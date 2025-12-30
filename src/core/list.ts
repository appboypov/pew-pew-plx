import { promises as fs } from 'fs';
import path from 'path';
import { getTaskProgressForChange, formatTaskStatus } from '../utils/task-progress.js';
import { migrateIfNeeded } from '../utils/task-migration.js';
import { readFileSync } from 'fs';
import { join } from 'path';
import { MarkdownParser } from './parsers/markdown-parser.js';
import {
  getActiveChangeIdsMulti,
  getSpecIdsMulti,
  getActiveReviewIdsMulti,
} from '../utils/item-discovery.js';
import { getFilteredWorkspaces } from '../utils/workspace-filter.js';
import { isMultiWorkspace } from '../utils/workspace-discovery.js';
import type { ReviewParent } from './schemas/index.js';

interface ChangeInfo {
  name: string;
  completedTasks: number;
  totalTasks: number;
  trackedIssue?: string;
  projectName?: string;
  displayId?: string;
}

interface SpecInfo {
  id: string;
  requirementCount: number;
  projectName?: string;
  displayId?: string;
}

interface ReviewInfo {
  name: string;
  parentType: ReviewParent;
  parentId: string;
  completedTasks: number;
  totalTasks: number;
  projectName?: string;
  displayId?: string;
}

export class ListCommand {
  async execute(targetPath: string = '.', mode: 'changes' | 'specs' | 'reviews' = 'changes'): Promise<void> {
    const resolvedPath = path.resolve(targetPath);

    if (mode === 'changes') {
      const workspaces = await getFilteredWorkspaces(resolvedPath);
      const isMulti = isMultiWorkspace(workspaces);

      if (workspaces.length === 0) {
        throw new Error("No PLX changes directory found. Run 'plx init' first.");
      }

      const changeItems = await getActiveChangeIdsMulti(workspaces);

      if (changeItems.length === 0) {
        console.log('No active changes found.');
        return;
      }

      const changes: ChangeInfo[] = [];

      for (const change of changeItems) {
        const changesDir = path.join(change.workspacePath, 'changes');
        const changeFullPath = path.join(changesDir, change.id);

        const migrationResult = await migrateIfNeeded(changeFullPath);
        if (migrationResult?.migrated) {
          console.log(`Migrated tasks.md → tasks/001-tasks.md`);
        }

        const progress = await getTaskProgressForChange(changesDir, change.id);

        let trackedIssue: string | undefined;
        try {
          const proposalPath = path.join(changesDir, change.id, 'proposal.md');
          const proposalContent = await fs.readFile(proposalPath, 'utf-8');
          const parser = new MarkdownParser(proposalContent);
          const frontmatter = parser.getFrontmatter();
          if (frontmatter?.trackedIssues && frontmatter.trackedIssues.length > 0) {
            trackedIssue = frontmatter.trackedIssues[0].id;
          }
        } catch {
          // proposal.md might not exist or be unreadable
        }

        changes.push({
          name: change.id,
          completedTasks: progress.completed,
          totalTasks: progress.total,
          trackedIssue,
          projectName: change.projectName,
          displayId: change.displayId,
        });
      }

      changes.sort((a, b) => {
        if (!a.projectName && b.projectName) return -1;
        if (a.projectName && !b.projectName) return 1;
        const projCmp = (a.projectName || '').localeCompare(b.projectName || '');
        if (projCmp !== 0) return projCmp;
        return a.name.localeCompare(b.name);
      });

      console.log('Changes:');
      const padding = '  ';
      const getDisplayName = (c: ChangeInfo) => {
        const name = isMulti && c.displayId ? c.displayId : c.name;
        const issueDisplay = c.trackedIssue ? ` (${c.trackedIssue})` : '';
        return `${name}${issueDisplay}`;
      };
      const nameWidth = Math.max(...changes.map(c => getDisplayName(c).length));
      for (const change of changes) {
        const displayName = getDisplayName(change).padEnd(nameWidth);
        const status = formatTaskStatus({ total: change.totalTasks, completed: change.completedTasks });
        console.log(`${padding}${displayName}     ${status}`);
      }
      return;
    }

    if (mode === 'specs') {
      const workspaces = await getFilteredWorkspaces(resolvedPath);
      const isMulti = isMultiWorkspace(workspaces);

      if (workspaces.length === 0) {
        console.log('No specs found.');
        return;
      }

      const specItems = await getSpecIdsMulti(workspaces);

      if (specItems.length === 0) {
        console.log('No specs found.');
        return;
      }

      const specs: SpecInfo[] = [];
      for (const spec of specItems) {
        const specsDir = path.join(spec.workspacePath, 'specs');
        const specPath = join(specsDir, spec.id, 'spec.md');
        try {
          const content = readFileSync(specPath, 'utf-8');
          const parser = new MarkdownParser(content);
          const parsedSpec = parser.parseSpec(spec.id);
          specs.push({
            id: spec.id,
            requirementCount: parsedSpec.requirements.length,
            projectName: spec.projectName,
            displayId: spec.displayId,
          });
        } catch {
          specs.push({
            id: spec.id,
            requirementCount: 0,
            projectName: spec.projectName,
            displayId: spec.displayId,
          });
        }
      }

      specs.sort((a, b) => {
        if (!a.projectName && b.projectName) return -1;
        if (a.projectName && !b.projectName) return 1;
        const projCmp = (a.projectName || '').localeCompare(b.projectName || '');
        if (projCmp !== 0) return projCmp;
        return a.id.localeCompare(b.id);
      });

      console.log('Specs:');
      const padding = '  ';
      const getDisplayName = (s: SpecInfo) => isMulti && s.displayId ? s.displayId : s.id;
      const nameWidth = Math.max(...specs.map(s => getDisplayName(s).length));
      for (const spec of specs) {
        const padded = getDisplayName(spec).padEnd(nameWidth);
        console.log(`${padding}${padded}     requirements ${spec.requirementCount}`);
      }
      return;
    }

    // reviews mode
    const workspaces = await getFilteredWorkspaces(resolvedPath);
    const isMulti = isMultiWorkspace(workspaces);

    if (workspaces.length === 0) {
      console.log('No active reviews found.');
      return;
    }

    const reviewItems = await getActiveReviewIdsMulti(workspaces);

    if (reviewItems.length === 0) {
      console.log('No active reviews found.');
      return;
    }

    const reviews: ReviewInfo[] = [];

    for (const review of reviewItems) {
      const reviewsDir = path.join(review.workspacePath, 'reviews');
      let parentType: ReviewParent = 'change';
      let parentId = '';

      try {
        const reviewPath = path.join(reviewsDir, review.id, 'review.md');
        const reviewContent = await fs.readFile(reviewPath, 'utf-8');
        const parser = new MarkdownParser(reviewContent);
        const frontmatter = parser.getFrontmatter();
        if (frontmatter?.parentType) {
          parentType = frontmatter.parentType as ReviewParent;
        }
        if (frontmatter?.parentId) {
          parentId = frontmatter.parentId;
        }
      } catch {
        // review.md might be unreadable
      }

      const progress = await getTaskProgressForChange(reviewsDir, review.id);

      reviews.push({
        name: review.id,
        parentType,
        parentId,
        completedTasks: progress.completed,
        totalTasks: progress.total,
        projectName: review.projectName,
        displayId: review.displayId,
      });
    }

    reviews.sort((a, b) => {
      if (!a.projectName && b.projectName) return -1;
      if (a.projectName && !b.projectName) return 1;
      const projCmp = (a.projectName || '').localeCompare(b.projectName || '');
      if (projCmp !== 0) return projCmp;
      return a.name.localeCompare(b.name);
    });

    console.log('Reviews:');
    const padding = '  ';
    const getDisplayName = (r: ReviewInfo) => isMulti && r.displayId ? r.displayId : r.name;
    const nameWidth = Math.max(...reviews.map(r => getDisplayName(r).length));
    const typeWidth = Math.max(...reviews.map(r => r.parentType.length));
    for (const review of reviews) {
      const paddedName = getDisplayName(review).padEnd(nameWidth);
      const paddedType = review.parentType.padEnd(typeWidth);
      const status = formatTaskStatus({ total: review.totalTasks, completed: review.completedTasks });
      console.log(`${padding}${paddedName}     ${paddedType}     ${status}`);
    }
  }
}