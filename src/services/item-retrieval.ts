import { promises as fs } from 'fs';
import path from 'path';
import { ParentType } from '../core/config.js';
import {
  parseTaskFilename,
} from '../utils/task-file-parser.js';
import { TaskStatus, SkillLevel } from '../utils/task-status.js';
import {
  getTaskStructureForChange,
  TaskFileInfo,
} from '../utils/task-progress.js';
import { getTaskIdFromFilename } from './task-id.js';
import {
  DiscoveredWorkspace,
  discoverWorkspaces,
  isMultiWorkspace,
} from '../utils/workspace-discovery.js';
import {
  discoverTasks,
  filterTasksByParent,
  checkParentIdConflicts,
  DiscoveredTask,
} from '../utils/centralized-task-discovery.js';

export interface TaskWithContext {
  task: TaskFileInfo;
  content: string;
  changeId: string;
}

export interface TaskWithWorkspace extends TaskWithContext {
  workspacePath: string;
  projectName: string;
  displayId: string;
}

export interface ChangeWithTasks {
  proposal: string;
  design: string | null;
  tasks: TaskFileInfo[];
}

export interface ChangeWithWorkspace extends ChangeWithTasks {
  workspacePath: string;
  projectName: string;
  displayId: string;
}

export interface SpecWithWorkspace {
  content: string;
  workspacePath: string;
  projectName: string;
  displayId: string;
}

export interface ReviewWithWorkspace {
  content: string;
  workspacePath: string;
  projectName: string;
  displayId: string;
}

export interface OpenTaskInfo {
  taskId: string;
  parentId: string;
  parentType: ParentType;
  task: TaskFileInfo;
  status: TaskStatus;
  skillLevel?: SkillLevel;
  workspacePath?: string;
  projectName?: string;
  displayId?: string;
}

interface WorkspacePaths {
  changesPath: string;
  reviewsPath: string;
  specsPath: string;
  workspace: DiscoveredWorkspace;
}

interface ParsedPrefixedId {
  projectName: string | null;
  itemId: string;
}

/**
 * Service for retrieving items (tasks, changes, specs) by ID.
 * Supports both single-workspace and multi-workspace configurations.
 */
export class ItemRetrievalService {
  private root: string;
  private workspaces: DiscoveredWorkspace[] = [];
  private isMulti: boolean = false;

  private constructor(root: string = process.cwd()) {
    this.root = root;
  }

  /**
   * Creates an ItemRetrievalService with workspace discovery.
   * Use this factory method for proper async initialization.
   */
  static async create(
    root: string = process.cwd(),
    workspaces?: DiscoveredWorkspace[]
  ): Promise<ItemRetrievalService> {
    const instance = new ItemRetrievalService(root);
    instance.workspaces = workspaces ?? (await discoverWorkspaces(root));
    instance.isMulti = isMultiWorkspace(instance.workspaces);
    return instance;
  }

