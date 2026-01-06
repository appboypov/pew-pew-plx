import { promises as fs } from 'fs';
import { PARENT_TYPES, type ParentType } from '../core/config.js';

export type TaskStatus = 'to-do' | 'in-progress' | 'done';
export type SkillLevel = 'junior' | 'medior' | 'senior';

export const DEFAULT_TASK_STATUS: TaskStatus = 'to-do';

export interface CheckboxCompletionResult {
  updatedContent: string;
  completedItems: string[];
}

export interface CheckboxUncompleteResult {
  updatedContent: string;
  uncheckedItems: string[];
}

export interface TaskParentInfo {
  parentType: ParentType;
  parentId: string;
}

const FRONTMATTER_REGEX = /^---\n([\s\S]*?)\n---/;
const STATUS_LINE_REGEX = /^status:\s*(to-do|in-progress|done)\s*$/m;
const SKILL_LEVEL_LINE_REGEX = /^skill-level:\s*(junior|medior|senior)\s*$/m;
const PARENT_TYPE_LINE_REGEX = /^parent-type:\s*(change|review|spec)\s*$/m;
const PARENT_ID_LINE_REGEX = /^parent-id:\s*(.+?)\s*$/m;

/**
 * Normalizes line endings to Unix-style (\n).
 */
function normalizeContent(content: string): string {
  return content.replace(/\r\n?/g, '\n');
}

/**
 * Parses the task status from YAML frontmatter in a task file's content.
 * Returns the default status ('to-do') if frontmatter or status field is missing.
 */
