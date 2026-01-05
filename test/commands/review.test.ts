import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { ReviewCommand } from '../../src/commands/review.js';
import { createValidPlxWorkspace } from '../test-utils.js';

// Hoist mock functions for ESM compatibility
const { mockSelect, mockInput, mockIsInteractive } = vi.hoisted(() => ({
  mockSelect: vi.fn(),
  mockInput: vi.fn(),
  mockIsInteractive: vi.fn(),
}));

vi.mock('@inquirer/prompts', () => ({
  select: mockSelect,
  input: mockInput,
}));

vi.mock('../../src/utils/interactive.js', () => ({
  isInteractive: mockIsInteractive,
}));

describe('ReviewCommand', () => {
  let tempDir: string;
  let originalCwd: string;
  let command: ReviewCommand;
  const originalConsoleLog = console.log;

  beforeEach(async () => {
    originalCwd = process.cwd();
    tempDir = path.join(os.tmpdir(), `review-command-test-${Date.now()}`);
    await fs.mkdir(tempDir, { recursive: true });
    process.chdir(tempDir);

    // Create valid PLX workspace structure
    await createValidPlxWorkspace(tempDir);
    await fs.mkdir(path.join(tempDir, 'workspace', 'changes'), { recursive: true });
    await fs.mkdir(path.join(tempDir, 'workspace', 'specs'), { recursive: true });

    // Suppress console.log during tests
    console.log = vi.fn();

    // Reset process.exitCode
    process.exitCode = undefined;

    command = new ReviewCommand(tempDir);
  });

  afterEach(async () => {
    console.log = originalConsoleLog;
    process.chdir(originalCwd);
    vi.clearAllMocks();
    mockSelect.mockReset();
    mockInput.mockReset();
    mockIsInteractive.mockReset();
    process.exitCode = undefined;
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  });

  async function createChange(
    changeId: string,
    options: { proposal?: string; design?: string; tasks?: string[] } = {}
  ): Promise<void> {
    const changeDir = path.join(tempDir, 'workspace', 'changes', changeId);
    await fs.mkdir(path.join(changeDir, 'tasks'), { recursive: true });
    await fs.writeFile(
      path.join(changeDir, 'proposal.md'),
      options.proposal ?? `# ${changeId} Proposal\n\nProposal content`
    );
    if (options.design) {
      await fs.writeFile(path.join(changeDir, 'design.md'), options.design);
    }
    if (options.tasks) {
      for (let i = 0; i < options.tasks.length; i++) {
        const taskFile = `${String(i + 1).padStart(3, '0')}-task.md`;
        await fs.writeFile(
          path.join(changeDir, 'tasks', taskFile),
          options.tasks[i]
        );
      }
    }
  }

  async function createSpec(specId: string, content?: string): Promise<void> {
    const specDir = path.join(tempDir, 'workspace', 'specs', specId);
    await fs.mkdir(specDir, { recursive: true });
    await fs.writeFile(
      path.join(specDir, 'spec.md'),
      content ?? `# ${specId} Spec\n\nSpec content`
    );
  }

  async function createReviewMd(content?: string): Promise<void> {
    await fs.writeFile(
      path.join(tempDir, 'REVIEW.md'),
      content ?? '# Review Guidelines\n\nGuidelines content'
    );
  }

  describe('non-interactive mode', () => {
    beforeEach(() => {
      mockIsInteractive.mockReturnValue(false);
    });

    it('fails without parent specified', async () => {
      await command.execute({ noInteractive: true });
      expect(process.exitCode).toBe(1);
    });

    it('outputs usage help when parent missing', async () => {
      await command.execute({ noInteractive: true });
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('--change-id')
      );
    });

    it('outputs change documents with --change-id', async () => {
      await createChange('test-change', {
        proposal: '# Test Change\n\nProposal content',
      });

      await command.execute({ changeId: 'test-change', noInteractive: true });

      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Proposal: test-change')
      );
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Proposal content')
      );
    });

    it('outputs design.md if exists', async () => {
      await createChange('test-change', {
        design: '# Design\n\nDesign decisions',
      });

      await command.execute({ changeId: 'test-change', noInteractive: true });

      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Design')
      );
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Design decisions')
      );
    });

    it('outputs tasks if exist', async () => {
      await createChange('test-change', {
        tasks: ['# Task 1\n\nFirst task', '# Task 2\n\nSecond task'],
      });

      await command.execute({ changeId: 'test-change', noInteractive: true });

      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Tasks')
      );
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('First task')
      );
    });

    it('outputs spec with --spec-id', async () => {
      await createSpec('cli-archive', '# CLI Archive Spec\n\nSpec requirements');

      await command.execute({ specId: 'cli-archive', noInteractive: true });

      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Spec: cli-archive')
      );
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Spec requirements')
      );
    });

    it('handles missing spec', async () => {
      await command.execute({ specId: 'non-existent', noInteractive: true });

      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Spec not found')
      );
      expect(process.exitCode).toBe(1);
    });

    it('handles missing change', async () => {
      await command.execute({ changeId: 'non-existent', noInteractive: true });

      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Change not found')
      );
      expect(process.exitCode).toBe(1);
    });

    it('outputs task with parent change using --task-id', async () => {
      await createChange('test-change', {
        tasks: ['# Task: Implement feature\n\nTask details'],
      });

      await command.execute({ taskId: '001-task', noInteractive: true });

      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Task: 001-task.md')
      );
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Task details')
      );
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Parent Change: test-change')
      );
    });

    it('handles task not found', async () => {
      await createChange('test-change');

      await command.execute({ taskId: 'non-existent-task', noInteractive: true });

      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Task not found')
      );
      expect(process.exitCode).toBe(1);
    });

    it('includes REVIEW.md if exists', async () => {
      await createChange('test-change');
      await createReviewMd('# Review Guidelines\n\nCustom guidelines');

      await command.execute({ changeId: 'test-change', noInteractive: true });

      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('REVIEW.md')
      );
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Custom guidelines')
      );
    });

    it('shows hint when REVIEW.md missing', async () => {
      await createChange('test-change');

      await command.execute({ changeId: 'test-change', noInteractive: true });

      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('No REVIEW.md found')
      );
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('plx refine-review')
      );
    });

    it('outputs next steps', async () => {
      await createChange('test-change');

      await command.execute({ changeId: 'test-change', noInteractive: true });

      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Next Steps')
      );
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('#FEEDBACK #TODO')
      );
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('plx parse feedback')
      );
    });
  });

  describe('JSON output', () => {
    beforeEach(() => {
      mockIsInteractive.mockReturnValue(false);
    });

    it('outputs error as JSON when parent missing', async () => {
      await command.execute({ noInteractive: true, json: true });
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('"error"')
      );
    });

    it('outputs change documents as JSON', async () => {
      await createChange('test-change', {
        proposal: '# Proposal\n\nContent',
        design: '# Design\n\nDesign content',
        tasks: ['# Task 1'],
      });

      await command.execute({ changeId: 'test-change', json: true });

      const calls = (console.log as ReturnType<typeof vi.fn>).mock.calls;
      const jsonCall = calls.find((c) => c[0].includes('"parentType"'));
      expect(jsonCall).toBeDefined();

      const output = JSON.parse(jsonCall![0]);
      expect(output.parentType).toBe('change');
      expect(output.parentId).toBe('test-change');
      expect(output.documents).toBeDefined();
      expect(Array.isArray(output.documents)).toBe(true);
    });

    it('includes REVIEW.md in JSON documents', async () => {
      await createChange('test-change');
      await createReviewMd('# Guidelines');

      await command.execute({ changeId: 'test-change', json: true });

      const calls = (console.log as ReturnType<typeof vi.fn>).mock.calls;
      const jsonCall = calls.find((c) => c[0].includes('"documents"'));
      const output = JSON.parse(jsonCall![0]);

      const reviewDoc = output.documents.find(
        (d: { path: string }) => d.path === 'REVIEW.md'
      );
      expect(reviewDoc).toBeDefined();
      expect(reviewDoc.content).toContain('Guidelines');
    });

    it('includes proposal.md in JSON documents', async () => {
      await createChange('test-change', {
        proposal: '# Test Proposal\n\nDetails',
      });

      await command.execute({ changeId: 'test-change', json: true });

      const calls = (console.log as ReturnType<typeof vi.fn>).mock.calls;
      const jsonCall = calls.find((c) => c[0].includes('"documents"'));
      const output = JSON.parse(jsonCall![0]);

      const proposalDoc = output.documents.find((d: { path: string }) =>
        d.path.includes('proposal.md')
      );
      expect(proposalDoc).toBeDefined();
      expect(proposalDoc.content).toContain('Test Proposal');
    });

    it('includes spec in JSON documents', async () => {
      await createSpec('cli-archive', '# Archive Spec\n\nRequirements');

      await command.execute({ specId: 'cli-archive', json: true });

      const calls = (console.log as ReturnType<typeof vi.fn>).mock.calls;
      const jsonCall = calls.find((c) => c[0].includes('"documents"'));
      const output = JSON.parse(jsonCall![0]);

      expect(output.parentType).toBe('spec');
      expect(output.parentId).toBe('cli-archive');
      expect(output.documents.some((d: { path: string }) => d.path.includes('spec.md'))).toBe(
        true
      );
    });
  });

  describe('interactive mode', () => {
    beforeEach(() => {
      mockIsInteractive.mockReturnValue(true);
    });

    it('prompts for parent type when not specified', async () => {
      await createChange('test-change');

      mockSelect.mockResolvedValueOnce('change');
      mockSelect.mockResolvedValueOnce('test-change');

      await command.execute({});

      expect(mockSelect).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'What would you like to review?',
        })
      );
    });

    it('prompts for change selection', async () => {
      await createChange('change-a');
      await createChange('change-b');

      mockSelect.mockResolvedValueOnce('change');
      mockSelect.mockResolvedValueOnce('change-a');

      await command.execute({});

      expect(mockSelect).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Select the change to review:',
        })
      );
    });

    it('prompts for spec selection', async () => {
      await createSpec('spec-a');
      await createSpec('spec-b');

      mockSelect.mockResolvedValueOnce('spec');
      mockSelect.mockResolvedValueOnce('spec-a');

      await command.execute({});

      expect(mockSelect).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Select the spec to review:',
        })
      );
    });

    it('prompts for task ID input', async () => {
      mockSelect.mockResolvedValueOnce('task');
      mockInput.mockResolvedValueOnce('001-my-task');

      await createChange('test-change', {
        tasks: ['# Task 001'],
      });

      await command.execute({});

      expect(mockInput).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Enter the task ID to review:',
        })
      );
    });

    it('fails when no changes available', async () => {
      mockSelect.mockResolvedValueOnce('change');

      await command.execute({});

      expect(process.exitCode).toBe(1);
    });

    it('fails when no specs available', async () => {
      mockSelect.mockResolvedValueOnce('spec');

      await command.execute({});

      expect(process.exitCode).toBe(1);
    });

    it('validates task ID is not empty', async () => {
      mockSelect.mockResolvedValueOnce('task');
      mockInput.mockResolvedValueOnce('001-task');

      await createChange('test-change', { tasks: ['# Task'] });

      await command.execute({});

      expect(mockInput.mock.calls.length).toBeGreaterThan(0);
      const inputCall = mockInput.mock.calls[0][0];
      expect(inputCall.validate).toBeDefined();
      expect(inputCall.validate('')).toBe('Task ID is required');
      expect(inputCall.validate('  ')).toBe('Task ID is required');
      expect(inputCall.validate('001-task')).toBe(true);
    });
  });

  describe('edge cases', () => {
    beforeEach(() => {
      mockIsInteractive.mockReturnValue(false);
    });

    it('handles change without design.md', async () => {
      await createChange('no-design-change');

      await command.execute({ changeId: 'no-design-change', noInteractive: true });

      // Should not fail, design is optional
      expect(process.exitCode).toBeUndefined();
    });

    it('handles change without tasks', async () => {
      await createChange('no-tasks-change');

      await command.execute({ changeId: 'no-tasks-change', noInteractive: true });

      // Should not fail, tasks are optional
      expect(process.exitCode).toBeUndefined();
    });

    it('uses cwd when root not specified', async () => {
      await createChange('cwd-change');

      const cwdCommand = new ReviewCommand();
      await cwdCommand.execute({ changeId: 'cwd-change', noInteractive: true });

      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Proposal: cwd-change')
      );
    });
  });
});