  /**
   * Parses a prefixed ID to extract project name and item ID.
   * Format: "projectName/itemId" or just "itemId"
   * Only treats the prefix as a project name if it matches a known workspace.
   */
  private parsePrefixedId(id: string): ParsedPrefixedId {
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
   * Gets workspace paths for a specific project or all workspaces.
   * When workspaces are not initialized (constructor usage), falls back to root-based paths.
   */
  private getWorkspacePaths(projectName: string | null): WorkspacePaths[] {
    // Backward compatibility: if workspaces are empty, use root-based workspace
    if (this.workspaces.length === 0) {
      const fallbackWorkspace: DiscoveredWorkspace = {
        path: path.join(this.root, 'workspace'),
        relativePath: '.',
        projectName: '',
        isRoot: true,
      };
      return [
        {
          changesPath: path.join(this.root, 'workspace', 'changes'),
          reviewsPath: path.join(this.root, 'workspace', 'reviews'),
          specsPath: path.join(this.root, 'workspace', 'specs'),
          workspace: fallbackWorkspace,
        },
      ];
    }

    if (projectName) {
      const workspace = this.workspaces.find(
        (w) => w.projectName.toLowerCase() === projectName.toLowerCase()
      );
      if (!workspace) return [];
      return [
        {
          changesPath: path.join(workspace.path, 'changes'),
          reviewsPath: path.join(workspace.path, 'reviews'),
          specsPath: path.join(workspace.path, 'specs'),
          workspace,
        },
      ];
    }
    return this.workspaces.map((workspace) => ({
      changesPath: path.join(workspace.path, 'changes'),
      reviewsPath: path.join(workspace.path, 'reviews'),
      specsPath: path.join(workspace.path, 'specs'),
      workspace,
    }));
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
   * Converts a DiscoveredTask to TaskWithWorkspace format.
   */
  private discoveredTaskToTaskWithWorkspace(
    task: DiscoveredTask,
    workspace: DiscoveredWorkspace
  ): TaskWithWorkspace {
    const taskId = getTaskIdFromFilename(task.filename);

    return {
      task: {
        filename: task.filename,
        filepath: task.filepath,
        sequence: task.sequence,
        name: task.name,
        progress: { total: 0, completed: 0 },
      },
      content: task.content,
      changeId: task.parentId || '',
      workspacePath: workspace.path,
      projectName: workspace.projectName,
      displayId: this.getDisplayId(workspace.projectName, taskId),
    };
  }

  /**
   * Retrieves a task by ID with its content and change context.
   * Supports formats:
   * - Full with project: {projectName}/{taskFilename}
   * - Short: {taskFilename} (searches all workspaces)
   * @param taskId The task identifier
   * @returns Task with workspace context or null if not found
   */
  async getTaskById(taskId: string): Promise<TaskWithWorkspace | null> {
    const parsed = this.parsePrefixedId(taskId);
    const workspacePaths = this.getWorkspacePaths(parsed.projectName);

    // The task ID is the filename without .md
    const taskFilename = parsed.itemId.endsWith('.md')
      ? parsed.itemId
      : `${parsed.itemId}.md`;

    for (const { workspace } of workspacePaths) {
      const result = await discoverTasks(workspace);
      const task = result.tasks.find((t) => t.filename === taskFilename);

      if (task) {
        return this.discoveredTaskToTaskWithWorkspace(task, workspace);
      }
    }

    return null;
  }

  /**
   * Retrieves a change proposal by ID with its documents and task list.
   * Supports formats:
   * - With project: {projectName}/{changeId}
   * - Without: {changeId}
   * @param changeId The change identifier
   * @returns Change with workspace context or null if not found
   */
  async getChangeById(changeId: string): Promise<ChangeWithWorkspace | null> {
    const parsed = this.parsePrefixedId(changeId);
    const workspacePaths = this.getWorkspacePaths(parsed.projectName);

    for (const { changesPath, workspace } of workspacePaths) {
      const changeDir = path.join(changesPath, parsed.itemId);
      const proposalPath = path.join(changeDir, 'proposal.md');

      try {
        const proposal = await fs.readFile(proposalPath, 'utf-8');

        let design: string | null = null;
        try {
          design = await fs.readFile(
            path.join(changeDir, 'design.md'),
            'utf-8'
          );
        } catch {
          // design.md is optional
        }

        const structure = await getTaskStructureForChange(
          changesPath,
          parsed.itemId
        );

        return {
          proposal,
          design,
          tasks: structure.files,
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
   * Retrieves a spec by ID.
   * Supports formats:
   * - With project: {projectName}/{specId}
   * - Without: {specId}
   * @param specId The spec identifier
   * @returns Spec with workspace context or null if not found
   */
  async getSpecById(specId: string): Promise<SpecWithWorkspace | null> {
    const parsed = this.parsePrefixedId(specId);
    const workspacePaths = this.getWorkspacePaths(parsed.projectName);

    for (const { specsPath, workspace } of workspacePaths) {
      const specPath = path.join(specsPath, parsed.itemId, 'spec.md');

      try {
        const content = await fs.readFile(specPath, 'utf-8');
        return {
          content,
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
   * Retrieves a review by ID.
   * Supports formats:
   * - With project: {projectName}/{reviewId}
   * - Without: {reviewId}
   * @param reviewId The review identifier
   * @returns Review with workspace context or null if not found
   */
  async getReviewById(reviewId: string): Promise<ReviewWithWorkspace | null> {
    const parsed = this.parsePrefixedId(reviewId);
    const workspacePaths = this.getWorkspacePaths(parsed.projectName);

    for (const { reviewsPath, workspace } of workspacePaths) {
      const reviewPath = path.join(reviewsPath, parsed.itemId, 'review.md');

      try {
        const content = await fs.readFile(reviewPath, 'utf-8');
        return {
          content,
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
   * Retrieves all tasks for a specific parent entity (change, review, or spec).
   * Supports formats:
   * - With project: {projectName}/{itemId}
   * - Without: {itemId}
   * @param itemId The parent identifier
   * @param parentType Optional parent type filter
   * @returns Array of task file info, or empty array if no tasks found
   * @throws Error if parent ID matches multiple parent types and parentType not specified
   */
  async getTasksForParent(
    itemId: string,
    parentType?: ParentType
  ): Promise<TaskFileInfo[]> {
    const parsed = this.parsePrefixedId(itemId);
    const workspacePaths = this.getWorkspacePaths(parsed.projectName);

    for (const { workspace } of workspacePaths) {
      const result = await discoverTasks(workspace);

      // If parentType not specified, check for conflicts
      if (!parentType) {
        const conflicts = checkParentIdConflicts(result.tasks, parsed.itemId);
        if (conflicts.length > 1) {
          throw new Error(
            `Parent ID "${parsed.itemId}" matches multiple parent types: ${conflicts.join(', ')}. Please specify --parent-type.`
          );
        }
      }

      const filtered = filterTasksByParent(
        result.tasks,
        parsed.itemId,
        parentType
      );

      if (filtered.length > 0) {
        return filtered.map((t) => ({
          filename: t.filename,
          filepath: t.filepath,
          sequence: t.sequence,
          name: t.name,
          progress: { total: 0, completed: 0 },
        }));
      }
    }

    return [];
  }

  /**
   * Retrieves all open tasks (status: to-do or in-progress) across all workspaces.
   * @param parentType Optional filter by parent type
   * @returns Array of open task info with workspace context
   */
  async getAllOpenTasks(parentType?: ParentType): Promise<OpenTaskInfo[]> {
    const openTasks: OpenTaskInfo[] = [];

    for (const { workspace } of this.getWorkspacePaths(null)) {
      const result = await discoverTasks(workspace);

      for (const task of result.tasks) {
        // Filter by status
        if (task.status !== 'to-do' && task.status !== 'in-progress') continue;

        // Filter by parent type if specified
        if (parentType && task.parentType !== parentType) continue;

        const taskId = getTaskIdFromFilename(task.filename);

        openTasks.push({
          taskId,
          parentId: task.parentId || '',
          parentType: task.parentType || 'change',
          task: {
            filename: task.filename,
            filepath: task.filepath,
            sequence: task.sequence,
            name: task.name,
            progress: { total: 0, completed: 0 },
          },
          status: task.status,
          skillLevel: task.skillLevel,
          workspacePath: workspace.path,
          projectName: workspace.projectName,
          displayId: this.getDisplayId(workspace.projectName, taskId),
        });
      }
    }

    return openTasks;
  }

  /**
   * Retrieves all tasks for a specific review.
   * Convenience wrapper around getTasksForParent.
   * @param reviewId The review identifier
   * @returns Array of task file info, or empty array if no tasks found
   */
  async getTasksForReview(reviewId: string): Promise<TaskFileInfo[]> {
    return this.getTasksForParent(reviewId, 'review');
  }

  /**
   * Retrieves all tasks for a specific spec.
   * Convenience wrapper around getTasksForParent.
   * @param specId The spec identifier
   * @returns Array of task file info, or empty array if no tasks found
   */
  async getTasksForSpec(specId: string): Promise<TaskFileInfo[]> {
    return this.getTasksForParent(specId, 'spec');
  }
}
