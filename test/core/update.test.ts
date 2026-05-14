import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { UpdateCommand } from '../../src/core/update.js';
import { FileSystemUtils } from '../../src/utils/file-system.js';
import { ToolRegistry } from '../../src/core/configurators/registry.js';
import path from 'path';
import fs from 'fs/promises';
import os from 'os';
import { randomUUID } from 'crypto';

// #FEEDBACK #TODO [BDD_STRUCTURE]: Test structure doesn't follow Given/When/Then BDD pattern. Tests mix setup, action, and assertions without clear separation.
// #FEEDBACK #TODO [COVERAGE_GAP]: Missing dedicated test suite for logging functionality - no comprehensive test that verifies all logging scenarios (success, failure, creation, update, migration) follow consistent itemized format.
// #FEEDBACK #TODO [COVERAGE_GAP]: Missing test to verify log output order and grouping - doesn't test if files are logged in a specific order or grouped by type (e.g., all config files, then slash commands).
describe('UpdateCommand', () => {
  let testDir: string;
  let updateCommand: UpdateCommand;
  let prevCodexHome: string | undefined;

  beforeEach(async () => {
    // Create a temporary test directory
    testDir = path.join(os.tmpdir(), `splx-test-${randomUUID()}`);
    await fs.mkdir(testDir, { recursive: true });

    // Create workspace directory
    const workspaceDir = path.join(testDir, 'workspace');
    await fs.mkdir(workspaceDir, { recursive: true });

    updateCommand = new UpdateCommand();

    // Route Codex global directory into the test sandbox
    prevCodexHome = process.env.CODEX_HOME;
    process.env.CODEX_HOME = path.join(testDir, '.codex');
  });

  afterEach(async () => {
    // Clean up test directory
    await fs.rm(testDir, { recursive: true, force: true });
    if (prevCodexHome === undefined) delete process.env.CODEX_HOME;
    else process.env.CODEX_HOME = prevCodexHome;
  });

  // #FEEDBACK #TODO [TEST_QUALITY]: Weak logging assertions - tests check if strings exist anywhere in concatenated logs, doesn't verify log message structure, format, or that each file appears as separate itemized entry. Should verify exact log format per file.
  // #FEEDBACK #TODO [COVERAGE_GAP]: Missing test for logging when multiple files are updated simultaneously - doesn't verify itemization works correctly when updating CLAUDE.md + workspace/AGENTS.md + slash commands together.
  it('should update only existing CLAUDE.md file', async () => {
    // Create CLAUDE.md file with initial content
    const claudePath = path.join(testDir, 'CLAUDE.md');
    const initialContent = `# Project Instructions

Some existing content here.

<!-- PLX:START -->
Old OpenSpec content
<!-- PLX:END -->

More content after.`;
    await fs.writeFile(claudePath, initialContent);

    const consoleSpy = vi.spyOn(console, 'log');

    // Execute update command
    await updateCommand.execute(testDir);

    // Check that CLAUDE.md was updated
    const updatedContent = await fs.readFile(claudePath, 'utf-8');
    expect(updatedContent).toContain('<!-- PLX:START -->');
    expect(updatedContent).toContain('<!-- PLX:END -->');
    expect(updatedContent).toContain("/workspace/AGENTS.md");
    expect(updatedContent).toContain('splx update');
    expect(updatedContent).toContain('Some existing content here');
    expect(updatedContent).toContain('More content after');

    // Check console output - now itemized per file
    const allLogs = consoleSpy.mock.calls.map(c => c[0]).join('\n');
    expect(allLogs).toContain('Updated workspace/AGENTS.md');
    expect(allLogs).toContain('AGENTS.md');
    consoleSpy.mockRestore();
  });

  it('should update only existing QWEN.md file', async () => {
    const qwenPath = path.join(testDir, 'QWEN.md');
    const initialContent = `# Qwen Instructions

Some existing content.

<!-- PLX:START -->
Old OpenSpec content
<!-- PLX:END -->

More notes here.`;
    await fs.writeFile(qwenPath, initialContent);

    const consoleSpy = vi.spyOn(console, 'log');

    await updateCommand.execute(testDir);

    const updatedContent = await fs.readFile(qwenPath, 'utf-8');
    expect(updatedContent).toContain('<!-- PLX:START -->');
    expect(updatedContent).toContain('<!-- PLX:END -->');
    expect(updatedContent).toContain("/workspace/AGENTS.md");
    expect(updatedContent).toContain('splx update');
    expect(updatedContent).toContain('Some existing content.');
    expect(updatedContent).toContain('More notes here.');

    // Check console output - now itemized per file
    const allLogs = consoleSpy.mock.calls.map(c => c[0]).join('\n');
    expect(allLogs).toContain('Updated workspace/AGENTS.md');
    expect(allLogs).toContain('AGENTS.md');

    consoleSpy.mockRestore();
  });

  // #FEEDBACK #TODO [TEST_QUALITY]: Logging assertions use substring matching on concatenated logs - doesn't verify each slash command file appears as separate itemized log entry with proper format.
  it('should refresh existing Claude slash command files', async () => {
    const proposalPath = path.join(
      testDir,
      '.claude/commands/splx/plan-proposal.md'
    );
    await fs.mkdir(path.dirname(proposalPath), { recursive: true });
    const initialContent = `---
name: OpenSplx: Proposal
description: Old description
category: OpenSplx
tags: [splx, change]
---
<!-- PLX:START -->
Old slash content
<!-- PLX:END -->`;
    await fs.writeFile(proposalPath, initialContent);

    const consoleSpy = vi.spyOn(console, 'log');

    await updateCommand.execute(testDir);

    const updated = await fs.readFile(proposalPath, 'utf-8');
    expect(updated).toContain('name: Plan Proposal');
    expect(updated).toContain('**Guardrails**');
    expect(updated).toContain(
      'Validate with `splx validate change --id <id> --strict`'
    );
    expect(updated).not.toContain('Old slash content');

    // Check console output - now itemized per file
    const allLogs = consoleSpy.mock.calls.map(c => c[0]).join('\n');
    expect(allLogs).toContain('Updated workspace/AGENTS.md');
    expect(allLogs).toContain('AGENTS.md');
    expect(allLogs).toContain('.claude/commands/splx/');
    expect(allLogs).toContain('slash commands');

    consoleSpy.mockRestore();
  });

  it('should refresh existing Qwen slash command files', async () => {
    const implementPath = path.join(
      testDir,
      '.qwen/commands/splx-implement.toml'
    );
    await fs.mkdir(path.dirname(implementPath), { recursive: true });
    const initialContent = `description = "Implement an approved PLX change and keep tasks in sync."

prompt = """
<!-- PLX:START -->
Old body
<!-- PLX:END -->
"""
`;
    await fs.writeFile(implementPath, initialContent);

    const consoleSpy = vi.spyOn(console, 'log');

    await updateCommand.execute(testDir);

    const updated = await fs.readFile(implementPath, 'utf-8');
    expect(updated).toContain('description = "Implement an approved PLX change and keep tasks in sync."');
    expect(updated).toContain('prompt = """');
    expect(updated).toContain('<!-- PLX:START -->');
    expect(updated).not.toContain('Old body');

    // Check console output - now itemized per file
    const allLogs = consoleSpy.mock.calls.map(c => c[0]).join('\n');
    expect(allLogs).toContain('Updated workspace/AGENTS.md');
    expect(allLogs).toContain('AGENTS.md');
    expect(allLogs).toContain('.qwen/commands/');
    expect(allLogs).toContain('slash commands');

    consoleSpy.mockRestore();
  });

  // #FEEDBACK #TODO [COVERAGE_GAP]: Missing logging verification for newly created slash command files - doesn't verify that creation of missing files is logged with proper format and itemization.
  it('should create missing Qwen slash command files on update', async () => {
    const implementPath = path.join(
      testDir,
      '.qwen/commands/splx-implement.toml'
    );

    await fs.mkdir(path.dirname(implementPath), { recursive: true });
    await fs.writeFile(
      implementPath,
      `description = "Old description"

prompt = """
<!-- PLX:START -->
Old content
<!-- PLX:END -->
"""
`
    );

    await updateCommand.execute(testDir);

    const updatedImplement = await fs.readFile(implementPath, 'utf-8');
    expect(updatedImplement).not.toContain('Old content');

    const proposalPath = path.join(
      testDir,
      '.qwen/commands/splx-plan-proposal.toml'
    );
    const archivePath = path.join(
      testDir,
      '.qwen/commands/splx-archive.toml'
    );

    // Now update creates missing files
    await expect(FileSystemUtils.fileExists(proposalPath)).resolves.toBe(true);
    await expect(FileSystemUtils.fileExists(archivePath)).resolves.toBe(true);
  });

  it('should not create CLAUDE.md if it does not exist', async () => {
    // Ensure CLAUDE.md does not exist
    const claudePath = path.join(testDir, 'CLAUDE.md');

    // Execute update command
    await updateCommand.execute(testDir);

    // Check that CLAUDE.md was not created
    const fileExists = await FileSystemUtils.fileExists(claudePath);
    expect(fileExists).toBe(false);
  });

  it('should not create QWEN.md if it does not exist', async () => {
    const qwenPath = path.join(testDir, 'QWEN.md');
    await updateCommand.execute(testDir);
    await expect(FileSystemUtils.fileExists(qwenPath)).resolves.toBe(false);
  });

  it('should update only existing CLINE.md file', async () => {
    // Create CLINE.md file with initial content
    const clinePath = path.join(testDir, 'CLINE.md');
    const initialContent = `# Cline Rules

Some existing Cline rules here.

<!-- PLX:START -->
Old OpenSpec content
<!-- PLX:END -->

More rules after.`;
    await fs.writeFile(clinePath, initialContent);

    const consoleSpy = vi.spyOn(console, 'log');

    // Execute update command
    await updateCommand.execute(testDir);

    // Check that CLINE.md was updated
    const updatedContent = await fs.readFile(clinePath, 'utf-8');
    expect(updatedContent).toContain('<!-- PLX:START -->');
    expect(updatedContent).toContain('<!-- PLX:END -->');
    expect(updatedContent).toContain("/workspace/AGENTS.md");
    expect(updatedContent).toContain('splx update');
    expect(updatedContent).toContain('Some existing Cline rules here');
    expect(updatedContent).toContain('More rules after');

    // Check console output - now itemized per file
    const allLogs = consoleSpy.mock.calls.map(c => c[0]).join('\n');
    expect(allLogs).toContain('Updated workspace/AGENTS.md');
    expect(allLogs).toContain('AGENTS.md');
    consoleSpy.mockRestore();
  });

  it('should not create CLINE.md if it does not exist', async () => {
    // Ensure CLINE.md does not exist
    const clinePath = path.join(testDir, 'CLINE.md');

    // Execute update command
    await updateCommand.execute(testDir);

    // Check that CLINE.md was not created
    const fileExists = await FileSystemUtils.fileExists(clinePath);
    expect(fileExists).toBe(false);
  });

  it('should refresh existing Cline workflow files', async () => {
    const proposalPath = path.join(
      testDir,
      '.clinerules/workflows/splx-plan-proposal.md'
    );
    await fs.mkdir(path.dirname(proposalPath), { recursive: true });
    const initialContent = `# OpenSplx: Proposal

Scaffold a new PLX change and validate strictly.

<!-- PLX:START -->
Old slash content
<!-- PLX:END -->`;
    await fs.writeFile(proposalPath, initialContent);

    const consoleSpy = vi.spyOn(console, 'log');

    await updateCommand.execute(testDir);

    const updated = await fs.readFile(proposalPath, 'utf-8');
    expect(updated).toContain('# OpenSplx: Proposal');
    expect(updated).toContain('**Guardrails**');
    expect(updated).toContain(
      'Validate with `splx validate change --id <id> --strict`'
    );
    expect(updated).not.toContain('Old slash content');

    // Check console output - now itemized per file
    const allLogs = consoleSpy.mock.calls.map(c => c[0]).join('\n');
    expect(allLogs).toContain('Updated workspace/AGENTS.md');
    expect(allLogs).toContain('AGENTS.md');
    expect(allLogs).toContain('.clinerules/workflows/');
    expect(allLogs).toContain('slash commands');

    consoleSpy.mockRestore();
  });

  it('should refresh existing Cursor slash command files', async () => {
    const cursorPath = path.join(testDir, '.cursor/commands/splx-implement.md');
    await fs.mkdir(path.dirname(cursorPath), { recursive: true });
    const initialContent = `---
name: /splx-implement
id: splx-implement
category: PLX
description: Old description
---
<!-- PLX:START -->
Old body
<!-- PLX:END -->`;
    await fs.writeFile(cursorPath, initialContent);

    const consoleSpy = vi.spyOn(console, 'log');

    await updateCommand.execute(testDir);

    const updated = await fs.readFile(cursorPath, 'utf-8');
    expect(updated).toContain('id: splx-implement');
    expect(updated).not.toContain('Old body');

    // Check console output - now itemized per file
    const allLogs = consoleSpy.mock.calls.map(c => c[0]).join('\n');
    expect(allLogs).toContain('Updated workspace/AGENTS.md');
    expect(allLogs).toContain('AGENTS.md');
    expect(allLogs).toContain('.cursor/commands/');
    expect(allLogs).toContain('slash commands');

    consoleSpy.mockRestore();
  });

  it('should refresh existing OpenCode slash command files', async () => {
    const openCodePath = path.join(
      testDir,
      '.opencode/command/splx-implement.md'
    );
    await fs.mkdir(path.dirname(openCodePath), { recursive: true });
    const initialContent = `---
name: /splx-implement
id: splx-implement
category: PLX
description: Old description
---
<!-- PLX:START -->
Old body
<!-- PLX:END -->`;
    await fs.writeFile(openCodePath, initialContent);

    const consoleSpy = vi.spyOn(console, 'log');

    await updateCommand.execute(testDir);

    const updated = await fs.readFile(openCodePath, 'utf-8');
    expect(updated).toContain('description: Implement an approved PLX change');
    expect(updated).not.toContain('Old body');

    // Check console output - now itemized per file
    const allLogs = consoleSpy.mock.calls.map(c => c[0]).join('\n');
    expect(allLogs).toContain('Updated workspace/AGENTS.md');
    expect(allLogs).toContain('AGENTS.md');
    expect(allLogs).toContain('.opencode/command/');
    expect(allLogs).toContain('slash commands');

    consoleSpy.mockRestore();
  });

  it('should refresh existing Kilo Code workflows', async () => {
    const kilocodePath = path.join(
      testDir,
      '.kilocode/workflows/splx-implement.md'
    );
    await fs.mkdir(path.dirname(kilocodePath), { recursive: true });
    const initialContent = `<!-- PLX:START -->
Old body
<!-- PLX:END -->`;
    await fs.writeFile(kilocodePath, initialContent);

    const consoleSpy = vi.spyOn(console, 'log');

    await updateCommand.execute(testDir);

    const updated = await fs.readFile(kilocodePath, 'utf-8');
    expect(updated).not.toContain('Old body');
    expect(updated.startsWith('<!-- PLX:START -->')).toBe(true);

    // Check console output - now itemized per file
    const allLogs = consoleSpy.mock.calls.map(c => c[0]).join('\n');
    expect(allLogs).toContain('.kilocode/workflows/');
    expect(allLogs).toContain('slash commands');

    consoleSpy.mockRestore();
  });

  it('should refresh existing Windsurf workflows', async () => {
    const wsPath = path.join(
      testDir,
      '.windsurf/workflows/splx-implement.md'
    );
    await fs.mkdir(path.dirname(wsPath), { recursive: true });
    const initialContent = `## PLX: Implement (Windsurf)
Intro
<!-- PLX:START -->
Old body
<!-- PLX:END -->`;
    await fs.writeFile(wsPath, initialContent);

    const consoleSpy = vi.spyOn(console, 'log');

    await updateCommand.execute(testDir);

    const updated = await fs.readFile(wsPath, 'utf-8');
    expect(updated).not.toContain('Old body');
    expect(updated).toContain('## PLX: Implement (Windsurf)');

    // Check console output - now itemized per file
    const allLogs = consoleSpy.mock.calls.map(c => c[0]).join('\n');
    expect(allLogs).toContain('.windsurf/workflows/');
    expect(allLogs).toContain('slash commands');
    consoleSpy.mockRestore();
  });

  it('should refresh existing Antigravity workflows', async () => {
    const agPath = path.join(
      testDir,
      '.agent/workflows/splx-implement.md'
    );
    await fs.mkdir(path.dirname(agPath), { recursive: true });
    const initialContent = `---
description: Implement an approved PLX change and keep tasks in sync.
---

<!-- PLX:START -->
Old body
<!-- PLX:END -->`;
    await fs.writeFile(agPath, initialContent);

    const consoleSpy = vi.spyOn(console, 'log');

    await updateCommand.execute(testDir);

    const updated = await fs.readFile(agPath, 'utf-8');
    expect(updated).not.toContain('Old body');
    expect(updated).toContain('description: Implement an approved PLX change and keep tasks in sync.');
    expect(updated).not.toContain('auto_execution_mode: 3');

    // Check console output - now itemized per file
    const allLogs = consoleSpy.mock.calls.map(c => c[0]).join('\n');
    expect(allLogs).toContain('.agent/workflows/');
    expect(allLogs).toContain('slash commands');
    consoleSpy.mockRestore();
  });

  it('should refresh existing Codex prompts', async () => {
    const codexPath = path.join(
      testDir,
      '.codex/prompts/splx-implement.md'
    );
    await fs.mkdir(path.dirname(codexPath), { recursive: true });
    const initialContent = `---\ndescription: Old description\nargument-hint: old-hint\n---\n\n$ARGUMENTS\n<!-- PLX:START -->\nOld body\n<!-- PLX:END -->`;
    await fs.writeFile(codexPath, initialContent);

    const consoleSpy = vi.spyOn(console, 'log');

    await updateCommand.execute(testDir);

    const updated = await fs.readFile(codexPath, 'utf-8');
    expect(updated).toContain('description: Implement an approved PLX change and keep tasks in sync.');
    expect(updated).toContain('argument-hint: change-id');
    expect(updated).toContain('$ARGUMENTS');
    expect(updated).not.toContain('Old body');
    expect(updated).not.toContain('Old description');

    // Check console output - now itemized per file
    const allLogs = consoleSpy.mock.calls.map(c => c[0]).join('\n');
    expect(allLogs).toContain('.codex/prompts/');
    expect(allLogs).toContain('slash commands');

    consoleSpy.mockRestore();
  });

  it('should create missing Codex prompts on update', async () => {
    const codexImplement = path.join(
      testDir,
      '.codex/prompts/splx-implement.md'
    );

    // Only create implement; leave proposal and archive missing
    await fs.mkdir(path.dirname(codexImplement), { recursive: true });
    await fs.writeFile(
      codexImplement,
      '---\ndescription: Old\nargument-hint: old\n---\n\n$ARGUMENTS\n<!-- PLX:START -->\nOld\n<!-- PLX:END -->'
    );

    await updateCommand.execute(testDir);

    const codexProposal = path.join(
      testDir,
      '.codex/prompts/splx-plan-proposal.md'
    );
    const codexArchive = path.join(
      testDir,
      '.codex/prompts/splx-archive.md'
    );

    // Now update creates missing files
    await expect(FileSystemUtils.fileExists(codexProposal)).resolves.toBe(true);
    await expect(FileSystemUtils.fileExists(codexArchive)).resolves.toBe(true);
  });

  it('should refresh existing GitHub Copilot prompts', async () => {
    const ghPath = path.join(
      testDir,
      '.github/prompts/splx-implement.prompt.md'
    );
    await fs.mkdir(path.dirname(ghPath), { recursive: true });
    const initialContent = `---
description: Implement an approved PLX change and keep tasks in sync.
---

$ARGUMENTS
<!-- PLX:START -->
Old body
<!-- PLX:END -->`;
    await fs.writeFile(ghPath, initialContent);

    const consoleSpy = vi.spyOn(console, 'log');

    await updateCommand.execute(testDir);

    const updated = await fs.readFile(ghPath, 'utf-8');
    expect(updated).toContain('description: Implement an approved PLX change and keep tasks in sync.');
    expect(updated).toContain('$ARGUMENTS');
    expect(updated).not.toContain('Old body');

    // Check console output - now itemized per file
    const allLogs = consoleSpy.mock.calls.map(c => c[0]).join('\n');
    expect(allLogs).toContain('.github/prompts/');
    expect(allLogs).toContain('slash commands');

    consoleSpy.mockRestore();
  });

  it('should create missing GitHub Copilot prompts on update', async () => {
    const ghImplement = path.join(
      testDir,
      '.github/prompts/splx-implement.prompt.md'
    );

    // Only create implement; leave proposal and archive missing
    await fs.mkdir(path.dirname(ghImplement), { recursive: true });
    await fs.writeFile(
      ghImplement,
      '---\ndescription: Old\n---\n\n$ARGUMENTS\n<!-- PLX:START -->\nOld\n<!-- PLX:END -->'
    );

    await updateCommand.execute(testDir);

    const ghProposal = path.join(
      testDir,
      '.github/prompts/splx-plan-proposal.prompt.md'
    );
    const ghArchive = path.join(
      testDir,
      '.github/prompts/splx-archive.prompt.md'
    );

    // Now update creates missing files
    await expect(FileSystemUtils.fileExists(ghProposal)).resolves.toBe(true);
    await expect(FileSystemUtils.fileExists(ghArchive)).resolves.toBe(true);
  });

  it('should refresh existing Gemini CLI TOML files and create missing ones', async () => {
    const geminiProposal = path.join(
      testDir,
      '.gemini/commands/splx/plan-proposal.toml'
    );
    await fs.mkdir(path.dirname(geminiProposal), { recursive: true });
    const initialContent = `description = "Old description"

prompt = """
<!-- PLX:START -->
Old Gemini body
<!-- PLX:END -->
"""
`;
    await fs.writeFile(geminiProposal, initialContent);

    const consoleSpy = vi.spyOn(console, 'log');

    await updateCommand.execute(testDir);

    const updated = await fs.readFile(geminiProposal, 'utf-8');
    expect(updated).toContain('<!-- PLX:START -->');
    expect(updated).toContain('<!-- PLX:END -->');
    expect(updated).not.toContain('Old Gemini body');

    const geminiImplement = path.join(
      testDir,
      '.gemini/commands/splx/implement.toml'
    );
    const geminiArchive = path.join(
      testDir,
      '.gemini/commands/splx/archive.toml'
    );

    // Now update creates missing files
    await expect(FileSystemUtils.fileExists(geminiImplement)).resolves.toBe(true);
    await expect(FileSystemUtils.fileExists(geminiArchive)).resolves.toBe(true);

    // Check console output - now itemized per file
    const allLogs = consoleSpy.mock.calls.map(c => c[0]).join('\n');
    expect(allLogs).toContain('.gemini/commands/splx/');
    expect(allLogs).toContain('slash commands');

    consoleSpy.mockRestore();
  });

  it('should refresh existing IFLOW slash commands and create missing ones', async () => {
    const iflowProposal = path.join(
      testDir,
      '.iflow/commands/splx-plan-proposal.md'
    );
    await fs.mkdir(path.dirname(iflowProposal), { recursive: true });
    const initialContent = `description: Scaffold a new PLX change and validate strictly."

prompt = """
<!-- PLX:START -->
Old IFlow body
<!-- PLX:END -->
"""
`;
    await fs.writeFile(iflowProposal, initialContent);

    const consoleSpy = vi.spyOn(console, 'log');

    await updateCommand.execute(testDir);

    const updated = await fs.readFile(iflowProposal, 'utf-8');
    expect(updated).toContain('description: Scaffold a new PLX change and validate strictly.');
    expect(updated).toContain('<!-- PLX:START -->');
    expect(updated).toContain('**Guardrails**');
    expect(updated).toContain('<!-- PLX:END -->');
    expect(updated).not.toContain('Old IFlow body');

    const iflowImplement = path.join(
      testDir,
      '.iflow/commands/splx-implement.md'
    );
    const iflowArchive = path.join(
      testDir,
      '.iflow/commands/splx-archive.md'
    );

    // Now update creates missing files
    await expect(FileSystemUtils.fileExists(iflowImplement)).resolves.toBe(true);
    await expect(FileSystemUtils.fileExists(iflowArchive)).resolves.toBe(true);

    // Check console output - now itemized per file
    const allLogs = consoleSpy.mock.calls.map(c => c[0]).join('\n');
    expect(allLogs).toContain('.iflow/commands/');
    expect(allLogs).toContain('slash commands');

    consoleSpy.mockRestore();
  });

  it('should refresh existing Factory slash commands', async () => {
    const factoryPath = path.join(
      testDir,
      '.factory/commands/splx-plan-proposal.md'
    );
    await fs.mkdir(path.dirname(factoryPath), { recursive: true });
    const initialContent = `---
description: Scaffold a new PLX change and validate strictly.
argument-hint: request or feature description
---

<!-- PLX:START -->
Old body
<!-- PLX:END -->`;
    await fs.writeFile(factoryPath, initialContent);

    const consoleSpy = vi.spyOn(console, 'log');

    await updateCommand.execute(testDir);

    const updated = await fs.readFile(factoryPath, 'utf-8');
    expect(updated).toContain('description: Scaffold a new PLX change and validate strictly.');
    expect(updated).toContain('argument-hint: request or feature description');
    expect(
      /<!-- PLX:START -->([\s\S]*?)<!-- PLX:END -->/u.exec(updated)?.[1]
    ).toContain('$ARGUMENTS');
    expect(updated).toContain('**Guardrails**');
    expect(updated).not.toContain('Old body');

    // Check console output - now itemized per file
    const allLogs = consoleSpy.mock.calls.map(c => c[0]).join('\n');
    expect(allLogs).toContain('.factory/commands/');
    expect(allLogs).toContain('slash commands');

    consoleSpy.mockRestore();
  });

  it('should create missing Factory slash command files on update', async () => {
    const factoryImplement = path.join(
      testDir,
      '.factory/commands/splx-implement.md'
    );

    await fs.mkdir(path.dirname(factoryImplement), { recursive: true });
    await fs.writeFile(
      factoryImplement,
      `---
description: Old
argument-hint: old
---

<!-- PLX:START -->
Old body
<!-- PLX:END -->`
    );

    await updateCommand.execute(testDir);

    const factoryProposal = path.join(
      testDir,
      '.factory/commands/splx-plan-proposal.md'
    );
    const factoryArchive = path.join(
      testDir,
      '.factory/commands/splx-archive.md'
    );

    // Now update creates missing files
    await expect(FileSystemUtils.fileExists(factoryProposal)).resolves.toBe(true);
    await expect(FileSystemUtils.fileExists(factoryArchive)).resolves.toBe(true);
  });

  it('should refresh existing Amazon Q Developer prompts', async () => {
    const aqPath = path.join(
      testDir,
      '.amazonq/prompts/splx-implement.md'
    );
    await fs.mkdir(path.dirname(aqPath), { recursive: true });
    const initialContent = `---
description: Implement an approved PLX change and keep tasks in sync.
---

The user wants to implement the following change. Use the splx instructions to implement the approved change.

<ChangeId>
  $ARGUMENTS
</ChangeId>
<!-- PLX:START -->
Old body
<!-- PLX:END -->`;
    await fs.writeFile(aqPath, initialContent);

    const consoleSpy = vi.spyOn(console, 'log');

    await updateCommand.execute(testDir);

    const updatedContent = await fs.readFile(aqPath, 'utf-8');
    expect(updatedContent).toContain('<!-- PLX:START -->');
    expect(updatedContent).toContain('<!-- PLX:END -->');
    expect(updatedContent).not.toContain('Old body');

    // Check console output - now itemized per file
    const allLogs = consoleSpy.mock.calls.map(c => c[0]).join('\n');
    expect(allLogs).toContain('.amazonq/prompts/');
    expect(allLogs).toContain('slash commands');

    consoleSpy.mockRestore();
  });

  it('should create missing Amazon Q Developer prompts on update', async () => {
    const aqImplement = path.join(
      testDir,
      '.amazonq/prompts/splx-implement.md'
    );

    // Only create implement; leave proposal and archive missing
    await fs.mkdir(path.dirname(aqImplement), { recursive: true });
    await fs.writeFile(
      aqImplement,
      '---\ndescription: Old\n---\n\nThe user wants to implement the following change.\n\n<ChangeId>\n  $ARGUMENTS\n</ChangeId>\n<!-- PLX:START -->\nOld\n<!-- PLX:END -->'
    );

    await updateCommand.execute(testDir);

    const aqProposal = path.join(
      testDir,
      '.amazonq/prompts/splx-plan-proposal.md'
    );
    const aqArchive = path.join(
      testDir,
      '.amazonq/prompts/splx-archive.md'
    );

    // Now update creates missing files
    await expect(FileSystemUtils.fileExists(aqProposal)).resolves.toBe(true);
    await expect(FileSystemUtils.fileExists(aqArchive)).resolves.toBe(true);
  });

  it('should refresh existing Auggie slash command files', async () => {
    const auggiePath = path.join(
      testDir,
      '.augment/commands/splx-implement.md'
    );
    await fs.mkdir(path.dirname(auggiePath), { recursive: true });
    const initialContent = `---
description: Implement an approved PLX change and keep tasks in sync.
argument-hint: change-id
---
<!-- PLX:START -->
Old body
<!-- PLX:END -->`;
    await fs.writeFile(auggiePath, initialContent);

    const consoleSpy = vi.spyOn(console, 'log');

    await updateCommand.execute(testDir);

    const updatedContent = await fs.readFile(auggiePath, 'utf-8');
    expect(updatedContent).toContain('<!-- PLX:START -->');
    expect(updatedContent).toContain('<!-- PLX:END -->');
    expect(updatedContent).not.toContain('Old body');

    // Check console output - now itemized per file
    const allLogs = consoleSpy.mock.calls.map(c => c[0]).join('\n');
    expect(allLogs).toContain('.augment/commands/');
    expect(allLogs).toContain('slash commands');

    consoleSpy.mockRestore();
  });

  it('should create missing Auggie slash command files on update', async () => {
    const auggieImplement = path.join(
      testDir,
      '.augment/commands/splx-implement.md'
    );

    // Only create implement; leave proposal and archive missing
    await fs.mkdir(path.dirname(auggieImplement), { recursive: true });
    await fs.writeFile(
      auggieImplement,
      '---\ndescription: Old\nargument-hint: old\n---\n<!-- PLX:START -->\nOld\n<!-- PLX:END -->'
    );

    await updateCommand.execute(testDir);

    const auggieProposal = path.join(
      testDir,
      '.augment/commands/splx-plan-proposal.md'
    );
    const auggieArchive = path.join(
      testDir,
      '.augment/commands/splx-archive.md'
    );

    // Now update creates missing files
    await expect(FileSystemUtils.fileExists(auggieProposal)).resolves.toBe(true);
    await expect(FileSystemUtils.fileExists(auggieArchive)).resolves.toBe(true);
  });

  it('should refresh existing CodeBuddy slash command files', async () => {
    const codeBuddyPath = path.join(
      testDir,
      '.codebuddy/commands/splx/plan-proposal.md'
    );
    await fs.mkdir(path.dirname(codeBuddyPath), { recursive: true });
    const initialContent = `---
name: OpenSplx: Proposal
description: Old description
category: OpenSplx
tags: [splx, change]
---
<!-- PLX:START -->
Old slash content
<!-- PLX:END -->`;
    await fs.writeFile(codeBuddyPath, initialContent);

    const consoleSpy = vi.spyOn(console, 'log');

    await updateCommand.execute(testDir);

    const updated = await fs.readFile(codeBuddyPath, 'utf-8');
    expect(updated).toContain('name: Plan Proposal');
    expect(updated).toContain('**Guardrails**');
    expect(updated).toContain(
      'Validate with `splx validate change --id <id> --strict`'
    );
    expect(updated).not.toContain('Old slash content');

    // Check console output - now itemized per file
    const allLogs = consoleSpy.mock.calls.map(c => c[0]).join('\n');
    expect(allLogs).toContain('Updated workspace/AGENTS.md');
    expect(allLogs).toContain('AGENTS.md');
    expect(allLogs).toContain('.codebuddy/commands/splx/');
    expect(allLogs).toContain('slash commands');

    consoleSpy.mockRestore();
  });

  it('should create missing CodeBuddy slash command files on update', async () => {
    const codeBuddyImplement = path.join(
      testDir,
      '.codebuddy/commands/splx/implement.md'
    );

    // Only create implement; leave plan-proposal and archive missing
    await fs.mkdir(path.dirname(codeBuddyImplement), { recursive: true });
    await fs.writeFile(
      codeBuddyImplement,
      `---
name: OpenSplx: Implement
description: Old description
category: OpenSplx
tags: [splx, implement]
---
<!-- PLX:START -->
Old body
<!-- PLX:END -->`
    );

    await updateCommand.execute(testDir);

    const codeBuddyProposal = path.join(
      testDir,
      '.codebuddy/commands/splx/plan-proposal.md'
    );
    const codeBuddyArchive = path.join(
      testDir,
      '.codebuddy/commands/splx/archive.md'
    );

    // Now update creates missing files
    await expect(FileSystemUtils.fileExists(codeBuddyProposal)).resolves.toBe(true);
    await expect(FileSystemUtils.fileExists(codeBuddyArchive)).resolves.toBe(true);
  });

  it('should refresh existing Crush slash command files', async () => {
    const crushPath = path.join(
      testDir,
      '.crush/commands/splx/plan-proposal.md'
    );
    await fs.mkdir(path.dirname(crushPath), { recursive: true });
    const initialContent = `---
name: OpenSplx: Proposal
description: Old description
category: OpenSplx
tags: [splx, change]
---
<!-- PLX:START -->
Old slash content
<!-- PLX:END -->`;
    await fs.writeFile(crushPath, initialContent);

    const consoleSpy = vi.spyOn(console, 'log');

    await updateCommand.execute(testDir);

    const updated = await fs.readFile(crushPath, 'utf-8');
    expect(updated).toContain('name: Plan Proposal');
    expect(updated).toContain('**Guardrails**');
    expect(updated).toContain(
      'Validate with `splx validate change --id <id> --strict`'
    );
    expect(updated).not.toContain('Old slash content');

    // Check console output - now itemized per file
    const allLogs = consoleSpy.mock.calls.map(c => c[0]).join('\n');
    expect(allLogs).toContain('Updated workspace/AGENTS.md');
    expect(allLogs).toContain('AGENTS.md');
    expect(allLogs).toContain('.crush/commands/splx/');
    expect(allLogs).toContain('slash commands');

    consoleSpy.mockRestore();
  });

  it('should create missing Crush slash command files on update', async () => {
    const crushImplement = path.join(
      testDir,
      '.crush/commands/splx/implement.md'
    );

    // Only create implement; leave plan-proposal and archive missing
    await fs.mkdir(path.dirname(crushImplement), { recursive: true });
    await fs.writeFile(
      crushImplement,
      `---
name: OpenSplx: Implement
description: Old description
category: OpenSplx
tags: [splx, implement]
---
<!-- PLX:START -->
Old body
<!-- PLX:END -->`
    );

    await updateCommand.execute(testDir);

    const crushProposal = path.join(
      testDir,
      '.crush/commands/splx/plan-proposal.md'
    );
    const crushArchive = path.join(
      testDir,
      '.crush/commands/splx/archive.md'
    );

    // Now update creates missing files
    await expect(FileSystemUtils.fileExists(crushProposal)).resolves.toBe(true);
    await expect(FileSystemUtils.fileExists(crushArchive)).resolves.toBe(true);
  });

  it('should refresh existing CoStrict slash command files', async () => {
    const costrictPath = path.join(
      testDir,
      '.cospec/splx/commands/splx-plan-proposal.md'
    );
    await fs.mkdir(path.dirname(costrictPath), { recursive: true });
    const initialContent = `---
description: "Old description"
argument-hint: old-hint
---
<!-- PLX:START -->
Old body
<!-- PLX:END -->`;
    await fs.writeFile(costrictPath, initialContent);

    const consoleSpy = vi.spyOn(console, 'log');

    await updateCommand.execute(testDir);

    const updated = await fs.readFile(costrictPath, 'utf-8');
    // Frontmatter is now updated along with the body
    expect(updated).toContain('description: "Scaffold a new PLX change');
    expect(updated).toContain('argument-hint: feature description or request');
    expect(updated).toContain('**Guardrails**');
    expect(updated).toContain(
      'Validate with `splx validate change --id <id> --strict`'
    );
    expect(updated).not.toContain('Old body');

    // Check console output - now itemized per file
    const allLogs = consoleSpy.mock.calls.map(c => c[0]).join('\n');
    expect(allLogs).toContain('Updated workspace/AGENTS.md');
    expect(allLogs).toContain('AGENTS.md');
    expect(allLogs).toContain('.cospec/splx/commands/');
    expect(allLogs).toContain('slash commands');

    consoleSpy.mockRestore();
  });

  it('should refresh existing Qoder slash command files', async () => {
    const qoderPath = path.join(
      testDir,
      '.qoder/commands/splx/plan-proposal.md'
    );
    await fs.mkdir(path.dirname(qoderPath), { recursive: true });
    const initialContent = `---
name: OpenSplx: Proposal
description: Old description
category: OpenSplx
tags: [splx, change]
---
<!-- PLX:START -->
Old slash content
<!-- PLX:END -->`;
    await fs.writeFile(qoderPath, initialContent);

    const consoleSpy = vi.spyOn(console, 'log');

    await updateCommand.execute(testDir);

    const updated = await fs.readFile(qoderPath, 'utf-8');
    expect(updated).toContain('name: Plan Proposal');
    expect(updated).toContain('**Guardrails**');
    expect(updated).toContain(
      'Validate with `splx validate change --id <id> --strict`'
    );
    expect(updated).not.toContain('Old slash content');

    // Check console output - now itemized per file
    const allLogs = consoleSpy.mock.calls.map(c => c[0]).join('\n');
    expect(allLogs).toContain('Updated workspace/AGENTS.md');
    expect(allLogs).toContain('AGENTS.md');
    expect(allLogs).toContain('.qoder/commands/splx/');
    expect(allLogs).toContain('slash commands');

    consoleSpy.mockRestore();
  });

  it('should refresh existing RooCode slash command files', async () => {
    const rooPath = path.join(
      testDir,
      '.roo/commands/splx-plan-proposal.md'
    );
    await fs.mkdir(path.dirname(rooPath), { recursive: true });
    const initialContent = `# OpenSplx: Proposal

Old description

<!-- PLX:START -->
Old body
<!-- PLX:END -->`;
    await fs.writeFile(rooPath, initialContent);

    const consoleSpy = vi.spyOn(console, 'log');

    await updateCommand.execute(testDir);

    const updated = await fs.readFile(rooPath, 'utf-8');
    // For RooCode, the header is Markdown, preserve it and update only managed block
    expect(updated).toContain('# OpenSplx: Proposal');
    expect(updated).toContain('**Guardrails**');
    expect(updated).toContain(
      'Validate with `splx validate change --id <id> --strict`'
    );
    expect(updated).not.toContain('Old body');

    // Check console output - now itemized per file
    const allLogs = consoleSpy.mock.calls.map(c => c[0]).join('\n');
    expect(allLogs).toContain('Updated workspace/AGENTS.md');
    expect(allLogs).toContain('AGENTS.md');
    expect(allLogs).toContain('.roo/commands/');
    expect(allLogs).toContain('slash commands');

    consoleSpy.mockRestore();
  });

  it('should create missing RooCode slash command files on update', async () => {
    const rooImplement = path.join(
      testDir,
      '.roo/commands/splx-implement.md'
    );

    // Only create implement; leave plan-proposal and archive missing
    await fs.mkdir(path.dirname(rooImplement), { recursive: true });
    await fs.writeFile(
      rooImplement,
      `# OpenSplx: Implement

<!-- PLX:START -->
Old body
<!-- PLX:END -->`
    );

    await updateCommand.execute(testDir);

    const rooProposal = path.join(
      testDir,
      '.roo/commands/splx-plan-proposal.md'
    );
    const rooArchive = path.join(
      testDir,
      '.roo/commands/splx-archive.md'
    );

    // Now update creates missing files
    await expect(FileSystemUtils.fileExists(rooProposal)).resolves.toBe(true);
    await expect(FileSystemUtils.fileExists(rooArchive)).resolves.toBe(true);
  });

  it('should create missing CoStrict slash command files on update', async () => {
    const costrictImplement = path.join(
      testDir,
      '.cospec/splx/commands/splx-implement.md'
    );

    // Only create implement; leave plan-proposal and archive missing
    await fs.mkdir(path.dirname(costrictImplement), { recursive: true });
    await fs.writeFile(
      costrictImplement,
      `---
description: "Old"
argument-hint: old
---
<!-- PLX:START -->
Old
<!-- PLX:END -->`
    );

    await updateCommand.execute(testDir);

    const costrictProposal = path.join(
      testDir,
      '.cospec/splx/commands/splx-plan-proposal.md'
    );
    const costrictArchive = path.join(
      testDir,
      '.cospec/splx/commands/splx-archive.md'
    );

    // Now update creates missing files
    await expect(FileSystemUtils.fileExists(costrictProposal)).resolves.toBe(true);
    await expect(FileSystemUtils.fileExists(costrictArchive)).resolves.toBe(true);
  });

  it('should create missing Qoder slash command files on update', async () => {
    const qoderImplement = path.join(
      testDir,
      '.qoder/commands/splx/implement.md'
    );

    // Only create implement; leave plan-proposal and archive missing
    await fs.mkdir(path.dirname(qoderImplement), { recursive: true });
    await fs.writeFile(
      qoderImplement,
      `---
name: OpenSplx: Implement
description: Old description
category: OpenSplx
tags: [splx, implement]
---
<!-- PLX:START -->
Old body
<!-- PLX:END -->`
    );

    await updateCommand.execute(testDir);

    const qoderProposal = path.join(
      testDir,
      '.qoder/commands/splx/plan-proposal.md'
    );
    const qoderArchive = path.join(
      testDir,
      '.qoder/commands/splx/archive.md'
    );

    // Now update creates missing files
    await expect(FileSystemUtils.fileExists(qoderProposal)).resolves.toBe(true);
    await expect(FileSystemUtils.fileExists(qoderArchive)).resolves.toBe(true);
  });

  it('should update only existing COSTRICT.md file', async () => {
    // Create COSTRICT.md file with initial content
    const costrictPath = path.join(testDir, 'COSTRICT.md');
    const initialContent = `# CoStrict Instructions

Some existing CoStrict instructions here.

<!-- PLX:START -->
Old OpenSpec content
<!-- PLX:END -->

More instructions after.`;
    await fs.writeFile(costrictPath, initialContent);

    const consoleSpy = vi.spyOn(console, 'log');

    // Execute update command
    await updateCommand.execute(testDir);

    // Check that COSTRICT.md was updated
    const updatedContent = await fs.readFile(costrictPath, 'utf-8');
    expect(updatedContent).toContain('<!-- PLX:START -->');
    expect(updatedContent).toContain('<!-- PLX:END -->');
    expect(updatedContent).toContain("/workspace/AGENTS.md");
    expect(updatedContent).toContain('splx update');
    expect(updatedContent).toContain('Some existing CoStrict instructions here');
    expect(updatedContent).toContain('More instructions after');

    // Check console output - now itemized per file
    const allLogs = consoleSpy.mock.calls.map(c => c[0]).join('\n');
    expect(allLogs).toContain('Updated workspace/AGENTS.md');
    expect(allLogs).toContain('AGENTS.md');
    consoleSpy.mockRestore();
  });


  it('should not create COSTRICT.md if it does not exist', async () => {
    // Ensure COSTRICT.md does not exist
    const costrictPath = path.join(testDir, 'COSTRICT.md');

    // Execute update command
    await updateCommand.execute(testDir);

    // Check that COSTRICT.md was not created
    const fileExists = await FileSystemUtils.fileExists(costrictPath);
    expect(fileExists).toBe(false);
  });

  it('should preserve CoStrict content outside markers during update', async () => {
    const costrictPath = path.join(
      testDir,
      '.cospec/splx/commands/splx-plan-proposal.md'
    );
    await fs.mkdir(path.dirname(costrictPath), { recursive: true });
    const initialContent = `## Custom Intro Title\nSome intro text\n<!-- PLX:START -->\nOld body\n<!-- PLX:END -->\n\nFooter stays`;
    await fs.writeFile(costrictPath, initialContent);

    await updateCommand.execute(testDir);

    const updated = await fs.readFile(costrictPath, 'utf-8');
    expect(updated).toContain('## Custom Intro Title');
    expect(updated).toContain('Footer stays');
    expect(updated).not.toContain('Old body');
    expect(updated).toContain('Validate with `splx validate change --id <id> --strict`');
  });

  it('should handle configurator errors gracefully for CoStrict', async () => {
    // Create COSTRICT.md file but make it read-only to cause an error
    const costrictPath = path.join(testDir, 'COSTRICT.md');
    await fs.writeFile(
      costrictPath,
      '<!-- PLX:START -->\nOld\n<!-- PLX:END -->'
    );

    const consoleSpy = vi.spyOn(console, 'log');
    const errorSpy = vi.spyOn(console, 'error');
    const originalWriteFile = FileSystemUtils.writeFile.bind(FileSystemUtils);
    const writeSpy = vi
      .spyOn(FileSystemUtils, 'writeFile')
      .mockImplementation(async (filePath, content) => {
        if (filePath.endsWith('COSTRICT.md')) {
          throw new Error('EACCES: permission denied, open');
        }

        return originalWriteFile(filePath, content);
      });

    // Execute update command - should not throw
    await updateCommand.execute(testDir);

    // Should report the failure
    expect(errorSpy).toHaveBeenCalled();
    // Check console output - now itemized per file
    const allLogs = consoleSpy.mock.calls.map(c => c[0]).join('\n');
    expect(allLogs).toContain('Updated workspace/AGENTS.md');
    expect(allLogs).toContain('AGENTS.md');
    // Failed to update is logged via console.error, checked above

    consoleSpy.mockRestore();
    errorSpy.mockRestore();
    writeSpy.mockRestore();
  });

  it('should preserve Windsurf content outside markers during update', async () => {
    const wsPath = path.join(
      testDir,
      '.windsurf/workflows/splx-plan-proposal.md'
    );
    await fs.mkdir(path.dirname(wsPath), { recursive: true });
    const initialContent = `## Custom Intro Title\nSome intro text\n<!-- PLX:START -->\nOld body\n<!-- PLX:END -->\n\nFooter stays`;
    await fs.writeFile(wsPath, initialContent);

    await updateCommand.execute(testDir);

    const updated = await fs.readFile(wsPath, 'utf-8');
    expect(updated).toContain('## Custom Intro Title');
    expect(updated).toContain('Footer stays');
    expect(updated).not.toContain('Old body');
    expect(updated).toContain('Validate with `splx validate change --id <id> --strict`');
  });

  it('should create missing Windsurf workflows on update', async () => {
    const wsImplement = path.join(
      testDir,
      '.windsurf/workflows/splx-implement.md'
    );
    // Only create implement; leave plan-proposal and archive missing
    await fs.mkdir(path.dirname(wsImplement), { recursive: true });
    await fs.writeFile(
      wsImplement,
      '<!-- PLX:START -->\nOld\n<!-- PLX:END -->'
    );

    await updateCommand.execute(testDir);

    const wsProposal = path.join(
      testDir,
      '.windsurf/workflows/splx-plan-proposal.md'
    );
    const wsArchive = path.join(
      testDir,
      '.windsurf/workflows/splx-archive.md'
    );

    // Now update creates missing files
    await expect(FileSystemUtils.fileExists(wsProposal)).resolves.toBe(true);
    await expect(FileSystemUtils.fileExists(wsArchive)).resolves.toBe(true);
  });

  // #FEEDBACK #TODO [COVERAGE_GAP]: Missing negative assertion - should verify that NO other file update logs appear when no AI tool files are present, only workspace/AGENTS.md and root AGENTS.md logs.
  it('should handle no AI tool files present', async () => {
    // Execute update command with no AI tool files
    const consoleSpy = vi.spyOn(console, 'log');
    await updateCommand.execute(testDir);

    // Should only update PLX instructions - now itemized per file
    const allLogs = consoleSpy.mock.calls.map(c => c[0]).join('\n');
    expect(allLogs).toContain('Updated workspace/AGENTS.md');
    expect(allLogs).toContain('AGENTS.md');
    consoleSpy.mockRestore();
  });

  it('should update multiple AI tool files if present', async () => {
    // TODO: When additional configurators are added (Cursor, Aider, etc.),
    // enhance this test to create multiple AI tool files and verify
    // that all existing files are updated in a single operation.
    // For now, we test with just CLAUDE.md.
    const claudePath = path.join(testDir, 'CLAUDE.md');
    await fs.mkdir(path.dirname(claudePath), { recursive: true });
    await fs.writeFile(
      claudePath,
      '<!-- PLX:START -->\nOld\n<!-- PLX:END -->'
    );

    const consoleSpy = vi.spyOn(console, 'log');
    await updateCommand.execute(testDir);

    // Should report updating with new format - now itemized per file
    const allLogs = consoleSpy.mock.calls.map(c => c[0]).join('\n');
    expect(allLogs).toContain('Updated workspace/AGENTS.md');
    expect(allLogs).toContain('AGENTS.md');
    consoleSpy.mockRestore();
  });

  it('should create missing slash commands during update', async () => {
    const proposalPath = path.join(
      testDir,
      '.claude/commands/splx/plan-proposal.md'
    );
    await fs.mkdir(path.dirname(proposalPath), { recursive: true });
    await fs.writeFile(
      proposalPath,
      `---
name: OpenSplx: Proposal
description: Existing file
category: OpenSplx
tags: [splx, change]
---
<!-- PLX:START -->
Old content
<!-- PLX:END -->`
    );

    await updateCommand.execute(testDir);

    const implementExists = await FileSystemUtils.fileExists(
      path.join(testDir, '.claude/commands/splx/implement.md')
    );
    const archiveExists = await FileSystemUtils.fileExists(
      path.join(testDir, '.claude/commands/splx/archive.md')
    );

    // Now update creates missing files
    expect(implementExists).toBe(true);
    expect(archiveExists).toBe(true);
  });

  it('should never create new AI tool files', async () => {
    // Get all configurators
    const configurators = ToolRegistry.getAll();

    // Execute update command
    await updateCommand.execute(testDir);

    // Check that no new AI tool files were created
    for (const configurator of configurators) {
      const configPath = path.join(testDir, configurator.configFileName);
      const fileExists = await FileSystemUtils.fileExists(configPath);
      if (configurator.configFileName === 'AGENTS.md') {
        expect(fileExists).toBe(true);
      } else {
        expect(fileExists).toBe(false);
      }
    }
  });

  it('should update AGENTS.md in workspace directory', async () => {
    // Execute update command
    await updateCommand.execute(testDir);

    // Check that AGENTS.md was created/updated
    const agentsPath = path.join(testDir, 'workspace', 'AGENTS.md');
    const fileExists = await FileSystemUtils.fileExists(agentsPath);
    expect(fileExists).toBe(true);

    const content = await fs.readFile(agentsPath, 'utf-8');
    expect(content).toContain('# OpenSplx Instructions');
  });

  it('should create root AGENTS.md with managed block when missing', async () => {
    await updateCommand.execute(testDir);

    const rootAgentsPath = path.join(testDir, 'AGENTS.md');
    const exists = await FileSystemUtils.fileExists(rootAgentsPath);
    expect(exists).toBe(true);

    const content = await fs.readFile(rootAgentsPath, 'utf-8');
    expect(content).toContain('<!-- PLX:START -->');
    expect(content).toContain("/workspace/AGENTS.md");
    expect(content).toContain('splx update');
    expect(content).toContain('<!-- PLX:END -->');
  });

  it('should refresh root AGENTS.md while preserving surrounding content', async () => {
    const rootAgentsPath = path.join(testDir, 'AGENTS.md');
    const original = `# Custom intro\n\n<!-- PLX:START -->\nOld content\n<!-- PLX:END -->\n\n# Footnotes`;
    await fs.writeFile(rootAgentsPath, original);

    const consoleSpy = vi.spyOn(console, 'log');

    await updateCommand.execute(testDir);

    const updated = await fs.readFile(rootAgentsPath, 'utf-8');
    expect(updated).toContain('# Custom intro');
    expect(updated).toContain('# Footnotes');
    expect(updated).toContain("/workspace/AGENTS.md");
    expect(updated).toContain('splx update');
    expect(updated).not.toContain('Old content');

    // Check console output - now itemized per file
    const allLogs = consoleSpy.mock.calls.map(c => c[0]).join('\n');
    expect(allLogs).toContain('Updated workspace/AGENTS.md');
    expect(allLogs).toContain('Updated AGENTS.md');

    consoleSpy.mockRestore();
  });

  it('should create workspace directory during migration if it does not exist', async () => {
    // Remove workspace directory
    await fs.rm(path.join(testDir, 'workspace'), {
      recursive: true,
      force: true,
    });

    // Create a root file that needs migration
    await fs.writeFile(path.join(testDir, 'ARCHITECTURE.md'), 'root content');

    // Execute update command - migration creates workspace when files exist, so it should succeed
    await updateCommand.execute(testDir);

    // Verify workspace was created
    expect(await FileSystemUtils.directoryExists(path.join(testDir, 'workspace'))).toBe(true);
    // Verify file was migrated
    expect(await FileSystemUtils.fileExists(path.join(testDir, 'workspace', 'ARCHITECTURE.md'))).toBe(true);
    expect(await FileSystemUtils.fileExists(path.join(testDir, 'ARCHITECTURE.md'))).toBe(false);
  });

  // #FEEDBACK #TODO [TEST_QUALITY]: Weak error logging assertion - only checks that console.error was called but doesn't verify the error message content, format, or that it includes the failed file name.
  // #FEEDBACK #TODO [COVERAGE_GAP]: Missing verification that error logging follows itemized format and includes specific file path that failed.
  it('should handle configurator errors gracefully', async () => {
    // Create CLAUDE.md file but make it read-only to cause an error
    const claudePath = path.join(testDir, 'CLAUDE.md');
    await fs.writeFile(
      claudePath,
      '<!-- PLX:START -->\nOld\n<!-- PLX:END -->'
    );
    await fs.chmod(claudePath, 0o444); // Read-only

    const consoleSpy = vi.spyOn(console, 'log');
    const errorSpy = vi.spyOn(console, 'error');
    const originalWriteFile = FileSystemUtils.writeFile.bind(FileSystemUtils);
    const writeSpy = vi
      .spyOn(FileSystemUtils, 'writeFile')
      .mockImplementation(async (filePath, content) => {
        if (filePath.endsWith('CLAUDE.md')) {
          throw new Error('EACCES: permission denied, open');
        }

        return originalWriteFile(filePath, content);
      });

    // Execute update command - should not throw
    await updateCommand.execute(testDir);

    // Should report the failure
    expect(errorSpy).toHaveBeenCalled();
    // Check console output - now itemized per file
    const allLogs = consoleSpy.mock.calls.map(c => c[0]).join('\n');
    expect(allLogs).toContain('Updated workspace/AGENTS.md');
    expect(allLogs).toContain('AGENTS.md');
    // Failed to update is logged via console.error, checked above

    // Restore permissions for cleanup
    await fs.chmod(claudePath, 0o644);
    consoleSpy.mockRestore();
    errorSpy.mockRestore();
    writeSpy.mockRestore();
  });

  describe('root files migration', () => {
    // #FEEDBACK #TODO [TEST_QUALITY]: Logging assertion checks if both filenames appear in same log entry, doesn't verify if each file is logged separately as itemized entry or if they're combined in a single log message.
    // #FEEDBACK #TODO [COVERAGE_GAP]: Missing verification that migration logging follows itemized format per file, consistent with the new detailed logging approach.
    it('should migrate root files to workspace when they exist', async () => {
      // Create root files
      await fs.writeFile(path.join(testDir, 'ARCHITECTURE.md'), 'root architecture');
      await fs.writeFile(path.join(testDir, 'REVIEW.md'), 'root review');

      const consoleSpy = vi.spyOn(console, 'log');

      await updateCommand.execute(testDir);

      // Verify files migrated to workspace
      const workspaceArchPath = path.join(testDir, 'workspace', 'ARCHITECTURE.md');
      const workspaceReviewPath = path.join(testDir, 'workspace', 'REVIEW.md');
      expect(await FileSystemUtils.fileExists(workspaceArchPath)).toBe(true);
      expect(await FileSystemUtils.fileExists(workspaceReviewPath)).toBe(true);

      // Verify root files removed
      expect(await FileSystemUtils.fileExists(path.join(testDir, 'ARCHITECTURE.md'))).toBe(false);
      expect(await FileSystemUtils.fileExists(path.join(testDir, 'REVIEW.md'))).toBe(false);

      // Verify migration message logged
      const migrationLog = consoleSpy.mock.calls.find(call =>
        call[0]?.includes('Migrated') && call[0]?.includes('root file')
      );
      expect(migrationLog).toBeDefined();
      expect(migrationLog?.[0]).toContain('ARCHITECTURE.md');
      expect(migrationLog?.[0]).toContain('REVIEW.md');

      consoleSpy.mockRestore();
    });

    it('should keep workspace version when both root and workspace exist', async () => {
      // Create files in both locations
      await fs.writeFile(path.join(testDir, 'RELEASE.md'), 'root release');
      await fs.writeFile(path.join(testDir, 'workspace', 'RELEASE.md'), 'workspace release');

      const consoleSpy = vi.spyOn(console, 'log');

      await updateCommand.execute(testDir);

      // Verify workspace version preserved
      const workspaceReleasePath = path.join(testDir, 'workspace', 'RELEASE.md');
      const content = await fs.readFile(workspaceReleasePath, 'utf-8');
      expect(content).toBe('workspace release');

      // Verify root file deleted
      expect(await FileSystemUtils.fileExists(path.join(testDir, 'RELEASE.md'))).toBe(false);

      // Verify migration logged
      const migrationLog = consoleSpy.mock.calls.find(call => 
        call[0]?.includes('Migrated') && call[0]?.includes('RELEASE.md')
      );
      expect(migrationLog).toBeDefined();

      consoleSpy.mockRestore();
    });

    it('should be silent when no root files to migrate', async () => {
      const consoleSpy = vi.spyOn(console, 'log');

      await updateCommand.execute(testDir);

      // Verify no migration message
      const migrationLog = consoleSpy.mock.calls.find(call => 
        call[0]?.includes('Migrated') && call[0]?.includes('root file')
      );
      expect(migrationLog).toBeUndefined();

      consoleSpy.mockRestore();
    });

    it('should create workspace directory if it does not exist during migration', async () => {
      // Remove workspace directory
      await fs.rm(path.join(testDir, 'workspace'), {
        recursive: true,
        force: true,
      });

      // Create root file
      await fs.writeFile(path.join(testDir, 'TESTING.md'), 'root testing');

      await updateCommand.execute(testDir);

      // Verify workspace created and file migrated
      expect(await FileSystemUtils.directoryExists(path.join(testDir, 'workspace'))).toBe(true);
      expect(await FileSystemUtils.fileExists(path.join(testDir, 'workspace', 'TESTING.md'))).toBe(true);
      expect(await FileSystemUtils.fileExists(path.join(testDir, 'TESTING.md'))).toBe(false);
    });
  });

});
