import { describe, it, expect } from 'vitest';
import { PlxSlashCommandRegistry } from '../../../../src/core/configurators/slash/plx-registry.js';

describe('PlxSlashCommandRegistry', () => {
  describe('get', () => {
    it('returns configurator for claude', () => {
      const configurator = PlxSlashCommandRegistry.get('claude');

      expect(configurator).toBeDefined();
      expect(configurator?.toolId).toBe('claude');
      expect(configurator?.isAvailable).toBe(true);
    });

    it('returns undefined for unknown tool', () => {
      const configurator = PlxSlashCommandRegistry.get('unknown-tool');

      expect(configurator).toBeUndefined();
    });
  });

  describe('getAll', () => {
    it('returns array of configurators', () => {
      const configurators = PlxSlashCommandRegistry.getAll();

      expect(Array.isArray(configurators)).toBe(true);
      expect(configurators.length).toBeGreaterThan(0);
    });

    it('all configurators have required properties', () => {
      const configurators = PlxSlashCommandRegistry.getAll();

      for (const configurator of configurators) {
        expect(configurator.toolId).toBeDefined();
        expect(typeof configurator.toolId).toBe('string');
        expect(typeof configurator.isAvailable).toBe('boolean');
        expect(typeof configurator.getTargets).toBe('function');
        expect(typeof configurator.generateAll).toBe('function');
      }
    });
  });
});
