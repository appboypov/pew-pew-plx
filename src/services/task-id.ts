/**
 * Service for consistent task ID management.
 *
 * Task ID formats:
 * - Parented: `NNN-parentId-taskName` (e.g., `001-add-feature-x-implement`)
 * - Standalone: `NNN-kebab-name` (e.g., `001-fix-typo`)
 *
 * The task ID is always the filename without the .md extension.
 */

import {
  TASK_FILE_PREFIX_PATTERN,
  parseTaskFilename,
} from '../utils/task-file-parser.js';

export interface ParsedTaskId {
  sequence: number;
  name: string;
  parentId?: string;
}

/**
 * Gets the canonical task ID from a task object.
 * @param task Object with filename property (e.g., TaskFileInfo)
 * @returns Canonical task ID (e.g., "001-update-templates" or "001-my-change-implement")
 */
export function getTaskId(task: { filename: string }): string {
  return getTaskIdFromFilename(task.filename);
}

/**
 * Gets the canonical task ID from a filename.
 * @param filename The task filename (e.g., "001-update-templates.md")
 * @returns Canonical task ID (e.g., "001-update-templates")
 */
export function getTaskIdFromFilename(filename: string): string {
  return filename.replace(/\.md$/, '');
}

/**
 * Parses a task ID into its components.
 *
 * For parented tasks (when hasParent hint is true):
 * - "001-add-feature-x-implement" parses to:
 *   { sequence: 1, parentId: "add-feature-x", name: "implement" }
 *
 * For standalone tasks:
 * - "001-fix-typo" parses to:
 *   { sequence: 1, name: "fix-typo" }
 *
 * @param taskId The task ID (e.g., "001-update-templates")
 * @param hasParent Optional hint indicating the task has a parent (from frontmatter)
 * @returns Parsed components or null if invalid format
 */
export function parseTaskId(
  taskId: string,
  hasParent?: boolean
): ParsedTaskId | null {
  // Add .md extension if needed for pattern matching
  const filename = taskId.endsWith('.md') ? taskId : `${taskId}.md`;
  return parseTaskFilename(filename, hasParent);
}

/**
 * Normalizes a task ID to canonical format.
 * @param taskId Input task ID (may or may not have .md extension)
 * @returns Canonical task ID without .md extension
 */
export function normalizeTaskId(taskId: string): string {
  return taskId.replace(/\.md$/, '');
}

/**
 * Validates that a string is a valid task ID format.
 * @param taskId The string to validate
 * @returns True if valid task ID format
 */
export function isValidTaskId(taskId: string): boolean {
  const filename = taskId.endsWith('.md') ? taskId : `${taskId}.md`;
  return TASK_FILE_PREFIX_PATTERN.test(filename);
}
