import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { emitDeprecationWarning } from '../../src/utils/deprecation.js';

describe('Deprecation Warnings', () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    delete process.env.PLX_NO_DEPRECATION_WARNINGS;
  });

  describe('emitDeprecationWarning', () => {
    it('outputs to stderr via console.error', () => {
      emitDeprecationWarning('test-command', 'new-command');

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining("Deprecation: 'test-command' is deprecated")
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining("Use 'new-command' instead")
      );
    });

    it('does not output when PLX_NO_DEPRECATION_WARNINGS=1', () => {
      process.env.PLX_NO_DEPRECATION_WARNINGS = '1';

      emitDeprecationWarning('test-command', 'new-command');

      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it('outputs when PLX_NO_DEPRECATION_WARNINGS is not set', () => {
      delete process.env.PLX_NO_DEPRECATION_WARNINGS;

      emitDeprecationWarning('test-command', 'new-command');

      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('outputs when PLX_NO_DEPRECATION_WARNINGS=0', () => {
      process.env.PLX_NO_DEPRECATION_WARNINGS = '0';

      emitDeprecationWarning('test-command', 'new-command');

      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('outputs when PLX_NO_DEPRECATION_WARNINGS is empty string', () => {
      process.env.PLX_NO_DEPRECATION_WARNINGS = '';

      emitDeprecationWarning('test-command', 'new-command');

      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe('format', () => {
    it('includes old command name', () => {
      emitDeprecationWarning('plx show <id>', 'plx get change --id <id>');

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('plx show <id>')
      );
    });

    it('includes new command suggestion', () => {
      emitDeprecationWarning('plx change <id>', 'plx get change --id <id>');

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('plx get change --id <id>')
      );
    });

    it('uses correct deprecation message format', () => {
      emitDeprecationWarning('old-cmd', 'new-cmd');

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Deprecation: 'old-cmd' is deprecated. Use 'new-cmd' instead."
      );
    });
  });
});
