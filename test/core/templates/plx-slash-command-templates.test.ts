import { describe, it, expect } from 'vitest';
import { getPlxSlashCommandBody, plxSlashCommandBodies, PlxSlashCommandId } from '../../../src/core/templates/plx-slash-command-templates.js';

describe('plx-slash-command-templates', () => {
  describe('getPlxSlashCommandBody', () => {
    it('returns body for init-architecture command', () => {
      const body = getPlxSlashCommandBody('init-architecture');

      expect(body).toContain('**Guardrails**');
      expect(body).toContain('**Steps**');
      expect(body).toContain('manifest files');
      expect(body).toContain('ARCHITECTURE.md');
    });

    it('returns body for update-architecture command', () => {
      const body = getPlxSlashCommandBody('update-architecture');

      expect(body).toContain('**Guardrails**');
      expect(body).toContain('**Steps**');
      expect(body).toContain('existing ARCHITECTURE.md');
      expect(body).toContain('Preserve user-added content');
    });
  });

  describe('plxSlashCommandBodies', () => {
    it('contains all PLX command IDs', () => {
      const expectedIds: PlxSlashCommandId[] = ['init-architecture', 'update-architecture'];

      for (const id of expectedIds) {
        expect(plxSlashCommandBodies[id]).toBeDefined();
        expect(typeof plxSlashCommandBodies[id]).toBe('string');
        expect(plxSlashCommandBodies[id].length).toBeGreaterThan(0);
      }
    });

    it('init-architecture contains generic language (no specific frameworks)', () => {
      const body = plxSlashCommandBodies['init-architecture'];

      expect(body).not.toContain('package.json');
      expect(body).not.toContain('pubspec.yaml');
      expect(body).not.toContain('src/');

      expect(body).toContain('manifest files');
      expect(body).toContain('directory structure');
    });

    it('all commands include guardrails about practical documentation', () => {
      for (const body of Object.values(plxSlashCommandBodies)) {
        expect(body).toContain('practical, usable documentation');
        expect(body).toContain('Document patterns and conventions');
      }
    });
  });
});
