import { promises as fs } from 'fs';
import path from 'path';
import { TASKS_DIRECTORY_NAME } from './task-progress.js';
import { TASK_FILE_PREFIX_PATTERN } from './task-file-parser.js';

export interface MigrationResult {
  migrated: boolean;
  fromPath: string;
  toPath: string;
}

/**
 * Checks if tasks/ directory exists with at least one valid task file.
 */
async function hasValidTasksDirectory(changeDir: string): Promise<boolean> {
  const tasksDir = path.join(changeDir, TASKS_DIRECTORY_NAME);
  try {
    const stat = await fs.stat(tasksDir);
    if (!stat.isDirectory()) return false;

    const entries = await fs.readdir(tasksDir);
    return entries.some(f => TASK_FILE_PREFIX_PATTERN.test(f));
  } catch {
    return false;
  }
}

/**
 * Checks if legacy tasks.md exists.
 */
async function hasLegacyTasksFile(changeDir: string): Promise<boolean> {
  const tasksPath = path.join(changeDir, 'tasks.md');
  try {
    const stat = await fs.stat(tasksPath);
    return stat.isFile();
  } catch {
    return false;
  }
}

/**
 * Migrates legacy tasks.md to tasks/001-tasks.md if needed.
 * Returns null if no migration was needed, otherwise returns the migration result.
 */
export async function migrateIfNeeded(changeDir: string): Promise<MigrationResult | null> {
  const hasValidDir = await hasValidTasksDirectory(changeDir);
  const hasLegacy = await hasLegacyTasksFile(changeDir);

  // If tasks/ exists with valid files
  if (hasValidDir) {
    // Clean up orphan tasks.md if it exists
    if (hasLegacy) {
      const legacyPath = path.join(changeDir, 'tasks.md');
      await fs.unlink(legacyPath);
    }
    return null;
  }

  // If no legacy tasks.md, nothing to migrate
  if (!hasLegacy) {
    return null;
  }

  // Migrate tasks.md to tasks/001-tasks.md
  return migrate(changeDir);
}

/**
 * Forces migration of tasks.md to tasks/001-tasks.md.
 */
export async function migrate(changeDir: string): Promise<MigrationResult> {
  const fromPath = path.join(changeDir, 'tasks.md');
  const tasksDir = path.join(changeDir, TASKS_DIRECTORY_NAME);
  const toPath = path.join(tasksDir, '001-tasks.md');

  // Read legacy content
  const content = await fs.readFile(fromPath, 'utf-8');

  // Create tasks/ directory
  await fs.mkdir(tasksDir, { recursive: true });

  // Write to new location
  await fs.writeFile(toPath, content, 'utf-8');

  // Delete legacy file
  await fs.unlink(fromPath);

  return {
    migrated: true,
    fromPath,
    toPath,
  };
}
