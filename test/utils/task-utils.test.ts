import { describe, it, expect } from 'vitest';
import {
  KNOWN_TEMPLATE_TYPES,
  isValidTemplateType,
  toKebabCase,
  parseItemId,
  parsePrefixedId,
  buildTaskFrontmatter,
} from '../../src/utils/task-utils.js';

describe('task-utils', () => {
  describe('KNOWN_TEMPLATE_TYPES', () => {
    it('should contain expected template types', () => {
      expect(KNOWN_TEMPLATE_TYPES).toContain('story');
      expect(KNOWN_TEMPLATE_TYPES).toContain('bug');
      expect(KNOWN_TEMPLATE_TYPES).toContain('implementation');
      expect(KNOWN_TEMPLATE_TYPES).toContain('components');
      expect(KNOWN_TEMPLATE_TYPES).toContain('business-logic');
      expect(KNOWN_TEMPLATE_TYPES).toContain('research');
      expect(KNOWN_TEMPLATE_TYPES).toContain('discovery');
      expect(KNOWN_TEMPLATE_TYPES).toContain('chore');
      expect(KNOWN_TEMPLATE_TYPES).toContain('refactor');
      expect(KNOWN_TEMPLATE_TYPES).toContain('infrastructure');
      expect(KNOWN_TEMPLATE_TYPES).toContain('documentation');
      expect(KNOWN_TEMPLATE_TYPES).toContain('release');
    });

    it('should have exactly 12 types', () => {
      expect(KNOWN_TEMPLATE_TYPES.length).toBe(12);
    });
  });

  describe('isValidTemplateType', () => {
    it('should return true for valid template types', () => {
      expect(isValidTemplateType('story')).toBe(true);
      expect(isValidTemplateType('bug')).toBe(true);
      expect(isValidTemplateType('implementation')).toBe(true);
      expect(isValidTemplateType('chore')).toBe(true);
    });

    it('should return false for invalid template types', () => {
      expect(isValidTemplateType('invalid')).toBe(false);
      expect(isValidTemplateType('')).toBe(false);
      expect(isValidTemplateType('STORY')).toBe(false);
      expect(isValidTemplateType('Story')).toBe(false);
      expect(isValidTemplateType('custom-type')).toBe(false);
    });
  });

  describe('toKebabCase', () => {
    it('should convert simple strings to kebab-case', () => {
      expect(toKebabCase('Hello World')).toBe('hello-world');
      expect(toKebabCase('MyFeature')).toBe('myfeature');
      expect(toKebabCase('test')).toBe('test');
    });

    it('should handle special characters', () => {
      expect(toKebabCase('Hello, World!')).toBe('hello-world');
      expect(toKebabCase('Feature (New)')).toBe('feature-new');
      expect(toKebabCase('Fix: Bug #123')).toBe('fix-bug-123');
    });

    it('should remove leading and trailing dashes', () => {
      expect(toKebabCase('---hello---')).toBe('hello');
      expect(toKebabCase('!test!')).toBe('test');
    });

    it('should truncate to 50 characters', () => {
      const longString = 'a'.repeat(100);
      expect(toKebabCase(longString).length).toBe(50);
    });

    it('should handle consecutive special characters', () => {
      expect(toKebabCase('hello   world')).toBe('hello-world');
      expect(toKebabCase('hello---world')).toBe('hello-world');
      expect(toKebabCase('hello...world')).toBe('hello-world');
    });

    it('should handle empty string', () => {
      expect(toKebabCase('')).toBe('');
    });

    it('should handle numbers', () => {
      expect(toKebabCase('Test 123')).toBe('test-123');
      expect(toKebabCase('123 Test')).toBe('123-test');
    });
  });

  describe('parseItemId', () => {
    it('should return the item ID without workspace prefix', () => {
      expect(parseItemId('project-a/change-name')).toBe('change-name');
      expect(parseItemId('my-project/my-change')).toBe('my-change');
    });

    it('should return the full ID if no prefix', () => {
      expect(parseItemId('change-name')).toBe('change-name');
      expect(parseItemId('simple-id')).toBe('simple-id');
    });

    it('should handle multiple slashes', () => {
      expect(parseItemId('project/sub/change')).toBe('sub/change');
    });

    it('should handle empty strings', () => {
      expect(parseItemId('')).toBe('');
    });

    it('should handle just a slash', () => {
      expect(parseItemId('/')).toBe('');
    });
  });

  describe('parsePrefixedId', () => {
    const workspaces = [
      { projectName: 'project-a' },
      { projectName: 'project-b' },
      { projectName: 'MyProject' },
    ];

    it('should parse prefixed ID with matching workspace', () => {
      const result = parsePrefixedId('project-a/change-name', workspaces);
      expect(result).toEqual({
        projectName: 'project-a',
        itemId: 'change-name',
      });
    });

    it('should be case-insensitive for workspace matching', () => {
      const result = parsePrefixedId('PROJECT-A/change-name', workspaces);
      expect(result).toEqual({
        projectName: 'PROJECT-A',
        itemId: 'change-name',
      });

      const result2 = parsePrefixedId('myproject/change-name', workspaces);
      expect(result2).toEqual({
        projectName: 'myproject',
        itemId: 'change-name',
      });
    });

    it('should return null projectName if no slash', () => {
      const result = parsePrefixedId('change-name', workspaces);
      expect(result).toEqual({
        projectName: null,
        itemId: 'change-name',
      });
    });

    it('should return null projectName if prefix does not match any workspace', () => {
      const result = parsePrefixedId('unknown-project/change-name', workspaces);
      expect(result).toEqual({
        projectName: null,
        itemId: 'unknown-project/change-name',
      });
    });

    it('should handle empty workspaces array', () => {
      const result = parsePrefixedId('project-a/change-name', []);
      expect(result).toEqual({
        projectName: null,
        itemId: 'project-a/change-name',
      });
    });

    it('should handle empty ID', () => {
      const result = parsePrefixedId('', workspaces);
      expect(result).toEqual({
        projectName: null,
        itemId: '',
      });
    });
  });

  describe('buildTaskFrontmatter', () => {
    it('should build minimal frontmatter with default status', () => {
      const result = buildTaskFrontmatter({});
      expect(result).toBe('---\nstatus: to-do\n---');
    });

    it('should build frontmatter with custom status', () => {
      const result = buildTaskFrontmatter({ status: 'in-progress' });
      expect(result).toBe('---\nstatus: in-progress\n---');
    });

    it('should include skill level when provided', () => {
      const result = buildTaskFrontmatter({ skillLevel: 'senior' });
      expect(result).toBe('---\nstatus: to-do\nskill-level: senior\n---');
    });

    it('should include parent type when provided', () => {
      const result = buildTaskFrontmatter({ parentType: 'change' });
      expect(result).toBe('---\nstatus: to-do\nparent-type: change\n---');
    });

    it('should include parent ID when provided', () => {
      const result = buildTaskFrontmatter({ parentId: 'my-change' });
      expect(result).toBe('---\nstatus: to-do\nparent-id: my-change\n---');
    });

    it('should include type when provided', () => {
      const result = buildTaskFrontmatter({ type: 'implementation' });
      expect(result).toBe('---\nstatus: to-do\ntype: implementation\n---');
    });

    it('should include blocked-by as YAML list when provided', () => {
      const result = buildTaskFrontmatter({ blockedBy: ['task-1', 'task-2'] });
      expect(result).toBe(
        '---\nstatus: to-do\nblocked-by:\n  - task-1\n  - task-2\n---'
      );
    });

    it('should not include blocked-by when array is empty', () => {
      const result = buildTaskFrontmatter({ blockedBy: [] });
      expect(result).toBe('---\nstatus: to-do\n---');
    });

    it('should build complete frontmatter with all options', () => {
      const result = buildTaskFrontmatter({
        status: 'in-progress',
        skillLevel: 'medior',
        parentType: 'review',
        parentId: 'my-review',
        type: 'bug',
        blockedBy: ['dependency-1'],
      });
      expect(result).toBe(
        '---\n' +
          'status: in-progress\n' +
          'skill-level: medior\n' +
          'parent-type: review\n' +
          'parent-id: my-review\n' +
          'type: bug\n' +
          'blocked-by:\n' +
          '  - dependency-1\n' +
          '---'
      );
    });

    it('should maintain consistent field ordering', () => {
      const result = buildTaskFrontmatter({
        blockedBy: ['a'],
        type: 'story',
        parentId: 'p1',
        parentType: 'change',
        skillLevel: 'junior',
        status: 'done',
      });
      const lines = result.split('\n');
      expect(lines[0]).toBe('---');
      expect(lines[1]).toBe('status: done');
      expect(lines[2]).toBe('skill-level: junior');
      expect(lines[3]).toBe('parent-type: change');
      expect(lines[4]).toBe('parent-id: p1');
      expect(lines[5]).toBe('type: story');
      expect(lines[6]).toBe('blocked-by:');
      expect(lines[7]).toBe('  - a');
      expect(lines[8]).toBe('---');
    });
  });
});
