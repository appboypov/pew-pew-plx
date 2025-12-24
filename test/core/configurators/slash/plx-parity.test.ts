import { describe, it, expect } from 'vitest';
import { SlashCommandRegistry } from '../../../../src/core/configurators/slash/registry.js';
import { PlxSlashCommandRegistry } from '../../../../src/core/configurators/slash/plx-registry.js';
import { ALL_PLX_COMMANDS } from '../../../../src/core/configurators/slash/plx-base.js';
import { plxSlashCommandBodies } from '../../../../src/core/templates/plx-slash-command-templates.js';

/**
 * Parity tests to ensure PLX commands are available for ALL tools that have OpenSpec commands.
 *
 * These tests will FAIL if:
 * 1. A new tool is added to SlashCommandRegistry without a matching PlxSlashCommandRegistry entry
 * 2. A new PLX command ID is added but a configurator doesn't provide a valid path for it
 *
 * This ensures we never forget to create PLX equivalents for new tools or commands.
 */
describe('PLX Command Parity', () => {
  describe('tool parity', () => {
    it('every tool in SlashCommandRegistry has a PLX configurator', () => {
      const openspecTools = SlashCommandRegistry.getAll().map(c => c.toolId);
      const plxTools = PlxSlashCommandRegistry.getAll().map(c => c.toolId);

      const missingTools = openspecTools.filter(toolId => !plxTools.includes(toolId));

      expect(missingTools).toEqual([]);
    });

    it('PLX registry has same number of tools as OpenSpec registry', () => {
      const openspecCount = SlashCommandRegistry.getAll().length;
      const plxCount = PlxSlashCommandRegistry.getAll().length;

      expect(plxCount).toBe(openspecCount);
    });
  });

  describe('command parity', () => {
    it('ALL_PLX_COMMANDS contains all PlxSlashCommandId values', () => {
      const bodyKeys = Object.keys(plxSlashCommandBodies);
      expect(ALL_PLX_COMMANDS).toHaveLength(bodyKeys.length);
      for (const key of bodyKeys) {
        expect(ALL_PLX_COMMANDS).toContain(key);
      }
    });

    it('every PLX configurator returns targets for all PLX command IDs', () => {
      const configurators = PlxSlashCommandRegistry.getAll();

      for (const configurator of configurators) {
        const targets = configurator.getTargets();
        const targetIds = targets.map(t => t.id);

        for (const expectedId of ALL_PLX_COMMANDS) {
          expect(targetIds).toContain(expectedId);
        }
      }
    });

    it('every PLX configurator target has a valid (non-empty) path', () => {
      const configurators = PlxSlashCommandRegistry.getAll();

      for (const configurator of configurators) {
        const targets = configurator.getTargets();

        for (const target of targets) {
          expect(target.path).toBeDefined();
          expect(target.path.length).toBeGreaterThan(0);
          expect(target.path).not.toBe('undefined');
        }
      }
    });
  });

  describe('toolId consistency', () => {
    it('PLX configurators use same toolIds as their OpenSpec counterparts', () => {
      const openspecToolIds = new Set(SlashCommandRegistry.getAll().map(c => c.toolId));
      const plxConfigurators = PlxSlashCommandRegistry.getAll();

      for (const plxConfig of plxConfigurators) {
        expect(openspecToolIds.has(plxConfig.toolId)).toBe(true);
      }
    });
  });
});
