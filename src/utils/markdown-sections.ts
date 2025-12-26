/**
 * Utility functions for extracting sections from markdown content.
 * Sections are identified by level-2 headers (## Header Name).
 */

const SECTION_HEADER_REGEX = /^## (.+)$/gm;

/**
 * Extracts a specific section from markdown content by section name.
 * The section includes the header and all content until the next ## header or EOF.
 * @param content The markdown content to search
 * @param sectionName The name of the section to extract (case-insensitive)
 * @returns The section content including header, or null if not found
 */
export function extractSection(
  content: string,
  sectionName: string
): string | null {
  const lines = content.split('\n');
  const normalizedSectionName = sectionName.toLowerCase().trim();
  let capturing = false;
  const capturedLines: string[] = [];

  for (const line of lines) {
    const headerMatch = line.match(/^## (.+)$/);

    if (headerMatch) {
      if (capturing) {
        // Hit next section, stop capturing
        break;
      }

      const headerName = headerMatch[1].toLowerCase().trim();
      if (headerName === normalizedSectionName) {
        capturing = true;
        capturedLines.push(line);
      }
    } else if (capturing) {
      capturedLines.push(line);
    }
  }

  if (capturedLines.length === 0) {
    return null;
  }

  // Trim trailing empty lines while preserving content structure
  while (
    capturedLines.length > 0 &&
    capturedLines[capturedLines.length - 1].trim() === ''
  ) {
    capturedLines.pop();
  }

  return capturedLines.join('\n');
}

/**
 * Lists all section names found in markdown content.
 * Only returns level-2 headers (## Header Name).
 * @param content The markdown content to scan
 * @returns Array of section names in order of appearance
 */
export function listSections(content: string): string[] {
  const sections: string[] = [];
  let match: RegExpExecArray | null;

  // Reset regex lastIndex
  SECTION_HEADER_REGEX.lastIndex = 0;

  while ((match = SECTION_HEADER_REGEX.exec(content)) !== null) {
    sections.push(match[1].trim());
  }

  return sections;
}
