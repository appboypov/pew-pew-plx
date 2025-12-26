import { extractSection } from '../utils/markdown-sections.js';

/**
 * Service for filtering markdown content by sections.
 */
export class ContentFilterService {
  /**
   * Filters content to include only the specified sections.
   * Sections are extracted in the order they appear in the content.
   * @param content The markdown content to filter
   * @param sections Array of section names to extract (case-insensitive)
   * @returns Combined content of matched sections, or empty string if none found
   */
  filterSections(content: string, sections: string[]): string {
    const extractedSections: string[] = [];

    for (const sectionName of sections) {
      const section = extractSection(content, sectionName);
      if (section !== null) {
        extractedSections.push(section);
      }
    }

    return extractedSections.join('\n\n');
  }

  /**
   * Filters multiple task contents and aggregates the results.
   * @param taskContents Array of task markdown contents
   * @param sections Array of section names to extract from each task
   * @returns Combined filtered content from all tasks
   */
  filterMultipleTasks(taskContents: string[], sections: string[]): string {
    const filteredContents: string[] = [];

    for (const content of taskContents) {
      const filtered = this.filterSections(content, sections);
      if (filtered.length > 0) {
        filteredContents.push(filtered);
      }
    }

    return filteredContents.join('\n\n---\n\n');
  }
}
