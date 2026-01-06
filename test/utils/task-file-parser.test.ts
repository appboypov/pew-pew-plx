import { describe, it, expect } from 'vitest';
import {
  parseTaskFilename,
  sortTaskFilesBySequence,
  generateTaskFilename,
  buildTaskFilename,
  isParentedTask,
  TASK_FILE_PREFIX_PATTERN,
} from '../../src/utils/task-file-parser.js';

describe('task-file-parser', () => {
  describe('TASK_FILE_PREFIX_PATTERN', () => {
    it('should match valid task filenames', () => {
      expect(TASK_FILE_PREFIX_PATTERN.test('001-implement.md')).toBe(true);
      expect(TASK_FILE_PREFIX_PATTERN.test('002-review.md')).toBe(true);
      expect(TASK_FILE_PREFIX_PATTERN.test('999-test.md')).toBe(true);
      expect(TASK_FILE_PREFIX_PATTERN.test('001-implement-core-logic.md')).toBe(
        true
      );
    });

    it('should not match invalid filenames', () => {
      expect(TASK_FILE_PREFIX_PATTERN.test('1-implement.md')).toBe(false);
      expect(TASK_FILE_PREFIX_PATTERN.test('01-implement.md')).toBe(false);
      expect(TASK_FILE_PREFIX_PATTERN.test('README.md')).toBe(false);
      expect(TASK_FILE_PREFIX_PATTERN.test('notes.txt')).toBe(false);
      expect(TASK_FILE_PREFIX_PATTERN.test('001-implement.txt')).toBe(false);
      expect(TASK_FILE_PREFIX_PATTERN.test('001.md')).toBe(false);
    });
  });

  describe('parseTaskFilename', () => {
    describe('standalone tasks (no hasParent hint)', () => {
      it('should parse valid task filename', () => {
        const result = parseTaskFilename('001-implement.md');
        expect(result).toEqual({ sequence: 1, name: 'implement' });
      });

      it('should parse filename with kebab-case name', () => {
        const result = parseTaskFilename('003-write-unit-tests.md');
        expect(result).toEqual({ sequence: 3, name: 'write-unit-tests' });
      });

      it('should handle leading zeros correctly', () => {
        const result = parseTaskFilename('099-feature.md');
        expect(result).toEqual({ sequence: 99, name: 'feature' });
      });

      it('should return null for invalid filename', () => {
        expect(parseTaskFilename('no-prefix.md')).toBeNull();
        expect(parseTaskFilename('1-short.md')).toBeNull();
        expect(parseTaskFilename('README.md')).toBeNull();
      });
    });

    describe('parented tasks (with hasParent hint)', () => {
      it('should parse parented filename with parent ID', () => {
        const result = parseTaskFilename(
          '001-add-feature-x-implement.md',
          true
        );
        expect(result).toEqual({
          sequence: 1,
          parentId: 'add-feature-x',
          name: 'implement',
        });
      });

      it('should parse parented filename with multi-segment parent ID', () => {
        const result = parseTaskFilename(
          '002-my-awesome-change-design.md',
          true
        );
        expect(result).toEqual({
          sequence: 2,
          parentId: 'my-awesome-change',
          name: 'design',
        });
      });

      it('should parse parented filename with simple parent ID', () => {
        const result = parseTaskFilename('003-feature-implement.md', true);
        expect(result).toEqual({
          sequence: 3,
          parentId: 'feature',
          name: 'implement',
        });
      });

      it('should fallback to standalone parsing if single segment with hasParent', () => {
        // Edge case: hasParent=true but only one segment after sequence
        // This shouldn't happen in practice, but parser handles it gracefully
        const result = parseTaskFilename('004-implement.md', true);
        // No dash to split on, so it returns the full name
        expect(result).toEqual({ sequence: 4, name: 'implement' });
      });
    });

    describe('backward compatibility', () => {
      it('should work without hasParent parameter', () => {
        const result = parseTaskFilename('001-my-change-task.md');
        expect(result).toEqual({ sequence: 1, name: 'my-change-task' });
      });

      it('should work with hasParent=false', () => {
        const result = parseTaskFilename('001-my-change-task.md', false);
        expect(result).toEqual({ sequence: 1, name: 'my-change-task' });
      });
    });
  });

  describe('sortTaskFilesBySequence', () => {
    it('should sort files by sequence number', () => {
      const files = ['003-last.md', '001-first.md', '002-middle.md'];
      const sorted = sortTaskFilesBySequence(files);
      expect(sorted).toEqual(['001-first.md', '002-middle.md', '003-last.md']);
    });

    it('should filter out invalid filenames', () => {
      const files = [
        '001-valid.md',
        'README.md',
        '002-also-valid.md',
        'notes.txt',
      ];
      const sorted = sortTaskFilesBySequence(files);
      expect(sorted).toEqual(['001-valid.md', '002-also-valid.md']);
    });

    it('should return empty array for no valid files', () => {
      const files = ['README.md', 'notes.txt', 'config.json'];
      const sorted = sortTaskFilesBySequence(files);
      expect(sorted).toEqual([]);
    });

    it('should handle empty array', () => {
      const sorted = sortTaskFilesBySequence([]);
      expect(sorted).toEqual([]);
    });
  });

  describe('generateTaskFilename', () => {
    it('should generate filename with padded sequence', () => {
      expect(generateTaskFilename(1, 'implement')).toBe('001-implement.md');
      expect(generateTaskFilename(10, 'review')).toBe('010-review.md');
      expect(generateTaskFilename(100, 'test')).toBe('100-test.md');
    });

    it('should handle kebab-case names', () => {
      expect(generateTaskFilename(2, 'write-tests')).toBe('002-write-tests.md');
    });
  });

  describe('buildTaskFilename', () => {
    describe('standalone tasks', () => {
      it('should build filename without parentId', () => {
        const result = buildTaskFilename({ sequence: 1, name: 'quick-task' });
        expect(result).toBe('001-quick-task.md');
      });

      it('should handle single-word name', () => {
        const result = buildTaskFilename({ sequence: 5, name: 'implement' });
        expect(result).toBe('005-implement.md');
      });

      it('should handle high sequence numbers', () => {
        const result = buildTaskFilename({ sequence: 999, name: 'final' });
        expect(result).toBe('999-final.md');
      });
    });

    describe('parented tasks', () => {
      it('should build filename with parentId', () => {
        const result = buildTaskFilename({
          sequence: 1,
          parentId: 'my-change',
          name: 'design',
        });
        expect(result).toBe('001-my-change-design.md');
      });

      it('should build filename with multi-segment parentId', () => {
        const result = buildTaskFilename({
          sequence: 2,
          parentId: 'add-feature-x',
          name: 'implement',
        });
        expect(result).toBe('002-add-feature-x-implement.md');
      });

      it('should build filename with simple parentId', () => {
        const result = buildTaskFilename({
          sequence: 3,
          parentId: 'feature',
          name: 'review',
        });
        expect(result).toBe('003-feature-review.md');
      });
    });

    describe('round-trip consistency', () => {
      it('should parse what it builds for standalone tasks', () => {
        const built = buildTaskFilename({ sequence: 1, name: 'quick-task' });
        const parsed = parseTaskFilename(built);
        expect(parsed).toEqual({ sequence: 1, name: 'quick-task' });
      });

      it('should parse what it builds for parented tasks', () => {
        const built = buildTaskFilename({
          sequence: 2,
          parentId: 'my-change',
          name: 'design',
        });
        const parsed = parseTaskFilename(built, true);
        expect(parsed).toEqual({
          sequence: 2,
          parentId: 'my-change',
          name: 'design',
        });
      });
    });
  });

  describe('isParentedTask', () => {
    it('should return true for filenames with multiple segments', () => {
      expect(isParentedTask('001-add-feature-x-implement.md')).toBe(true);
      expect(isParentedTask('002-my-change-design.md')).toBe(true);
      expect(isParentedTask('003-fix-typo.md')).toBe(true); // Could be parented or standalone
    });

    it('should return false for filenames with single segment', () => {
      expect(isParentedTask('001-implement.md')).toBe(false);
      expect(isParentedTask('002-review.md')).toBe(false);
    });

    it('should return false for invalid filenames', () => {
      expect(isParentedTask('README.md')).toBe(false);
      expect(isParentedTask('notes.txt')).toBe(false);
      expect(isParentedTask('1-task.md')).toBe(false);
    });
  });
});
