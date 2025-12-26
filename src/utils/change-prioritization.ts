import { promises as fs } from 'fs';
import path from 'path';
import {
  getTaskStructureForChange,
  TaskProgress,
  TaskFileInfo,
} from './task-progress.js';
import { parseStatus } from './task-status.js';

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

  // Filter out non-actionable changes:
  // - total == 0 (no checkboxes at all) AND no in-progress task
  // - completed == total (all checkboxes complete) AND no in-progress task
  // Keep changes with in-progress tasks so auto-completion can run
  const actionableChanges = changes.filter((c) => {
    const { total, completed } = c.taskProgress;
    return c.inProgressTask !== null || (total > 0 && completed < total);
  });

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
