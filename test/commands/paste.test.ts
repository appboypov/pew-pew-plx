import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { platform } from 'os';
import { createValidPlxWorkspace } from '../test-utils.js';

const isMacOS = platform() === 'darwin';

describe.skipIf(!isMacOS)('paste request command', () => {
  const projectRoot = process.cwd();
  const testDir = path.join(projectRoot, 'test-paste-request-tmp');
  const draftsDir = path.join(testDir, 'workspace', 'drafts');
  const plxBin = path.join(projectRoot, 'bin', 'plx.js');

  beforeEach(async () => {
    await createValidPlxWorkspace(testDir);
  });

  afterEach(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
  });

  it('saves clipboard content to drafts/request.md', async () => {
    const originalCwd = process.cwd();
    try {
      process.chdir(testDir);

      // Set clipboard content (macOS only for this test)
      execSync('echo "test request content" | pbcopy');

      const output = execSync(
        `node ${plxBin} paste request --json`,
        { encoding: 'utf-8' }
      );
      const json = JSON.parse(output);

      expect(json.success).toBe(true);
      expect(json.path).toBe('workspace/drafts/request.md');
      expect(json.characters).toBeGreaterThan(0);

      // Verify file was created
      const content = await fs.readFile(
        path.join(draftsDir, 'request.md'),
        'utf-8'
      );
      expect(content).toContain('test request content');
    } finally {
      process.chdir(originalCwd);
    }
  });

  it('creates drafts directory if it does not exist', async () => {
    const originalCwd = process.cwd();
    try {
      process.chdir(testDir);

      // Verify drafts directory doesn't exist
      await expect(fs.access(draftsDir)).rejects.toThrow();

      // Set clipboard content
      execSync('echo "new request" | pbcopy');

      execSync(
        `node ${plxBin} paste request`,
        { encoding: 'utf-8' }
      );

      // Verify directory and file were created
      const stats = await fs.stat(draftsDir);
      expect(stats.isDirectory()).toBe(true);

      const content = await fs.readFile(
        path.join(draftsDir, 'request.md'),
        'utf-8'
      );
      expect(content).toContain('new request');
    } finally {
      process.chdir(originalCwd);
    }
  });

  it('overwrites existing request.md', async () => {
    const originalCwd = process.cwd();
    try {
      process.chdir(testDir);

      // Create initial file
      await fs.mkdir(draftsDir, { recursive: true });
      await fs.writeFile(
        path.join(draftsDir, 'request.md'),
        'old content'
      );

      // Set new clipboard content
      execSync('echo "new content" | pbcopy');

      execSync(
        `node ${plxBin} paste request`,
        { encoding: 'utf-8' }
      );

      // Verify file was overwritten
      const content = await fs.readFile(
        path.join(draftsDir, 'request.md'),
        'utf-8'
      );
      expect(content).toContain('new content');
      expect(content).not.toContain('old content');
    } finally {
      process.chdir(originalCwd);
    }
  });

  it('outputs JSON with success structure', async () => {
    const originalCwd = process.cwd();
    try {
      process.chdir(testDir);

      execSync('echo "json test" | pbcopy');

      const output = execSync(
        `node ${plxBin} paste request --json`,
        { encoding: 'utf-8' }
      );
      const json = JSON.parse(output);

      expect(json).toHaveProperty('path');
      expect(json).toHaveProperty('characters');
      expect(json).toHaveProperty('success');
      expect(json.path).toBe('workspace/drafts/request.md');
      expect(json.success).toBe(true);
      expect(typeof json.characters).toBe('number');
    } finally {
      process.chdir(originalCwd);
    }
  });

  it('outputs JSON error when clipboard is empty', async () => {
    const originalCwd = process.cwd();
    try {
      process.chdir(testDir);

      // Clear clipboard
      execSync('pbcopy < /dev/null');

      const result = execSync(
        `node ${plxBin} paste request --json 2>&1 || true`,
        { encoding: 'utf-8' }
      );
      const json = JSON.parse(result.trim());
      expect(json.error).toContain('Clipboard is empty');
    } finally {
      process.chdir(originalCwd);
    }
  });
});
