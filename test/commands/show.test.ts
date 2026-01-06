import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { createValidPlxWorkspace } from '../test-utils.js';

describe('top-level show command', () => {
  const projectRoot = process.cwd();
  const testDir = path.join(projectRoot, 'test-show-command-tmp');
  const changesDir = path.join(testDir, 'workspace', 'changes');
  const specsDir = path.join(testDir, 'workspace', 'specs');
  const plxBin = path.join(projectRoot, 'bin', 'plx.js');


  beforeEach(async () => {
    await createValidPlxWorkspace(testDir);
    await fs.mkdir(changesDir, { recursive: true });
    await fs.mkdir(specsDir, { recursive: true });

    const changeContent = `# Change: Demo\n\n## Why\nBecause reasons.\n\n## What Changes\n- **auth:** Add requirement\n`;
    await fs.mkdir(path.join(changesDir, 'demo'), { recursive: true });
    await fs.writeFile(path.join(changesDir, 'demo', 'proposal.md'), changeContent, 'utf-8');

    const specContent = `## Purpose\nAuth spec.\n\n## Requirements\n\n### Requirement: User Authentication\nText\n`;
    await fs.mkdir(path.join(specsDir, 'auth'), { recursive: true });
    await fs.writeFile(path.join(specsDir, 'auth', 'spec.md'), specContent, 'utf-8');
  });

  afterEach(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
  });

  it('prints hint and non-zero exit when no args and non-interactive', () => {
    const originalCwd = process.cwd();
    const originalEnv = { ...process.env };
    try {
      process.chdir(testDir);
      process.env.PLX_INTERACTIVE = '0';
      let err: any;
      try {
        execSync(`node ${plxBin} show`, { encoding: 'utf-8' });
      } catch (e) { err = e; }
      expect(err).toBeDefined();
      expect(err.status).not.toBe(0);
      const stderr = err.stderr.toString();
      expect(stderr).toContain('Nothing to show.');
      expect(stderr).toContain('plx get change --id <id>');
      expect(stderr).toContain('plx get spec --id <id>');
    } finally {
      process.chdir(originalCwd);
      process.env = originalEnv;
    }
  });

  it('auto-detects change id and supports --json', () => {
    const originalCwd = process.cwd();
    try {
      process.chdir(testDir);
      const output = execSync(`node ${plxBin} show demo --json`, { encoding: 'utf-8' });
      const json = JSON.parse(output);
      expect(json.id).toBe('demo');
      expect(Array.isArray(json.deltas)).toBe(true);
    } finally {
      process.chdir(originalCwd);
    }
  });

  it('auto-detects spec id and supports spec-only flags', () => {
    const originalCwd = process.cwd();
    try {
      process.chdir(testDir);
      const output = execSync(`node ${plxBin} show auth --json --requirements`, { encoding: 'utf-8' });
      const json = JSON.parse(output);
      expect(json.id).toBe('auth');
      expect(Array.isArray(json.requirements)).toBe(true);
    } finally {
      process.chdir(originalCwd);
    }
  });

  it('handles ambiguity and suggests --type', async () => {
    // create matching spec and change named 'foo'
    await fs.mkdir(path.join(changesDir, 'foo'), { recursive: true });
    await fs.writeFile(path.join(changesDir, 'foo', 'proposal.md'), '# Change: Foo\n\n## Why\n\n## What Changes\n', 'utf-8');
    await fs.mkdir(path.join(specsDir, 'foo'), { recursive: true });
    await fs.writeFile(path.join(specsDir, 'foo', 'spec.md'), '## Purpose\n\n## Requirements\n\n### Requirement: R\nX', 'utf-8');

    const originalCwd = process.cwd();
    try {
      process.chdir(testDir);
      let err: any;
      try {
        execSync(`node ${plxBin} show foo`, { encoding: 'utf-8' });
      } catch (e) { err = e; }
      expect(err).toBeDefined();
      expect(err.status).not.toBe(0);
      const stderr = err.stderr.toString();
      expect(stderr).toContain('Ambiguous item');
      expect(stderr).toContain('--type change|spec');
    } finally {
      process.chdir(originalCwd);
    }
  });

  it('prints nearest matches when not found', () => {
    const originalCwd = process.cwd();
    try {
      process.chdir(testDir);
      let err: any;
      try {
        execSync(`node ${plxBin} show unknown-item`, { encoding: 'utf-8' });
      } catch (e) { err = e; }
      expect(err).toBeDefined();
      expect(err.status).not.toBe(0);
      const stderr = err.stderr.toString();
      expect(stderr).toContain("Unknown item 'unknown-item'");
      expect(stderr).toContain('Did you mean:');
    } finally {
      process.chdir(originalCwd);
    }
  });

  it('emits deprecation warning when showing a change', () => {
    const originalCwd = process.cwd();
    try {
      process.chdir(testDir);
      const output = execSync(`node ${plxBin} show demo --json 2>&1`, { encoding: 'utf-8' });
      expect(output).toContain("Deprecation: 'plx show' is deprecated");
      expect(output).toContain('plx get change --id <item> or plx get spec --id <item>');
    } finally {
      process.chdir(originalCwd);
    }
  });

  it('emits deprecation warning when showing a spec', () => {
    const originalCwd = process.cwd();
    try {
      process.chdir(testDir);
      const output = execSync(`node ${plxBin} show auth --json 2>&1`, { encoding: 'utf-8' });
      expect(output).toContain("Deprecation: 'plx show' is deprecated");
      expect(output).toContain('plx get change --id <item> or plx get spec --id <item>');
    } finally {
      process.chdir(originalCwd);
    }
  });

  it('suppresses deprecation warning with --no-deprecation-warnings flag', () => {
    const originalCwd = process.cwd();
    try {
      process.chdir(testDir);
      const output = execSync(`node ${plxBin} show demo --json --no-deprecation-warnings 2>&1`, { encoding: 'utf-8' });
      expect(output).not.toContain("Deprecation: 'plx show' is deprecated");
    } finally {
      process.chdir(originalCwd);
    }
  });

  it('ensures JSON output is unaffected by deprecation warnings', () => {
    const originalCwd = process.cwd();
    try {
      process.chdir(testDir);
      const fullOutput = execSync(`node ${plxBin} show demo --json 2>&1`, { encoding: 'utf-8' });
      const lines = fullOutput.split('\n');

      // Find and extract just the JSON part (starts with {)
      const jsonStartIdx = lines.findIndex(line => line.trim().startsWith('{'));
      expect(jsonStartIdx).toBeGreaterThan(-1);

      const jsonLines = lines.slice(jsonStartIdx);
      const jsonStr = jsonLines.join('\n');

      // Should be valid JSON
      const json = JSON.parse(jsonStr);
      expect(json.id).toBe('demo');
      expect(Array.isArray(json.deltas)).toBe(true);
    } finally {
      process.chdir(originalCwd);
    }
  });
});

