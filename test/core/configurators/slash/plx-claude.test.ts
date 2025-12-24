import { describe, it, expect } from 'vitest';
import { PlxClaudeSlashCommandConfigurator } from '../../../../src/core/configurators/slash/plx-claude.js';

describe('PlxClaudeSlashCommandConfigurator', () => {
  const configurator = new PlxClaudeSlashCommandConfigurator();

  describe('properties', () => {
    it('has correct toolId', () => {
      expect(configurator.toolId).toBe('claude');
    });

    it('is available', () => {
      expect(configurator.isAvailable).toBe(true);
    });
  });

  describe('getTargets', () => {
    it('returns targets for init-architecture and update-architecture', () => {
      const targets = configurator.getTargets();

      expect(targets).toHaveLength(2);

      const ids = targets.map(t => t.id);
      expect(ids).toContain('init-architecture');
      expect(ids).toContain('update-architecture');
    });

    it('all targets have correct structure', () => {
      const targets = configurator.getTargets();

      for (const target of targets) {
        expect(target.id).toBeDefined();
        expect(target.path).toBeDefined();
        expect(target.kind).toBe('slash');
        expect(target.path).toContain('.claude/commands/plx/');
        expect(target.path.endsWith('.md')).toBe(true);
      }
    });

    it('init-architecture has correct path', () => {
      const targets = configurator.getTargets();
      const initTarget = targets.find(t => t.id === 'init-architecture');

      expect(initTarget?.path).toBe('.claude/commands/plx/init-architecture.md');
    });

    it('update-architecture has correct path', () => {
      const targets = configurator.getTargets();
      const updateTarget = targets.find(t => t.id === 'update-architecture');

      expect(updateTarget?.path).toBe('.claude/commands/plx/update-architecture.md');
    });
  });
});
