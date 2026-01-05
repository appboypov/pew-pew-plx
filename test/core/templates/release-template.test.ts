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

    it('contains config-style default sections', () => {
      const result = releaseTemplate();
      expect(result).toContain('## Changelog Format');
      expect(result).toContain('## README Style');
      expect(result).toContain('## Audience');
      expect(result).toContain('## Emoji Level');
    });

    it('contains default values', () => {
      const result = releaseTemplate();
      expect(result).toContain('keep-a-changelog');
      expect(result).toContain('standard');
      expect(result).toContain('technical');
      expect(result).toContain('none');
    });

    it('contains Project Overrides section with yaml config', () => {
      const result = releaseTemplate();
      expect(result).toContain('## Project Overrides');
      expect(result).toContain('```yaml');
    });

    it('contains Release Checklist', () => {
      const result = releaseTemplate();
      expect(result).toContain('## Release Checklist');
      expect(result).toContain('- [ ]');
    });

  });
});
