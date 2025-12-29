import { describe, it, expect } from 'vitest';
import { getPlxSlashCommandBody, plxSlashCommandBodies, PlxSlashCommandId } from '../../../src/core/templates/plx-slash-command-templates.js';

describe('plx-slash-command-templates', () => {
  describe('getPlxSlashCommandBody', () => {
    it('returns body for compact command', () => {
      const body = getPlxSlashCommandBody('compact');

      expect(body).toContain('**Guardrails**');
      expect(body).toContain('**Steps**');
      expect(body).toContain('PROGRESS.md');
      expect(body).toContain('.gitignore');
    });
  });

  describe('plxSlashCommandBodies', () => {
    it('contains all PLX command IDs', () => {
      const expectedIds: PlxSlashCommandId[] = [
        'get-task',
        'compact',
        'review',
        'refine-architecture',
        'refine-review',
        'refine-release',
        'parse-feedback',
        'prepare-release'
      ];

      for (const id of expectedIds) {
        expect(plxSlashCommandBodies[id]).toBeDefined();
        expect(typeof plxSlashCommandBodies[id]).toBe('string');
        expect(plxSlashCommandBodies[id].length).toBeGreaterThan(0);
      }
    });

    it('all commands include guardrails and steps', () => {
      for (const body of Object.values(plxSlashCommandBodies)) {
        expect(body).toContain('**Guardrails**');
        expect(body).toContain('**Steps**');
      }
    });

    it('compact command includes context preservation content', () => {
      const body = plxSlashCommandBodies['compact'];

      expect(body).toContain('PROGRESS.md');
      expect(body).toContain('.gitignore');
      expect(body).toContain('Save all files');
      expect(body).toContain('Context for Next Agent');
    });

    it('review command includes review workflow content', () => {
      const body = plxSlashCommandBodies['review'];

      expect(body).toContain('plx review');
      expect(body).toContain('feedback markers');
      expect(body).toContain('plx parse feedback');
    });

    it('review command references @REVIEW.md', () => {
      const body = plxSlashCommandBodies['review'];
      expect(body).toContain('@REVIEW.md');
    });

    it('refine-architecture command includes architecture content', () => {
      const body = plxSlashCommandBodies['refine-architecture'];

      expect(body).toContain('@ARCHITECTURE.md');
      expect(body).toContain('Preserve user content');
    });

    it('refine-review command includes review template content', () => {
      const body = plxSlashCommandBodies['refine-review'];

      expect(body).toContain('@REVIEW.md');
      expect(body).toContain('Preserve existing guidelines');
    });

    it('refine-release command includes release template content', () => {
      const body = plxSlashCommandBodies['refine-release'];

      expect(body).toContain('@RELEASE.md');
      expect(body).toContain('Preserve existing release configuration');
    });

    it('parse-feedback command includes feedback parsing content', () => {
      const body = plxSlashCommandBodies['parse-feedback'];

      expect(body).toContain('plx parse feedback');
      expect(body).toContain('one task per marker');
      expect(body).toContain('parent linkage');
    });

    it('prepare-release command includes release workflow content', () => {
      const body = plxSlashCommandBodies['prepare-release'];

      expect(body).toContain('@RELEASE.md');
      expect(body).toContain('changelog');
      expect(body).toContain('readme');
      expect(body).toContain('architecture');
    });

    it('prepare-release command references documentation files', () => {
      const body = plxSlashCommandBodies['prepare-release'];

      expect(body).toContain('@README.md');
      expect(body).toContain('@CHANGELOG.md');
      expect(body).toContain('@ARCHITECTURE.md');
    });
  });
});
