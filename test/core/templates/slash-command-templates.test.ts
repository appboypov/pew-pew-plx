import { describe, it, expect } from 'vitest';
import { getSlashCommandBody } from '../../../src/core/templates/slash-command-templates.js';

describe('slash-command-templates', () => {
  describe('getSlashCommandBody', () => {
    it('returns non-empty content for sync-workspace', () => {
      const result = getSlashCommandBody('sync-workspace');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('returns non-empty content for complete-task', () => {
      const result = getSlashCommandBody('complete-task');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('returns non-empty content for undo-task', () => {
      const result = getSlashCommandBody('undo-task');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('returns non-empty content for refine-testing', () => {
      const result = getSlashCommandBody('refine-testing');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('returns non-empty content for test', () => {
      const result = getSlashCommandBody('test');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('returns non-empty content for refine-release', () => {
      const result = getSlashCommandBody('refine-release');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('returns non-empty content for refine-review', () => {
      const result = getSlashCommandBody('refine-review');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });
});
