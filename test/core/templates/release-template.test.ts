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

    it('contains Documentation Config section with yaml', () => {
      const result = releaseTemplate();
      expect(result).toContain('## Documentation Config');
      expect(result).toContain('```yaml');
    });

    it('contains default values', () => {
      const result = releaseTemplate();
      expect(result).toContain('keep-a-changelog');
      expect(result).toContain('standard');
      expect(result).toContain('technical');
      expect(result).toContain('none');
    });

    it('contains Consistency Checklist section', () => {
      const result = releaseTemplate();
      expect(result).toContain('## Consistency Checklist');
      expect(result).toContain('### Primary Sources');
      expect(result).toContain('### Derived Artifacts');
      expect(result).toContain('### Verification');
    });

    it('contains Release Checklist', () => {
      const result = releaseTemplate();
      expect(result).toContain('## Release Checklist');
      expect(result).toContain('- [ ]');
    });

  });
});
