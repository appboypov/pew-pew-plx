import { promises as fs } from 'fs';
import path from 'path';
import { readFileSync } from 'fs';
import { migrateIfNeeded } from '../utils/task-migration.js';
import { MarkdownParser } from '../core/parsers/markdown-parser.js';
import {
  getActiveChangeIdsMulti,
  getSpecIdsMulti,
  getActiveReviewIdsMulti,
} from '../utils/item-discovery.js';
import { getFilteredWorkspaces } from '../utils/workspace-filter.js';
import {
  DiscoveredWorkspace,
  isMultiWorkspace,
} from '../utils/workspace-discovery.js';
import type { ReviewParent } from '../core/schemas/index.js';
import {
  discoverTasks,
  filterTasksByParent,
  DiscoveredTask,
} from '../utils/centralized-task-discovery.js';
import { countTasksFromContent, TaskProgress } from '../utils/task-progress.js';
import { ParentType } from '../core/config.js';

export interface ChangeInfo {
  name: string;
  completedTasks: number;
  totalTasks: number;
  trackedIssue?: string;
  projectName?: string;
  displayId?: string;
}

export interface SpecInfo {
  id: string;
  requirementCount: number;
  projectName?: string;
  displayId?: string;
}

export interface ReviewInfo {
  name: string;
  parentType: ReviewParent;
  parentId: string;
  completedTasks: number;
  totalTasks: number;
  projectName?: string;
  displayId?: string;
}

export interface ReviewWithWorkspace {
  review: string;
  parentType: ReviewParent;
  parentId: string;
  workspacePath: string;
  projectName: string;
  displayId: string;
}

/**
 * Service for listing entities (changes, specs, reviews) across workspaces.
 * Provides shared functionality for both GetCommand and ListCommand.
 */
export class EntityListingService {
  private workspaces: DiscoveredWorkspace[] = [];
  private isMulti: boolean = false;

  private constructor() {}

  /**
   * Creates an EntityListingService with workspace discovery.
   */
  static async create(
    root: string = process.cwd(),
    workspaces?: DiscoveredWorkspace[]
  ): Promise<EntityListingService> {
    const instance = new EntityListingService();
    instance.workspaces = workspaces ?? (await getFilteredWorkspaces(root));
    instance.isMulti = isMultiWorkspace(instance.workspaces);
    return instance;
  }

  /**
   * Returns whether multiple workspaces are active.
   */
  isMultiWorkspace(): boolean {
    return this.isMulti;
  }

  /**
   * Calculates task progress from centralized task storage for a parent entity.
   */
  private async getTaskProgressFromCentralized(
    workspace: DiscoveredWorkspace,
    parentId: string,
    parentType: ParentType
  ): Promise<TaskProgress> {
    const result = await discoverTasks(workspace);
    const parentTasks = filterTasksByParent(result.tasks, parentId, parentType);

    let total = 0;
    let completed = 0;

    for (const task of parentTasks) {
      const taskProgress = countTasksFromContent(task.content);
      total += taskProgress.total;
      completed += taskProgress.completed;
    }

    return { total, completed };
  }

