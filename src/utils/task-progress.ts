import { promises as fs } from 'fs';
import path from 'path';
import { parseTaskFilename, sortTaskFilesBySequence } from './task-file-parser.js';

const TASK_PATTERN = /^[-*]\s+\[[\sx]\]/i;
const COMPLETED_TASK_PATTERN = /^[-*]\s+\[x\]/i;

export const TASKS_DIRECTORY_NAME = 'tasks';

export interface TaskProgress {
  total: number;
  completed: number;
}

export interface TaskFileInfo {
  filename: string;
  filepath: string;
  sequence: number;
  name: string;
  progress: TaskProgress;
}

export interface ChangeTaskStructure {
  files: TaskFileInfo[];
  aggregateProgress: TaskProgress;
}

/**
 * Counts tasks from markdown content, excluding checkboxes under
 * ## Constraints and ## Acceptance Criteria sections.
 */
export function countTasksFromContent(content: string): TaskProgress {
  const lines = content.split('\n');
  let total = 0;
  let completed = 0;
  let inExcludedSection = false;

  for (const line of lines) {
    // Check for section headers
    if (line.match(/^##\s+Constraints\s*$/i) || line.match(/^##\s+Acceptance\s+Criteria\s*$/i)) {
      inExcludedSection = true;
      continue;
    }
    // Any other ## header exits excluded section
    if (line.match(/^##\s+/)) {
      inExcludedSection = false;
      continue;
    }

    // Skip checkboxes in excluded sections
    if (inExcludedSection) {
      continue;
    }

    if (line.match(TASK_PATTERN)) {
      total++;
      if (line.match(COMPLETED_TASK_PATTERN)) {
        completed++;
      }
    }
  }
  return { total, completed };
}

/**
 * Gets the task structure for a change, detecting if tasks/ directory exists
 * and reading all task files ordered by sequence.
 */
export async function getTaskStructureForChange(changesDir: string, changeName: string): Promise<ChangeTaskStructure> {
  const changeDir = path.join(changesDir, changeName);
  const tasksDir = path.join(changeDir, TASKS_DIRECTORY_NAME);

  try {
    const stat = await fs.stat(tasksDir);
    if (!stat.isDirectory()) {
      return { files: [], aggregateProgress: { total: 0, completed: 0 } };
    }
  } catch {
    // tasks/ directory doesn't exist
    return { files: [], aggregateProgress: { total: 0, completed: 0 } };
  }

  // Read and filter task files
  const entries = await fs.readdir(tasksDir);
  const sortedFiles = sortTaskFilesBySequence(entries);

  const files: TaskFileInfo[] = [];
  let totalAggregate = 0;
  let completedAggregate = 0;

  for (const filename of sortedFiles) {
    const parsed = parseTaskFilename(filename);
    if (!parsed) continue;

    const filepath = path.join(tasksDir, filename);
    try {
      const content = await fs.readFile(filepath, 'utf-8');
      const progress = countTasksFromContent(content);

      files.push({
        filename,
        filepath,
        sequence: parsed.sequence,
        name: parsed.name,
        progress,
      });

      totalAggregate += progress.total;
      completedAggregate += progress.completed;
    } catch {
      // Skip files that can't be read
    }
  }

  return {
    files,
    aggregateProgress: { total: totalAggregate, completed: completedAggregate },
  };
}

/**
 * Gets aggregate task progress for a change.
 * Supports both tasks/ directory structure and legacy tasks.md file.
 */
export async function getTaskProgressForChange(changesDir: string, changeName: string): Promise<TaskProgress> {
  const structure = await getTaskStructureForChange(changesDir, changeName);

  // If tasks/ directory exists with files, return aggregate progress
  if (structure.files.length > 0) {
    return structure.aggregateProgress;
  }

  // Fallback to legacy tasks.md file
  const tasksPath = path.join(changesDir, changeName, 'tasks.md');
  try {
    const content = await fs.readFile(tasksPath, 'utf-8');
    return countTasksFromContent(content);
  } catch {
    return { total: 0, completed: 0 };
  }
}

export function formatTaskStatus(progress: TaskProgress): string {
  if (progress.total === 0) return 'No tasks';
  if (progress.completed === progress.total) return '✓ Complete';
  return `${progress.completed}/${progress.total} tasks`;
}
