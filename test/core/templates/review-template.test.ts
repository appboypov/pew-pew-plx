import { describe, it, expect } from 'vitest';
import { TemplateManager } from '../../../src/core/templates/index.js';

describe('review-template', () => {
  describe('getReviewTemplate', () => {
    it('returns a non-empty string', () => {
      const result = TemplateManager.getReviewTemplate();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('contains the main heading', () => {
      const result = TemplateManager.getReviewTemplate();
      expect(result).toContain('# Review Guidelines');
    });

    it('contains Purpose section', () => {
      const result = TemplateManager.getReviewTemplate();
      expect(result).toContain('## Purpose');
      expect(result).toContain('how code reviews should be conducted');
    });

    it('contains Review Config section with yaml', () => {
      const result = TemplateManager.getReviewTemplate();
      expect(result).toContain('## Review Config');
      expect(result).toContain('```yaml');
      expect(result).toContain('review_types:');
    });

    it('contains Review Scope section', () => {
      const result = TemplateManager.getReviewTemplate();
      expect(result).toContain('## Review Scope');
      expect(result).toContain('### Architecture Patterns');
      expect(result).toContain('### Project Conventions');
      expect(result).toContain('### Critical Paths');
    });

    it('contains Feedback Format section', () => {
      const result = TemplateManager.getReviewTemplate();
      expect(result).toContain('## Feedback Format');
      expect(result).toContain('#FEEDBACK #TODO');
    });

    it('documents the basic feedback marker format', () => {
      const result = TemplateManager.getReviewTemplate();
      expect(result).toContain('#FEEDBACK #TODO | {feedback}');
    });

    it('documents the spec-impacting feedback format', () => {
      const result = TemplateManager.getReviewTemplate();
      expect(result).toContain('(spec:<spec-id>)');
    });

    it('contains Review Checklist section', () => {
      const result = TemplateManager.getReviewTemplate();
      expect(result).toContain('## Review Checklist');
      expect(result).toContain('- [ ]');
    });

    it('includes checklist items', () => {
      const result = TemplateManager.getReviewTemplate();
      expect(result).toContain('Code follows project conventions');
      expect(result).toContain('Tests cover new functionality');
      expect(result).toContain('Documentation updated');
    });
  });
});