export function parseStatus(content: string): TaskStatus {
  const normalized = normalizeContent(content);
  const frontmatterMatch = normalized.match(FRONTMATTER_REGEX);
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
 * Parses the skill level from YAML frontmatter in a task file's content.
 * Returns undefined if frontmatter, skill-level field is missing, or value is invalid.
 */
export function parseSkillLevel(content: string): SkillLevel | undefined {
  const normalized = normalizeContent(content);
  const frontmatterMatch = normalized.match(FRONTMATTER_REGEX);
  if (!frontmatterMatch) {
    return undefined;
  }

  const frontmatter = frontmatterMatch[1];
  const skillLevelMatch = frontmatter.match(SKILL_LEVEL_LINE_REGEX);
  if (!skillLevelMatch) {
    return undefined;
  }

  return skillLevelMatch[1] as SkillLevel;
}

/**
 * Updates the status in YAML frontmatter, preserving other fields.
 * Adds frontmatter with status if it doesn't exist.
 */
export function updateStatus(content: string, newStatus: TaskStatus): string {
  const normalized = normalizeContent(content);
  const frontmatterMatch = normalized.match(FRONTMATTER_REGEX);

  if (!frontmatterMatch) {
    // No frontmatter - add it at the beginning
    return `---\nstatus: ${newStatus}\n---\n\n${normalized}`;
  }

  const frontmatter = frontmatterMatch[1];
  const afterFrontmatter = normalized.slice(frontmatterMatch[0].length);

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
 * Reads a task file and returns its skill level.
 * Returns undefined if the skill-level field is missing or invalid.
 */
export async function getTaskSkillLevel(
  filePath: string
): Promise<SkillLevel | undefined> {
  const content = await fs.readFile(filePath, 'utf-8');
  return parseSkillLevel(content);
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

/**
 * Marks all unchecked checkboxes in the Implementation Checklist as complete.
 * Does NOT modify checkboxes under ## Constraints or ## Acceptance Criteria.
 */
export function completeImplementationChecklist(
  content: string
): CheckboxCompletionResult {
  const normalized = normalizeContent(content);
  const lines = normalized.split('\n');
  const completedItems: string[] = [];
  let inImplementationChecklist = false;
  let inExcludedSection = false;

  const updatedLines = lines.map((line) => {
    // Check for section headers
    if (line.match(/^##\s+Implementation\s+Checklist\s*$/i)) {
      inImplementationChecklist = true;
      inExcludedSection = false;
      return line;
    }

    if (
      line.match(/^##\s+Constraints\s*$/i) ||
      line.match(/^##\s+Acceptance\s+Criteria\s*$/i)
    ) {
      inExcludedSection = true;
      inImplementationChecklist = false;
      return line;
    }

    // Any other ## header exits both sections
    if (line.match(/^##\s+/)) {
      inImplementationChecklist = false;
      inExcludedSection = false;
      return line;
    }

    // Only process checkboxes in Implementation Checklist, not in excluded sections
    if (inImplementationChecklist && !inExcludedSection) {
      const uncheckedMatch = line.match(/^(\s*[-*]\s+)\[ \](.*)$/);
      if (uncheckedMatch) {
        const prefix = uncheckedMatch[1];
        const text = uncheckedMatch[2].trim();
        completedItems.push(text);
        return `${prefix}[x]${uncheckedMatch[2]}`;
      }
    }

    return line;
  });

  return {
    updatedContent: updatedLines.join('\n'),
    completedItems,
  };
}

/**
 * Completes a task: updates status to 'done' and marks all Implementation Checklist items complete.
 * Returns list of checkbox items that were marked complete.
 */
export async function completeTaskFully(filePath: string): Promise<string[]> {
  const content = await fs.readFile(filePath, 'utf-8');

  // First complete the checkboxes
  const { updatedContent, completedItems } =
    completeImplementationChecklist(content);

  // Then update the status
  const finalContent = updateStatus(updatedContent, 'done');

  await fs.writeFile(filePath, finalContent, 'utf-8');

  return completedItems;
}

/**
 * Marks all checked checkboxes in the Implementation Checklist as uncomplete.
 * Does NOT modify checkboxes under ## Constraints or ## Acceptance Criteria.
 * Handles both [x] and [X] checkbox patterns.
 */
export function uncompleteImplementationChecklist(
  content: string
): CheckboxUncompleteResult {
  const normalized = normalizeContent(content);
  const lines = normalized.split('\n');
  const uncheckedItems: string[] = [];
  let inImplementationChecklist = false;
  let inExcludedSection = false;

  const updatedLines = lines.map((line) => {
    // Check for section headers
    if (line.match(/^##\s+Implementation\s+Checklist\s*$/i)) {
      inImplementationChecklist = true;
      inExcludedSection = false;
      return line;
    }

    if (
      line.match(/^##\s+Constraints\s*$/i) ||
      line.match(/^##\s+Acceptance\s+Criteria\s*$/i)
    ) {
      inExcludedSection = true;
      inImplementationChecklist = false;
      return line;
    }

    // Any other ## header exits both sections
    if (line.match(/^##\s+/)) {
      inImplementationChecklist = false;
      inExcludedSection = false;
      return line;
    }

    // Only process checkboxes in Implementation Checklist, not in excluded sections
    if (inImplementationChecklist && !inExcludedSection) {
      const checkedMatch = line.match(/^(\s*[-*]\s+)\[[xX]\](.*)$/);
      if (checkedMatch) {
        const prefix = checkedMatch[1];
        const text = checkedMatch[2].trim();
        uncheckedItems.push(text);
        return `${prefix}[ ]${checkedMatch[2]}`;
      }
    }

    return line;
  });

  return {
    updatedContent: updatedLines.join('\n'),
    uncheckedItems,
  };
}

/**
 * Undoes a task: updates status to 'to-do' and marks all Implementation Checklist items uncomplete.
 * Returns list of checkbox items that were unchecked.
 */
export async function undoTaskFully(filePath: string): Promise<string[]> {
  const content = await fs.readFile(filePath, 'utf-8');

  // First uncomplete the checkboxes
  const { updatedContent, uncheckedItems } =
    uncompleteImplementationChecklist(content);

  // Then update the status
  const finalContent = updateStatus(updatedContent, 'to-do');

  await fs.writeFile(filePath, finalContent, 'utf-8');

  return uncheckedItems;
}

/**
 * Parses the parent-type from YAML frontmatter in a task file's content.
 * @returns The parent type or undefined if not present or invalid
 */
export function parseParentType(content: string): ParentType | undefined {
  const normalized = normalizeContent(content);
  const frontmatterMatch = normalized.match(FRONTMATTER_REGEX);
  if (!frontmatterMatch) {
    return undefined;
  }

  const frontmatter = frontmatterMatch[1];
  const parentTypeMatch = frontmatter.match(PARENT_TYPE_LINE_REGEX);
  if (!parentTypeMatch) {
    return undefined;
  }

  const value = parentTypeMatch[1] as ParentType;
  if (!PARENT_TYPES.includes(value)) {
    return undefined;
  }

  return value;
}

/**
 * Parses the parent-id from YAML frontmatter in a task file's content.
 * @returns The parent ID or undefined if not present
 */
export function parseParentId(content: string): string | undefined {
  const normalized = normalizeContent(content);
  const frontmatterMatch = normalized.match(FRONTMATTER_REGEX);
  if (!frontmatterMatch) {
    return undefined;
  }

  const frontmatter = frontmatterMatch[1];
  const parentIdMatch = frontmatter.match(PARENT_ID_LINE_REGEX);
  if (!parentIdMatch) {
    return undefined;
  }

  return parentIdMatch[1];
}

/**
 * Parses parent information from YAML frontmatter in a task file's content.
 *
 * Validates that both parent-type and parent-id are either:
 * - Both present (returns TaskParentInfo)
 * - Both absent (returns null)
 *
 * @throws Error if only one of parent-type or parent-id is present
 * @returns TaskParentInfo if both fields present, null if both absent
 */
export function parseTaskParentInfo(content: string): TaskParentInfo | null {
  const parentType = parseParentType(content);
  const parentId = parseParentId(content);

  const hasParentType = parentType !== undefined;
  const hasParentId = parentId !== undefined;

  if (hasParentType && hasParentId) {
    return {
      parentType,
      parentId,
    };
  }

  if (!hasParentType && !hasParentId) {
    return null;
  }

  // Only one present - validation error
  if (hasParentType && !hasParentId) {
    throw new Error(
      'Task has parent-type but missing parent-id in frontmatter'
    );
  }

  throw new Error('Task has parent-id but missing parent-type in frontmatter');
}
