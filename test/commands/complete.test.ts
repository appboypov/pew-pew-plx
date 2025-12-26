import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import { execSync } from 'child_process';

describe('complete task command', () => {
  const projectRoot = process.cwd();
  const testDir = path.join(projectRoot, 'test-complete-task-tmp');
  const changesDir = path.join(testDir, 'openspec', 'changes');
  const openspecBin = path.join(projectRoot, 'bin', 'openspec.js');

  beforeEach(async () => {
    await fs.mkdir(changesDir, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
  });

  it('completes a task by ID', async () => {
    const changeDir = path.join(changesDir, 'test-change');
    const tasksDir = path.join(changeDir, 'tasks');
    await fs.mkdir(tasksDir, { recursive: true });

    await fs.writeFile(
      path.join(changeDir, 'proposal.md'),
      '# Change: Test\n\n## Why\nTest\n\n## What Changes\n- Test'
    );
    await fs.writeFile(
      path.join(tasksDir, '001-my-task.md'),
      `---
status: in-progress
---

# Task: My Task

## Implementation Checklist
- [ ] First item
- [ ] Second item
`
    );

    const originalCwd = process.cwd();
    try {
      process.chdir(testDir);
      const output = execSync(
        `node ${openspecBin} complete task --id 001-my-task --json`,
        { encoding: 'utf-8' }
      );
      const json = JSON.parse(output);

      expect(json.taskId).toBe('001-my-task');
      expect(json.previousStatus).toBe('in-progress');
      expect(json.newStatus).toBe('done');
      expect(json.completedItems).toContain('First item');
      expect(json.completedItems).toContain('Second item');

      // Verify file was updated
      const taskContent = await fs.readFile(
        path.join(tasksDir, '001-my-task.md'),
        'utf-8'
      );
      expect(taskContent).toContain('status: done');
      expect(taskContent).toContain('[x] First item');
      expect(taskContent).toContain('[x] Second item');
    } finally {
      process.chdir(originalCwd);
    }
  });

  it('returns error when task not found', async () => {
    const changeDir = path.join(changesDir, 'test-change');
    const tasksDir = path.join(changeDir, 'tasks');
    await fs.mkdir(tasksDir, { recursive: true });

    await fs.writeFile(
      path.join(changeDir, 'proposal.md'),
      '# Change: Test\n\n## Why\nTest\n\n## What Changes\n- Test'
    );

    const originalCwd = process.cwd();
    try {
      process.chdir(testDir);
      try {
        execSync(
          `node ${openspecBin} complete task --id nonexistent --json`,
          { encoding: 'utf-8' }
        );
      } catch (error: any) {
        const json = JSON.parse(error.stdout);
        expect(json.error).toContain('Task not found');
      }
    } finally {
      process.chdir(originalCwd);
    }
  });

  it('warns when task already complete', async () => {
    const changeDir = path.join(changesDir, 'test-change');
    const tasksDir = path.join(changeDir, 'tasks');
    await fs.mkdir(tasksDir, { recursive: true });

    await fs.writeFile(
      path.join(changeDir, 'proposal.md'),
      '# Change: Test\n\n## Why\nTest\n\n## What Changes\n- Test'
    );
    await fs.writeFile(
      path.join(tasksDir, '001-done-task.md'),
      `---
status: done
---

# Task: Done Task

## Implementation Checklist
- [x] Already done
`
    );

    const originalCwd = process.cwd();
    try {
      process.chdir(testDir);
      const output = execSync(
        `node ${openspecBin} complete task --id 001-done-task --json`,
        { encoding: 'utf-8' }
      );
      const json = JSON.parse(output);

      expect(json.warning).toContain('already complete');
    } finally {
      process.chdir(originalCwd);
    }
  });

  it('completes task with full ID format (changeId/taskName)', async () => {
    const changeDir = path.join(changesDir, 'test-change');
    const tasksDir = path.join(changeDir, 'tasks');
    await fs.mkdir(tasksDir, { recursive: true });

    await fs.writeFile(
      path.join(changeDir, 'proposal.md'),
      '# Change: Test\n\n## Why\nTest\n\n## What Changes\n- Test'
    );
    await fs.writeFile(
      path.join(tasksDir, '001-my-task.md'),
      `---
status: to-do
---

# Task: My Task

## Implementation Checklist
- [ ] Something
`
    );

    const originalCwd = process.cwd();
    try {
      process.chdir(testDir);
      const output = execSync(
        `node ${openspecBin} complete task --id test-change/001-my-task --json`,
        { encoding: 'utf-8' }
      );
      const json = JSON.parse(output);

      expect(json.changeId).toBe('test-change');
      expect(json.newStatus).toBe('done');
    } finally {
      process.chdir(originalCwd);
    }
  });
});

describe('complete change command', () => {
  const projectRoot = process.cwd();
  const testDir = path.join(projectRoot, 'test-complete-change-tmp');
  const changesDir = path.join(testDir, 'openspec', 'changes');
  const openspecBin = path.join(projectRoot, 'bin', 'openspec.js');

  beforeEach(async () => {
    await fs.mkdir(changesDir, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
  });

  it('completes all tasks in a change', async () => {
    const changeDir = path.join(changesDir, 'test-change');
    const tasksDir = path.join(changeDir, 'tasks');
    await fs.mkdir(tasksDir, { recursive: true });

    await fs.writeFile(
      path.join(changeDir, 'proposal.md'),
      '# Change: Test\n\n## Why\nTest\n\n## What Changes\n- Test'
    );
    await fs.writeFile(
      path.join(tasksDir, '001-first.md'),
      `---
status: in-progress
---

# Task: First

## Implementation Checklist
- [ ] Item 1
`
    );
    await fs.writeFile(
      path.join(tasksDir, '002-second.md'),
      `---
status: to-do
---

# Task: Second

## Implementation Checklist
- [ ] Item 2
`
    );

    const originalCwd = process.cwd();
    try {
      process.chdir(testDir);
      const output = execSync(
        `node ${openspecBin} complete change --id test-change --json`,
        { encoding: 'utf-8' }
      );
      const json = JSON.parse(output);

      expect(json.changeId).toBe('test-change');
      expect(json.completedTasks).toHaveLength(2);
      expect(json.skippedTasks).toHaveLength(0);

      // Verify files were updated
      const task1 = await fs.readFile(path.join(tasksDir, '001-first.md'), 'utf-8');
      const task2 = await fs.readFile(path.join(tasksDir, '002-second.md'), 'utf-8');
      expect(task1).toContain('status: done');
      expect(task2).toContain('status: done');
    } finally {
      process.chdir(originalCwd);
    }
  });

  it('skips already-done tasks', async () => {
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
- [x] Already done
`
    );
    await fs.writeFile(
      path.join(tasksDir, '002-pending.md'),
      `---
status: to-do
---

# Task: Pending

## Implementation Checklist
- [ ] Not done
`
    );

    const originalCwd = process.cwd();
    try {
      process.chdir(testDir);
      const output = execSync(
        `node ${openspecBin} complete change --id test-change --json`,
        { encoding: 'utf-8' }
      );
      const json = JSON.parse(output);

      expect(json.completedTasks).toHaveLength(1);
      expect(json.skippedTasks).toContain('done');
    } finally {
      process.chdir(originalCwd);
    }
  });

  it('returns error when change not found', async () => {
    const originalCwd = process.cwd();
    try {
      process.chdir(testDir);
      try {
        execSync(
          `node ${openspecBin} complete change --id nonexistent --json`,
          { encoding: 'utf-8' }
        );
      } catch (error: any) {
        const json = JSON.parse(error.stdout);
        expect(json.error).toContain('Change not found');
      }
    } finally {
      process.chdir(originalCwd);
    }
  });

  it('reports all tasks skipped when all already complete', async () => {
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

    const originalCwd = process.cwd();
    try {
      process.chdir(testDir);
      const output = execSync(
        `node ${openspecBin} complete change --id test-change --json`,
        { encoding: 'utf-8' }
      );
      const json = JSON.parse(output);

      expect(json.completedTasks).toHaveLength(0);
      expect(json.skippedTasks).toHaveLength(1);
    } finally {
      process.chdir(originalCwd);
    }
  });
});
