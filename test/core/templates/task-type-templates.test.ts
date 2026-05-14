import { describe, it, expect } from 'vitest';
import { TemplateManager, KNOWN_TEMPLATE_TYPES } from '../../../src/core/templates/index.js';

describe('task type templates', () => {
  describe('getTaskTypeTemplates', () => {
    it('returns all 12 known template types', () => {
      const templates = TemplateManager.getTaskTypeTemplates();
      expect(templates).toHaveLength(12);
    });

    it('each template has type, filename, and content', () => {
      const templates = TemplateManager.getTaskTypeTemplates();
      for (const t of templates) {
        expect(t.type).toBeTruthy();
        expect(t.filename).toBe(`${t.type}.md`);
        expect(t.content.length).toBeGreaterThan(0);
      }
    });

    it('each template contains frontmatter with type field', () => {
      const templates = TemplateManager.getTaskTypeTemplates();
      for (const t of templates) {
        expect(t.content).toContain('---');
        expect(t.content).toContain(`type: ${t.type}`);
      }
    });

    it('includes all expected template types', () => {
      const templates = TemplateManager.getTaskTypeTemplates();
      const types = templates.map(t => t.type);

      expect(types).toContain('story');
      expect(types).toContain('bug');
      expect(types).toContain('business-logic');
      expect(types).toContain('components');
      expect(types).toContain('implementation');
      expect(types).toContain('research');
      expect(types).toContain('discovery');
      expect(types).toContain('chore');
      expect(types).toContain('refactor');
      expect(types).toContain('infrastructure');
      expect(types).toContain('documentation');
      expect(types).toContain('release');
    });
  });

  describe('getTaskTypeTemplate', () => {
    it('returns correct template for story type', () => {
      const story = TemplateManager.getTaskTypeTemplate('story');
      expect(story).toBeDefined();
      expect(story?.type).toBe('story');
      expect(story?.filename).toBe('story.md');
      expect(story?.content).toContain('type: story');
    });

    it('returns correct template for bug type', () => {
      const bug = TemplateManager.getTaskTypeTemplate('bug');
      expect(bug).toBeDefined();
      expect(bug?.type).toBe('bug');
      expect(bug?.content).toContain('type: bug');
    });

    it('returns undefined for invalid type', () => {
      const invalid = TemplateManager.getTaskTypeTemplate('invalid-type');
      expect(invalid).toBeUndefined();
    });

    it('returns undefined for empty string', () => {
      const empty = TemplateManager.getTaskTypeTemplate('');
      expect(empty).toBeUndefined();
    });

    it('each valid type can be retrieved individually', () => {
      for (const type of KNOWN_TEMPLATE_TYPES) {
        const template = TemplateManager.getTaskTypeTemplate(type);
        expect(template).toBeDefined();
        expect(template?.type).toBe(type);
      }
    });
  });

  describe('getKnownTemplateTypes', () => {
    it('returns the list of known types', () => {
      const types = TemplateManager.getKnownTemplateTypes();
      expect(types).toEqual(KNOWN_TEMPLATE_TYPES);
    });

    it('returns 12 types', () => {
      const types = TemplateManager.getKnownTemplateTypes();
      expect(types).toHaveLength(12);
    });
  });

  describe('isValidTemplateType', () => {
    it('returns true for valid types', () => {
      expect(TemplateManager.isValidTemplateType('story')).toBe(true);
      expect(TemplateManager.isValidTemplateType('bug')).toBe(true);
      expect(TemplateManager.isValidTemplateType('chore')).toBe(true);
    });

    it('returns false for invalid types', () => {
      expect(TemplateManager.isValidTemplateType('invalid')).toBe(false);
      expect(TemplateManager.isValidTemplateType('')).toBe(false);
      expect(TemplateManager.isValidTemplateType('STORY')).toBe(false);
    });
  });

  describe('template content quality', () => {
    it('story template contains expected structure', () => {
      const story = TemplateManager.getTaskTypeTemplate('story');
      expect(story?.content).toContain('## 👤 User Story');
      expect(story?.content).toContain('## ✅ Acceptance Criteria');
    });

    it('bug template contains expected structure', () => {
      const bug = TemplateManager.getTaskTypeTemplate('bug');
      expect(bug?.content).toContain('## 🦋 Expected Result');
      expect(bug?.content).toContain('## 🐛 Actual Result');
      expect(bug?.content).toContain('## 👣 Steps to Reproduce');
    });

    it('all templates have emoji in title', () => {
      const templates = TemplateManager.getTaskTypeTemplates();
      for (const t of templates) {
        // Check for emoji pattern after # heading
        expect(t.content).toMatch(/^#\s+[\p{Emoji_Presentation}\p{Emoji}\uFE0F]/mu);
      }
    });
  });
});
