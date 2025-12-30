import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { execSync } from 'child_process';
import { platform } from 'os';

// Mock child_process and os modules
vi.mock('child_process', () => ({
  execSync: vi.fn(),
}));

vi.mock('os', () => ({
  platform: vi.fn(),
}));

describe('ClipboardUtils', () => {
  const mockExecSync = vi.mocked(execSync);
  const mockPlatform = vi.mocked(platform);

  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('macOS (darwin)', () => {
    it('reads clipboard using pbpaste', async () => {
      mockPlatform.mockReturnValue('darwin');
      mockExecSync.mockReturnValue('test clipboard content');

      const { ClipboardUtils } = await import('../../src/utils/clipboard.js');
      const result = ClipboardUtils.read();

      expect(mockExecSync).toHaveBeenCalledWith('pbpaste', { encoding: 'utf-8' });
      expect(result).toBe('test clipboard content');
    });

    it('throws error when clipboard is empty', async () => {
      mockPlatform.mockReturnValue('darwin');
      mockExecSync.mockReturnValue('   ');

      const { ClipboardUtils } = await import('../../src/utils/clipboard.js');

      expect(() => ClipboardUtils.read()).toThrow('Clipboard is empty');
    });
  });

  describe('Windows (win32)', () => {
    it('reads clipboard using PowerShell Get-Clipboard', async () => {
      mockPlatform.mockReturnValue('win32');
      mockExecSync.mockReturnValue('windows clipboard content');

      const { ClipboardUtils } = await import('../../src/utils/clipboard.js');
      const result = ClipboardUtils.read();

      expect(mockExecSync).toHaveBeenCalledWith('powershell -command "Get-Clipboard"', { encoding: 'utf-8' });
      expect(result).toBe('windows clipboard content');
    });

    it('throws error when clipboard is empty', async () => {
      mockPlatform.mockReturnValue('win32');
      mockExecSync.mockReturnValue('');

      const { ClipboardUtils } = await import('../../src/utils/clipboard.js');

      expect(() => ClipboardUtils.read()).toThrow('Clipboard is empty');
    });
  });

  describe('Linux', () => {
    it('reads clipboard using xclip', async () => {
      mockPlatform.mockReturnValue('linux');
      mockExecSync.mockReturnValue('linux clipboard content');

      const { ClipboardUtils } = await import('../../src/utils/clipboard.js');
      const result = ClipboardUtils.read();

      expect(mockExecSync).toHaveBeenCalledWith('xclip -selection clipboard -o', { encoding: 'utf-8' });
      expect(result).toBe('linux clipboard content');
    });

    it('falls back to xsel when xclip fails', async () => {
      mockPlatform.mockReturnValue('linux');
      mockExecSync
        .mockImplementationOnce(() => {
          throw new Error('xclip not found');
        })
        .mockReturnValueOnce('xsel content');

      const { ClipboardUtils } = await import('../../src/utils/clipboard.js');
      const result = ClipboardUtils.read();

      expect(mockExecSync).toHaveBeenCalledWith('xclip -selection clipboard -o', { encoding: 'utf-8' });
      expect(mockExecSync).toHaveBeenCalledWith('xsel --clipboard --output', { encoding: 'utf-8' });
      expect(result).toBe('xsel content');
    });

    it('throws descriptive error when both xclip and xsel fail', async () => {
      mockPlatform.mockReturnValue('linux');
      mockExecSync
        .mockImplementationOnce(() => {
          throw new Error('xclip not found');
        })
        .mockImplementationOnce(() => {
          throw new Error('xsel not found');
        });

      const { ClipboardUtils } = await import('../../src/utils/clipboard.js');

      expect(() => ClipboardUtils.read()).toThrow('Clipboard utility not found. Install xclip or xsel.');
    });

    it('throws error when clipboard is empty with xclip', async () => {
      mockPlatform.mockReturnValue('linux');
      mockExecSync.mockReturnValue('  \n  ');

      const { ClipboardUtils } = await import('../../src/utils/clipboard.js');

      expect(() => ClipboardUtils.read()).toThrow('Clipboard is empty');
    });

    it('throws error when clipboard is empty with xsel fallback', async () => {
      mockPlatform.mockReturnValue('linux');
      mockExecSync
        .mockImplementationOnce(() => {
          throw new Error('xclip not found');
        })
        .mockReturnValueOnce('  \n  ');

      const { ClipboardUtils } = await import('../../src/utils/clipboard.js');

      expect(() => ClipboardUtils.read()).toThrow('Clipboard is empty');
    });
  });

  describe('Unsupported OS', () => {
    it('throws error for unsupported operating system', async () => {
      mockPlatform.mockReturnValue('freebsd' as NodeJS.Platform);

      const { ClipboardUtils } = await import('../../src/utils/clipboard.js');

      expect(() => ClipboardUtils.read()).toThrow('Unsupported operating system: freebsd');
    });
  });
});
