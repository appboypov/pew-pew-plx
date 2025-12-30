import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { ListCommand } from '../../src/core/list.js';

describe('ListCommand', () => {
  let tempDir: string;
  let originalLog: typeof console.log;
  let logOutput: string[] = [];

  beforeEach(async () => {
    // Create temp directory
    tempDir = path.join(os.tmpdir(), `plx-list-test-${Date.now()}`);
    await fs.mkdir(tempDir, { recursive: true });

    // Mock console.log to capture output
    originalLog = console.log;
    console.log = (...args: any[]) => {
      logOutput.push(args.join(' '));
    };
    logOutput = [];
  });

  afterEach(async () => {
    // Restore console.log
    console.log = originalLog;

    // Clean up temp directory
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  describe('execute', () => {
    it('should handle missing workspace/changes directory', async () => {
      const listCommand = new ListCommand();
      
      await expect(listCommand.execute(tempDir, 'changes')).rejects.toThrow(
        "No PLX changes directory found. Run 'plx init' first."
      );
    });

    it('should handle empty changes directory', async () => {
      const changesDir = path.join(tempDir, 'workspace', 'changes');
      await fs.mkdir(changesDir, { recursive: true });

      const listCommand = new ListCommand();
      await listCommand.execute(tempDir, 'changes');

      expect(logOutput).toEqual(['No active changes found.']);
    });

    it('should exclude archive directory', async () => {
      const changesDir = path.join(tempDir, 'workspace', 'changes');
      await fs.mkdir(path.join(changesDir, 'archive'), { recursive: true });
      await fs.mkdir(path.join(changesDir, 'my-change'), { recursive: true });

      // Create proposal.md (required for change detection)
      await fs.writeFile(
        path.join(changesDir, 'my-change', 'proposal.md'),
        '# Change: My Change\n\n## Why\nTest\n\n## What Changes\nTest'
      );

      // Create tasks.md with some tasks
      await fs.writeFile(
        path.join(changesDir, 'my-change', 'tasks.md'),
        '- [x] Task 1\n- [ ] Task 2\n'
      );

      const listCommand = new ListCommand();
      await listCommand.execute(tempDir, 'changes');

      expect(logOutput).toContain('Changes:');
      expect(logOutput.some(line => line.includes('my-change'))).toBe(true);
      expect(logOutput.some(line => line.includes('archive'))).toBe(false);
    });

    it('should count tasks correctly', async () => {
      const changesDir = path.join(tempDir, 'workspace', 'changes');
      await fs.mkdir(path.join(changesDir, 'test-change'), { recursive: true });

      // Create proposal.md (required for change detection)
      await fs.writeFile(
        path.join(changesDir, 'test-change', 'proposal.md'),
        '# Change: Test Change\n\n## Why\nTest\n\n## What Changes\nTest'
      );

      await fs.writeFile(
        path.join(changesDir, 'test-change', 'tasks.md'),
        `# Tasks
- [x] Completed task 1
- [x] Completed task 2
- [ ] Incomplete task 1
- [ ] Incomplete task 2
- [ ] Incomplete task 3
Regular text that should be ignored
`
      );

      const listCommand = new ListCommand();
      await listCommand.execute(tempDir, 'changes');

      expect(logOutput.some(line => line.includes('2/5 tasks'))).toBe(true);
    });

    it('should show complete status for fully completed changes', async () => {
      const changesDir = path.join(tempDir, 'workspace', 'changes');
      await fs.mkdir(path.join(changesDir, 'completed-change'), { recursive: true });

      // Create proposal.md (required for change detection)
      await fs.writeFile(
        path.join(changesDir, 'completed-change', 'proposal.md'),
        '# Change: Completed Change\n\n## Why\nTest\n\n## What Changes\nTest'
      );

      await fs.writeFile(
        path.join(changesDir, 'completed-change', 'tasks.md'),
        '- [x] Task 1\n- [x] Task 2\n- [x] Task 3\n'
      );

      const listCommand = new ListCommand();
      await listCommand.execute(tempDir, 'changes');

      expect(logOutput.some(line => line.includes('✓ Complete'))).toBe(true);
    });

    it('should handle changes without tasks.md', async () => {
      const changesDir = path.join(tempDir, 'workspace', 'changes');
      await fs.mkdir(path.join(changesDir, 'no-tasks'), { recursive: true });

      // Create proposal.md (required for change detection)
      await fs.writeFile(
        path.join(changesDir, 'no-tasks', 'proposal.md'),
        '# Change: No Tasks\n\n## Why\nTest\n\n## What Changes\nTest'
      );

      const listCommand = new ListCommand();
      await listCommand.execute(tempDir, 'changes');

      expect(logOutput.some(line => line.includes('no-tasks') && line.includes('No tasks'))).toBe(true);
    });

    it('should sort changes alphabetically', async () => {
      const changesDir = path.join(tempDir, 'workspace', 'changes');
      await fs.mkdir(path.join(changesDir, 'zebra'), { recursive: true });
      await fs.mkdir(path.join(changesDir, 'alpha'), { recursive: true });
      await fs.mkdir(path.join(changesDir, 'middle'), { recursive: true });

      // Create proposal.md for each change (required for change detection)
      await fs.writeFile(
        path.join(changesDir, 'zebra', 'proposal.md'),
        '# Change: Zebra\n\n## Why\nTest\n\n## What Changes\nTest'
      );
      await fs.writeFile(
        path.join(changesDir, 'alpha', 'proposal.md'),
        '# Change: Alpha\n\n## Why\nTest\n\n## What Changes\nTest'
      );
      await fs.writeFile(
        path.join(changesDir, 'middle', 'proposal.md'),
        '# Change: Middle\n\n## Why\nTest\n\n## What Changes\nTest'
      );

      const listCommand = new ListCommand();
      await listCommand.execute(tempDir);

      const changeLines = logOutput.filter(line => 
        line.includes('alpha') || line.includes('middle') || line.includes('zebra')
      );
      
      expect(changeLines[0]).toContain('alpha');
      expect(changeLines[1]).toContain('middle');
      expect(changeLines[2]).toContain('zebra');
    });

    it('should handle multiple changes with various states', async () => {
      const changesDir = path.join(tempDir, 'workspace', 'changes');

      // Complete change
      await fs.mkdir(path.join(changesDir, 'completed'), { recursive: true });
      await fs.writeFile(
        path.join(changesDir, 'completed', 'proposal.md'),
        '# Change: Completed\n\n## Why\nTest\n\n## What Changes\nTest'
      );
      await fs.writeFile(
        path.join(changesDir, 'completed', 'tasks.md'),
        '- [x] Task 1\n- [x] Task 2\n'
      );

      // Partial change
      await fs.mkdir(path.join(changesDir, 'partial'), { recursive: true });
      await fs.writeFile(
        path.join(changesDir, 'partial', 'proposal.md'),
        '# Change: Partial\n\n## Why\nTest\n\n## What Changes\nTest'
      );
      await fs.writeFile(
        path.join(changesDir, 'partial', 'tasks.md'),
        '- [x] Done\n- [ ] Not done\n- [ ] Also not done\n'
      );

      // No tasks
      await fs.mkdir(path.join(changesDir, 'no-tasks'), { recursive: true });
      await fs.writeFile(
        path.join(changesDir, 'no-tasks', 'proposal.md'),
        '# Change: No Tasks\n\n## Why\nTest\n\n## What Changes\nTest'
      );

      const listCommand = new ListCommand();
      await listCommand.execute(tempDir);

      expect(logOutput).toContain('Changes:');
      expect(logOutput.some(line => line.includes('completed') && line.includes('✓ Complete'))).toBe(true);
      expect(logOutput.some(line => line.includes('partial') && line.includes('1/3 tasks'))).toBe(true);
      expect(logOutput.some(line => line.includes('no-tasks') && line.includes('No tasks'))).toBe(true);
    });

    it('should display tracked issue IDs from proposal frontmatter', async () => {
      const changesDir = path.join(tempDir, 'workspace', 'changes');
      await fs.mkdir(path.join(changesDir, 'with-issue'), { recursive: true });

      const proposal = `---
tracked-issues:
  - tracker: linear
    id: PROJ-123
    url: https://linear.app/proj/issue/PROJ-123
---

# Change: Test

## Why
Test

## What Changes
Test`;
      await fs.writeFile(path.join(changesDir, 'with-issue', 'proposal.md'), proposal);

      const listCommand = new ListCommand();
      await listCommand.execute(tempDir, 'changes');

      expect(logOutput.some(line => line.includes('with-issue') && line.includes('(PROJ-123)'))).toBe(true);
    });

    it('should align columns correctly when changes have different issue ID lengths', async () => {
      const changesDir = path.join(tempDir, 'workspace', 'changes');

      // Change with short issue ID
      await fs.mkdir(path.join(changesDir, 'short'), { recursive: true });
      const shortProposal = `---
tracked-issues:
  - tracker: linear
    id: A-1
    url: https://example.com/A-1
---
# Change: Short`;
      await fs.writeFile(path.join(changesDir, 'short', 'proposal.md'), shortProposal);
      await fs.writeFile(path.join(changesDir, 'short', 'tasks.md'), '- [x] Done\n');

      // Change with long issue ID
      await fs.mkdir(path.join(changesDir, 'long'), { recursive: true });
      const longProposal = `---
tracked-issues:
  - tracker: linear
    id: PROJECT-12345
    url: https://example.com/PROJECT-12345
---
# Change: Long`;
      await fs.writeFile(path.join(changesDir, 'long', 'proposal.md'), longProposal);
      await fs.writeFile(path.join(changesDir, 'long', 'tasks.md'), '- [x] Done\n');

      // Change without issue
      await fs.mkdir(path.join(changesDir, 'no-issue'), { recursive: true });
      await fs.writeFile(path.join(changesDir, 'no-issue', 'proposal.md'), '# Change: No Issue');
      await fs.writeFile(path.join(changesDir, 'no-issue', 'tasks.md'), '- [x] Done\n');

      const listCommand = new ListCommand();
      await listCommand.execute(tempDir, 'changes');

      // Find the lines with status info
      const statusLines = logOutput.filter(line => line.includes('✓ Complete'));

      // All status indicators should be aligned (start at same column position)
      const statusPositions = statusLines.map(line => line.indexOf('✓ Complete'));
      const uniquePositions = [...new Set(statusPositions)];

      // All status indicators should be at the same position (aligned)
      expect(uniquePositions.length).toBe(1);
    });

    it('should handle changes without tracked issues in alignment calculation', async () => {
      const changesDir = path.join(tempDir, 'workspace', 'changes');

      // Mix of changes with and without issues
      await fs.mkdir(path.join(changesDir, 'alpha-with-issue'), { recursive: true });
      const withIssue = `---
tracked-issues:
  - tracker: github
    id: GH-999
    url: https://github.com/org/repo/issues/999
---
# Change`;
      await fs.writeFile(path.join(changesDir, 'alpha-with-issue', 'proposal.md'), withIssue);

      await fs.mkdir(path.join(changesDir, 'beta-no-issue'), { recursive: true });
      await fs.writeFile(path.join(changesDir, 'beta-no-issue', 'proposal.md'), '# Change');

      const listCommand = new ListCommand();
      await listCommand.execute(tempDir, 'changes');

      // Verify both are displayed
      expect(logOutput.some(line => line.includes('alpha-with-issue') && line.includes('(GH-999)'))).toBe(true);
      expect(logOutput.some(line => line.includes('beta-no-issue'))).toBe(true);
      expect(logOutput.some(line => line.includes('beta-no-issue') && line.includes('('))).toBe(false);
    });
  });
});