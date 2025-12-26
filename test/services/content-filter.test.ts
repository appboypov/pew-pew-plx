import { describe, it, expect } from 'vitest';
import { ContentFilterService } from '../../src/services/content-filter.js';

describe('ContentFilterService', () => {
  const service = new ContentFilterService();

  describe('filterSections', () => {
    it('should extract a single section', () => {
      const content = `## Constraints
- [ ] Must be fast
- [ ] Must be reliable

## Implementation Checklist
- [ ] Do thing 1
- [ ] Do thing 2`;

      const result = service.filterSections(content, ['Constraints']);
      expect(result).toBe(`## Constraints
- [ ] Must be fast
- [ ] Must be reliable`);
    });

    it('should extract multiple sections', () => {
      const content = `## End Goal
Achieve something great.

## Constraints
- [ ] Must be fast

## Acceptance Criteria
- [ ] Feature works`;

      const result = service.filterSections(content, [
        'Constraints',
        'Acceptance Criteria',
      ]);
      expect(result).toBe(`## Constraints
- [ ] Must be fast

## Acceptance Criteria
- [ ] Feature works`);
    });

    it('should return empty string when no sections match', () => {
      const content = `## Existing Section
Some content.`;

      const result = service.filterSections(content, ['Missing Section']);
      expect(result).toBe('');
    });

    it('should skip missing sections and return found ones', () => {
      const content = `## Found Section
Content here.

## Another Section
More content.`;

      const result = service.filterSections(content, [
        'Missing',
        'Found Section',
      ]);
      expect(result).toBe(`## Found Section
Content here.`);
    });

    it('should handle empty sections array', () => {
      const content = `## Some Section
Content.`;

      const result = service.filterSections(content, []);
      expect(result).toBe('');
    });

    it('should be case-insensitive', () => {
      const content = `## Constraints
- Item 1`;

      const result = service.filterSections(content, ['constraints']);
      expect(result).toBe(`## Constraints
- Item 1`);
    });
  });

  describe('filterMultipleTasks', () => {
    it('should aggregate sections from multiple tasks', () => {
      const task1 = `## Constraints
- [ ] Task 1 constraint

## Notes
Task 1 notes.`;

      const task2 = `## Constraints
- [ ] Task 2 constraint

## Notes
Task 2 notes.`;

      const result = service.filterMultipleTasks([task1, task2], ['Constraints']);
      expect(result).toBe(`## Constraints
- [ ] Task 1 constraint

---

## Constraints
- [ ] Task 2 constraint`);
    });

    it('should skip tasks without matching sections', () => {
      const task1 = `## Constraints
- [ ] Has constraint`;

      const task2 = `## Notes
No constraints here.`;

      const result = service.filterMultipleTasks([task1, task2], ['Constraints']);
      expect(result).toBe(`## Constraints
- [ ] Has constraint`);
    });

    it('should return empty string when no tasks have matching sections', () => {
      const task1 = `## Notes
Notes only.`;

      const task2 = `## Other Section
Other content.`;

      const result = service.filterMultipleTasks([task1, task2], ['Constraints']);
      expect(result).toBe('');
    });

    it('should handle empty tasks array', () => {
      const result = service.filterMultipleTasks([], ['Constraints']);
      expect(result).toBe('');
    });

    it('should extract multiple sections from multiple tasks', () => {
      const task1 = `## Constraints
C1

## Acceptance Criteria
AC1`;

      const task2 = `## Constraints
C2

## Acceptance Criteria
AC2`;

      const result = service.filterMultipleTasks(
        [task1, task2],
        ['Constraints', 'Acceptance Criteria']
      );
      expect(result).toBe(`## Constraints
C1

## Acceptance Criteria
AC1

---

## Constraints
C2

## Acceptance Criteria
AC2`);
    });
  });
});
