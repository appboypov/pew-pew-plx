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

    // Create workspace structure
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

  async function createSourceWithMarker(
    relativePath: string,
    feedback: string,
    parent?: { type: 'task' | 'change' | 'spec'; id: string }
  ): Promise<void> {
    const fullPath = path.join(tempDir, relativePath);
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    const parentPart = parent ? `${parent.type}:${parent.id} | ` : '';
    await fs.writeFile(fullPath, `// #FEEDBACK #TODO | ${parentPart}${feedback}\n`);
  }

  describe('non-interactive mode with unassigned markers', () => {
    beforeEach(() => {
      mockIsInteractive.mockReturnValue(false);
    });

    it('fails when markers have no parent and no CLI fallback provided', async () => {
      await createSourceWithMarker('src/file.ts', 'Unassigned feedback');

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
      await createSourceWithMarker('src/file.ts', 'Test', { type: 'change', id: 'test-change' });
      await command.execute('MyReview', { noInteractive: true, changeId: 'test-change' });
      expect(process.exitCode).toBe(1);
    });

    it('validates review name format - rejects spaces', async () => {
      await createChange('test-change');
      await createSourceWithMarker('src/file.ts', 'Test', { type: 'change', id: 'test-change' });
      await command.execute('my review', { noInteractive: true, changeId: 'test-change' });
      expect(process.exitCode).toBe(1);
    });

    it('validates review name format - rejects underscores', async () => {
      await createChange('test-change');
      await createSourceWithMarker('src/file.ts', 'Test', { type: 'change', id: 'test-change' });
      await command.execute('my_review', { noInteractive: true, changeId: 'test-change' });
      expect(process.exitCode).toBe(1);
    });

    it('accepts valid review name with hyphens and numbers', async () => {
      await createChange('test-change');
      await createSourceWithMarker('src/file.ts', 'Test feedback', {
        type: 'change',
        id: 'test-change',
      });
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

      await createSourceWithMarker('src/file.ts', 'Test', { type: 'change', id: 'test-change' });

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
  });

  describe('markers with parent linkage', () => {
    beforeEach(() => {
      mockIsInteractive.mockReturnValue(false);
    });

    it('creates review when markers have parent linkage', async () => {
      await createChange('test-change');
      await createSourceWithMarker('src/file.ts', 'Add validation', {
        type: 'change',
        id: 'test-change',
      });

      await command.execute('valid-review', { noInteractive: true });

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
      await createSourceWithMarker('src/file.ts', 'First issue', {
        type: 'change',
        id: 'test-change',
      });
      await createSourceWithMarker('src/utils.ts', 'Second issue', {
        type: 'change',
        id: 'test-change',
      });

      await command.execute('tasks-review', { noInteractive: true });

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

    it('groups markers by different parents into multiple reviews', async () => {
      await createChange('change-1');
      await createSpec('spec-1');
      await createSourceWithMarker('src/file1.ts', 'Change feedback', {
        type: 'change',
        id: 'change-1',
      });
      await createSourceWithMarker('src/file2.ts', 'Spec feedback', {
        type: 'spec',
        id: 'spec-1',
      });

      await command.execute('multi-review', { noInteractive: true });

      // Check both reviews were created with suffixed names
      const review1Path = path.join(
        tempDir,
        'workspace',
        'reviews',
        'multi-review-change-1',
        'review.md'
      );
      const review2Path = path.join(
        tempDir,
        'workspace',
        'reviews',
        'multi-review-spec-1',
        'review.md'
      );

      const review1Content = await fs.readFile(review1Path, 'utf-8');
      const review2Content = await fs.readFile(review2Path, 'utf-8');

      expect(review1Content).toContain('parent-type: change');
      expect(review1Content).toContain('parent-id: change-1');
      expect(review2Content).toContain('parent-type: spec');
      expect(review2Content).toContain('parent-id: spec-1');
    });
  });

  describe('unassigned markers with CLI fallback', () => {
    beforeEach(() => {
      mockIsInteractive.mockReturnValue(false);
    });

    it('uses --change-id as fallback for unassigned markers', async () => {
      await createChange('test-change');
      await createSourceWithMarker('src/file.ts', 'Unassigned feedback');

      await command.execute('change-fallback-review', {
        noInteractive: true,
        changeId: 'test-change',
      });

      const reviewPath = path.join(
        tempDir,
        'workspace',
        'reviews',
        'change-fallback-review',
        'review.md'
      );
      const content = await fs.readFile(reviewPath, 'utf-8');
      expect(content).toContain('parent-type: change');
      expect(content).toContain('parent-id: test-change');
    });

    it('uses --spec-id as fallback for unassigned markers', async () => {
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

    it('uses --task-id as fallback for unassigned markers', async () => {
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

    it('merges unassigned markers into existing group with same parent', async () => {
      await createChange('test-change');
      // One marker with parent linkage
      await createSourceWithMarker('src/file1.ts', 'Linked feedback', {
        type: 'change',
        id: 'test-change',
      });
      // One marker without parent linkage
      await createSourceWithMarker('src/file2.ts', 'Unassigned feedback');

      await command.execute('merged-review', {
        noInteractive: true,
        changeId: 'test-change',
      });

      // Should create single review with both markers
      const tasksDir = path.join(
        tempDir,
        'workspace',
        'reviews',
        'merged-review',
        'tasks'
      );
      const tasks = await fs.readdir(tasksDir);
      expect(tasks).toHaveLength(2);
    });
  });

  describe('JSON output', () => {
    beforeEach(() => {
      mockIsInteractive.mockReturnValue(false);
    });

    it('outputs error as JSON when unassigned markers without fallback', async () => {
      await createSourceWithMarker('src/file.ts', 'Unassigned feedback');

      await command.execute('my-review', { noInteractive: true, json: true });
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('"error"')
      );
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('"unassignedMarkers"')
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
        expect.stringContaining('"totalMarkers":0')
      );
    });

    it('outputs multi-review details as JSON', async () => {
      await createChange('test-change');
      await createSourceWithMarker('src/file.ts', 'Test feedback', {
        type: 'change',
        id: 'test-change',
      });

      await command.execute('json-review', {
        noInteractive: true,
        json: true,
      });

      const calls = (console.log as ReturnType<typeof vi.fn>).mock.calls;
      const jsonCall = calls.find((c) => c[0].includes('"reviews"'));
      expect(jsonCall).toBeDefined();

      const output = JSON.parse(jsonCall![0]);
      expect(output.reviews).toHaveLength(1);
      expect(output.reviews[0].reviewId).toBe('json-review');
      expect(output.reviews[0].parentType).toBe('change');
      expect(output.reviews[0].parentId).toBe('test-change');
      expect(output.reviews[0].markersFound).toBe(1);
      expect(output.reviews[0].tasksCreated).toBe(1);
      expect(output.reviews[0].files).toContain('src/file.ts');
      expect(output.totalMarkers).toBe(1);
      expect(output.totalTasks).toBe(1);
    });

    it('outputs multiple reviews in JSON when markers have different parents', async () => {
      await createChange('change-1');
      await createSpec('spec-1');
      await createSourceWithMarker('src/file1.ts', 'Change feedback', {
        type: 'change',
        id: 'change-1',
      });
      await createSourceWithMarker('src/file2.ts', 'Spec feedback', {
        type: 'spec',
        id: 'spec-1',
      });

      await command.execute('multi-json-review', {
        noInteractive: true,
        json: true,
      });

      const calls = (console.log as ReturnType<typeof vi.fn>).mock.calls;
      const jsonCall = calls.find((c) => c[0].includes('"reviews"'));
      expect(jsonCall).toBeDefined();

      const output = JSON.parse(jsonCall![0]);
      expect(output.reviews).toHaveLength(2);
      expect(output.totalMarkers).toBe(2);
      expect(output.totalTasks).toBe(2);
    });
  });

  describe('interactive mode', () => {
    beforeEach(() => {
      mockIsInteractive.mockReturnValue(true);
    });

    it('prompts for parent for unassigned markers', async () => {
      await createChange('test-change');
      await createSourceWithMarker('src/file.ts', 'Unassigned feedback');

      mockSelect.mockResolvedValueOnce('change'); // Parent type
      mockSelect.mockResolvedValueOnce('test-change'); // Change selection
      mockInput.mockResolvedValueOnce('interactive-review'); // Review name

      await command.execute(undefined, {});

      expect(mockSelect).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('marker(s) have no parent'),
        })
      );
    });

    it('prompts for review name when not provided', async () => {
      await createChange('test-change');
      await createSourceWithMarker('src/file.ts', 'Test feedback', {
        type: 'change',
        id: 'test-change',
      });

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
      await createSourceWithMarker('src/file.ts', 'Test feedback', {
        type: 'change',
        id: 'test-change',
      });

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

    it('fails when no changes available for unassigned markers', async () => {
      await createSourceWithMarker('src/file.ts', 'Unassigned feedback');
      mockSelect.mockResolvedValueOnce('change');

      await command.execute(undefined, {});

      expect(process.exitCode).toBe(1);
    });

    it('fails when no specs available for unassigned markers', async () => {
      await createSourceWithMarker('src/file.ts', 'Unassigned feedback');
      mockSelect.mockResolvedValueOnce('spec');

      await command.execute(undefined, {});

      expect(process.exitCode).toBe(1);
    });

    it('prompts for task ID input for unassigned markers', async () => {
      await createSourceWithMarker('src/file.ts', 'Unassigned feedback');

      mockSelect.mockResolvedValueOnce('task');
      mockInput.mockResolvedValueOnce('001-my-task');
      mockInput.mockResolvedValueOnce('task-review');

      await command.execute(undefined, {});

      expect(mockInput).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Enter the task ID for unassigned markers:',
        })
      );
    });
  });
});
