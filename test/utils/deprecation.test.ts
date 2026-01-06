import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { emitDeprecationWarning } from '../../src/utils/deprecation.js';

describe('emitDeprecationWarning', () => {
  let originalEnv: NodeJS.ProcessEnv;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    originalEnv = { ...process.env };
    delete process.env.PLX_NO_DEPRECATION_WARNINGS;
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    process.env = originalEnv;
    consoleErrorSpy.mockRestore();
  });

  it('should emit deprecation warning to stderr by default', () => {
    emitDeprecationWarning('plx list', 'plx get changes');

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Deprecation: 'plx list' is deprecated. Use 'plx get changes' instead."
    );
  });

  it('should suppress warning when PLX_NO_DEPRECATION_WARNINGS is set', () => {
    process.env.PLX_NO_DEPRECATION_WARNINGS = '1';
    emitDeprecationWarning('plx list', 'plx get changes');

    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it('should emit different messages for different commands', () => {
    emitDeprecationWarning('plx list --specs', 'plx get specs');
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Deprecation: 'plx list --specs' is deprecated. Use 'plx get specs' instead."
    );

    consoleErrorSpy.mockClear();

    emitDeprecationWarning('plx show', 'plx get change --id <item>');
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Deprecation: 'plx show' is deprecated. Use 'plx get change --id <item>' instead."
    );
  });

  it('should not suppress warnings when PLX_NO_DEPRECATION_WARNINGS is 0', () => {
    process.env.PLX_NO_DEPRECATION_WARNINGS = '0';
    emitDeprecationWarning('plx list', 'plx get changes');

    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  it('should not suppress warnings when PLX_NO_DEPRECATION_WARNINGS is empty', () => {
    process.env.PLX_NO_DEPRECATION_WARNINGS = '';
    emitDeprecationWarning('plx list', 'plx get changes');

    expect(consoleErrorSpy).toHaveBeenCalled();
  });
});
