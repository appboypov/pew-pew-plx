/**
 * Service for consistent task ID management.
 *
 * Canonical task ID format: `NNN-kebab-name` (e.g., `001-update-templates`)
 * - Always includes the 3-digit sequence prefix
 * - Never includes the .md extension
 */

import { TASK_FILE_PREFIX_PATTERN, parseTaskFilename } from '../utils/task-file-parser.js';

export interface ParsedTaskId {
  sequence: number;
  name: string;
}

/**
 * Gets the canonical task ID from a task object.
 * @param task Object with filename property (e.g., TaskFileInfo)
 * @returns Canonical task ID (e.g., "001-update-templates")
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
 * @param taskId The task ID (e.g., "001-update-templates")
 * @returns Parsed components or null if invalid format
 */
export function parseTaskId(taskId: string): ParsedTaskId | null {
  // Add .md extension if needed for pattern matching
  const filename = taskId.endsWith('.md') ? taskId : `${taskId}.md`;
  return parseTaskFilename(filename);
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
