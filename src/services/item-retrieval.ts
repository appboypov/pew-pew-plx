import { promises as fs } from 'fs';
import path from 'path';
import {
  getActiveChangeIdsMulti,
  getActiveReviewIdsMulti,
} from '../utils/item-discovery.js';
import {
  parseTaskFilename,
  sortTaskFilesBySequence,
} from '../utils/task-file-parser.js';
import { parseStatus, TaskStatus } from '../utils/task-status.js';
import {
  getTaskStructureForChange,
  TaskFileInfo,
  TASKS_DIRECTORY_NAME,
} from '../utils/task-progress.js';
import { getTaskIdFromFilename } from './task-id.js';
import {
  DiscoveredWorkspace,
  discoverWorkspaces,
  isMultiWorkspace,
} from '../utils/workspace-discovery.js';

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

export interface OpenTaskInfo {
  taskId: string;
  changeId: string;
  task: TaskFileInfo;
  status: TaskStatus;
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

  constructor(root: string = process.cwd()) {
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
   */
  private parsePrefixedId(id: string): ParsedPrefixedId {
    const slashIndex = id.indexOf('/');
    if (slashIndex === -1) {
      return { projectName: null, itemId: id };
    }
    return {
      projectName: id.substring(0, slashIndex),
      itemId: id.substring(slashIndex + 1),
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
        (w) => w.projectName === projectName
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
   * Retrieves a task by ID with its content and change context.
   * Supports formats:
   * - Full with project: {projectName}/{changeId}/{taskFilename}
   * - Full: {changeId}/{taskFilename}
   * - Short: {taskFilename} (searches all active changes)
   * @param taskId The task identifier
   * @returns Task with workspace context or null if not found
   */
  async getTaskById(taskId: string): Promise<TaskWithWorkspace | null> {
    const parsed = this.parsePrefixedId(taskId);

    if (parsed.projectName) {
      // Check if projectName matches an actual workspace project
      const isValidProject = this.workspaces.some(
        (w) => w.projectName === parsed.projectName
      );

      if (isValidProject) {
        // Has project prefix: projectName/changeId/taskName or projectName/taskName
        const remainingParts = parsed.itemId.split('/');

        if (remainingParts.length === 2) {
          // projectName/changeId/taskName
          const [changeId, taskName] = remainingParts;
          return this.findTaskWithWorkspace(
            parsed.projectName,
            changeId,
            taskName
          );
        } else {
          // projectName/taskName - search all changes in that project
          const taskName = parsed.itemId;
          return this.searchTaskInProject(parsed.projectName, taskName);
        }
      }
    }

    // No project prefix (or projectName didn't match any known workspace)
    const parts = taskId.split('/');

    if (parts.length === 2) {
      // changeId/taskFilename
      const [changeId, taskName] = parts;
      return this.searchTaskInAllWorkspaces(changeId, taskName);
    }

    // Just taskFilename - search everywhere
    return this.searchTaskByNameInAllWorkspaces(taskId);
  }

  private async findTaskWithWorkspace(
    projectName: string,
    changeId: string,
    taskName: string
  ): Promise<TaskWithWorkspace | null> {
    const workspacePaths = this.getWorkspacePaths(projectName);
    if (workspacePaths.length === 0) return null;

    const { changesPath, reviewsPath, workspace } = workspacePaths[0];

    // Ensure .md extension
    const taskFilename = taskName.endsWith('.md') ? taskName : `${taskName}.md`;

    // Try changes first
    const changeResult = await this.findTaskInPath(
      changesPath,
      changeId,
      taskFilename,
      workspace
    );
    if (changeResult) return changeResult;

    // Try reviews
    return this.findTaskInPath(reviewsPath, changeId, taskFilename, workspace);
  }

  private async searchTaskInProject(
    projectName: string,
    taskName: string
  ): Promise<TaskWithWorkspace | null> {
    const workspacePaths = this.getWorkspacePaths(projectName);
    if (workspacePaths.length === 0) return null;

    const { changesPath, reviewsPath, workspace } = workspacePaths[0];

    const taskFilename = taskName.endsWith('.md') ? taskName : `${taskName}.md`;

    // Get all active changes in this workspace
    const activeChanges = await getActiveChangeIdsMulti([workspace]);
    for (const change of activeChanges) {
      const result = await this.findTaskInPath(
        changesPath,
        change.id,
        taskFilename,
        workspace
      );
      if (result) return result;
    }

    // Try reviews
    const activeReviews = await getActiveReviewIdsMulti([workspace]);
    for (const review of activeReviews) {
      const result = await this.findTaskInPath(
        reviewsPath,
        review.id,
        taskFilename,
        workspace
      );
      if (result) return result;
    }

    return null;
  }

  private async searchTaskInAllWorkspaces(
    changeId: string,
    taskName: string
  ): Promise<TaskWithWorkspace | null> {
    const taskFilename = taskName.endsWith('.md') ? taskName : `${taskName}.md`;

    for (const workspacePath of this.getWorkspacePaths(null)) {
      const { changesPath, reviewsPath, workspace } = workspacePath;

      // Try changes
      const changeResult = await this.findTaskInPath(
        changesPath,
        changeId,
        taskFilename,
        workspace
      );
      if (changeResult) return changeResult;

      // Try reviews
      const reviewResult = await this.findTaskInPath(
        reviewsPath,
        changeId,
        taskFilename,
        workspace
      );
      if (reviewResult) return reviewResult;
    }

    return null;
  }

  private async searchTaskByNameInAllWorkspaces(
    taskName: string
  ): Promise<TaskWithWorkspace | null> {
    const taskFilename = taskName.endsWith('.md') ? taskName : `${taskName}.md`;

    for (const workspacePath of this.getWorkspacePaths(null)) {
      const { changesPath, reviewsPath, workspace } = workspacePath;

      // Get all active changes
      const activeChanges = await getActiveChangeIdsMulti([workspace]);
      for (const change of activeChanges) {
        const result = await this.findTaskInPath(
          changesPath,
          change.id,
          taskFilename,
          workspace
        );
        if (result) return result;
      }

      // Try reviews
      const activeReviews = await getActiveReviewIdsMulti([workspace]);
      for (const review of activeReviews) {
        const result = await this.findTaskInPath(
          reviewsPath,
          review.id,
          taskFilename,
          workspace
        );
        if (result) return result;
      }
    }

    return null;
  }

  private async findTaskInPath(
    basePath: string,
    itemId: string,
    taskFilename: string,
    workspace: DiscoveredWorkspace
  ): Promise<TaskWithWorkspace | null> {
    const tasksDir = path.join(basePath, itemId, TASKS_DIRECTORY_NAME);
    const taskPath = path.join(tasksDir, taskFilename);

    try {
      const content = await fs.readFile(taskPath, 'utf-8');
      const parsed = parseTaskFilename(taskFilename);

      if (!parsed) {
        return null;
      }

      const progress = { total: 0, completed: 0 };

      const task: TaskFileInfo = {
        filename: taskFilename,
        filepath: taskPath,
        sequence: parsed.sequence,
        name: parsed.name,
        progress,
      };

      const taskId = getTaskIdFromFilename(taskFilename);

      return {
        task,
        content,
        changeId: itemId,
        workspacePath: workspace.path,
        projectName: workspace.projectName,
        displayId: this.getDisplayId(
          workspace.projectName,
          `${itemId}/${taskId}`
        ),
      };
    } catch {
      return null;
    }
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
   * Retrieves all tasks for a specific change or review.
   * Supports formats:
   * - With project: {projectName}/{itemId}
   * - Without: {itemId}
   * @param itemId The change or review identifier
   * @returns Array of task file info, or empty array if item not found
   */
  async getTasksForChange(itemId: string): Promise<TaskFileInfo[]> {
    const parsed = this.parsePrefixedId(itemId);
    const workspacePaths = this.getWorkspacePaths(parsed.projectName);

    for (const { changesPath, reviewsPath } of workspacePaths) {
      // Try changes first
      const changeStructure = await getTaskStructureForChange(
        changesPath,
        parsed.itemId
      );
      if (changeStructure.files.length > 0) {
        return changeStructure.files;
      }

      // Try reviews if not found in changes
      const reviewStructure = await getTaskStructureForChange(
        reviewsPath,
        parsed.itemId
      );
      if (reviewStructure.files.length > 0) {
        return reviewStructure.files;
      }
    }

    return [];
  }

  /**
   * Retrieves all open tasks (status: to-do or in-progress) across all active changes and reviews.
   * @returns Array of open task info with workspace context
   */
  async getAllOpenTasks(): Promise<OpenTaskInfo[]> {
    const openTasks: OpenTaskInfo[] = [];

    for (const workspacePath of this.getWorkspacePaths(null)) {
      const { changesPath, reviewsPath, workspace } = workspacePath;

      // Get active changes for this workspace
      const activeChanges = await getActiveChangeIdsMulti([workspace]);

      for (const change of activeChanges) {
        const tasksDir = path.join(changesPath, change.id, TASKS_DIRECTORY_NAME);

        try {
          const entries = await fs.readdir(tasksDir);
          const sortedFiles = sortTaskFilesBySequence(entries);

          for (const filename of sortedFiles) {
            const parsed = parseTaskFilename(filename);
            if (!parsed) continue;

            const filepath = path.join(tasksDir, filename);

            try {
              const content = await fs.readFile(filepath, 'utf-8');
              const status = parseStatus(content);

              if (status === 'to-do' || status === 'in-progress') {
                const task: TaskFileInfo = {
                  filename,
                  filepath,
                  sequence: parsed.sequence,
                  name: parsed.name,
                  progress: { total: 0, completed: 0 },
                };

                const taskId = getTaskIdFromFilename(filename);

                openTasks.push({
                  taskId,
                  changeId: change.id,
                  task,
                  status,
                  workspacePath: workspace.path,
                  projectName: workspace.projectName,
                  displayId: this.getDisplayId(
                    workspace.projectName,
                    `${change.id}/${taskId}`
                  ),
                });
              }
            } catch {
              // Skip files that can't be read
            }
          }
        } catch {
          // Skip changes without tasks directory
        }
      }

      // Get active reviews for this workspace
      const activeReviews = await getActiveReviewIdsMulti([workspace]);

      for (const review of activeReviews) {
        const tasksDir = path.join(reviewsPath, review.id, TASKS_DIRECTORY_NAME);

        try {
          const entries = await fs.readdir(tasksDir);
          const sortedFiles = sortTaskFilesBySequence(entries);

          for (const filename of sortedFiles) {
            const parsed = parseTaskFilename(filename);
            if (!parsed) continue;

            const filepath = path.join(tasksDir, filename);

            try {
              const content = await fs.readFile(filepath, 'utf-8');
              const status = parseStatus(content);

              if (status === 'to-do' || status === 'in-progress') {
                const task: TaskFileInfo = {
                  filename,
                  filepath,
                  sequence: parsed.sequence,
                  name: parsed.name,
                  progress: { total: 0, completed: 0 },
                };

                const taskId = getTaskIdFromFilename(filename);

                openTasks.push({
                  taskId,
                  changeId: review.id,
                  task,
                  status,
                  workspacePath: workspace.path,
                  projectName: workspace.projectName,
                  displayId: this.getDisplayId(
                    workspace.projectName,
                    `${review.id}/${taskId}`
                  ),
                });
              }
            } catch {
              // Skip files that can't be read
            }
          }
        } catch {
          // Skip reviews without tasks directory
        }
      }
    }

    return openTasks;
  }
}
