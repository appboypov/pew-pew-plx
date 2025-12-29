import { describe, it, expect } from 'vitest';
import { releaseTemplate } from '../../../src/core/templates/release-template.js';

describe('release-template', () => {
  describe('releaseTemplate', () => {
    it('returns a non-empty string', () => {
      const result = releaseTemplate();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('contains the main heading', () => {
      const result = releaseTemplate();
      expect(result).toContain('# Release Preparation');
    });

    it('contains Purpose section', () => {
      const result = releaseTemplate();
      expect(result).toContain('## Purpose');
    });

    it('contains Changelog Update Activity', () => {
      const result = releaseTemplate();
      expect(result).toContain('## Activity: Changelog Update');
      expect(result).toContain('Source Selection');
      expect(result).toContain('Version Configuration');
      expect(result).toContain('Format Selection');
    });

    it('contains changelog format templates', () => {
      const result = releaseTemplate();
      expect(result).toContain('keep-a-changelog');
      expect(result).toContain('simple-list');
      expect(result).toContain('github-release');
    });

    it('contains Readme Update Activity', () => {
      const result = releaseTemplate();
      expect(result).toContain('## Activity: Readme Update');
      expect(result).toContain('Style Selection');
      expect(result).toContain('Section Configuration');
      expect(result).toContain('Badge Configuration');
    });

    it('contains readme style templates', () => {
      const result = releaseTemplate();
      expect(result).toContain('Minimal Style');
      expect(result).toContain('Standard Style');
      expect(result).toContain('Comprehensive Style');
    });

    it('contains badge URL patterns', () => {
      const result = releaseTemplate();
      expect(result).toContain('shields.io');
      expect(result).toContain('img.shields.io');
    });

    it('contains Architecture Update Activity', () => {
      const result = releaseTemplate();
      expect(result).toContain('## Activity: Architecture Update');
      expect(result).toContain('Preservation Rules');
    });

    it('contains Release Checklist', () => {
      const result = releaseTemplate();
      expect(result).toContain('## Release Checklist');
      expect(result).toContain('- [ ]');
    });
  });
});
