import { promises as fs } from 'fs';
import path from 'path';

export type TaskStatus = 'to-do' | 'in-progress' | 'done';

export const DEFAULT_TASK_STATUS: TaskStatus = 'to-do';

const FRONTMATTER_REGEX = /^---\n([\s\S]*?)\n---/;
const STATUS_LINE_REGEX = /^status:\s*(to-do|in-progress|done)\s*$/m;

/**
 * Parses the task status from YAML frontmatter in a task file's content.
 * Returns the default status ('to-do') if frontmatter or status field is missing.
 */
export function parseStatus(content: string): TaskStatus {
  const frontmatterMatch = content.match(FRONTMATTER_REGEX);
  if (!frontmatterMatch) {
    return DEFAULT_TASK_STATUS;
  }

  const frontmatter = frontmatterMatch[1];
  const statusMatch = frontmatter.match(STATUS_LINE_REGEX);
  if (!statusMatch) {
    return DEFAULT_TASK_STATUS;
  }

  return statusMatch[1] as TaskStatus;
}

/**
 * Updates the status in YAML frontmatter, preserving other fields.
 * Adds frontmatter with status if it doesn't exist.
 */
export function updateStatus(content: string, newStatus: TaskStatus): string {
  const frontmatterMatch = content.match(FRONTMATTER_REGEX);

  if (!frontmatterMatch) {
    // No frontmatter - add it at the beginning
    return `---\nstatus: ${newStatus}\n---\n\n${content}`;
  }

  const frontmatter = frontmatterMatch[1];
  const afterFrontmatter = content.slice(frontmatterMatch[0].length);

  if (STATUS_LINE_REGEX.test(frontmatter)) {
    // Update existing status line
    const updatedFrontmatter = frontmatter.replace(
      STATUS_LINE_REGEX,
      `status: ${newStatus}`
    );
    return `---\n${updatedFrontmatter}\n---${afterFrontmatter}`;
  } else {
    // Add status to existing frontmatter
    const updatedFrontmatter = `status: ${newStatus}\n${frontmatter}`;
    return `---\n${updatedFrontmatter}\n---${afterFrontmatter}`;
  }
}

/**
 * Reads a task file and returns its status.
 */
export async function getTaskStatus(filePath: string): Promise<TaskStatus> {
  const content = await fs.readFile(filePath, 'utf-8');
  return parseStatus(content);
}

/**
 * Updates the status of a task file on disk.
 */
export async function setTaskStatus(
  filePath: string,
  newStatus: TaskStatus
): Promise<void> {
  const content = await fs.readFile(filePath, 'utf-8');
  const updatedContent = updateStatus(content, newStatus);
  await fs.writeFile(filePath, updatedContent, 'utf-8');
}
