import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import { execSync } from 'child_process';

describe('act next command', () => {
  const projectRoot = process.cwd();
  const testDir = path.join(projectRoot, 'test-act-command-tmp');
  const changesDir = path.join(testDir, 'openspec', 'changes');
  const openspecBin = path.join(projectRoot, 'bin', 'openspec.js');

  beforeEach(async () => {
    await fs.mkdir(changesDir, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
  });

  describe('basic invocation', () => {
    it('shows "No active changes found" when no changes exist', () => {
      const originalCwd = process.cwd();
      try {
        process.chdir(testDir);
        const output = execSync(`node ${openspecBin} act next 2>&1`, {
          encoding: 'utf-8',
        });
        expect(output).toContain('No active changes found');
      } finally {
        process.chdir(originalCwd);
      }
    });

    it('shows next task with change context', async () => {
      const changeDir = path.join(changesDir, 'test-change');
      const tasksDir = path.join(changeDir, 'tasks');
      await fs.mkdir(tasksDir, { recursive: true });

      await fs.writeFile(
        path.join(changeDir, 'proposal.md'),
        '# Change: Test Change\n\n## Why\nTest\n\n## What Changes\n- Test'
      );
      await fs.writeFile(
        path.join(tasksDir, '001-first-task.md'),
        `---
status: to-do
---

# Task: First Task

## Implementation Checklist
- [ ] Do something
`
      );

      const originalCwd = process.cwd();
      try {
        process.chdir(testDir);
        const output = execSync(`node ${openspecBin} act next`, {
          encoding: 'utf-8',
        });
        expect(output).toContain('Proposal: test-change');
        expect(output).toContain('Task 1: first-task');
        expect(output).toContain('Do something');
      } finally {
        process.chdir(originalCwd);
      }
    });

    it('shows "All tasks complete" when all tasks are done', async () => {
      const changeDir = path.join(changesDir, 'test-change');
      const tasksDir = path.join(changeDir, 'tasks');
      await fs.mkdir(tasksDir, { recursive: true });

      await fs.writeFile(
        path.join(changeDir, 'proposal.md'),
        '# Change: Test Change\n\n## Why\nTest\n\n## What Changes\n- Test'
      );
      await fs.writeFile(
        path.join(tasksDir, '001-first-task.md'),
        `---
status: done
---

# Task: First Task

## Implementation Checklist
- [x] Done
`
      );

      const originalCwd = process.cwd();
      try {
        process.chdir(testDir);
        const output = execSync(`node ${openspecBin} act next 2>&1`, {
          encoding: 'utf-8',
        });
        expect(output).toContain('All tasks complete');
      } finally {
        process.chdir(originalCwd);
      }
    });
  });

  describe('--json flag', () => {
    it('outputs valid JSON with task info', async () => {
      const changeDir = path.join(changesDir, 'test-change');
      const tasksDir = path.join(changeDir, 'tasks');
      await fs.mkdir(tasksDir, { recursive: true });

      await fs.writeFile(
        path.join(changeDir, 'proposal.md'),
        '# Change: Test Change\n\n## Why\nTest\n\n## What Changes\n- Test'
      );
      await fs.writeFile(
        path.join(tasksDir, '001-first-task.md'),
        `---
status: in-progress
---

# Task: First Task

## Implementation Checklist
- [ ] Do something
`
      );

      const originalCwd = process.cwd();
      try {
        process.chdir(testDir);
        const output = execSync(`node ${openspecBin} act next --json`, {
          encoding: 'utf-8',
        });
        const json = JSON.parse(output);
        expect(json.changeId).toBe('test-change');
        expect(json.task).toBeDefined();
        expect(json.task.filename).toBe('001-first-task.md');
        expect(json.task.sequence).toBe(1);
        expect(json.task.name).toBe('first-task');
        expect(json.task.status).toBe('in-progress');
        expect(json.taskContent).toContain('First Task');
        expect(json.changeDocuments).toBeDefined();
        expect(json.changeDocuments.proposal).toContain('Test Change');
      } finally {
        process.chdir(originalCwd);
      }
    });

    it('outputs JSON with error when no changes exist', () => {
      const originalCwd = process.cwd();
      try {
        process.chdir(testDir);
        const output = execSync(`node ${openspecBin} act next --json`, {
          encoding: 'utf-8',
        });
        const json = JSON.parse(output);
        expect(json.error).toBe('No active changes found');
      } finally {
        process.chdir(originalCwd);
      }
    });
  });

  describe('--did-complete-previous flag', () => {
    it('completes in-progress task and advances to next', async () => {
      const changeDir = path.join(changesDir, 'test-change');
      const tasksDir = path.join(changeDir, 'tasks');
      await fs.mkdir(tasksDir, { recursive: true });

      await fs.writeFile(
        path.join(changeDir, 'proposal.md'),
        '# Change: Test Change\n\n## Why\nTest\n\n## What Changes\n- Test'
      );
      await fs.writeFile(
        path.join(tasksDir, '001-first-task.md'),
        `---
status: in-progress
---

# Task: First Task

## Implementation Checklist
- [ ] Do something
`
      );
      await fs.writeFile(
        path.join(tasksDir, '002-second-task.md'),
        `---
status: to-do
---

# Task: Second Task

## Implementation Checklist
- [ ] Do something else
`
      );

      const originalCwd = process.cwd();
      try {
        process.chdir(testDir);
        const output = execSync(
          `node ${openspecBin} act next --did-complete-previous`,
          { encoding: 'utf-8' }
        );

        // Should show second task
        expect(output).toContain('Task 2: second-task');
        expect(output).toContain('Do something else');

        // Should NOT show proposal (only task with --did-complete-previous)
        expect(output).not.toContain('Proposal:');

        // Verify first task is now done
        const firstTaskContent = await fs.readFile(
          path.join(tasksDir, '001-first-task.md'),
          'utf-8'
        );
        expect(firstTaskContent).toContain('status: done');

        // Verify second task is now in-progress
        const secondTaskContent = await fs.readFile(
          path.join(tasksDir, '002-second-task.md'),
          'utf-8'
        );
        expect(secondTaskContent).toContain('status: in-progress');
      } finally {
        process.chdir(originalCwd);
      }
    });

    it('warns when no in-progress task exists', async () => {
      const changeDir = path.join(changesDir, 'test-change');
      const tasksDir = path.join(changeDir, 'tasks');
      await fs.mkdir(tasksDir, { recursive: true });

      await fs.writeFile(
        path.join(changeDir, 'proposal.md'),
        '# Change: Test Change\n\n## Why\nTest\n\n## What Changes\n- Test'
      );
      await fs.writeFile(
        path.join(tasksDir, '001-first-task.md'),
        `---
status: to-do
---

# Task: First Task

## Implementation Checklist
- [ ] Do something
`
      );

      const originalCwd = process.cwd();
      try {
        process.chdir(testDir);
        const output = execSync(
          `node ${openspecBin} act next --did-complete-previous 2>&1`,
          { encoding: 'utf-8' }
        );
        expect(output).toContain('No in-progress task found');
        expect(output).toContain('Task 1: first-task');

        // Verify task is now in-progress
        const taskContent = await fs.readFile(
          path.join(tasksDir, '001-first-task.md'),
          'utf-8'
        );
        expect(taskContent).toContain('status: in-progress');
      } finally {
        process.chdir(originalCwd);
      }
    });
  });

  describe('change prioritization', () => {
    it('selects change with highest completion percentage', async () => {
      // Create change-a with 25% completion (1/4 tasks)
      const changeA = path.join(changesDir, 'change-a');
      const tasksA = path.join(changeA, 'tasks');
      await fs.mkdir(tasksA, { recursive: true });
      await fs.writeFile(
        path.join(changeA, 'proposal.md'),
        '# Change: A\n\n## Why\nTest\n\n## What Changes\n- Test'
      );
      await fs.writeFile(
        path.join(tasksA, '001-task.md'),
        `# Task
## Implementation Checklist
- [x] Done
- [ ] Not done
- [ ] Not done
- [ ] Not done
`
      );

      // Create change-b with 75% completion (3/4 tasks)
      const changeB = path.join(changesDir, 'change-b');
      const tasksB = path.join(changeB, 'tasks');
      await fs.mkdir(tasksB, { recursive: true });
      await fs.writeFile(
        path.join(changeB, 'proposal.md'),
        '# Change: B\n\n## Why\nTest\n\n## What Changes\n- Test'
      );
      await fs.writeFile(
        path.join(tasksB, '001-task.md'),
        `# Task
## Implementation Checklist
- [x] Done
- [x] Done
- [x] Done
- [ ] Not done
`
      );

      const originalCwd = process.cwd();
      try {
        process.chdir(testDir);
        const output = execSync(`node ${openspecBin} act next --json`, {
          encoding: 'utf-8',
        });
        const json = JSON.parse(output);
        expect(json.changeId).toBe('change-b');
      } finally {
        process.chdir(originalCwd);
      }
    });
  });

  describe('in-progress task selection', () => {
    it('selects in-progress task over to-do task', async () => {
      const changeDir = path.join(changesDir, 'test-change');
      const tasksDir = path.join(changeDir, 'tasks');
      await fs.mkdir(tasksDir, { recursive: true });

      await fs.writeFile(
        path.join(changeDir, 'proposal.md'),
        '# Change: Test\n\n## Why\nTest\n\n## What Changes\n- Test'
      );
      await fs.writeFile(
        path.join(tasksDir, '001-done.md'),
        `---
status: done
---

# Task: Done
## Implementation Checklist
- [x] Done
`
      );
      await fs.writeFile(
        path.join(tasksDir, '002-in-progress.md'),
        `---
status: in-progress
---

# Task: In Progress
## Implementation Checklist
- [ ] Working on it
`
      );
      await fs.writeFile(
        path.join(tasksDir, '003-todo.md'),
        `---
status: to-do
---

# Task: Todo
## Implementation Checklist
- [ ] Not started
`
      );

      const originalCwd = process.cwd();
      try {
        process.chdir(testDir);
        const output = execSync(`node ${openspecBin} act next --json`, {
          encoding: 'utf-8',
        });
        const json = JSON.parse(output);
        expect(json.task.filename).toBe('002-in-progress.md');
        expect(json.task.status).toBe('in-progress');
      } finally {
        process.chdir(originalCwd);
      }
    });
  });
});
