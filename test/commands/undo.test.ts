import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { createValidPlxWorkspace } from '../test-utils.js';

describe('undo task command', () => {
  const projectRoot = process.cwd();
  const testDir = path.join(projectRoot, 'test-undo-task-tmp');
  const workspaceDir = path.join(testDir, 'workspace');
  const changesDir = path.join(workspaceDir, 'changes');
  const tasksDir = path.join(workspaceDir, 'tasks');
  const plxBin = path.join(projectRoot, 'bin', 'plx.js');

  beforeEach(async () => {
    await createValidPlxWorkspace(testDir);
    await fs.mkdir(changesDir, { recursive: true });
    await fs.mkdir(tasksDir, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
  });

  it('undoes a task by ID', async () => {
    const changeDir = path.join(changesDir, 'test-change');
    await fs.mkdir(changeDir, { recursive: true });

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
    await fs.mkdir(changeDir, { recursive: true });

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
    await fs.mkdir(changeDir, { recursive: true });

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

  it('undoes parented task by ID', async () => {
    const changeDir = path.join(changesDir, 'test-change');
    await fs.mkdir(changeDir, { recursive: true });

    await fs.writeFile(
      path.join(changeDir, 'proposal.md'),
      '# Change: Test\n\n## Why\nTest\n\n## What Changes\n- Test'
    );
    await fs.writeFile(
      path.join(tasksDir, '001-test-change-my-task.md'),
      `---
status: in-progress
parent-type: change
parent-id: test-change
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
        `node ${plxBin} undo task --id 001-test-change-my-task --json`,
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
  const workspaceDir = path.join(testDir, 'workspace');
  const changesDir = path.join(workspaceDir, 'changes');
  const tasksDir = path.join(workspaceDir, 'tasks');
  const plxBin = path.join(projectRoot, 'bin', 'plx.js');

  beforeEach(async () => {
    await createValidPlxWorkspace(testDir);
    await fs.mkdir(changesDir, { recursive: true });
    await fs.mkdir(tasksDir, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
  });

  it('undoes all tasks in a change', async () => {
    const changeDir = path.join(changesDir, 'test-change');
    await fs.mkdir(changeDir, { recursive: true });

    await fs.writeFile(
      path.join(changeDir, 'proposal.md'),
      '# Change: Test\n\n## Why\nTest\n\n## What Changes\n- Test'
    );
    await fs.writeFile(
      path.join(tasksDir, '001-test-change-first.md'),
      `---
status: done
parent-type: change
parent-id: test-change
---

# Task: First

## Implementation Checklist
- [x] Item 1
`
    );
    await fs.writeFile(
      path.join(tasksDir, '002-test-change-second.md'),
      `---
status: in-progress
parent-type: change
parent-id: test-change
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
      const task1 = await fs.readFile(
        path.join(tasksDir, '001-test-change-first.md'),
        'utf-8'
      );
      const task2 = await fs.readFile(
        path.join(tasksDir, '002-test-change-second.md'),
        'utf-8'
      );
      expect(task1).toContain('status: to-do');
      expect(task2).toContain('status: to-do');
    } finally {
      process.chdir(originalCwd);
    }
  });

  it('skips already to-do tasks', async () => {
    const changeDir = path.join(changesDir, 'test-change');
    await fs.mkdir(changeDir, { recursive: true });

    await fs.writeFile(
      path.join(changeDir, 'proposal.md'),
      '# Change: Test\n\n## Why\nTest\n\n## What Changes\n- Test'
    );
    await fs.writeFile(
      path.join(tasksDir, '001-test-change-todo.md'),
      `---
status: to-do
parent-type: change
parent-id: test-change
---

# Task: Todo

## Implementation Checklist
- [ ] Not done
`
    );
    await fs.writeFile(
      path.join(tasksDir, '002-test-change-done.md'),
      `---
status: done
parent-type: change
parent-id: test-change
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
      expect(json.skippedTasks).toContain('001-test-change-todo');
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
    await fs.mkdir(changeDir, { recursive: true });

    await fs.writeFile(
      path.join(changeDir, 'proposal.md'),
      '# Change: Test\n\n## Why\nTest\n\n## What Changes\n- Test'
    );
    await fs.writeFile(
      path.join(tasksDir, '001-test-change-todo.md'),
      `---
status: to-do
parent-type: change
parent-id: test-change
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
    await fs.mkdir(changeDir, { recursive: true });

    await fs.writeFile(
      path.join(changeDir, 'proposal.md'),
      '# Change: Test\n\n## Why\nTest\n\n## What Changes\n- Test'
    );
    await fs.writeFile(
      path.join(tasksDir, '001-test-change-task.md'),
      `---
status: done
parent-type: change
parent-id: test-change
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

      expect(json.undoneTasks[0].taskId).toBe('001-test-change-task');
      expect(json.undoneTasks[0].name).toBe('task');
      expect(json.undoneTasks[0].previousStatus).toBe('done');
      expect(json.undoneTasks[0].uncheckedItems).toContain('Checked item');
    } finally {
      process.chdir(originalCwd);
    }
  });
});

describe('undo review command', () => {
  const projectRoot = process.cwd();
  const testDir = path.join(projectRoot, 'test-undo-review-tmp');
  const workspaceDir = path.join(testDir, 'workspace');
  const reviewsDir = path.join(workspaceDir, 'reviews');
  const tasksDir = path.join(workspaceDir, 'tasks');
  const plxBin = path.join(projectRoot, 'bin', 'plx.js');

  beforeEach(async () => {
    await createValidPlxWorkspace(testDir);
    await fs.mkdir(reviewsDir, { recursive: true });
    await fs.mkdir(tasksDir, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
  });

  it('undoes all tasks in a review', async () => {
    const reviewDir = path.join(reviewsDir, 'test-review');
    await fs.mkdir(reviewDir, { recursive: true });

    await fs.writeFile(
      path.join(reviewDir, 'review.md'),
      '# Review: Test Review\n\n## Description\nTest review'
    );
    await fs.writeFile(
      path.join(tasksDir, '001-test-review-first.md'),
      `---
status: done
parent-type: review
parent-id: test-review
---

# Task: First

## Implementation Checklist
- [x] Item 1
`
    );
    await fs.writeFile(
      path.join(tasksDir, '002-test-review-second.md'),
      `---
status: in-progress
parent-type: review
parent-id: test-review
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
        `node ${plxBin} undo review --id test-review --json`,
        { encoding: 'utf-8' }
      );
      const json = JSON.parse(output);

      expect(json.reviewId).toBe('test-review');
      expect(json.undoneTasks).toHaveLength(2);
      expect(json.skippedTasks).toHaveLength(0);

      // Verify files were updated
      const task1 = await fs.readFile(
        path.join(tasksDir, '001-test-review-first.md'),
        'utf-8'
      );
      const task2 = await fs.readFile(
        path.join(tasksDir, '002-test-review-second.md'),
        'utf-8'
      );
      expect(task1).toContain('status: to-do');
      expect(task2).toContain('status: to-do');
    } finally {
      process.chdir(originalCwd);
    }
  });

  it('skips already to-do tasks in review', async () => {
    const reviewDir = path.join(reviewsDir, 'test-review');
    await fs.mkdir(reviewDir, { recursive: true });

    await fs.writeFile(
      path.join(reviewDir, 'review.md'),
      '# Review: Test Review\n\n## Description\nTest review'
    );
    await fs.writeFile(
      path.join(tasksDir, '001-test-review-todo.md'),
      `---
status: to-do
parent-type: review
parent-id: test-review
---

# Task: Todo

## Implementation Checklist
- [ ] Not done
`
    );
    await fs.writeFile(
      path.join(tasksDir, '002-test-review-done.md'),
      `---
status: done
parent-type: review
parent-id: test-review
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
        `node ${plxBin} undo review --id test-review --json`,
        { encoding: 'utf-8' }
      );
      const json = JSON.parse(output);

      expect(json.undoneTasks).toHaveLength(1);
      expect(json.skippedTasks).toContain('001-test-review-todo');
    } finally {
      process.chdir(originalCwd);
    }
  });

  it('returns error when review not found', async () => {
    const originalCwd = process.cwd();
    try {
      process.chdir(testDir);
      try {
        execSync(
          `node ${plxBin} undo review --id nonexistent --json`,
          { encoding: 'utf-8' }
        );
      } catch (error: any) {
        const json = JSON.parse(error.stdout);
        expect(json.error).toContain('Review not found');
      }
    } finally {
      process.chdir(originalCwd);
    }
  });
});

describe('undo spec command', () => {
  const projectRoot = process.cwd();
  const testDir = path.join(projectRoot, 'test-undo-spec-tmp');
  const workspaceDir = path.join(testDir, 'workspace');
  const specsDir = path.join(workspaceDir, 'specs');
  const tasksDir = path.join(workspaceDir, 'tasks');
  const plxBin = path.join(projectRoot, 'bin', 'plx.js');

  beforeEach(async () => {
    await createValidPlxWorkspace(testDir);
    await fs.mkdir(specsDir, { recursive: true });
    await fs.mkdir(tasksDir, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
  });

  it('undoes all tasks in a spec', async () => {
    const specDir = path.join(specsDir, 'test-spec');
    await fs.mkdir(specDir, { recursive: true });
    await fs.writeFile(
      path.join(specDir, 'spec.md'),
      '# Spec: Test Spec\n\n## Requirements\n- Test requirement'
    );
    await fs.writeFile(
      path.join(tasksDir, '001-test-spec-first.md'),
      `---
status: done
parent-type: spec
parent-id: test-spec
---

# Task: First

## Implementation Checklist
- [x] Item 1
`
    );
    await fs.writeFile(
      path.join(tasksDir, '002-test-spec-second.md'),
      `---
status: in-progress
parent-type: spec
parent-id: test-spec
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
        `node ${plxBin} undo spec --id test-spec --json`,
        { encoding: 'utf-8' }
      );
      const json = JSON.parse(output);

      expect(json.specId).toBe('test-spec');
      expect(json.undoneTasks).toHaveLength(2);
      expect(json.skippedTasks).toHaveLength(0);

      // Verify files were updated
      const task1 = await fs.readFile(
        path.join(tasksDir, '001-test-spec-first.md'),
        'utf-8'
      );
      const task2 = await fs.readFile(
        path.join(tasksDir, '002-test-spec-second.md'),
        'utf-8'
      );
      expect(task1).toContain('status: to-do');
      expect(task2).toContain('status: to-do');
    } finally {
      process.chdir(originalCwd);
    }
  });

  it('handles spec with no tasks', async () => {
    const specDir = path.join(specsDir, 'empty-spec');
    await fs.mkdir(specDir, { recursive: true });
    await fs.writeFile(
      path.join(specDir, 'spec.md'),
      '# Spec: Empty Spec\n\n## Requirements\n- Test requirement'
    );

    const originalCwd = process.cwd();
    try {
      process.chdir(testDir);
      const output = execSync(
        `node ${plxBin} undo spec --id empty-spec --json`,
        { encoding: 'utf-8' }
      );
      const json = JSON.parse(output);

      expect(json.specId).toBe('empty-spec');
      expect(json.undoneTasks).toHaveLength(0);
      expect(json.skippedTasks).toHaveLength(0);
    } finally {
      process.chdir(originalCwd);
    }
  });

  it('skips already to-do tasks in spec', async () => {
    const specDir = path.join(specsDir, 'test-spec');
    await fs.mkdir(specDir, { recursive: true });
    await fs.writeFile(
      path.join(specDir, 'spec.md'),
      '# Spec: Test Spec\n\n## Requirements\n- Test requirement'
    );
    await fs.writeFile(
      path.join(tasksDir, '001-test-spec-todo.md'),
      `---
status: to-do
parent-type: spec
parent-id: test-spec
---

# Task: Todo

## Implementation Checklist
- [ ] Not done
`
    );
    await fs.writeFile(
      path.join(tasksDir, '002-test-spec-done.md'),
      `---
status: done
parent-type: spec
parent-id: test-spec
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
        `node ${plxBin} undo spec --id test-spec --json`,
        { encoding: 'utf-8' }
      );
      const json = JSON.parse(output);

      expect(json.undoneTasks).toHaveLength(1);
      expect(json.skippedTasks).toContain('001-test-spec-todo');
    } finally {
      process.chdir(originalCwd);
    }
  });

  it('returns error when spec not found', async () => {
    const originalCwd = process.cwd();
    try {
      process.chdir(testDir);
      try {
        execSync(
          `node ${plxBin} undo spec --id nonexistent --json`,
          { encoding: 'utf-8' }
        );
      } catch (error: any) {
        const json = JSON.parse(error.stdout);
        expect(json.error).toContain('Spec not found');
      }
    } finally {
      process.chdir(originalCwd);
    }
  });
});
