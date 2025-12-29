import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { ParseFeedbackCommand } from '../../src/commands/parse-feedback.js';

// Hoist mock functions for ESM compatibility
const { mockInput, mockSelect, mockIsInteractive } = vi.hoisted(() => ({
  mockInput: vi.fn(),
  mockSelect: vi.fn(),
  mockIsInteractive: vi.fn(),
}));

vi.mock('@inquirer/prompts', () => ({
  input: mockInput,
  select: mockSelect,
}));

vi.mock('../../src/utils/interactive.js', () => ({
  isInteractive: mockIsInteractive,
}));

describe('ParseFeedbackCommand', () => {
  let tempDir: string;
  let originalCwd: string;
  let command: ParseFeedbackCommand;
  const originalConsoleLog = console.log;

  beforeEach(async () => {
    originalCwd = process.cwd();
    tempDir = path.join(os.tmpdir(), `parse-feedback-test-${Date.now()}`);
    await fs.mkdir(tempDir, { recursive: true });
    process.chdir(tempDir);

    // Create OpenSpec structure
    await fs.mkdir(path.join(tempDir, 'workspace', 'changes'), { recursive: true });
    await fs.mkdir(path.join(tempDir, 'workspace', 'reviews'), { recursive: true });
    await fs.mkdir(path.join(tempDir, 'workspace', 'specs'), { recursive: true });

    // Suppress console.log during tests
    console.log = vi.fn();

    // Reset process.exitCode
    process.exitCode = undefined;

    command = new ParseFeedbackCommand();
  });

  afterEach(async () => {
    console.log = originalConsoleLog;
    process.chdir(originalCwd);
    vi.clearAllMocks();
    mockInput.mockReset();
    mockSelect.mockReset();
    mockIsInteractive.mockReset();
    process.exitCode = undefined;
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  });

  async function createChange(changeId: string): Promise<void> {
    const changeDir = path.join(tempDir, 'workspace', 'changes', changeId);
    await fs.mkdir(changeDir, { recursive: true });
    await fs.writeFile(path.join(changeDir, 'proposal.md'), '# Proposal');
  }

  async function createSpec(specId: string): Promise<void> {
    const specDir = path.join(tempDir, 'workspace', 'specs', specId);
    await fs.mkdir(specDir, { recursive: true });
    await fs.writeFile(path.join(specDir, 'spec.md'), '# Spec');
  }

  async function createSourceWithMarker(relativePath: string, feedback: string): Promise<void> {
    const fullPath = path.join(tempDir, relativePath);
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, `// #FEEDBACK #TODO | ${feedback}\n`);
  }

  describe('non-interactive mode', () => {
    beforeEach(() => {
      mockIsInteractive.mockReturnValue(false);
    });

    it('fails without parent ID', async () => {
      await command.execute('my-review', { noInteractive: true });
      expect(process.exitCode).toBe(1);
    });

    it('fails without review name', async () => {
      await createChange('test-change');
      await command.execute(undefined, { noInteractive: true, changeId: 'test-change' });
      expect(process.exitCode).toBe(1);
    });

    it('validates review name format - rejects uppercase', async () => {
      await createChange('test-change');
      await command.execute('MyReview', { noInteractive: true, changeId: 'test-change' });
      expect(process.exitCode).toBe(1);
    });

    it('validates review name format - rejects spaces', async () => {
      await createChange('test-change');
      await command.execute('my review', { noInteractive: true, changeId: 'test-change' });
      expect(process.exitCode).toBe(1);
    });

    it('validates review name format - rejects underscores', async () => {
      await createChange('test-change');
      await command.execute('my_review', { noInteractive: true, changeId: 'test-change' });
      expect(process.exitCode).toBe(1);
    });

    it('accepts valid review name with hyphens and numbers', async () => {
      await createChange('test-change');
      await createSourceWithMarker('src/file.ts', 'Test feedback');
      await command.execute('my-review-123', {
        noInteractive: true,
        changeId: 'test-change',
      });
      expect(process.exitCode).not.toBe(1);
    });

    it('rejects existing review name', async () => {
      await createChange('test-change');
      // Create existing review
      const reviewDir = path.join(tempDir, 'workspace', 'reviews', 'existing-review');
      await fs.mkdir(path.join(reviewDir, 'tasks'), { recursive: true });
      await fs.writeFile(
        path.join(reviewDir, 'review.md'),
        '---\nparent-type: change\nparent-id: x\nreviewed-at: 2025-01-01T00:00:00Z\n---'
      );

      await command.execute('existing-review', {
        noInteractive: true,
        changeId: 'test-change',
      });
      expect(process.exitCode).toBe(1);
    });

    it('handles no markers found', async () => {
      await createChange('test-change');
      await command.execute('no-markers-review', {
        noInteractive: true,
        changeId: 'test-change',
      });

      // Should not fail, just inform no markers found
      expect(process.exitCode).not.toBe(1);
    });

    it('creates review when markers found', async () => {
      await createChange('test-change');
      await createSourceWithMarker('src/file.ts', 'Add validation');

      await command.execute('valid-review', {
        noInteractive: true,
        changeId: 'test-change',
      });

      // Check review was created
      const reviewPath = path.join(
        tempDir,
        'workspace',
        'reviews',
        'valid-review',
        'review.md'
      );
      const exists = await fs
        .access(reviewPath)
        .then(() => true)
        .catch(() => false);
      expect(exists).toBe(true);
    });

    it('creates tasks from markers', async () => {
      await createChange('test-change');
      await createSourceWithMarker('src/file.ts', 'First issue');
      await createSourceWithMarker('src/utils.ts', 'Second issue');

      await command.execute('tasks-review', {
        noInteractive: true,
        changeId: 'test-change',
      });

      const tasksDir = path.join(
        tempDir,
        'workspace',
        'reviews',
        'tasks-review',
        'tasks'
      );
      const tasks = await fs.readdir(tasksDir);
      expect(tasks).toHaveLength(2);
    });

    it('supports --spec-id option', async () => {
      await createSpec('cli-archive');
      await createSourceWithMarker('src/file.ts', 'Spec issue');

      await command.execute('spec-review', {
        noInteractive: true,
        specId: 'cli-archive',
      });

      const reviewPath = path.join(
        tempDir,
        'workspace',
        'reviews',
        'spec-review',
        'review.md'
      );
      const content = await fs.readFile(reviewPath, 'utf-8');
      expect(content).toContain('parent-type: spec');
      expect(content).toContain('parent-id: cli-archive');
    });

    it('supports --task-id option', async () => {
      await createChange('test-change');
      await createSourceWithMarker('src/file.ts', 'Task issue');

      await command.execute('task-review', {
        noInteractive: true,
        taskId: '001-implement-feature',
      });

      const reviewPath = path.join(
        tempDir,
        'workspace',
        'reviews',
        'task-review',
        'review.md'
      );
      const content = await fs.readFile(reviewPath, 'utf-8');
      expect(content).toContain('parent-type: task');
      expect(content).toContain('parent-id: 001-implement-feature');
    });
  });

  describe('JSON output', () => {
    beforeEach(() => {
      mockIsInteractive.mockReturnValue(false);
    });

    it('outputs error as JSON when parent missing', async () => {
      await command.execute('my-review', { noInteractive: true, json: true });
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('"error"')
      );
    });

    it('outputs no markers message as JSON', async () => {
      await createChange('test-change');
      await command.execute('no-markers', {
        noInteractive: true,
        json: true,
        changeId: 'test-change',
      });

      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('"markersFound":0')
      );
    });

    it('outputs review details as JSON', async () => {
      await createChange('test-change');
      await createSourceWithMarker('src/file.ts', 'Test feedback');

      await command.execute('json-review', {
        noInteractive: true,
        json: true,
        changeId: 'test-change',
      });

      const calls = (console.log as ReturnType<typeof vi.fn>).mock.calls;
      const jsonCall = calls.find((c) => c[0].includes('"reviewId"'));
      expect(jsonCall).toBeDefined();

      const output = JSON.parse(jsonCall![0]);
      expect(output.reviewId).toBe('json-review');
      expect(output.parentType).toBe('change');
      expect(output.parentId).toBe('test-change');
      expect(output.markersFound).toBe(1);
      expect(output.tasksCreated).toBe(1);
      expect(output.files).toContain('src/file.ts');
    });

    it('includes spec impacts in JSON output', async () => {
      await createChange('test-change');
      const srcDir = path.join(tempDir, 'src');
      await fs.mkdir(srcDir, { recursive: true });
      await fs.writeFile(
        path.join(srcDir, 'file.ts'),
        '// #FEEDBACK #TODO | Update spec (spec:cli-get-task)\n'
      );

      await command.execute('spec-impact-review', {
        noInteractive: true,
        json: true,
        changeId: 'test-change',
      });

      const calls = (console.log as ReturnType<typeof vi.fn>).mock.calls;
      const jsonCall = calls.find((c) => c[0].includes('"specImpacts"'));
      expect(jsonCall).toBeDefined();

      const output = JSON.parse(jsonCall![0]);
      expect(output.specImpacts).toContain('cli-get-task');
    });
  });

  describe('interactive mode', () => {
    beforeEach(() => {
      mockIsInteractive.mockReturnValue(true);
    });

    it('prompts for parent type when not specified', async () => {
      await createChange('test-change');

      mockSelect.mockResolvedValueOnce('change'); // Parent type
      mockSelect.mockResolvedValueOnce('test-change'); // Change selection
      mockInput.mockResolvedValueOnce('interactive-review'); // Review name

      await command.execute(undefined, {});

      expect(mockSelect).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'What are you reviewing?',
        })
      );
    });

    it('prompts for review name when not provided', async () => {
      await createChange('test-change');

      mockSelect.mockResolvedValueOnce('change');
      mockSelect.mockResolvedValueOnce('test-change');
      mockInput.mockResolvedValueOnce('prompted-review');

      await command.execute(undefined, {});

      expect(mockInput).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Enter a name for this review:',
        })
      );
    });

    it('validates review name in interactive prompt', async () => {
      await createChange('test-change');

      mockSelect.mockResolvedValueOnce('change');
      mockSelect.mockResolvedValueOnce('test-change');
      mockInput.mockResolvedValueOnce('valid-name');

      await command.execute(undefined, {});

      // Check that input validator was provided
      expect(mockInput.mock.calls.length).toBeGreaterThan(0);
      const inputCall = mockInput.mock.calls[0][0];
      expect(inputCall.validate).toBeDefined();

      // Test the validator
      expect(inputCall.validate('')).toBe('Review name is required');
      expect(inputCall.validate('INVALID')).toContain('lowercase');
      expect(inputCall.validate('valid-name')).toBe(true);
    });

    it('fails when no changes available', async () => {
      mockSelect.mockResolvedValueOnce('change');

      await command.execute(undefined, {});

      expect(process.exitCode).toBe(1);
    });

    it('fails when no specs available', async () => {
      mockSelect.mockResolvedValueOnce('spec');

      await command.execute(undefined, {});

      expect(process.exitCode).toBe(1);
    });

    it('prompts for task ID input', async () => {
      mockSelect.mockResolvedValueOnce('task');
      mockInput.mockResolvedValueOnce('001-my-task');
      mockInput.mockResolvedValueOnce('task-review');

      await command.execute(undefined, {});

      expect(mockInput).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Enter the task ID:',
        })
      );
    });
  });
});
