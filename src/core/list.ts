import { promises as fs } from 'fs';
import path from 'path';
import { getTaskProgressForChange, formatTaskStatus } from '../utils/task-progress.js';
import { migrateIfNeeded } from '../utils/task-migration.js';
import { readFileSync } from 'fs';
import { join } from 'path';
import { MarkdownParser } from './parsers/markdown-parser.js';
import { getActiveReviewIds } from '../utils/item-discovery.js';
import type { TrackedIssue, ReviewParent } from './schemas/index.js';

interface ChangeInfo {
  name: string;
  completedTasks: number;
  totalTasks: number;
  trackedIssue?: string;
}

interface ReviewInfo {
  name: string;
  parentType: ReviewParent;
  parentId: string;
  completedTasks: number;
  totalTasks: number;
}

export class ListCommand {
  async execute(targetPath: string = '.', mode: 'changes' | 'specs' | 'reviews' = 'changes'): Promise<void> {
    const resolvedPath = path.resolve(targetPath);

    if (mode === 'changes') {
      const changesDir = path.join(resolvedPath, 'workspace', 'changes');

      // Check if changes directory exists
      try {
        await fs.access(changesDir);
      } catch {
        throw new Error("No PLX changes directory found. Run 'plx init' first.");
      }

      // Get all directories in changes (excluding archive)
      const entries = await fs.readdir(changesDir, { withFileTypes: true });
      const changeDirs = entries
        .filter(entry => entry.isDirectory() && entry.name !== 'archive')
        .map(entry => entry.name);

      if (changeDirs.length === 0) {
        console.log('No active changes found.');
        return;
      }

      // Collect information about each change
      const changes: ChangeInfo[] = [];

      for (const changeDir of changeDirs) {
        // Trigger migration if needed
        const changeFullPath = path.join(changesDir, changeDir);
        const migrationResult = await migrateIfNeeded(changeFullPath);
        if (migrationResult?.migrated) {
          console.log(`Migrated tasks.md → tasks/001-tasks.md`);
        }

        const progress = await getTaskProgressForChange(changesDir, changeDir);

        // Try to get tracked issue from proposal.md frontmatter
        let trackedIssue: string | undefined;
        try {
          const proposalPath = path.join(changesDir, changeDir, 'proposal.md');
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
          name: changeDir,
          completedTasks: progress.completed,
          totalTasks: progress.total,
          trackedIssue,
        });
      }

      // Sort alphabetically by name
      changes.sort((a, b) => a.name.localeCompare(b.name));

      // Display results
      console.log('Changes:');
      const padding = '  ';
      const getDisplayName = (c: ChangeInfo) => {
        const issueDisplay = c.trackedIssue ? ` (${c.trackedIssue})` : '';
        return `${c.name}${issueDisplay}`;
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
      const specsDir = path.join(resolvedPath, 'workspace', 'specs');
      try {
        await fs.access(specsDir);
      } catch {
        console.log('No specs found.');
        return;
      }

      const entries = await fs.readdir(specsDir, { withFileTypes: true });
      const specDirs = entries.filter(e => e.isDirectory()).map(e => e.name);
      if (specDirs.length === 0) {
        console.log('No specs found.');
        return;
      }

      type SpecInfo = { id: string; requirementCount: number };
      const specs: SpecInfo[] = [];
      for (const id of specDirs) {
        const specPath = join(specsDir, id, 'spec.md');
        try {
          const content = readFileSync(specPath, 'utf-8');
          const parser = new MarkdownParser(content);
          const spec = parser.parseSpec(id);
          specs.push({ id, requirementCount: spec.requirements.length });
        } catch {
          specs.push({ id, requirementCount: 0 });
        }
      }

      specs.sort((a, b) => a.id.localeCompare(b.id));
      console.log('Specs:');
      const padding = '  ';
      const nameWidth = Math.max(...specs.map(s => s.id.length));
      for (const spec of specs) {
        const padded = spec.id.padEnd(nameWidth);
        console.log(`${padding}${padded}     requirements ${spec.requirementCount}`);
      }
      return;
    }

    // reviews mode
    const reviewIds = await getActiveReviewIds(resolvedPath);
    if (reviewIds.length === 0) {
      console.log('No active reviews found.');
      return;
    }

    const reviewsDir = path.join(resolvedPath, 'workspace', 'reviews');
    const reviews: ReviewInfo[] = [];

    for (const reviewId of reviewIds) {
      let parentType: ReviewParent = 'change';
      let parentId = '';

      try {
        const reviewPath = path.join(reviewsDir, reviewId, 'review.md');
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

      const progress = await getTaskProgressForChange(reviewsDir, reviewId);

      reviews.push({
        name: reviewId,
        parentType,
        parentId,
        completedTasks: progress.completed,
        totalTasks: progress.total,
      });
    }

    reviews.sort((a, b) => a.name.localeCompare(b.name));

    console.log('Reviews:');
    const padding = '  ';
    const nameWidth = Math.max(...reviews.map(r => r.name.length));
    const typeWidth = Math.max(...reviews.map(r => r.parentType.length));
    for (const review of reviews) {
      const paddedName = review.name.padEnd(nameWidth);
      const paddedType = review.parentType.padEnd(typeWidth);
      const status = formatTaskStatus({ total: review.totalTasks, completed: review.completedTasks });
      console.log(`${padding}${paddedName}     ${paddedType}     ${status}`);
    }
  }
}