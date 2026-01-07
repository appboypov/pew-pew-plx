import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { UpgradeCommand } from '../../src/core/upgrade.js';
import type { ChildProcess } from 'child_process';
import type { EventEmitter } from 'events';

// Mock child_process module
vi.mock('child_process', () => ({
  execSync: vi.fn(),
  spawn: vi.fn(),
}));

// Mock the module import for package.json
vi.mock('module', () => ({
  createRequire: () => (path: string) => {
    if (path.includes('package.json')) {
      return { version: '0.14.0' };
    }
    throw new Error(`Cannot find module '${path}'`);
  },
}));

describe('UpgradeCommand', () => {
  let upgradeCommand: UpgradeCommand;
  let consoleSpy: ReturnType<typeof vi.spyOn>;
  let mockFetch: ReturnType<typeof vi.fn>;
  let mockExecSync: ReturnType<typeof vi.fn>;
  let mockSpawn: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    // Import child_process mocks
    const childProcess = await import('child_process');
    mockExecSync = childProcess.execSync as ReturnType<typeof vi.fn>;
    mockSpawn = childProcess.spawn as ReturnType<typeof vi.fn>;

    upgradeCommand = new UpgradeCommand();
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    // Mock global fetch
    mockFetch = vi.fn();
    global.fetch = mockFetch;

    vi.clearAllMocks();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
    vi.restoreAllMocks();
  });

  describe('execute', () => {
    describe('version comparison', () => {
      it('should show "Already up to date" when versions match', async () => {
        // Mock fetch to return same version
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ version: '0.14.0' }),
        });

        await upgradeCommand.execute();

        expect(consoleSpy).toHaveBeenCalledWith(
          expect.stringContaining('Already up to date (v0.14.0)')
        );
        expect(mockSpawn).not.toHaveBeenCalled();
      });

      it('should show upgrade message when update is available', async () => {
        // Mock fetch to return newer version
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ version: '0.15.0' }),
        });

        // Mock spawn to succeed
        mockSpawn.mockReturnValueOnce(createMockSpawn(0));
        mockExecSync.mockImplementationOnce(() => Buffer.from('8.0.0'));

        await upgradeCommand.execute();

        expect(consoleSpy).toHaveBeenCalledWith(
          expect.stringContaining('Upgrading from v0.14.0 to v0.15.0')
        );
        expect(mockSpawn).toHaveBeenCalled();
      });
    });

    describe('--check flag', () => {
      it('should show version comparison without installing when versions differ', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ version: '0.15.0' }),
        });

        await upgradeCommand.execute({ check: true });

        expect(consoleSpy).toHaveBeenCalledWith(
          expect.stringContaining('Current:')
        );
        expect(consoleSpy).toHaveBeenCalledWith(
          expect.stringContaining('0.14.0')
        );
        expect(consoleSpy).toHaveBeenCalledWith(
          expect.stringContaining('Latest:')
        );
        expect(consoleSpy).toHaveBeenCalledWith(
          expect.stringContaining('0.15.0')
        );
        expect(mockSpawn).not.toHaveBeenCalled();
      });

      it('should show "Already up to date" when versions match with --check flag', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ version: '0.14.0' }),
        });

        await upgradeCommand.execute({ check: true });

        expect(consoleSpy).toHaveBeenCalledWith(
          expect.stringContaining('Already up to date (v0.14.0)')
        );
        expect(mockSpawn).not.toHaveBeenCalled();
      });
    });

    describe('network error handling', () => {
      it('should throw error when fetch fails with network error', async () => {
        mockFetch.mockRejectedValueOnce(new Error('Network error'));

        await expect(upgradeCommand.execute()).rejects.toThrow(
          'Failed to check for updates: Network error'
        );
      });

      it('should throw error when fetch returns non-ok response', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          statusText: 'Not Found',
        });

        await expect(upgradeCommand.execute()).rejects.toThrow(
          'Failed to fetch package info: Not Found'
        );
      });

      it('should handle non-Error objects thrown during fetch', async () => {
        mockFetch.mockRejectedValueOnce('string error');

        await expect(upgradeCommand.execute()).rejects.toThrow(
          'Failed to check for updates: string error'
        );
      });
    });

    describe('package manager detection', () => {
      it('should use pnpm when pnpm is available', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ version: '0.15.0' }),
        });

        // Mock pnpm being available
        mockExecSync.mockImplementationOnce(() => Buffer.from('8.0.0'));
        mockSpawn.mockReturnValueOnce(createMockSpawn(0));

        await upgradeCommand.execute();

        expect(mockExecSync).toHaveBeenCalledWith('pnpm --version', {
          stdio: 'ignore',
        });
        expect(mockSpawn).toHaveBeenCalledWith(
          'pnpm',
          ['install', '-g', '@appboypov/pew-pew-plx@latest'],
          { stdio: 'inherit', shell: true }
        );
      });

      it('should use npm when pnpm is not available', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ version: '0.15.0' }),
        });

        // Mock pnpm not being available
        mockExecSync.mockImplementationOnce(() => {
          throw new Error('Command not found');
        });
        mockSpawn.mockReturnValueOnce(createMockSpawn(0));

        await upgradeCommand.execute();

        expect(mockSpawn).toHaveBeenCalledWith(
          'npm',
          ['install', '-g', '@appboypov/pew-pew-plx@latest'],
          { stdio: 'inherit', shell: true }
        );
      });
    });

    describe('upgrade execution', () => {
      it('should show success message when upgrade completes successfully', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ version: '0.15.0' }),
        });

        mockExecSync.mockImplementationOnce(() => Buffer.from('8.0.0'));
        mockSpawn.mockReturnValueOnce(createMockSpawn(0));

        await upgradeCommand.execute();

        expect(consoleSpy).toHaveBeenCalledWith(
          expect.stringContaining('Upgrade completed successfully!')
        );
      });

      it('should throw error when spawn exits with non-zero code', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ version: '0.15.0' }),
        });

        mockExecSync.mockImplementationOnce(() => Buffer.from('8.0.0'));
        mockSpawn.mockReturnValueOnce(createMockSpawn(1));

        await expect(upgradeCommand.execute()).rejects.toThrow(
          'Upgrade failed with exit code 1'
        );
      });

      it('should throw error when spawn emits error event', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ version: '0.15.0' }),
        });

        mockExecSync.mockImplementationOnce(() => Buffer.from('8.0.0'));
        mockSpawn.mockReturnValueOnce(createMockSpawn('error'));

        await expect(upgradeCommand.execute()).rejects.toThrow(
          'Upgrade failed: spawn error'
        );
      });
    });

    describe('npm registry integration', () => {
      it('should fetch version from correct npm registry URL', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ version: '0.14.0' }),
        });

        await upgradeCommand.execute();

        expect(mockFetch).toHaveBeenCalledWith(
          'https://registry.npmjs.org/@appboypov/pew-pew-plx/latest'
        );
      });
    });
  });
});

/**
 * Creates a mock ChildProcess that emits events based on the exit code or error type
 */
function createMockSpawn(exitCodeOrError: number | 'error'): ChildProcess {
  const emitter = new Map<string, Array<(...args: any[]) => void>>();

  const mock = {
    on(event: string, handler: (...args: any[]) => void) {
      if (!emitter.has(event)) {
        emitter.set(event, []);
      }
      emitter.get(event)!.push(handler);
      return this;
    },
  } as unknown as ChildProcess;

  // Emit events asynchronously
  setTimeout(() => {
    if (exitCodeOrError === 'error') {
      const errorHandlers = emitter.get('error') ?? [];
      errorHandlers.forEach((handler) => handler(new Error('spawn error')));
    } else {
      const closeHandlers = emitter.get('close') ?? [];
      closeHandlers.forEach((handler) => handler(exitCodeOrError));
    }
  }, 0);

  return mock;
}
