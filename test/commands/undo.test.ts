import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import { execSync } from 'child_process';

describe('undo task command', () => {
  const projectRoot = process.cwd();
  const testDir = path.join(projectRoot, 'test-undo-task-tmp');
  const changesDir = path.join(testDir, 'workspace', 'changes');
  const plxBin = path.join(projectRoot, 'bin', 'plx.js');

  beforeEach(async () => {
    await fs.mkdir(changesDir, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
  });

  it('undoes a task by ID', async () => {
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
status: done
---

# Task: My Task

## Implementation Checklist
- [x] First item
- [x] Second item
`
    );

    const originalCwd = process.cwd();
    try {
      process.chdir(testDir);
      const output = execSync(
        `node ${plxBin} undo task --id 001-my-task --json`,
        { encoding: 'utf-8' }
      );
      const json = JSON.parse(output);

      expect(json.taskId).toBe('001-my-task');
      expect(json.previousStatus).toBe('done');
      expect(json.newStatus).toBe('to-do');
      expect(json.uncheckedItems).toContain('First item');
      expect(json.uncheckedItems).toContain('Second item');

      // Verify file was updated
      const taskContent = await fs.readFile(
        path.join(tasksDir, '001-my-task.md'),
        'utf-8'
      );
      expect(taskContent).toContain('status: to-do');
      expect(taskContent).toContain('[ ] First item');
      expect(taskContent).toContain('[ ] Second item');
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
          `node ${plxBin} undo task --id nonexistent --json`,
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

  it('warns when task already in to-do state', async () => {
    const changeDir = path.join(changesDir, 'test-change');
    const tasksDir = path.join(changeDir, 'tasks');
    await fs.mkdir(tasksDir, { recursive: true });

    await fs.writeFile(
      path.join(changeDir, 'proposal.md'),
      '# Change: Test\n\n## Why\nTest\n\n## What Changes\n- Test'
    );
    await fs.writeFile(
      path.join(tasksDir, '001-todo-task.md'),
      `---
status: to-do
---

# Task: Todo Task

## Implementation Checklist
- [ ] Not done
`
    );

    const originalCwd = process.cwd();
    try {
      process.chdir(testDir);
      const output = execSync(
        `node ${plxBin} undo task --id 001-todo-task --json`,
        { encoding: 'utf-8' }
      );
      const json = JSON.parse(output);

      expect(json.warning).toContain('already in to-do state');
    } finally {
      process.chdir(originalCwd);
    }
  });

  it('undoes task with full ID format (changeId/taskName)', async () => {
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
- [x] Something
`
    );

    const originalCwd = process.cwd();
    try {
      process.chdir(testDir);
      const output = execSync(
        `node ${plxBin} undo task --id test-change/001-my-task --json`,
        { encoding: 'utf-8' }
      );
      const json = JSON.parse(output);

      expect(json.changeId).toBe('test-change');
      expect(json.newStatus).toBe('to-do');
    } finally {
      process.chdir(originalCwd);
    }
  });
});

describe('undo change command', () => {
  const projectRoot = process.cwd();
  const testDir = path.join(projectRoot, 'test-undo-change-tmp');
  const changesDir = path.join(testDir, 'workspace', 'changes');
  const plxBin = path.join(projectRoot, 'bin', 'plx.js');

  beforeEach(async () => {
    await fs.mkdir(changesDir, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
  });

  it('undoes all tasks in a change', async () => {
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
status: done
---

# Task: First

## Implementation Checklist
- [x] Item 1
`
    );
    await fs.writeFile(
      path.join(tasksDir, '002-second.md'),
      `---
status: in-progress
---

# Task: Second

## Implementation Checklist
- [x] Item 2
`
    );

    const originalCwd = process.cwd();
    try {
      process.chdir(testDir);
      const output = execSync(
        `node ${plxBin} undo change --id test-change --json`,
        { encoding: 'utf-8' }
      );
      const json = JSON.parse(output);

      expect(json.changeId).toBe('test-change');
      expect(json.undoneTasks).toHaveLength(2);
      expect(json.skippedTasks).toHaveLength(0);

      // Verify files were updated
      const task1 = await fs.readFile(path.join(tasksDir, '001-first.md'), 'utf-8');
      const task2 = await fs.readFile(path.join(tasksDir, '002-second.md'), 'utf-8');
      expect(task1).toContain('status: to-do');
      expect(task2).toContain('status: to-do');
    } finally {
      process.chdir(originalCwd);
    }
  });

  it('skips already to-do tasks', async () => {
    const changeDir = path.join(changesDir, 'test-change');
    const tasksDir = path.join(changeDir, 'tasks');
    await fs.mkdir(tasksDir, { recursive: true });

    await fs.writeFile(
      path.join(changeDir, 'proposal.md'),
      '# Change: Test\n\n## Why\nTest\n\n## What Changes\n- Test'
    );
    await fs.writeFile(
      path.join(tasksDir, '001-todo.md'),
      `---
status: to-do
---

# Task: Todo

## Implementation Checklist
- [ ] Not done
`
    );
    await fs.writeFile(
      path.join(tasksDir, '002-done.md'),
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
        `node ${plxBin} undo change --id test-change --json`,
        { encoding: 'utf-8' }
      );
      const json = JSON.parse(output);

      expect(json.undoneTasks).toHaveLength(1);
      expect(json.skippedTasks).toContain('001-todo');
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
          `node ${plxBin} undo change --id nonexistent --json`,
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

  it('reports all tasks skipped when all already to-do', async () => {
    const changeDir = path.join(changesDir, 'test-change');
    const tasksDir = path.join(changeDir, 'tasks');
    await fs.mkdir(tasksDir, { recursive: true });

    await fs.writeFile(
      path.join(changeDir, 'proposal.md'),
      '# Change: Test\n\n## Why\nTest\n\n## What Changes\n- Test'
    );
    await fs.writeFile(
      path.join(tasksDir, '001-todo.md'),
      `---
status: to-do
---

# Task: Todo

## Implementation Checklist
- [ ] Not done
`
    );

    const originalCwd = process.cwd();
    try {
      process.chdir(testDir);
      const output = execSync(
        `node ${plxBin} undo change --id test-change --json`,
        { encoding: 'utf-8' }
      );
      const json = JSON.parse(output);

      expect(json.undoneTasks).toHaveLength(0);
      expect(json.skippedTasks).toHaveLength(1);
    } finally {
      process.chdir(originalCwd);
    }
  });

  it('includes full task details in undoneTasks array', async () => {
    const changeDir = path.join(changesDir, 'test-change');
    const tasksDir = path.join(changeDir, 'tasks');
    await fs.mkdir(tasksDir, { recursive: true });

    await fs.writeFile(
      path.join(changeDir, 'proposal.md'),
      '# Change: Test\n\n## Why\nTest\n\n## What Changes\n- Test'
    );
    await fs.writeFile(
      path.join(tasksDir, '001-task.md'),
      `---
status: done
---

# Task: Task

## Implementation Checklist
- [x] Checked item
`
    );

    const originalCwd = process.cwd();
    try {
      process.chdir(testDir);
      const output = execSync(
        `node ${plxBin} undo change --id test-change --json`,
        { encoding: 'utf-8' }
      );
      const json = JSON.parse(output);

      expect(json.undoneTasks[0].taskId).toBe('001-task');
      expect(json.undoneTasks[0].name).toBe('task');
      expect(json.undoneTasks[0].previousStatus).toBe('done');
      expect(json.undoneTasks[0].uncheckedItems).toContain('Checked item');
    } finally {
      process.chdir(originalCwd);
    }
  });
});
