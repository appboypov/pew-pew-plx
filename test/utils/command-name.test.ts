import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getCommandName } from '../../src/utils/command-name.js';

describe('getCommandName', () => {
  let originalArgv: string[];

  beforeEach(() => {
    originalArgv = [...process.argv];
  });

  afterEach(() => {
    process.argv = originalArgv;
  });

  describe('returns plx when invoked via plx', () => {
    it('should return plx for plx.js', () => {
      process.argv = ['node', '/path/to/plx.js'];
      expect(getCommandName()).toBe('plx');
    });

    it('should return plx for plx (no extension)', () => {
      process.argv = ['node', '/path/to/plx'];
      expect(getCommandName()).toBe('plx');
    });

    it('should return plx for PLX (uppercase)', () => {
      process.argv = ['node', '/path/to/PLX'];
      expect(getCommandName()).toBe('plx');
    });

    it('should return plx for Plx (mixed case)', () => {
      process.argv = ['node', '/path/to/Plx.js'];
      expect(getCommandName()).toBe('plx');
    });
  });

  describe('handles Windows extensions', () => {
    it('should return plx for plx.exe', () => {
      process.argv = ['node', 'C:\\Program Files\\plx.exe'];
      expect(getCommandName()).toBe('plx');
    });

    it('should return plx for plx.cmd', () => {
      process.argv = ['node', 'C:\\path\\plx.cmd'];
      expect(getCommandName()).toBe('plx');
    });

    it('should return plx for plx.bat', () => {
      process.argv = ['node', 'C:\\path\\plx.bat'];
      expect(getCommandName()).toBe('plx');
    });

    it('should return openspec for openspec.exe', () => {
      process.argv = ['node', 'C:\\Program Files\\openspec.exe'];
      expect(getCommandName()).toBe('openspec');
    });
  });

  describe('handles Node.js module extensions', () => {
    it('should return plx for plx.cjs', () => {
      process.argv = ['node', '/path/to/plx.cjs'];
      expect(getCommandName()).toBe('plx');
    });

    it('should return plx for plx.mjs', () => {
      process.argv = ['node', '/path/to/plx.mjs'];
      expect(getCommandName()).toBe('plx');
    });

    it('should return plx for plx.ts', () => {
      process.argv = ['node', '/path/to/plx.ts'];
      expect(getCommandName()).toBe('plx');
    });
  });

  describe('defaults to openspec', () => {
    it('should return openspec for openspec.js', () => {
      process.argv = ['node', '/path/to/openspec.js'];
      expect(getCommandName()).toBe('openspec');
    });

    it('should return openspec for unknown scripts', () => {
      process.argv = ['node', '/path/to/somescript.js'];
      expect(getCommandName()).toBe('openspec');
    });

    it('should return openspec when argv[1] is empty', () => {
      process.argv = ['node', ''];
      expect(getCommandName()).toBe('openspec');
    });

    it('should return openspec when argv[1] is undefined', () => {
      process.argv = ['node'];
      expect(getCommandName()).toBe('openspec');
    });
  });

  describe('handles various path formats', () => {
    it('should handle Unix paths', () => {
      process.argv = ['node', '/usr/local/bin/plx'];
      expect(getCommandName()).toBe('plx');
    });

    it('should handle Windows paths with backslashes', () => {
      process.argv = ['node', 'C:\\Users\\test\\node_modules\\.bin\\plx.cmd'];
      expect(getCommandName()).toBe('plx');
    });

    it('should handle paths with spaces', () => {
      process.argv = ['node', '/path with spaces/to/plx.js'];
      expect(getCommandName()).toBe('plx');
    });

    it('should handle npx-style paths', () => {
      process.argv = ['node', '/Users/test/.npm/_npx/12345/node_modules/.bin/plx'];
      expect(getCommandName()).toBe('plx');
    });
  });
});
