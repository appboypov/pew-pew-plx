import { describe, it, expect, beforeEach } from 'vitest';
import { loadTemplate, loadTemplateWithReplacements, clearTemplateCache } from '../../../src/core/templates/template-loader.js';

describe('template-loader', () => {
  beforeEach(() => {
    clearTemplateCache();
  });

  describe('loadTemplate', () => {
    it('loads workspace templates', () => {
      const content = loadTemplate('workspace/agents.md');
      expect(content).toContain('# OpenSplx');
    });

    it('loads task type templates', () => {
      const content = loadTemplate('task-types/story.md');
      expect(content).toContain('type: story');
    });

    it('loads slash command templates', () => {
      const content = loadTemplate('slash-commands/implement.md');
      expect(content.length).toBeGreaterThan(0);
    });

    it('loads entity templates', () => {
      const content = loadTemplate('entities/change.md');
      expect(content).toContain('{{NAME}}');
    });

    it('caches templates', () => {
      const content1 = loadTemplate('workspace/review.md');
      const content2 = loadTemplate('workspace/review.md');

      expect(content1).toBe(content2);
      expect(content1).toContain('# Review');
    });

    it('throws for non-existent template', () => {
      expect(() => loadTemplate('non-existent/template.md')).toThrow();
    });
  });

  describe('loadTemplateWithReplacements', () => {
    it('applies single replacement correctly', () => {
      const content = loadTemplateWithReplacements('entities/change.md', {
        NAME: 'test-change',
      });
      expect(content).toContain('test-change');
      expect(content).not.toContain('{{NAME}}');
    });

    it('applies multiple replacements', () => {
      const content = loadTemplateWithReplacements('entities/task.md', {
        TITLE: 'My Task Title',
        AVAILABLE_TYPES: 'story, bug, chore',
      });
      expect(content).toContain('My Task Title');
      expect(content).toContain('story, bug, chore');
      expect(content).not.toContain('{{TITLE}}');
      expect(content).not.toContain('{{AVAILABLE_TYPES}}');
    });

    it('handles empty replacements object', () => {
      const content = loadTemplateWithReplacements('workspace/review.md', {});
      expect(content).toContain('# Review');
    });

    it('replaces all occurrences of same placeholder', () => {
      const content = loadTemplateWithReplacements('entities/spec.md', {
        NAME: 'repeated-name',
      });
      expect(content).toContain('repeated-name');
      expect(content).not.toContain('{{NAME}}');
    });
  });

  describe('clearTemplateCache', () => {
    it('clears the cache allowing fresh loads', () => {
      const content1 = loadTemplate('workspace/review.md');
      expect(content1).toContain('# Review');

      clearTemplateCache();

      const content2 = loadTemplate('workspace/review.md');
      expect(content2).toContain('# Review');

      expect(content1).toBe(content2);
    });
  });
});
