import { promises as fs } from 'fs';
import path from 'path';
import {
  getTaskStructureForChange,
  TaskProgress,
  TaskFileInfo,
} from './task-progress.js';
import { parseStatus } from './task-status.js';
import { DiscoveredTask } from './centralized-task-discovery.js';
import { ParentType } from '../core/config.js';

export interface PrioritizedChange {
  id: string;
  completionPercentage: number;
  createdAt: Date;
  taskProgress: TaskProgress;
  taskFiles: TaskFileInfo[];
  inProgressTask: TaskFileInfo | null;
  nextTask: TaskFileInfo | null;
}

/**
 * Calculates completion percentage from task progress.
 * Returns 0 for 0/0 tasks (no tasks).
 */
export function getCompletionPercentage(progress: TaskProgress): number {
  if (progress.total === 0) {
    return 0;
  }
  return (progress.completed / progress.total) * 100;
}

/**
 * Gets the creation date of a change by reading proposal.md birthtime.
 * Falls back to mtime if birthtime is unavailable (epoch).
 */
export async function getChangeCreatedAt(
  changesDir: string,
  changeId: string
): Promise<Date> {
  const proposalPath = path.join(changesDir, changeId, 'proposal.md');
  const stat = await fs.stat(proposalPath);

  // Check if birthtime is available (not epoch)
  if (stat.birthtime.getTime() > 0) {
    return stat.birthtime;
  }

  // Fall back to mtime
  return stat.mtime;
}

/**
 * Finds the in-progress task and next to-do task for a change.
 */
async function findTasksByStatus(
  taskFiles: TaskFileInfo[]
): Promise<{ inProgress: TaskFileInfo | null; nextTodo: TaskFileInfo | null }> {
  let inProgress: TaskFileInfo | null = null;
  let nextTodo: TaskFileInfo | null = null;

  for (const taskFile of taskFiles) {
    const content = await fs.readFile(taskFile.filepath, 'utf-8');
    const status = parseStatus(content);

    if (status === 'in-progress' && !inProgress) {
      inProgress = taskFile;
    } else if (status === 'to-do' && !nextTodo) {
      nextTodo = taskFile;
    }

    // Stop early if we found both
    if (inProgress && nextTodo) {
      break;
    }
  }

  return { inProgress, nextTodo };
}

/**
 * Gets all active change directories from the changes directory.
 */
async function getActiveChangeIds(changesDir: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(changesDir, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);
  } catch {
    return [];
  }
}

/**
 * Selects the highest-priority change based on completion percentage.
 * Uses creation date (oldest first) as tiebreaker when percentages are equal.
 * Returns null if no active changes exist.
 */
export async function getPrioritizedChange(
  changesDir: string
): Promise<PrioritizedChange | null> {
  const changeIds = await getActiveChangeIds(changesDir);

  if (changeIds.length === 0) {
    return null;
  }

  const changes: PrioritizedChange[] = [];

  for (const id of changeIds) {
    try {
      const structure = await getTaskStructureForChange(changesDir, id);
      const completionPercentage = getCompletionPercentage(
        structure.aggregateProgress
      );
      const createdAt = await getChangeCreatedAt(changesDir, id);
      const { inProgress, nextTodo } = await findTasksByStatus(structure.files);

      // Determine next task: prefer in-progress, fall back to first to-do
      const nextTask = inProgress || nextTodo;

      changes.push({
        id,
        completionPercentage,
        createdAt,
        taskProgress: structure.aggregateProgress,
        taskFiles: structure.files,
        inProgressTask: inProgress,
        nextTask,
      });
    } catch {
      // Skip changes that can't be processed (e.g., missing proposal.md)
    }
  }

  if (changes.length === 0) {
    return null;
  }

  // Filter out non-actionable changes (no in-progress or to-do task files)
  const actionableChanges = changes.filter((c) => c.nextTask !== null);

  if (actionableChanges.length === 0) {
    return null;
  }

  // Sort by completion percentage (highest first), then by creation date (oldest first)
  actionableChanges.sort((a, b) => {
    if (b.completionPercentage !== a.completionPercentage) {
      return b.completionPercentage - a.completionPercentage;
    }
    return a.createdAt.getTime() - b.createdAt.getTime();
  });

  return actionableChanges[0];
}

export interface PrioritizedParent {
  parentId: string;
  parentType: ParentType;
  completionPercentage: number;
  completedCount: number;
  totalCount: number;
  tasks: DiscoveredTask[];
  inProgressTask: DiscoveredTask | null;
  nextTask: DiscoveredTask | null;
}

/**
 * Finds the in-progress task and next to-do task from a list of discovered tasks.
 */
function findDiscoveredTasksByStatus(
  tasks: DiscoveredTask[]
): { inProgress: DiscoveredTask | null; nextTodo: DiscoveredTask | null } {
  let inProgress: DiscoveredTask | null = null;
  let nextTodo: DiscoveredTask | null = null;

  for (const task of tasks) {
    if (task.status === 'in-progress' && !inProgress) {
      inProgress = task;
    } else if (task.status === 'to-do' && !nextTodo) {
      nextTodo = task;
    }

    // Stop early if we found both
    if (inProgress && nextTodo) {
      break;
    }
  }

  return { inProgress, nextTodo };
}

/**
 * Selects the highest-priority parent from centralized tasks based on completion percentage.
 * Uses oldest creation date as tiebreaker when percentages are equal.
 * Standalone tasks (no parentId) are deprioritized.
 * Returns null if no actionable parents exist.
 */
export function getPrioritizedParent(
  tasks: DiscoveredTask[]
): PrioritizedParent | null {
  // Group tasks by parentId
  const tasksByParent = new Map<string, DiscoveredTask[]>();

  for (const task of tasks) {
    if (!task.parentId) {
      // Skip standalone tasks for now (deprioritized)
      continue;
    }

    const parentKey = task.parentId;
    if (!tasksByParent.has(parentKey)) {
      tasksByParent.set(parentKey, []);
    }
    tasksByParent.get(parentKey)!.push(task);
  }

  if (tasksByParent.size === 0) {
    return null;
  }

  const parents: PrioritizedParent[] = [];

  for (const [parentId, parentTasks] of tasksByParent.entries()) {
    // Sort tasks by sequence to maintain order
    const sortedTasks = [...parentTasks].sort((a, b) => a.sequence - b.sequence);

    // Calculate completion
    const totalCount = sortedTasks.length;
    const completedCount = sortedTasks.filter((t) => t.status === 'done').length;
    const completionPercentage =
      totalCount === 0 ? 0 : (completedCount / totalCount) * 100;

    // Find in-progress and next to-do tasks
    const { inProgress, nextTodo } = findDiscoveredTasksByStatus(sortedTasks);
    const nextTask = inProgress || nextTodo;

    // Skip parents with no actionable tasks
    if (!nextTask) {
      continue;
    }

    // Use the first task's parentType (all tasks should have the same parentType for a given parentId)
    const parentType = sortedTasks[0].parentType!;

    parents.push({
      parentId,
      parentType,
      completionPercentage,
      completedCount,
      totalCount,
      tasks: sortedTasks,
      inProgressTask: inProgress,
      nextTask,
    });
  }

  if (parents.length === 0) {
    return null;
  }

  // Sort by completion percentage (highest first), then by oldest task creation date
  parents.sort((a, b) => {
    if (b.completionPercentage !== a.completionPercentage) {
      return b.completionPercentage - a.completionPercentage;
    }
    // Use oldest task creation date as tiebreaker (earliest sequence as proxy)
    return a.tasks[0].sequence - b.tasks[0].sequence;
  });

  return parents[0];
}
