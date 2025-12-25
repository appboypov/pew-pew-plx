/**
 * Parses task file names and extracts sequence/name information.
 * Task files follow the pattern: NNN-<kebab-case-name>.md (e.g., 001-implement.md)
 */

export const TASK_FILE_PREFIX_PATTERN = /^(\d{3})-(.+)\.md$/;

export interface ParsedTaskFilename {
  sequence: number;
  name: string;
}

/**
 * Parses a task filename and extracts the sequence number and name.
 * @param filename The filename to parse (e.g., "001-implement-core.md")
 * @returns Parsed info or null if filename doesn't match pattern
 */
export function parseTaskFilename(filename: string): ParsedTaskFilename | null {
  const match = filename.match(TASK_FILE_PREFIX_PATTERN);
  if (!match) {
    return null;
  }
  return {
    sequence: parseInt(match[1], 10),
    name: match[2],
  };
}

/**
 * Sorts task filenames by their sequence number.
 * Files that don't match the pattern are excluded.
 * @param files Array of filenames
 * @returns Sorted array of valid task filenames
 */
export function sortTaskFilesBySequence(files: string[]): string[] {
  const validFiles = files.filter(f => TASK_FILE_PREFIX_PATTERN.test(f));
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
 */
export function generateTaskFilename(sequence: number, name: string): string {
  const paddedSequence = String(sequence).padStart(3, '0');
  return `${paddedSequence}-${name}.md`;
}
