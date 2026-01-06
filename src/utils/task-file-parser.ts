/**
 * Parses task file names and extracts sequence/name/parentId information.
 *
 * Task files follow two patterns:
 * - Parented: NNN-<parent-id>-<name>.md (e.g., 001-add-feature-x-implement.md)
 * - Standalone: NNN-<name>.md (e.g., 001-fix-typo.md)
 *
 * For parented tasks, the parentId is the parent's kebab-case ID, followed by the
 * task's kebab-case name. The parsing relies on frontmatter to determine if a task
 * is parented (via parent-type and parent-id fields), with filename parsing providing
 * the structural decomposition.
 */

/**
 * Pattern for standalone task filenames: NNN-<name>.md
 * Kept for backward compatibility.
 */
export const TASK_FILE_PREFIX_PATTERN = /^(\d{3})-(.+)\.md$/;

/**
 * Pattern for parented task filenames: NNN-<parent-id>-<name>.md
 * Captures: [1] = sequence, [2] = parentId, [3] = taskName
 * The parentId must have at least one segment, taskName is the last segment.
 */
export const PARENTED_TASK_FILE_PATTERN =
  /^(\d{3})-((?:[a-z0-9]+(?:-[a-z0-9]+)*)-([a-z0-9]+(?:-[a-z0-9]+)*))\.md$/;

export interface ParsedTaskFilename {
  sequence: number;
  name: string;
  parentId?: string;
}

export interface BuildTaskFilenameOptions {
  sequence: number;
  name: string;
  parentId?: string;
}

/**
 * Parses a task filename and extracts the sequence number, name, and optional parentId.
 *
 * For parented tasks (determined by having a parentId prefix in the filename):
 * - `001-add-feature-x-implement.md` parses to:
 *   { sequence: 1, parentId: 'add-feature-x', name: 'implement' }
 *
 * For standalone tasks:
 * - `001-fix-typo.md` parses to:
 *   { sequence: 1, name: 'fix-typo' }
 *
 * Note: This function provides structural parsing only. To determine if a task is
 * truly parented, check the frontmatter fields (parent-type, parent-id).
 *
 * @param filename The filename to parse (e.g., "001-implement-core.md")
 * @param hasParent Optional hint indicating the task has a parent (from frontmatter).
 *                  When true, attempts to parse as parented format.
 * @returns Parsed info or null if filename doesn't match pattern
 */
export function parseTaskFilename(
  filename: string,
  hasParent?: boolean
): ParsedTaskFilename | null {
  const match = filename.match(TASK_FILE_PREFIX_PATTERN);
  if (!match) {
    return null;
  }

  const sequence = parseInt(match[1], 10);
  const fullName = match[2];

  // If we know this has a parent, try to extract parentId from the fullName
  if (hasParent) {
    // For parented tasks, the last kebab segment is the task name,
    // everything before is the parentId.
    // e.g., "add-feature-x-implement" -> parentId: "add-feature-x", name: "implement"
    const lastDashIndex = fullName.lastIndexOf('-');
    if (lastDashIndex > 0) {
      return {
        sequence,
        parentId: fullName.substring(0, lastDashIndex),
        name: fullName.substring(lastDashIndex + 1),
      };
    }
  }

  // Default: treat entire portion after sequence as the name (standalone task)
  return {
    sequence,
    name: fullName,
  };
}

/**
 * Sorts task filenames by their sequence number.
 * Files that don't match the pattern are excluded.
 * @param files Array of filenames
 * @returns Sorted array of valid task filenames
 */
export function sortTaskFilesBySequence(files: string[]): string[] {
  const validFiles = files.filter((f) => TASK_FILE_PREFIX_PATTERN.test(f));
  return validFiles.sort((a, b) => {
    const parsedA = parseTaskFilename(a);
    const parsedB = parseTaskFilename(b);
    if (!parsedA || !parsedB) return 0;
    return parsedA.sequence - parsedB.sequence;
  });
}

/**
 * Generates a task filename from sequence and name.
 * @param sequence The sequence number (will be zero-padded to 3 digits)
 * @param name The task name in kebab-case
 * @returns Formatted filename (e.g., "001-implement.md")
 * @deprecated Use buildTaskFilename instead for new code
 */
export function generateTaskFilename(sequence: number, name: string): string {
  const paddedSequence = String(sequence).padStart(3, '0');
  return `${paddedSequence}-${name}.md`;
}

/**
 * Builds a task filename from the given options.
 *
 * For parented tasks:
 * - buildTaskFilename({ sequence: 1, parentId: 'my-change', name: 'design' })
 *   returns '001-my-change-design.md'
 *
 * For standalone tasks:
 * - buildTaskFilename({ sequence: 1, name: 'quick-task' })
 *   returns '001-quick-task.md'
 *
 * @param options The options for building the filename
 * @returns Formatted filename
 */
export function buildTaskFilename(options: BuildTaskFilenameOptions): string {
  const { sequence, name, parentId } = options;
  const paddedSequence = String(sequence).padStart(3, '0');

  if (parentId) {
    return `${paddedSequence}-${parentId}-${name}.md`;
  }

  return `${paddedSequence}-${name}.md`;
}

/**
 * Checks if a filename follows the parented task format.
 *
 * Note: This is a heuristic based on filename structure (having multiple
 * kebab-case segments after the sequence). For definitive determination,
 * check the frontmatter fields.
 *
 * @param filename The filename to check
 * @returns true if the filename could be a parented task format
 */
export function isParentedTask(filename: string): boolean {
  const match = filename.match(TASK_FILE_PREFIX_PATTERN);
  if (!match) {
    return false;
  }

  const fullName = match[2];
  // Parented tasks have at least 2 kebab segments (parentId-taskName)
  // e.g., "add-feature-x-implement" has parentId "add-feature-x" and name "implement"
  // But "fix-typo" could be standalone with name "fix-typo"
  // Without frontmatter, we check if there are at least 2 dash-separated groups
  // that could represent parent-name separation
  const segments = fullName.split('-');
  return segments.length >= 2;
}
