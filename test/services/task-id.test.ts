import { describe, it, expect } from 'vitest';
import {
  getTaskId,
  getTaskIdFromFilename,
  parseTaskId,
  normalizeTaskId,
  isValidTaskId,
} from '../../src/services/task-id.js';

describe('TaskIdService', () => {
  describe('getTaskId', () => {
    it('should return task ID from task object', () => {
      const task = { filename: '001-implement.md' };
      expect(getTaskId(task)).toBe('001-implement');
    });

    it('should handle multi-word task names', () => {
      const task = { filename: '002-update-templates.md' };
      expect(getTaskId(task)).toBe('002-update-templates');
    });

    it('should handle high sequence numbers', () => {
      const task = { filename: '999-final-task.md' };
      expect(getTaskId(task)).toBe('999-final-task');
    });

    it('should handle parented task filenames', () => {
      const task = { filename: '001-add-feature-x-implement.md' };
      expect(getTaskId(task)).toBe('001-add-feature-x-implement');
    });
  });

  describe('getTaskIdFromFilename', () => {
    it('should strip .md extension', () => {
      expect(getTaskIdFromFilename('001-test.md')).toBe('001-test');
    });

    it('should return unchanged if no .md extension', () => {
      expect(getTaskIdFromFilename('001-test')).toBe('001-test');
    });

    it('should only strip trailing .md', () => {
      expect(getTaskIdFromFilename('001-test.md.backup')).toBe(
        '001-test.md.backup'
      );
    });

    it('should handle parented task filenames', () => {
      expect(getTaskIdFromFilename('001-my-change-implement.md')).toBe(
        '001-my-change-implement'
      );
    });
  });

  describe('parseTaskId', () => {
    describe('standalone tasks (no hasParent hint)', () => {
      it('should parse valid task ID', () => {
        const result = parseTaskId('001-implement');
        expect(result).not.toBeNull();
        expect(result!.sequence).toBe(1);
        expect(result!.name).toBe('implement');
        expect(result!.parentId).toBeUndefined();
      });

      it('should parse task ID with .md extension', () => {
        const result = parseTaskId('002-review.md');
        expect(result).not.toBeNull();
        expect(result!.sequence).toBe(2);
        expect(result!.name).toBe('review');
      });

      it('should parse multi-word task names', () => {
        const result = parseTaskId('003-update-templates');
        expect(result).not.toBeNull();
        expect(result!.sequence).toBe(3);
        expect(result!.name).toBe('update-templates');
      });

      it('should return null for invalid format (no sequence)', () => {
        expect(parseTaskId('implement')).toBeNull();
      });

      it('should return null for invalid format (wrong sequence length)', () => {
        expect(parseTaskId('01-test')).toBeNull();
        expect(parseTaskId('1-test')).toBeNull();
      });

      it('should return null for invalid format (no name)', () => {
        expect(parseTaskId('001-')).toBeNull();
      });
    });

    describe('parented tasks (with hasParent hint)', () => {
      it('should parse parented task ID', () => {
        const result = parseTaskId('001-add-feature-x-implement', true);
        expect(result).not.toBeNull();
        expect(result!.sequence).toBe(1);
        expect(result!.parentId).toBe('add-feature-x');
        expect(result!.name).toBe('implement');
      });

      it('should parse parented task ID with .md extension', () => {
        const result = parseTaskId('002-my-change-design.md', true);
        expect(result).not.toBeNull();
        expect(result!.sequence).toBe(2);
        expect(result!.parentId).toBe('my-change');
        expect(result!.name).toBe('design');
      });

      it('should parse parented task ID with multi-segment parent', () => {
        const result = parseTaskId('003-my-awesome-change-review', true);
        expect(result).not.toBeNull();
        expect(result!.sequence).toBe(3);
        expect(result!.parentId).toBe('my-awesome-change');
        expect(result!.name).toBe('review');
      });

      it('should fallback gracefully for single segment with hasParent', () => {
        // Edge case: hasParent=true but only one segment
        const result = parseTaskId('004-implement', true);
        expect(result).not.toBeNull();
        expect(result!.sequence).toBe(4);
        expect(result!.name).toBe('implement');
        expect(result!.parentId).toBeUndefined();
      });
    });
  });

  describe('normalizeTaskId', () => {
    it('should strip .md extension', () => {
      expect(normalizeTaskId('001-test.md')).toBe('001-test');
    });

    it('should return unchanged if no .md extension', () => {
      expect(normalizeTaskId('001-test')).toBe('001-test');
    });

    it('should handle empty string', () => {
      expect(normalizeTaskId('')).toBe('');
    });

    it('should handle parented task IDs', () => {
      expect(normalizeTaskId('001-my-change-implement.md')).toBe(
        '001-my-change-implement'
      );
    });
  });

  describe('isValidTaskId', () => {
    it('should return true for valid task ID', () => {
      expect(isValidTaskId('001-implement')).toBe(true);
    });

    it('should return true for valid task ID with .md', () => {
      expect(isValidTaskId('001-implement.md')).toBe(true);
    });

    it('should return true for multi-word names', () => {
      expect(isValidTaskId('002-update-templates')).toBe(true);
    });

    it('should return true for parented task IDs', () => {
      expect(isValidTaskId('001-add-feature-x-implement')).toBe(true);
      expect(isValidTaskId('002-my-change-design.md')).toBe(true);
    });

    it('should return false for invalid sequence length', () => {
      expect(isValidTaskId('01-test')).toBe(false);
      expect(isValidTaskId('1-test')).toBe(false);
      expect(isValidTaskId('0001-test')).toBe(false);
    });

    it('should return false for missing sequence', () => {
      expect(isValidTaskId('test')).toBe(false);
      expect(isValidTaskId('test-task')).toBe(false);
    });

    it('should return false for missing name', () => {
      expect(isValidTaskId('001-')).toBe(false);
      expect(isValidTaskId('001')).toBe(false);
    });
  });
});
