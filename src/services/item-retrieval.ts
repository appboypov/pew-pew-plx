import { promises as fs } from 'fs';
import path from 'path';
import { getActiveChangeIds, getSpecIds } from '../utils/item-discovery.js';
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

export interface TaskWithContext {
  task: TaskFileInfo;
  content: string;
  changeId: string;
}

export interface ChangeWithTasks {
  proposal: string;
  design: string | null;
  tasks: TaskFileInfo[];
}

export interface OpenTaskInfo {
  taskId: string;
  changeId: string;
  task: TaskFileInfo;
  status: TaskStatus;
}

/**
 * Service for retrieving items (tasks, changes, specs) by ID.
 */
export class ItemRetrievalService {
  private root: string;
  private changesPath: string;
  private specsPath: string;

  constructor(root: string = process.cwd()) {
    this.root = root;
    this.changesPath = path.join(root, 'openspec', 'changes');
    this.specsPath = path.join(root, 'openspec', 'specs');
  }

  /**
   * Retrieves a task by ID with its content and change context.
   * Supports two formats:
   * - Full: {changeId}/{taskFilename} (e.g., "add-feature/001-implement")
   * - Short: {taskFilename} (e.g., "001-implement" - searches all active changes)
   * @param taskId The task identifier
   * @returns Task with context or null if not found
   */
  async getTaskById(taskId: string): Promise<TaskWithContext | null> {
    // Parse taskId to determine if it includes changeId
    const parts = taskId.split('/');
    let changeId: string | null = null;
    let taskName: string;

    if (parts.length === 2) {
      // Full format: changeId/taskFilename
      changeId = parts[0];
      taskName = parts[1];
    } else {
      // Short format: just taskFilename
      taskName = taskId;
    }

    // Ensure .md extension
    if (!taskName.endsWith('.md')) {
      taskName = `${taskName}.md`;
    }

    if (changeId) {
      // Search specific change
      return this.findTaskInChange(changeId, taskName);
    }

    // Search all active changes
    const activeChanges = await getActiveChangeIds(this.root);
    for (const cid of activeChanges) {
      const result = await this.findTaskInChange(cid, taskName);
      if (result) {
        return result;
      }
    }

    return null;
  }

  private async findTaskInChange(
    changeId: string,
    taskFilename: string
  ): Promise<TaskWithContext | null> {
    const tasksDir = path.join(
      this.changesPath,
      changeId,
      TASKS_DIRECTORY_NAME
    );
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

      return { task, content, changeId };
    } catch {
      return null;
    }
  }

  /**
   * Retrieves a change proposal by ID with its documents and task list.
   * @param changeId The change identifier
   * @returns Change with tasks or null if not found
   */
  async getChangeById(changeId: string): Promise<ChangeWithTasks | null> {
    const changeDir = path.join(this.changesPath, changeId);
    const proposalPath = path.join(changeDir, 'proposal.md');

    try {
      const proposal = await fs.readFile(proposalPath, 'utf-8');

      let design: string | null = null;
      try {
        design = await fs.readFile(path.join(changeDir, 'design.md'), 'utf-8');
      } catch {
        // design.md is optional
      }

      const structure = await getTaskStructureForChange(
        this.changesPath,
        changeId
      );

      return {
        proposal,
        design,
        tasks: structure.files,
      };
    } catch {
      return null;
    }
  }

  /**
   * Retrieves a spec by ID.
   * @param specId The spec identifier
   * @returns Spec content or null if not found
   */
  async getSpecById(specId: string): Promise<string | null> {
    const specPath = path.join(this.specsPath, specId, 'spec.md');

    try {
      return await fs.readFile(specPath, 'utf-8');
    } catch {
      return null;
    }
  }

  /**
   * Retrieves all tasks for a specific change.
   * @param changeId The change identifier
   * @returns Array of task file info, or empty array if change not found
   */
  async getTasksForChange(changeId: string): Promise<TaskFileInfo[]> {
    const structure = await getTaskStructureForChange(
      this.changesPath,
      changeId
    );
    return structure.files;
  }

  /**
   * Retrieves all open tasks (status: to-do or in-progress) across all active changes.
   * @returns Array of open task info with change context
   */
  async getAllOpenTasks(): Promise<OpenTaskInfo[]> {
    const openTasks: OpenTaskInfo[] = [];
    const activeChanges = await getActiveChangeIds(this.root);

    for (const changeId of activeChanges) {
      const tasksDir = path.join(
        this.changesPath,
        changeId,
        TASKS_DIRECTORY_NAME
      );

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

              openTasks.push({
                taskId: `${changeId}/${parsed.name}`,
                changeId,
                task,
                status,
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

    return openTasks;
  }
}
