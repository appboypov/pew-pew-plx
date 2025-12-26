import { describe, it, expect } from 'vitest';
import {
  extractSection,
  listSections,
} from '../../src/utils/markdown-sections.js';

describe('markdown-sections', () => {
  describe('extractSection', () => {
    it('should extract section with content until next header', () => {
      const content = `# Title

## First Section
Content of first section.

## Second Section
Content of second section.`;

      const result = extractSection(content, 'First Section');
      expect(result).toBe(`## First Section
Content of first section.`);
    });

    it('should extract section at end of file', () => {
      const content = `## First Section
Some content.

## Last Section
Content of last section.
More content here.`;

      const result = extractSection(content, 'Last Section');
      expect(result).toBe(`## Last Section
Content of last section.
More content here.`);
    });

    it('should be case-insensitive', () => {
      const content = `## Implementation Checklist
- [ ] Item 1
- [ ] Item 2`;

      expect(extractSection(content, 'implementation checklist')).toBe(`## Implementation Checklist
- [ ] Item 1
- [ ] Item 2`);

      expect(extractSection(content, 'IMPLEMENTATION CHECKLIST')).toBe(`## Implementation Checklist
- [ ] Item 1
- [ ] Item 2`);
    });

    it('should return null for missing section', () => {
      const content = `## Existing Section
Some content.`;

      const result = extractSection(content, 'Missing Section');
      expect(result).toBeNull();
    });

    it('should handle section with empty content', () => {
      const content = `## Empty Section

## Next Section
Content here.`;

      const result = extractSection(content, 'Empty Section');
      expect(result).toBe('## Empty Section');
    });

    it('should trim whitespace from section name for matching', () => {
      const content = `## Constraints
- Constraint 1`;

      expect(extractSection(content, '  Constraints  ')).toBe(`## Constraints
- Constraint 1`);
    });

    it('should not match level-3 or higher headers', () => {
      const content = `## Main Section
Content.

### Subsection
More content.

## Another Section
Different content.`;

      const result = extractSection(content, 'Main Section');
      expect(result).toBe(`## Main Section
Content.

### Subsection
More content.`);
    });

    it('should handle content with only one section', () => {
      const content = `## Only Section
This is the only content.`;

      const result = extractSection(content, 'Only Section');
      expect(result).toBe(`## Only Section
This is the only content.`);
    });

    it('should handle empty content', () => {
      const result = extractSection('', 'Any Section');
      expect(result).toBeNull();
    });
  });

  describe('listSections', () => {
    it('should list all level-2 sections', () => {
      const content = `# Title

## First Section
Content.

## Second Section
More content.

## Third Section
Even more.`;

      const result = listSections(content);
      expect(result).toEqual(['First Section', 'Second Section', 'Third Section']);
    });

    it('should return empty array for content without sections', () => {
      const content = `# Just a Title

Some content without level-2 headers.

### Level 3 Header
This shouldn't count.`;

      const result = listSections(content);
      expect(result).toEqual([]);
    });

    it('should preserve section name order', () => {
      const content = `## Zebra
## Alpha
## Beta`;

      const result = listSections(content);
      expect(result).toEqual(['Zebra', 'Alpha', 'Beta']);
    });

    it('should trim section names', () => {
      const content = `##   Spaced Section
Content.

## Normal Section
More content.`;

      const result = listSections(content);
      expect(result).toEqual(['Spaced Section', 'Normal Section']);
    });

    it('should handle empty content', () => {
      const result = listSections('');
      expect(result).toEqual([]);
    });

    it('should ignore level-3 and deeper headers', () => {
      const content = `## Level 2
### Level 3
#### Level 4
## Another Level 2`;

      const result = listSections(content);
      expect(result).toEqual(['Level 2', 'Another Level 2']);
    });
  });
});