  /**
   * Lists all active changes across workspaces.
   */
  async listChanges(): Promise<ChangeInfo[]> {
    if (this.workspaces.length === 0) {
      return [];
    }

    const changeItems = await getActiveChangeIdsMulti(this.workspaces);

    if (changeItems.length === 0) {
      return [];
    }

    const changes: ChangeInfo[] = [];

    for (const change of changeItems) {
      const changesDir = path.join(change.workspacePath, 'changes');
      const changeFullPath = path.join(changesDir, change.id);

      const migrationResult = await migrateIfNeeded(changeFullPath);
      if (migrationResult?.migrated) {
        // Migration happened, but we don't log here (let caller handle)
      }

      // Find the workspace for this change
      const workspace = this.workspaces.find(w => w.path === change.workspacePath);
      const progress = workspace
        ? await this.getTaskProgressFromCentralized(workspace, change.id, 'change')
        : { total: 0, completed: 0 };

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

    return this.sortByWorkspace(changes, (c) => c.projectName ?? '', (c) => c.name);
  }

  /**
   * Lists all specs across workspaces.
   */
  async listSpecs(): Promise<SpecInfo[]> {
    if (this.workspaces.length === 0) {
      return [];
    }

    const specItems = await getSpecIdsMulti(this.workspaces);

    if (specItems.length === 0) {
      return [];
    }

    const specs: SpecInfo[] = [];
    for (const spec of specItems) {
      const specsDir = path.join(spec.workspacePath, 'specs');
      const specPath = path.join(specsDir, spec.id, 'spec.md');
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

    return this.sortByWorkspace(specs, (s) => s.projectName ?? '', (s) => s.id);
  }

  /**
   * Lists all active reviews across workspaces.
   */
  async listReviews(): Promise<ReviewInfo[]> {
    if (this.workspaces.length === 0) {
      return [];
    }

    const reviewItems = await getActiveReviewIdsMulti(this.workspaces);

    if (reviewItems.length === 0) {
      return [];
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

      // Find the workspace for this review
      const workspace = this.workspaces.find(w => w.path === review.workspacePath);
      const progress = workspace
        ? await this.getTaskProgressFromCentralized(workspace, review.id, 'review')
        : { total: 0, completed: 0 };

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

    return this.sortByWorkspace(reviews, (r) => r.projectName ?? '', (r) => r.name);
  }

  /**
   * Retrieves a review by ID.
   * Supports formats:
   * - With project: {projectName}/{reviewId}
   * - Without: {reviewId}
   */
  async getReviewById(reviewId: string): Promise<ReviewWithWorkspace | null> {
    const parsed = this.parsePrefixedId(reviewId);
    const workspacesToSearch = parsed.projectName
      ? this.workspaces.filter(
          (w) => w.projectName.toLowerCase() === parsed.projectName!.toLowerCase()
        )
      : this.workspaces;

    for (const workspace of workspacesToSearch) {
      const reviewsDir = path.join(workspace.path, 'reviews');
      const reviewPath = path.join(reviewsDir, parsed.itemId, 'review.md');

      try {
        const review = await fs.readFile(reviewPath, 'utf-8');
        const parser = new MarkdownParser(review);
        const frontmatter = parser.getFrontmatter();

        const parentType: ReviewParent = (frontmatter?.parentType as ReviewParent) ?? 'change';
        const parentId: string = frontmatter?.parentId ?? '';

        return {
          review,
          parentType,
          parentId,
          workspacePath: workspace.path,
          projectName: workspace.projectName,
          displayId: this.getDisplayId(workspace.projectName, parsed.itemId),
        };
      } catch {
        // Continue to next workspace
      }
    }

    return null;
  }

  /**
   * Parses a prefixed ID to extract project name and item ID.
   * Format: "projectName/itemId" or just "itemId"
   */
  private parsePrefixedId(id: string): { projectName: string | null; itemId: string } {
    const slashIndex = id.indexOf('/');
    if (slashIndex === -1) {
      return { projectName: null, itemId: id };
    }

    const candidateProjectName = id.substring(0, slashIndex);
    const candidateItemId = id.substring(slashIndex + 1);

    const hasMatchingWorkspace = this.workspaces.some(
      (w) => w.projectName.toLowerCase() === candidateProjectName.toLowerCase()
    );

    if (!hasMatchingWorkspace) {
      return { projectName: null, itemId: id };
    }

    return {
      projectName: candidateProjectName,
      itemId: candidateItemId,
    };
  }

  /**
   * Generates a display ID based on multi-workspace context.
   */
  private getDisplayId(projectName: string, itemId: string): string {
    if (!this.isMulti || !projectName) {
      return itemId;
    }
    return `${projectName}/${itemId}`;
  }

  /**
   * Sorts items by project name first, then by item identifier.
   */
  private sortByWorkspace<T>(
    items: T[],
    getProjectName: (item: T) => string,
    getItemName: (item: T) => string
  ): T[] {
    return items.sort((a, b) => {
      const projA = getProjectName(a);
      const projB = getProjectName(b);
      if (!projA && projB) return -1;
      if (projA && !projB) return 1;
      const projCmp = projA.localeCompare(projB);
      if (projCmp !== 0) return projCmp;
      return getItemName(a).localeCompare(getItemName(b));
    });
  }
}
