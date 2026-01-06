import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { createValidPlxWorkspace } from '../test-utils.js';

describe('complete task command', () => {
  const projectRoot = process.cwd();
  const testDir = path.join(projectRoot, 'test-complete-task-tmp');
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

  it('completes a task by ID', async () => {
    const changeDir = path.join(changesDir, 'test-change');
    await fs.mkdir(changeDir, { recursive: true });

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
        `node ${plxBin} complete task --id 001-my-task --json`,
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
          `node ${plxBin} complete task --id nonexistent --json`,
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
    await fs.mkdir(changeDir, { recursive: true });

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
        `node ${plxBin} complete task --id 001-done-task --json`,
        { encoding: 'utf-8' }
      );
      const json = JSON.parse(output);

      expect(json.warning).toContain('already complete');
    } finally {
      process.chdir(originalCwd);
    }
  });

  it('completes parented task by ID', async () => {
    const changeDir = path.join(changesDir, 'test-change');
    await fs.mkdir(changeDir, { recursive: true });

    await fs.writeFile(
      path.join(changeDir, 'proposal.md'),
      '# Change: Test\n\n## Why\nTest\n\n## What Changes\n- Test'
    );
    await fs.writeFile(
      path.join(tasksDir, '001-test-change-my-task.md'),
      `---
status: to-do
parent-type: change
parent-id: test-change
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
        `node ${plxBin} complete task --id 001-test-change-my-task --json`,
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

  it('completes all tasks in a change', async () => {
    const changeDir = path.join(changesDir, 'test-change');
    await fs.mkdir(changeDir, { recursive: true });

    await fs.writeFile(
      path.join(changeDir, 'proposal.md'),
      '# Change: Test\n\n## Why\nTest\n\n## What Changes\n- Test'
    );
    await fs.writeFile(
      path.join(tasksDir, '001-test-change-first.md'),
      `---
status: in-progress
parent-type: change
parent-id: test-change
---

# Task: First

## Implementation Checklist
- [ ] Item 1
`
    );
    await fs.writeFile(
      path.join(tasksDir, '002-test-change-second.md'),
      `---
status: to-do
parent-type: change
parent-id: test-change
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
        `node ${plxBin} complete change --id test-change --json`,
        { encoding: 'utf-8' }
      );
      const json = JSON.parse(output);

      expect(json.changeId).toBe('test-change');
      expect(json.completedTasks).toHaveLength(2);
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
      expect(task1).toContain('status: done');
      expect(task2).toContain('status: done');
    } finally {
      process.chdir(originalCwd);
    }
  });

  it('skips already-done tasks', async () => {
    const changeDir = path.join(changesDir, 'test-change');
    await fs.mkdir(changeDir, { recursive: true });

    await fs.writeFile(
      path.join(changeDir, 'proposal.md'),
      '# Change: Test\n\n## Why\nTest\n\n## What Changes\n- Test'
    );
    await fs.writeFile(
      path.join(tasksDir, '001-test-change-done.md'),
      `---
status: done
parent-type: change
parent-id: test-change
---

# Task: Done

## Implementation Checklist
- [x] Already done
`
    );
    await fs.writeFile(
      path.join(tasksDir, '002-test-change-pending.md'),
      `---
status: to-do
parent-type: change
parent-id: test-change
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
        `node ${plxBin} complete change --id test-change --json`,
        { encoding: 'utf-8' }
      );
      const json = JSON.parse(output);

      expect(json.completedTasks).toHaveLength(1);
      expect(json.skippedTasks).toContain('001-test-change-done');
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
          `node ${plxBin} complete change --id nonexistent --json`,
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
    await fs.mkdir(changeDir, { recursive: true });

    await fs.writeFile(
      path.join(changeDir, 'proposal.md'),
      '# Change: Test\n\n## Why\nTest\n\n## What Changes\n- Test'
    );
    await fs.writeFile(
      path.join(tasksDir, '001-test-change-done.md'),
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
        `node ${plxBin} complete change --id test-change --json`,
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

describe('complete review command', () => {
  const projectRoot = process.cwd();
  const testDir = path.join(projectRoot, 'test-complete-review-tmp');
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

  it('completes all tasks in a review', async () => {
    const reviewDir = path.join(reviewsDir, 'test-review');
    await fs.mkdir(reviewDir, { recursive: true });

    await fs.writeFile(
      path.join(reviewDir, 'review.md'),
      '# Review: Test\n\nReview content'
    );
    await fs.writeFile(
      path.join(tasksDir, '001-test-review-first.md'),
      `---
status: in-progress
parent-type: review
parent-id: test-review
---

# Task: First

## Implementation Checklist
- [ ] Item 1
`
    );
    await fs.writeFile(
      path.join(tasksDir, '002-test-review-second.md'),
      `---
status: to-do
parent-type: review
parent-id: test-review
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
        `node ${plxBin} complete review --id test-review --json`,
        { encoding: 'utf-8' }
      );
      const json = JSON.parse(output);

      expect(json.reviewId).toBe('test-review');
      expect(json.completedTasks).toHaveLength(2);
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
      expect(task1).toContain('status: done');
      expect(task2).toContain('status: done');
    } finally {
      process.chdir(originalCwd);
    }
  });

  it('skips already-done tasks', async () => {
    const reviewDir = path.join(reviewsDir, 'test-review');
    await fs.mkdir(reviewDir, { recursive: true });

    await fs.writeFile(
      path.join(reviewDir, 'review.md'),
      '# Review: Test\n\nReview content'
    );
    await fs.writeFile(
      path.join(tasksDir, '001-test-review-done.md'),
      `---
status: done
parent-type: review
parent-id: test-review
---

# Task: Done

## Implementation Checklist
- [x] Already done
`
    );
    await fs.writeFile(
      path.join(tasksDir, '002-test-review-pending.md'),
      `---
status: to-do
parent-type: review
parent-id: test-review
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
        `node ${plxBin} complete review --id test-review --json`,
        { encoding: 'utf-8' }
      );
      const json = JSON.parse(output);

      expect(json.completedTasks).toHaveLength(1);
      expect(json.skippedTasks).toContain('001-test-review-done');
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
          `node ${plxBin} complete review --id nonexistent --json`,
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

describe('complete spec command', () => {
  const projectRoot = process.cwd();
  const testDir = path.join(projectRoot, 'test-complete-spec-tmp');
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

  it('completes all tasks in a spec', async () => {
    const specDir = path.join(specsDir, 'test-spec');
    await fs.mkdir(specDir, { recursive: true });
    await fs.writeFile(
      path.join(specDir, 'spec.md'),
      '# Spec: Test\n\n## Requirements\n- Requirement 1'
    );
    await fs.writeFile(
      path.join(tasksDir, '001-test-spec-first.md'),
      `---
status: in-progress
parent-type: spec
parent-id: test-spec
---

# Task: First

## Implementation Checklist
- [ ] Item 1
`
    );
    await fs.writeFile(
      path.join(tasksDir, '002-test-spec-second.md'),
      `---
status: to-do
parent-type: spec
parent-id: test-spec
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
        `node ${plxBin} complete spec --id test-spec --json`,
        { encoding: 'utf-8' }
      );
      const json = JSON.parse(output);

      expect(json.specId).toBe('test-spec');
      expect(json.completedTasks).toHaveLength(2);
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
      expect(task1).toContain('status: done');
      expect(task2).toContain('status: done');
    } finally {
      process.chdir(originalCwd);
    }
  });

  it('handles spec with no tasks', async () => {
    const specDir = path.join(specsDir, 'test-spec');
    await fs.mkdir(specDir, { recursive: true });
    await fs.writeFile(
      path.join(specDir, 'spec.md'),
      '# Spec: Test\n\n## Requirements\n- Requirement 1'
    );

    const originalCwd = process.cwd();
    try {
      process.chdir(testDir);
      const output = execSync(
        `node ${plxBin} complete spec --id test-spec --json`,
        { encoding: 'utf-8' }
      );
      const json = JSON.parse(output);

      expect(json.specId).toBe('test-spec');
      expect(json.completedTasks).toHaveLength(0);
      expect(json.skippedTasks).toHaveLength(0);
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
          `node ${plxBin} complete spec --id nonexistent --json`,
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

  it('skips already-done tasks', async () => {
    const specDir = path.join(specsDir, 'test-spec');
    await fs.mkdir(specDir, { recursive: true });
    await fs.writeFile(
      path.join(specDir, 'spec.md'),
      '# Spec: Test\n\n## Requirements\n- Requirement 1'
    );
    await fs.writeFile(
      path.join(tasksDir, '001-test-spec-done.md'),
      `---
status: done
parent-type: spec
parent-id: test-spec
---

# Task: Done

## Implementation Checklist
- [x] Already done
`
    );
    await fs.writeFile(
      path.join(tasksDir, '002-test-spec-pending.md'),
      `---
status: to-do
parent-type: spec
parent-id: test-spec
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
        `node ${plxBin} complete spec --id test-spec --json`,
        { encoding: 'utf-8' }
      );
      const json = JSON.parse(output);

      expect(json.completedTasks).toHaveLength(1);
      expect(json.skippedTasks).toContain('001-test-spec-done');
    } finally {
      process.chdir(originalCwd);
    }
  });
});
