import { describe, it, expect } from 'vitest';
import {
  parseTaskFilename,
  sortTaskFilesBySequence,
  generateTaskFilename,
  TASK_FILE_PREFIX_PATTERN,
} from '../../src/utils/task-file-parser.js';

describe('task-file-parser', () => {
  describe('TASK_FILE_PREFIX_PATTERN', () => {
    it('should match valid task filenames', () => {
      expect(TASK_FILE_PREFIX_PATTERN.test('001-implement.md')).toBe(true);
      expect(TASK_FILE_PREFIX_PATTERN.test('002-review.md')).toBe(true);
      expect(TASK_FILE_PREFIX_PATTERN.test('999-test.md')).toBe(true);
      expect(TASK_FILE_PREFIX_PATTERN.test('001-implement-core-logic.md')).toBe(true);
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

  describe('sortTaskFilesBySequence', () => {
    it('should sort files by sequence number', () => {
      const files = ['003-last.md', '001-first.md', '002-middle.md'];
      const sorted = sortTaskFilesBySequence(files);
      expect(sorted).toEqual(['001-first.md', '002-middle.md', '003-last.md']);
    });

    it('should filter out invalid filenames', () => {
      const files = ['001-valid.md', 'README.md', '002-also-valid.md', 'notes.txt'];
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
});
