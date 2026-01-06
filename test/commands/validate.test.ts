import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import { runCLI } from '../helpers/run-cli.js';
import { createValidPlxWorkspace } from '../test-utils.js';

describe('top-level validate command', () => {
  const projectRoot = process.cwd();
  const testDir = path.join(projectRoot, 'test-validate-command-tmp');
  const changesDir = path.join(testDir, 'workspace', 'changes');
  const specsDir = path.join(testDir, 'workspace', 'specs');

  beforeEach(async () => {
    await createValidPlxWorkspace(testDir);
    await fs.mkdir(changesDir, { recursive: true });
    await fs.mkdir(specsDir, { recursive: true });

    // Create a valid spec
    const specContent = [
      '## Purpose',
      'This spec ensures the validation harness exercises a deterministic alpha module for automated tests.',
      '',
      '## Requirements',
      '',
      '### Requirement: Alpha module SHALL produce deterministic output',
      'The alpha module SHALL produce a deterministic response for validation.',
      '',
      '#### Scenario: Deterministic alpha run',
      '- **GIVEN** a configured alpha module',
      '- **WHEN** the module runs the default flow',
      '- **THEN** the output matches the expected fixture result',
    ].join('\n');
    await fs.mkdir(path.join(specsDir, 'alpha'), { recursive: true });
    await fs.writeFile(path.join(specsDir, 'alpha', 'spec.md'), specContent, 'utf-8');

    // Create a simple change with bullets (parser supports this)
    const changeContent = `# Test Change\n\n## Why\nBecause reasons that are sufficiently long for validation.\n\n## What Changes\n- **alpha:** Add something`;
    await fs.mkdir(path.join(changesDir, 'c1'), { recursive: true });
    await fs.writeFile(path.join(changesDir, 'c1', 'proposal.md'), changeContent, 'utf-8');
    const deltaContent = [
      '## ADDED Requirements',
      '### Requirement: Validator SHALL support alpha change deltas',
      'The validator SHALL accept deltas provided by the test harness.',
      '',
      '#### Scenario: Apply alpha delta',
      '- **GIVEN** the test change delta',
      '- **WHEN** plx validate runs',
      '- **THEN** the validator reports the change as valid',
    ].join('\n');
    const c1DeltaDir = path.join(changesDir, 'c1', 'specs', 'alpha');
    await fs.mkdir(c1DeltaDir, { recursive: true });
    await fs.writeFile(path.join(c1DeltaDir, 'spec.md'), deltaContent, 'utf-8');

    // Duplicate name for ambiguity test
    await fs.mkdir(path.join(changesDir, 'dup'), { recursive: true });
    await fs.writeFile(path.join(changesDir, 'dup', 'proposal.md'), changeContent, 'utf-8');
    const dupDeltaDir = path.join(changesDir, 'dup', 'specs', 'dup');
    await fs.mkdir(dupDeltaDir, { recursive: true });
    await fs.writeFile(path.join(dupDeltaDir, 'spec.md'), deltaContent, 'utf-8');
    await fs.mkdir(path.join(specsDir, 'dup'), { recursive: true });
    await fs.writeFile(path.join(specsDir, 'dup', 'spec.md'), specContent, 'utf-8');
  });

  afterEach(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
  });

  it('shows help when no subcommand provided', async () => {
    const result = await runCLI(['validate'], { cwd: testDir });
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain('Validate changes and specs');
    expect(result.stderr).toContain('Commands:');
  });

  it('validates all changes and specs using subcommands', async () => {
    // Validate all changes
    const changesResult = await runCLI(['validate', 'changes', '--json'], { cwd: testDir });
    expect(changesResult.exitCode).toBe(0);
    const changesJson = JSON.parse(changesResult.stdout.trim());
    expect(changesJson.items.every((i: any) => i.type === 'change')).toBe(true);

    // Validate all specs
    const specsResult = await runCLI(['validate', 'specs', '--json'], { cwd: testDir });
    expect(specsResult.exitCode).toBe(0);
    const specsJson = JSON.parse(specsResult.stdout.trim());
    expect(specsJson.items.every((i: any) => i.type === 'spec')).toBe(true);
  });

  it('validates specs with --concurrency', async () => {
    const result = await runCLI(['validate', 'specs', '--json', '--concurrency', '1'], { cwd: testDir });
    expect(result.exitCode).toBe(0);
    const output = result.stdout.trim();
    expect(output).not.toBe('');
    const json = JSON.parse(output);
    expect(json.items.every((i: any) => i.type === 'spec')).toBe(true);
  });

  // Note: Ambiguity only occurs in multi-workspace setups when the same ID exists in multiple workspaces.
  // The validate change/spec subcommands are specific to entity type, so ambiguity with the old
  // positional syntax (which checked both changes and specs) no longer applies.

  it('accepts change proposals saved with CRLF line endings', async () => {
    const changeId = 'crlf-change';
    const toCrlf = (segments: string[]) => segments.join('\n').replace(/\n/g, '\r\n');

    const crlfContent = toCrlf([
      '# CRLF Proposal',
      '',
      '## Why',
      'This change verifies validation works with Windows line endings.',
      '',
      '## What Changes',
      '- **alpha:** Ensure validation passes on CRLF files',
    ]);

    await fs.mkdir(path.join(changesDir, changeId), { recursive: true });
    await fs.writeFile(path.join(changesDir, changeId, 'proposal.md'), crlfContent, 'utf-8');

    const deltaContent = toCrlf([
      '## ADDED Requirements',
      '### Requirement: Parser SHALL accept CRLF change proposals',
      'The parser SHALL accept CRLF change proposals without manual edits.',
      '',
      '#### Scenario: Validate CRLF change',
      '- **GIVEN** a change proposal saved with CRLF line endings',
      '- **WHEN** a developer runs plx validate on the proposal',
      '- **THEN** validation succeeds without section errors',
    ]);

    const deltaDir = path.join(changesDir, changeId, 'specs', 'alpha');
    await fs.mkdir(deltaDir, { recursive: true });
    await fs.writeFile(path.join(deltaDir, 'spec.md'), deltaContent, 'utf-8');

    const result = await runCLI(['validate', 'change', '--id', changeId], { cwd: testDir });
    expect(result.exitCode).toBe(0);
  });

  it('respects --no-interactive flag passed via CLI', async () => {
    // This test ensures Commander.js --no-interactive flag is correctly parsed
    // and passed to the validate command. The flag sets options.interactive = false
    // (not options.noInteractive = true) due to Commander.js convention.
    const result = await runCLI(['validate', 'specs', '--no-interactive'], {
      cwd: testDir,
      // Don't set PLX_INTERACTIVE to ensure we're testing the flag itself
      env: { ...process.env, PLX_INTERACTIVE: undefined },
    });
    expect(result.exitCode).toBe(0);
    // Should complete without hanging and without prompts
    expect(result.stderr).not.toContain('What would you like to validate?');
  });

  describe('validate change command', () => {
    it('validates a specific change by ID', async () => {
      const result = await runCLI(['validate', 'change', '--id', 'c1', '--json'], { cwd: testDir });
      expect(result.exitCode).toBe(0);
      const json = JSON.parse(result.stdout.trim());
      expect(json.items).toHaveLength(1);
      expect(json.items[0].type).toBe('change');
      expect(json.items[0].id).toBe('c1');
    });

    it('returns error when change not found', async () => {
      const result = await runCLI(['validate', 'change', '--id', 'nonexistent', '--json'], { cwd: testDir });
      expect(result.exitCode).toBe(1);
      expect(result.stderr).toContain('Unknown change');
    });

    it('supports --strict flag', async () => {
      const result = await runCLI(['validate', 'change', '--id', 'c1', '--strict', '--json'], { cwd: testDir });
      expect(result.exitCode).toBe(0);
      const json = JSON.parse(result.stdout.trim());
      expect(json.items[0].type).toBe('change');
    });

    it('validates change with deltas', async () => {
      const result = await runCLI(['validate', 'change', '--id', 'c1', '--json'], { cwd: testDir });
      expect(result.exitCode).toBe(0);
      const json = JSON.parse(result.stdout.trim());
      expect(json.items[0].valid).toBe(true);
    });
  });

  describe('validate spec command', () => {
    it('validates a specific spec by ID', async () => {
      const result = await runCLI(['validate', 'spec', '--id', 'alpha', '--json'], { cwd: testDir });
      expect(result.exitCode).toBe(0);
      const json = JSON.parse(result.stdout.trim());
      expect(json.items).toHaveLength(1);
      expect(json.items[0].type).toBe('spec');
      expect(json.items[0].id).toBe('alpha');
    });

    it('returns error when spec not found', async () => {
      const result = await runCLI(['validate', 'spec', '--id', 'nonexistent', '--json'], { cwd: testDir });
      expect(result.exitCode).toBe(1);
      expect(result.stderr).toContain('Unknown spec');
    });

    it('supports --strict flag', async () => {
      const result = await runCLI(['validate', 'spec', '--id', 'alpha', '--strict', '--json'], { cwd: testDir });
      expect(result.exitCode).toBe(0);
      const json = JSON.parse(result.stdout.trim());
      expect(json.items[0].type).toBe('spec');
    });

    it('validates spec with requirements and scenarios', async () => {
      const result = await runCLI(['validate', 'spec', '--id', 'alpha', '--json'], { cwd: testDir });
      expect(result.exitCode).toBe(0);
      const json = JSON.parse(result.stdout.trim());
      expect(json.items[0].valid).toBe(true);
    });
  });
});
