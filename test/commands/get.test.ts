import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { createValidPlxWorkspace } from '../test-utils.js';

describe('get task command', () => {
  const projectRoot = process.cwd();
  const testDir = path.join(projectRoot, 'test-get-command-tmp');
  const changesDir = path.join(testDir, 'workspace', 'changes');
  const centralTasksDir = path.join(testDir, 'workspace', 'tasks');
  const plxBin = path.join(projectRoot, 'bin', 'plx.js');

  beforeEach(async () => {
    await createValidPlxWorkspace(testDir);
    await fs.mkdir(changesDir, { recursive: true });
    await fs.mkdir(centralTasksDir, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
  });

  describe('basic invocation', () => {
    it('shows "No active changes found" when no changes exist', () => {
      const originalCwd = process.cwd();
      try {
        process.chdir(testDir);
        const output = execSync(`node ${plxBin} get task 2>&1`, {
          encoding: 'utf-8',
        });
        expect(output).toContain('No active changes found');
      } finally {
        process.chdir(originalCwd);
      }
    });

    it('shows next task with change context', async () => {
      const changeDir = path.join(changesDir, 'test-change');
      await fs.mkdir(changeDir, { recursive: true });

      await fs.writeFile(
        path.join(changeDir, 'proposal.md'),
        '# Change: Test Change\n\n## Why\nTest\n\n## What Changes\n- Test'
      );
      await fs.writeFile(
        path.join(changeDir, 'design.md'),
        '## Design\n\nTest design content'
      );
      // Use centralized task storage
      await fs.writeFile(
        path.join(centralTasksDir, '001-test-change-first-task.md'),
        `---
status: to-do
parent-type: change
parent-id: test-change
---

# Task: First Task

## Implementation Checklist
- [ ] Do something
`
      );

      const originalCwd = process.cwd();
      try {
        process.chdir(testDir);
        const output = execSync(`node ${plxBin} get task`, {
          encoding: 'utf-8',
        });
        expect(output).toContain('Proposal: test-change');
        expect(output).toContain('Design');
        expect(output).toContain('Test design content');
        expect(output).toContain('Task 1: 001-test-change-first-task');
        expect(output).toContain('Do something');
      } finally {
        process.chdir(originalCwd);
      }
    });

    it('shows "No active changes found" when only change is complete', async () => {
      const changeDir = path.join(changesDir, 'test-change');
      await fs.mkdir(changeDir, { recursive: true });

      await fs.writeFile(
        path.join(changeDir, 'proposal.md'),
        '# Change: Test Change\n\n## Why\nTest\n\n## What Changes\n- Test'
      );
      // Use centralized task storage
      await fs.writeFile(
        path.join(centralTasksDir, '001-test-change-first-task.md'),
        `---
status: done
parent-type: change
parent-id: test-change
---

# Task: First Task

## Implementation Checklist
- [x] Done
`
      );

      const originalCwd = process.cwd();
      try {
        process.chdir(testDir);
        const output = execSync(`node ${plxBin} get task 2>&1`, {
          encoding: 'utf-8',
        });
        expect(output).toContain('No active changes found');
      } finally {
        process.chdir(originalCwd);
      }
    });
  });

  describe('--json flag', () => {
    it('outputs valid JSON with task info', async () => {
      const changeDir = path.join(changesDir, 'test-change');
      await fs.mkdir(changeDir, { recursive: true });

      await fs.writeFile(
        path.join(changeDir, 'proposal.md'),
        '# Change: Test Change\n\n## Why\nTest\n\n## What Changes\n- Test'
      );
      // Use centralized task storage
      await fs.writeFile(
        path.join(centralTasksDir, '001-test-change-first-task.md'),
        `---
status: in-progress
parent-type: change
parent-id: test-change
---

# Task: First Task

## Implementation Checklist
- [ ] Do something
`
      );

      const originalCwd = process.cwd();
      try {
        process.chdir(testDir);
        const output = execSync(`node ${plxBin} get task --json`, {
          encoding: 'utf-8',
        });
        const json = JSON.parse(output);
        expect(json.changeId).toBe('test-change');
        expect(json.task).toBeDefined();
        expect(json.task.filename).toBe('001-test-change-first-task.md');
        expect(json.task.sequence).toBe(1);
        expect(json.task.id).toBe('001-test-change-first-task');
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
        const output = execSync(`node ${plxBin} get task --json`, {
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
      await fs.mkdir(changeDir, { recursive: true });

      await fs.writeFile(
        path.join(changeDir, 'proposal.md'),
        '# Change: Test Change\n\n## Why\nTest\n\n## What Changes\n- Test'
      );
      // Use centralized task storage
      await fs.writeFile(
        path.join(centralTasksDir, '001-test-change-first-task.md'),
        `---
status: in-progress
parent-type: change
parent-id: test-change
---

# Task: First Task

## Implementation Checklist
- [ ] Do something
`
      );
      await fs.writeFile(
        path.join(centralTasksDir, '002-test-change-second-task.md'),
        `---
status: to-do
parent-type: change
parent-id: test-change
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
          `node ${plxBin} get task --did-complete-previous`,
          { encoding: 'utf-8' }
        );

        // Should show second task
        expect(output).toContain('Task 2: 002-test-change-second-task');
        expect(output).toContain('Do something else');

        // Should NOT show proposal (only task with --did-complete-previous)
        expect(output).not.toContain('Proposal:');

        // Verify first task is now done
        const firstTaskContent = await fs.readFile(
          path.join(centralTasksDir, '001-test-change-first-task.md'),
          'utf-8'
        );
        expect(firstTaskContent).toContain('status: done');

        // Verify second task is now in-progress
        const secondTaskContent = await fs.readFile(
          path.join(centralTasksDir, '002-test-change-second-task.md'),
          'utf-8'
        );
        expect(secondTaskContent).toContain('status: in-progress');
      } finally {
        process.chdir(originalCwd);
      }
    });

    it('warns when no in-progress task exists', async () => {
      const changeDir = path.join(changesDir, 'test-change');
      await fs.mkdir(changeDir, { recursive: true });

      await fs.writeFile(
        path.join(changeDir, 'proposal.md'),
        '# Change: Test Change\n\n## Why\nTest\n\n## What Changes\n- Test'
      );
      // Use centralized task storage
      await fs.writeFile(
        path.join(centralTasksDir, '001-test-change-first-task.md'),
        `---
status: to-do
parent-type: change
parent-id: test-change
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
          `node ${plxBin} get task --did-complete-previous 2>&1`,
          { encoding: 'utf-8' }
        );
        expect(output).toContain('No in-progress task found');
        expect(output).toContain('Task 1: 001-test-change-first-task');

        // Verify task is now in-progress
        const taskContent = await fs.readFile(
          path.join(centralTasksDir, '001-test-change-first-task.md'),
          'utf-8'
        );
        expect(taskContent).toContain('status: in-progress');
      } finally {
        process.chdir(originalCwd);
      }
    });

    it('marks Implementation Checklist items as complete', async () => {
      const changeDir = path.join(changesDir, 'test-change');
      await fs.mkdir(changeDir, { recursive: true });

      await fs.writeFile(
        path.join(changeDir, 'proposal.md'),
        '# Change: Test\n\n## Why\nTest\n\n## What Changes\n- Test'
      );
      // Use centralized task storage
      await fs.writeFile(
        path.join(centralTasksDir, '001-test-change-first-task.md'),
        `---
status: in-progress
parent-type: change
parent-id: test-change
---

# Task: First Task

## Implementation Checklist
- [ ] First item
- [x] Already done
- [ ] Third item

## Constraints
- [ ] Constraint item

## Acceptance Criteria
- [ ] Acceptance item
`
      );
      await fs.writeFile(
        path.join(centralTasksDir, '002-test-change-second-task.md'),
        `---
status: to-do
parent-type: change
parent-id: test-change
---

# Task: Second Task

## Implementation Checklist
- [ ] Next item
`
      );

      const originalCwd = process.cwd();
      try {
        process.chdir(testDir);
        execSync(
          `node ${plxBin} get task --did-complete-previous`,
          { encoding: 'utf-8' }
        );

        // Verify first task checkboxes
        const firstTaskContent = await fs.readFile(
          path.join(centralTasksDir, '001-test-change-first-task.md'),
          'utf-8'
        );

        // Implementation Checklist items should be checked
        expect(firstTaskContent).toContain('[x] First item');
        expect(firstTaskContent).toContain('[x] Third item');

        // Constraints and Acceptance Criteria should NOT be modified
        expect(firstTaskContent).toMatch(/## Constraints\n- \[ \] Constraint item/);
        expect(firstTaskContent).toMatch(/## Acceptance Criteria\n- \[ \] Acceptance item/);
      } finally {
        process.chdir(originalCwd);
      }
    });

    it('includes completedTask in JSON output', async () => {
      const changeDir = path.join(changesDir, 'test-change');
      await fs.mkdir(changeDir, { recursive: true });

      await fs.writeFile(
        path.join(changeDir, 'proposal.md'),
        '# Change: Test\n\n## Why\nTest\n\n## What Changes\n- Test'
      );
      // Use centralized task storage
      await fs.writeFile(
        path.join(centralTasksDir, '001-test-change-first-task.md'),
        `---
status: in-progress
parent-type: change
parent-id: test-change
---

# Task: First Task

## Implementation Checklist
- [ ] First item
- [ ] Second item
`
      );
      await fs.writeFile(
        path.join(centralTasksDir, '002-test-change-second-task.md'),
        `---
status: to-do
parent-type: change
parent-id: test-change
---

# Task: Second Task

## Implementation Checklist
- [ ] Next item
`
      );

      const originalCwd = process.cwd();
      try {
        process.chdir(testDir);
        const output = execSync(
          `node ${plxBin} get task --did-complete-previous --json`,
          { encoding: 'utf-8' }
        );
        const json = JSON.parse(output);

        expect(json.completedTask).toBeDefined();
        expect(json.completedTask.id).toBe('001-test-change-first-task');
        expect(json.completedTask.completedItems).toContain('First item');
        expect(json.completedTask.completedItems).toContain('Second item');
      } finally {
        process.chdir(originalCwd);
      }
    });

    it('shows completed task info in text output', async () => {
      const changeDir = path.join(changesDir, 'test-change');
      await fs.mkdir(changeDir, { recursive: true });

      await fs.writeFile(
        path.join(changeDir, 'proposal.md'),
        '# Change: Test\n\n## Why\nTest\n\n## What Changes\n- Test'
      );
      // Use centralized task storage
      await fs.writeFile(
        path.join(centralTasksDir, '001-test-change-first-task.md'),
        `---
status: in-progress
parent-type: change
parent-id: test-change
---

# Task: First Task

## Implementation Checklist
- [ ] First item
`
      );
      await fs.writeFile(
        path.join(centralTasksDir, '002-test-change-second-task.md'),
        `---
status: to-do
parent-type: change
parent-id: test-change
---

# Task: Second Task

## Implementation Checklist
- [ ] Next item
`
      );

      const originalCwd = process.cwd();
      try {
        process.chdir(testDir);
        const output = execSync(
          `node ${plxBin} get task --did-complete-previous`,
          { encoding: 'utf-8' }
        );

        expect(output).toContain('Completed task: 001-test-change-first-task');
        expect(output).toContain('Marked complete:');
        expect(output).toContain('First item');
      } finally {
        process.chdir(originalCwd);
      }
    });
  });

  describe('auto-completion', () => {
    it('auto-completes in-progress task when all checklist items are checked', async () => {
      const changeDir = path.join(changesDir, 'test-change');
      await fs.mkdir(changeDir, { recursive: true });

      await fs.writeFile(
        path.join(changeDir, 'proposal.md'),
        '# Change: Test Change\n\n## Why\nTest\n\n## What Changes\n- Test'
      );
      await fs.writeFile(
        path.join(changeDir, 'design.md'),
        '## Design\n\nTest design content'
      );
      // Use centralized task storage
      await fs.writeFile(
        path.join(centralTasksDir, '001-test-change-first-task.md'),
        `---
status: in-progress
parent-type: change
parent-id: test-change
---

# Task: First Task

## Implementation Checklist
- [x] Item one
- [x] Item two
`
      );
      await fs.writeFile(
        path.join(centralTasksDir, '002-test-change-second-task.md'),
        `---
status: to-do
parent-type: change
parent-id: test-change
---

# Task: Second Task

## Implementation Checklist
- [ ] Second item
`
      );

      const originalCwd = process.cwd();
      try {
        process.chdir(testDir);
        const output = execSync(`node ${plxBin} get task`, {
          encoding: 'utf-8',
        });

        // Should show auto-completed message
        expect(output).toContain('Auto-completed task: 001-test-change-first-task');

        // Should show second task
        expect(output).toContain('Task 2: 002-test-change-second-task');
        expect(output).toContain('Second item');

        // Should NOT show proposal/design (change documents excluded after auto-complete)
        expect(output).not.toContain('Proposal:');

        // Verify first task is now done
        const firstTaskContent = await fs.readFile(
          path.join(centralTasksDir, '001-test-change-first-task.md'),
          'utf-8'
        );
        expect(firstTaskContent).toContain('status: done');

        // Verify second task is now in-progress
        const secondTaskContent = await fs.readFile(
          path.join(centralTasksDir, '002-test-change-second-task.md'),
          'utf-8'
        );
        expect(secondTaskContent).toContain('status: in-progress');
      } finally {
        process.chdir(originalCwd);
      }
    });

    it('displays task normally when partially complete', async () => {
      const changeDir = path.join(changesDir, 'test-change');
      await fs.mkdir(changeDir, { recursive: true });

      await fs.writeFile(
        path.join(changeDir, 'proposal.md'),
        '# Change: Test Change\n\n## Why\nTest\n\n## What Changes\n- Test'
      );
      // Use centralized task storage
      await fs.writeFile(
        path.join(centralTasksDir, '001-test-change-first-task.md'),
        `---
status: in-progress
parent-type: change
parent-id: test-change
---

# Task: First Task

## Implementation Checklist
- [x] Done item
- [ ] Not done item
`
      );

      const originalCwd = process.cwd();
      try {
        process.chdir(testDir);
        const output = execSync(`node ${plxBin} get task`, {
          encoding: 'utf-8',
        });

        // Should show the in-progress task (not auto-completed)
        expect(output).toContain('Task 1: 001-test-change-first-task');
        expect(output).toContain('Not done item');

        // Should NOT show auto-completed message
        expect(output).not.toContain('Auto-completed');

        // Should show proposal (change documents included)
        expect(output).toContain('Proposal: test-change');

        // Verify task is still in-progress
        const taskContent = await fs.readFile(
          path.join(centralTasksDir, '001-test-change-first-task.md'),
          'utf-8'
        );
        expect(taskContent).toContain('status: in-progress');
      } finally {
        process.chdir(originalCwd);
      }
    });

    it('does not auto-complete task with zero checklist items', async () => {
      const changeDir = path.join(changesDir, 'test-change');
      await fs.mkdir(changeDir, { recursive: true });

      await fs.writeFile(
        path.join(changeDir, 'proposal.md'),
        '# Change: Test Change\n\n## Why\nTest\n\n## What Changes\n- Test'
      );
      // Task with zero checklist items AND a second task with incomplete items
      // Use centralized task storage
      await fs.writeFile(
        path.join(centralTasksDir, '001-test-change-first-task.md'),
        `---
status: in-progress
parent-type: change
parent-id: test-change
---

# Task: First Task

## Notes
No checklist items in this task.
`
      );
      await fs.writeFile(
        path.join(centralTasksDir, '002-test-change-second-task.md'),
        `---
status: to-do
parent-type: change
parent-id: test-change
---

# Task: Second Task

## Implementation Checklist
- [ ] Not done yet
`
      );

      const originalCwd = process.cwd();
      try {
        process.chdir(testDir);
        const output = execSync(`node ${plxBin} get task`, {
          encoding: 'utf-8',
        });

        // Should show the in-progress task (first-task has no checkboxes, so not auto-completed)
        expect(output).toContain('Task 1: 001-test-change-first-task');

        // Should NOT show auto-completed message
        expect(output).not.toContain('Auto-completed');

        // Verify task is still in-progress
        const taskContent = await fs.readFile(
          path.join(centralTasksDir, '001-test-change-first-task.md'),
          'utf-8'
        );
        expect(taskContent).toContain('status: in-progress');
      } finally {
        process.chdir(originalCwd);
      }
    });

    it('shows all tasks complete when auto-completing final to-do task', async () => {
      const changeDir = path.join(changesDir, 'test-change');
      await fs.mkdir(changeDir, { recursive: true });

      await fs.writeFile(
        path.join(changeDir, 'proposal.md'),
        '# Change: Test Change\n\n## Why\nTest\n\n## What Changes\n- Test'
      );
      // Use centralized task storage
      // First task is done
      await fs.writeFile(
        path.join(centralTasksDir, '001-test-change-first-task.md'),
        `---
status: done
parent-type: change
parent-id: test-change
---

# Task: First Task

## Implementation Checklist
- [x] Done
`
      );
      // Second task is in-progress with all items checked (will be auto-completed)
      await fs.writeFile(
        path.join(centralTasksDir, '002-test-change-second-task.md'),
        `---
status: in-progress
parent-type: change
parent-id: test-change
---

# Task: Second Task

## Implementation Checklist
- [x] Done
`
      );
      // Third task is to-do with unchecked items (makes change actionable for prioritization)
      await fs.writeFile(
        path.join(centralTasksDir, '003-test-change-third-task.md'),
        `---
status: to-do
parent-type: change
parent-id: test-change
---

# Task: Third Task

## Implementation Checklist
- [ ] Not done
`
      );

      const originalCwd = process.cwd();
      try {
        process.chdir(testDir);
        const output = execSync(`node ${plxBin} get task`, {
          encoding: 'utf-8',
        });

        // Should show auto-completed message
        expect(output).toContain('Auto-completed task: 002-test-change-second-task');

        // Should show third task (the next task after auto-completion)
        expect(output).toContain('Task 3: 003-test-change-third-task');

        // Verify second task is now done
        const secondTaskContent = await fs.readFile(
          path.join(centralTasksDir, '002-test-change-second-task.md'),
          'utf-8'
        );
        expect(secondTaskContent).toContain('status: done');

        // Verify third task is now in-progress
        const thirdTaskContent = await fs.readFile(
          path.join(centralTasksDir, '003-test-change-third-task.md'),
          'utf-8'
        );
        expect(thirdTaskContent).toContain('status: in-progress');
      } finally {
        process.chdir(originalCwd);
      }
    });

    it('includes autoCompletedTask in JSON output', async () => {
      const changeDir = path.join(changesDir, 'test-change');
      await fs.mkdir(changeDir, { recursive: true });

      await fs.writeFile(
        path.join(changeDir, 'proposal.md'),
        '# Change: Test Change\n\n## Why\nTest\n\n## What Changes\n- Test'
      );
      // Use centralized task storage
      await fs.writeFile(
        path.join(centralTasksDir, '001-test-change-first-task.md'),
        `---
status: in-progress
parent-type: change
parent-id: test-change
---

# Task: First Task

## Implementation Checklist
- [x] Done
`
      );
      await fs.writeFile(
        path.join(centralTasksDir, '002-test-change-second-task.md'),
        `---
status: to-do
parent-type: change
parent-id: test-change
---

# Task: Second Task

## Implementation Checklist
- [ ] Not done
`
      );

      const originalCwd = process.cwd();
      try {
        process.chdir(testDir);
        const output = execSync(`node ${plxBin} get task --json`, {
          encoding: 'utf-8',
        });
        const json = JSON.parse(output);

        // Should include autoCompletedTask
        expect(json.autoCompletedTask).toBeDefined();
        expect(json.autoCompletedTask.id).toBe('001-test-change-first-task');

        // Should have task info for second task
        expect(json.task).toBeDefined();
        expect(json.task.id).toBe('002-test-change-second-task');

        // Should NOT include changeDocuments
        expect(json.changeDocuments).toBeUndefined();
      } finally {
        process.chdir(originalCwd);
      }
    });

    it('transitions to next change when current change auto-completes', async () => {
      // Create change-a: in-progress task with all checkboxes checked (will auto-complete)
      const changeA = path.join(changesDir, 'change-a');
      await fs.mkdir(changeA, { recursive: true });
      await fs.writeFile(path.join(changeA, 'proposal.md'), '# Change A\n\n## Why\nTest\n\n## What Changes\n- Test');
      // Use centralized task storage
      await fs.writeFile(path.join(centralTasksDir, '001-change-a-task.md'), `---\nstatus: in-progress\nparent-type: change\nparent-id: change-a\n---\n# Task\n## Implementation Checklist\n- [x] Done`);

      // Create change-b: to-do task with incomplete checkboxes (should be selected next)
      const changeB = path.join(changesDir, 'change-b');
      await fs.mkdir(changeB, { recursive: true });
      await fs.writeFile(path.join(changeB, 'proposal.md'), '# Change B\n\n## Why\nTest\n\n## What Changes\n- Test');
      await fs.writeFile(path.join(centralTasksDir, '001-change-b-task.md'), `---\nstatus: to-do\nparent-type: change\nparent-id: change-b\n---\n# Task\n## Implementation Checklist\n- [ ] Not done`);

      const originalCwd = process.cwd();
      try {
        process.chdir(testDir);
        const output = execSync(`node ${plxBin} get task --json`, { encoding: 'utf-8' });
        const json = JSON.parse(output);

        expect(json.autoCompletedTask).toBeDefined();
        expect(json.changeId).toBe('change-b');
        expect(json.task).toBeDefined();
        expect(json.message).toBeUndefined();
      } finally {
        process.chdir(originalCwd);
      }
    });

    it('shows all tasks complete only when no other changes have pending tasks', async () => {
      // Single change with in-progress task that will auto-complete
      const changeA = path.join(changesDir, 'change-a');
      await fs.mkdir(changeA, { recursive: true });
      await fs.writeFile(path.join(changeA, 'proposal.md'), '# Change A\n\n## Why\nTest\n\n## What Changes\n- Test');
      // Use centralized task storage
      await fs.writeFile(path.join(centralTasksDir, '001-change-a-task.md'), `---\nstatus: in-progress\nparent-type: change\nparent-id: change-a\n---\n# Task\n## Implementation Checklist\n- [x] Done`);

      const originalCwd = process.cwd();
      try {
        process.chdir(testDir);
        const output = execSync(`node ${plxBin} get task 2>&1`, { encoding: 'utf-8' });
        expect(output).toContain('Auto-completed task');
        expect(output).toContain('All tasks complete');
      } finally {
        process.chdir(originalCwd);
      }
    });

    it('auto-completes single in-progress task when all checklist items are checked', async () => {
      // Bug regression test: when a change has only one in-progress task with all items
      // checked (100% checkbox completion), it was filtered out as "non-actionable"
      // before auto-completion could run, leaving the task stuck in in-progress status.
      const changeDir = path.join(changesDir, 'test-change');
      await fs.mkdir(changeDir, { recursive: true });

      await fs.writeFile(
        path.join(changeDir, 'proposal.md'),
        '# Change: Test Change\n\n## Why\nTest\n\n## What Changes\n- Test'
      );
      // Use centralized task storage - Single in-progress task with all checkboxes checked
      await fs.writeFile(
        path.join(centralTasksDir, '001-test-change-only-task.md'),
        `---
status: in-progress
parent-type: change
parent-id: test-change
---

# Task: Only Task

## Implementation Checklist
- [x] Step one
- [x] Step two
`
      );

      const originalCwd = process.cwd();
      try {
        process.chdir(testDir);
        // Use 2>&1 to capture both stdout and stderr (ora outputs to stderr)
        const output = execSync(`node ${plxBin} get task 2>&1`, {
          encoding: 'utf-8',
        });

        // Should show auto-completed message
        expect(output).toContain('Auto-completed task: 001-test-change-only-task');

        // Should show all tasks complete
        expect(output).toContain('All tasks complete');

        // Verify task is now done
        const taskContent = await fs.readFile(
          path.join(centralTasksDir, '001-test-change-only-task.md'),
          'utf-8'
        );
        expect(taskContent).toContain('status: done');
      } finally {
        process.chdir(originalCwd);
      }
    });
  });

  describe('change prioritization', () => {
    it('skips completed changes and selects actionable one', async () => {
      // Create complete-change with all tasks marked done (should be skipped)
      const completeChange = path.join(changesDir, 'complete-change');
      await fs.mkdir(completeChange, { recursive: true });
      await fs.writeFile(
        path.join(completeChange, 'proposal.md'),
        '# Change: Complete\n\n## Why\nTest\n\n## What Changes\n- Test'
      );
      // Use centralized task storage
      await fs.writeFile(
        path.join(centralTasksDir, '001-complete-change-task.md'),
        `---
status: done
parent-type: change
parent-id: complete-change
---
# Task
## Implementation Checklist
- [x] Done
- [x] Also done
`
      );

      // Create actionable-change with a to-do task
      const actionableChange = path.join(changesDir, 'actionable-change');
      await fs.mkdir(actionableChange, { recursive: true });
      await fs.writeFile(
        path.join(actionableChange, 'proposal.md'),
        '# Change: Actionable\n\n## Why\nTest\n\n## What Changes\n- Test'
      );
      await fs.writeFile(
        path.join(centralTasksDir, '001-actionable-change-task.md'),
        `---
status: to-do
parent-type: change
parent-id: actionable-change
---
# Task
## Implementation Checklist
- [x] Done
- [ ] Not done
`
      );

      const originalCwd = process.cwd();
      try {
        process.chdir(testDir);
        const output = execSync(`node ${plxBin} get task --json`, {
          encoding: 'utf-8',
        });
        const json = JSON.parse(output);
        expect(json.changeId).toBe('actionable-change');
      } finally {
        process.chdir(originalCwd);
      }
    });

    it('selects change with highest completion percentage', async () => {
      // Create change-a with 25% completion (1/4 tasks done)
      const changeA = path.join(changesDir, 'change-a');
      await fs.mkdir(changeA, { recursive: true });
      await fs.writeFile(
        path.join(changeA, 'proposal.md'),
        '# Change: A\n\n## Why\nTest\n\n## What Changes\n- Test'
      );
      // Use centralized task storage
      await fs.writeFile(path.join(centralTasksDir, '001-change-a-done.md'), `---\nstatus: done\nparent-type: change\nparent-id: change-a\n---\n# Task 1`);
      await fs.writeFile(path.join(centralTasksDir, '002-change-a-todo1.md'), `---\nstatus: to-do\nparent-type: change\nparent-id: change-a\n---\n# Task 2`);
      await fs.writeFile(path.join(centralTasksDir, '003-change-a-todo2.md'), `---\nstatus: to-do\nparent-type: change\nparent-id: change-a\n---\n# Task 3`);
      await fs.writeFile(path.join(centralTasksDir, '004-change-a-todo3.md'), `---\nstatus: to-do\nparent-type: change\nparent-id: change-a\n---\n# Task 4`);

      // Create change-b with 75% completion (3/4 tasks done)
      const changeB = path.join(changesDir, 'change-b');
      await fs.mkdir(changeB, { recursive: true });
      await fs.writeFile(
        path.join(changeB, 'proposal.md'),
        '# Change: B\n\n## Why\nTest\n\n## What Changes\n- Test'
      );
      await fs.writeFile(path.join(centralTasksDir, '001-change-b-done1.md'), `---\nstatus: done\nparent-type: change\nparent-id: change-b\n---\n# Task 1`);
      await fs.writeFile(path.join(centralTasksDir, '002-change-b-done2.md'), `---\nstatus: done\nparent-type: change\nparent-id: change-b\n---\n# Task 2`);
      await fs.writeFile(path.join(centralTasksDir, '003-change-b-done3.md'), `---\nstatus: done\nparent-type: change\nparent-id: change-b\n---\n# Task 3`);
      await fs.writeFile(path.join(centralTasksDir, '004-change-b-todo.md'), `---\nstatus: to-do\nparent-type: change\nparent-id: change-b\n---\n# Task 4`);

      const originalCwd = process.cwd();
      try {
        process.chdir(testDir);
        const output = execSync(`node ${plxBin} get task --json`, {
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
      await fs.mkdir(changeDir, { recursive: true });

      await fs.writeFile(
        path.join(changeDir, 'proposal.md'),
        '# Change: Test\n\n## Why\nTest\n\n## What Changes\n- Test'
      );
      // Use centralized task storage
      await fs.writeFile(
        path.join(centralTasksDir, '001-test-change-done.md'),
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
      await fs.writeFile(
        path.join(centralTasksDir, '002-test-change-in-progress.md'),
        `---
status: in-progress
parent-type: change
parent-id: test-change
---

# Task: In Progress
## Implementation Checklist
- [ ] Working on it
`
      );
      await fs.writeFile(
        path.join(centralTasksDir, '003-test-change-todo.md'),
        `---
status: to-do
parent-type: change
parent-id: test-change
---

# Task: Todo
## Implementation Checklist
- [ ] Not started
`
      );

      const originalCwd = process.cwd();
      try {
        process.chdir(testDir);
        const output = execSync(`node ${plxBin} get task --json`, {
          encoding: 'utf-8',
        });
        const json = JSON.parse(output);
        expect(json.task.filename).toBe('002-test-change-in-progress.md');
        expect(json.task.status).toBe('in-progress');
      } finally {
        process.chdir(originalCwd);
      }
    });
  });

  describe('--id flag', () => {
    it('retrieves a specific task by ID', async () => {
      const changeDir = path.join(changesDir, 'test-change');
      await fs.mkdir(changeDir, { recursive: true });

      await fs.writeFile(
        path.join(changeDir, 'proposal.md'),
        '# Change: Test\n\n## Why\nTest\n\n## What Changes\n- Test'
      );
      await fs.writeFile(
        path.join(centralTasksDir, '001-first-task.md'),
        `---
status: to-do
---

# Task: First Task

## Implementation Checklist
- [ ] First item
`
      );
      await fs.writeFile(
        path.join(centralTasksDir, '002-second-task.md'),
        `---
status: to-do
---

# Task: Second Task

## Implementation Checklist
- [ ] Second item
`
      );

      const originalCwd = process.cwd();
      try {
        process.chdir(testDir);
        const output = execSync(
          `node ${plxBin} get task --id 002-second-task`,
          { encoding: 'utf-8' }
        );
        expect(output).toContain('Task 2: 002-second-task');
        expect(output).toContain('Second item');
        expect(output).not.toContain('First item');
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
            `node ${plxBin} get task --id nonexistent --json`,
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

    it('retrieves parented task by ID', async () => {
      const changeDir = path.join(changesDir, 'test-change');
      await fs.mkdir(changeDir, { recursive: true });

      await fs.writeFile(
        path.join(changeDir, 'proposal.md'),
        '# Change: Test\n\n## Why\nTest\n\n## What Changes\n- Test'
      );
      await fs.writeFile(
        path.join(centralTasksDir, '001-test-change-my-task.md'),
        `---
status: in-progress
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
          `node ${plxBin} get task --id 001-test-change-my-task --json`,
          { encoding: 'utf-8' }
        );
        const json = JSON.parse(output);
        expect(json.changeId).toBe('test-change');
        expect(json.task.id).toBe('001-test-change-my-task');
      } finally {
        process.chdir(originalCwd);
      }
    });
  });

  describe('auto-transition on retrieval', () => {
    it('auto-transitions to-do task to in-progress when retrieved via prioritization', async () => {
      const changeDir = path.join(changesDir, 'test-change');
      await fs.mkdir(changeDir, { recursive: true });

      await fs.writeFile(
        path.join(changeDir, 'proposal.md'),
        '# Change: Test\n\n## Why\nTest\n\n## What Changes\n- Test'
      );
      // Use centralized task storage
      await fs.writeFile(
        path.join(centralTasksDir, '001-test-change-first-task.md'),
        `---
status: to-do
parent-type: change
parent-id: test-change
---

# Task: First Task

## Implementation Checklist
- [ ] Do something
`
      );

      const originalCwd = process.cwd();
      try {
        process.chdir(testDir);
        const output = execSync(`node ${plxBin} get task --json`, {
          encoding: 'utf-8',
        });
        const json = JSON.parse(output);

        expect(json.task.status).toBe('in-progress');
        expect(json.transitionedToInProgress).toBe(true);

        // Verify file was updated
        const taskContent = await fs.readFile(
          path.join(centralTasksDir, '001-test-change-first-task.md'),
          'utf-8'
        );
        expect(taskContent).toContain('status: in-progress');
      } finally {
        process.chdir(originalCwd);
      }
    });

    it('auto-transitions to-do task to in-progress when retrieved by --id', async () => {
      const changeDir = path.join(changesDir, 'test-change');
      await fs.mkdir(changeDir, { recursive: true });

      await fs.writeFile(
        path.join(changeDir, 'proposal.md'),
        '# Change: Test\n\n## Why\nTest\n\n## What Changes\n- Test'
      );
      await fs.writeFile(
        path.join(centralTasksDir, '001-my-task.md'),
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
          `node ${plxBin} get task --id 001-my-task --json`,
          { encoding: 'utf-8' }
        );
        const json = JSON.parse(output);

        expect(json.task.status).toBe('in-progress');
        expect(json.transitionedToInProgress).toBe(true);

        // Verify file was updated
        const taskContent = await fs.readFile(
          path.join(centralTasksDir, '001-my-task.md'),
          'utf-8'
        );
        expect(taskContent).toContain('status: in-progress');
      } finally {
        process.chdir(originalCwd);
      }
    });

    it('does NOT transition already in-progress tasks', async () => {
      const changeDir = path.join(changesDir, 'test-change');
      await fs.mkdir(changeDir, { recursive: true });

      await fs.writeFile(
        path.join(changeDir, 'proposal.md'),
        '# Change: Test\n\n## Why\nTest\n\n## What Changes\n- Test'
      );
      // Use centralized task storage
      await fs.writeFile(
        path.join(centralTasksDir, '001-test-change-task.md'),
        `---
status: in-progress
parent-type: change
parent-id: test-change
---

# Task: Test

## Implementation Checklist
- [ ] Something
`
      );

      const originalCwd = process.cwd();
      try {
        process.chdir(testDir);
        const output = execSync(`node ${plxBin} get task --json`, {
          encoding: 'utf-8',
        });
        const json = JSON.parse(output);

        expect(json.task.status).toBe('in-progress');
        // transitionedToInProgress is only included when true
        expect(json.transitionedToInProgress).toBeUndefined();
      } finally {
        process.chdir(originalCwd);
      }
    });

    it('does not include transitionedToInProgress when not transitioned (--id retrieval)', async () => {
      const changeDir = path.join(changesDir, 'test-change');
      await fs.mkdir(changeDir, { recursive: true });

      await fs.writeFile(
        path.join(changeDir, 'proposal.md'),
        '# Change: Test\n\n## Why\nTest\n\n## What Changes\n- Test'
      );
      await fs.writeFile(
        path.join(centralTasksDir, '001-task.md'),
        `---
status: in-progress
---

# Task: Test

## Implementation Checklist
- [ ] Something
`
      );

      const originalCwd = process.cwd();
      try {
        process.chdir(testDir);
        const output = execSync(
          `node ${plxBin} get task --id 001-task --json`,
          { encoding: 'utf-8' }
        );
        const json = JSON.parse(output);

        // transitionedToInProgress is only included when true
        expect(json.transitionedToInProgress).toBeUndefined();
      } finally {
        process.chdir(originalCwd);
      }
    });
  });

  describe('--constraints and --acceptance-criteria flags', () => {
    it('filters to only Constraints section', async () => {
      const changeDir = path.join(changesDir, 'test-change');
      await fs.mkdir(changeDir, { recursive: true });

      await fs.writeFile(
        path.join(changeDir, 'proposal.md'),
        '# Change: Test\n\n## Why\nTest\n\n## What Changes\n- Test'
      );
      // Use centralized task storage
      await fs.writeFile(
        path.join(centralTasksDir, '001-test-change-task.md'),
        `---
status: in-progress
parent-type: change
parent-id: test-change
---

# Task: Test Task

## Constraints
- [ ] Must be fast
- [ ] Must be secure

## Acceptance Criteria
- [ ] Works correctly
- [ ] Has tests

## Implementation Checklist
- [ ] Do something
`
      );

      const originalCwd = process.cwd();
      try {
        process.chdir(testDir);
        const output = execSync(
          `node ${plxBin} get task --constraints`,
          { encoding: 'utf-8' }
        );
        expect(output).toContain('Constraints');
        expect(output).toContain('Must be fast');
        expect(output).not.toContain('Works correctly');
        expect(output).not.toContain('Implementation Checklist');
      } finally {
        process.chdir(originalCwd);
      }
    });

    it('filters to only Acceptance Criteria section', async () => {
      const changeDir = path.join(changesDir, 'test-change');
      await fs.mkdir(changeDir, { recursive: true });

      await fs.writeFile(
        path.join(changeDir, 'proposal.md'),
        '# Change: Test\n\n## Why\nTest\n\n## What Changes\n- Test'
      );
      // Use centralized task storage
      await fs.writeFile(
        path.join(centralTasksDir, '001-test-change-task.md'),
        `---
status: in-progress
parent-type: change
parent-id: test-change
---

# Task: Test Task

## Constraints
- [ ] Must be fast

## Acceptance Criteria
- [ ] Works correctly
- [ ] Has tests

## Implementation Checklist
- [ ] Do something
`
      );

      const originalCwd = process.cwd();
      try {
        process.chdir(testDir);
        const output = execSync(
          `node ${plxBin} get task --acceptance-criteria`,
          { encoding: 'utf-8' }
        );
        expect(output).toContain('Acceptance Criteria');
        expect(output).toContain('Works correctly');
        expect(output).not.toContain('Must be fast');
        expect(output).not.toContain('Implementation Checklist');
      } finally {
        process.chdir(originalCwd);
      }
    });

    it('shows both sections when both flags are used', async () => {
      const changeDir = path.join(changesDir, 'test-change');
      await fs.mkdir(changeDir, { recursive: true });

      await fs.writeFile(
        path.join(changeDir, 'proposal.md'),
        '# Change: Test\n\n## Why\nTest\n\n## What Changes\n- Test'
      );
      // Use centralized task storage
      await fs.writeFile(
        path.join(centralTasksDir, '001-test-change-task.md'),
        `---
status: in-progress
parent-type: change
parent-id: test-change
---

# Task: Test Task

## Constraints
- [ ] Constraint item

## Acceptance Criteria
- [ ] Acceptance item

## Implementation Checklist
- [ ] Impl item
`
      );

      const originalCwd = process.cwd();
      try {
        process.chdir(testDir);
        const output = execSync(
          `node ${plxBin} get task --constraints --acceptance-criteria`,
          { encoding: 'utf-8' }
        );
        expect(output).toContain('Constraints');
        expect(output).toContain('Constraint item');
        expect(output).toContain('Acceptance Criteria');
        expect(output).toContain('Acceptance item');
        expect(output).not.toContain('Impl item');
      } finally {
        process.chdir(originalCwd);
      }
    });

    it('works with --id flag', async () => {
      const changeDir = path.join(changesDir, 'test-change');
      await fs.mkdir(changeDir, { recursive: true });

      await fs.writeFile(
        path.join(changeDir, 'proposal.md'),
        '# Change: Test\n\n## Why\nTest\n\n## What Changes\n- Test'
      );
      await fs.writeFile(
        path.join(centralTasksDir, '001-task.md'),
        `---
status: to-do
---

# Task: Test

## Constraints
- [ ] Only this

## Implementation Checklist
- [ ] Not this
`
      );

      const originalCwd = process.cwd();
      try {
        process.chdir(testDir);
        const output = execSync(
          `node ${plxBin} get task --id 001-task --constraints`,
          { encoding: 'utf-8' }
        );
        expect(output).toContain('Only this');
        expect(output).not.toContain('Not this');
      } finally {
        process.chdir(originalCwd);
      }
    });
  });
});

describe('get change command', () => {
  const projectRoot = process.cwd();
  const testDir = path.join(projectRoot, 'test-get-change-tmp');
  const changesDir = path.join(testDir, 'workspace', 'changes');
  const plxBin = path.join(projectRoot, 'bin', 'plx.js');

  beforeEach(async () => {
    await createValidPlxWorkspace(testDir);
    await fs.mkdir(changesDir, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
  });

  it('retrieves a change by ID', async () => {
    const changeDir = path.join(changesDir, 'my-change');
    const tasksDir = path.join(changeDir, 'tasks');
    await fs.mkdir(tasksDir, { recursive: true });

    await fs.writeFile(
      path.join(changeDir, 'proposal.md'),
      '# Change: My Change\n\n## Why\nBecause\n\n## What Changes\n- Something'
    );
    await fs.writeFile(
      path.join(changeDir, 'design.md'),
      '## Design\n\nDesign content here'
    );
    await fs.writeFile(
      path.join(tasksDir, '001-task.md'),
      '# Task\n## Implementation Checklist\n- [ ] Item'
    );

    const originalCwd = process.cwd();
    try {
      process.chdir(testDir);
      const output = execSync(
        `node ${plxBin} get change --id my-change`,
        { encoding: 'utf-8' }
      );
      expect(output).toContain('Proposal: my-change');
      expect(output).toContain('My Change');
      expect(output).toContain('Design');
      expect(output).toContain('Design content here');
      expect(output).toContain('Tasks');
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
          `node ${plxBin} get change --id nonexistent --json`,
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

  it('outputs JSON format', async () => {
    const changeDir = path.join(changesDir, 'test-change');
    const tasksDir = path.join(changeDir, 'tasks');
    await fs.mkdir(tasksDir, { recursive: true });

    await fs.writeFile(
      path.join(changeDir, 'proposal.md'),
      '# Change: Test\n\n## Why\nTest\n\n## What Changes\n- Test'
    );
    await fs.writeFile(
      path.join(tasksDir, '001-task.md'),
      '# Task\n## Implementation Checklist\n- [ ] Item'
    );

    const originalCwd = process.cwd();
    try {
      process.chdir(testDir);
      const output = execSync(
        `node ${plxBin} get change --id test-change --json`,
        { encoding: 'utf-8' }
      );
      const json = JSON.parse(output);
      expect(json.changeId).toBe('test-change');
      expect(json.proposal).toContain('Test');
      expect(json.tasks).toHaveLength(1);
    } finally {
      process.chdir(originalCwd);
    }
  });

  it('supports --deltas-only filter', async () => {
    const changeDir = path.join(changesDir, 'test-change');
    const specsDir = path.join(changeDir, 'specs');
    await fs.mkdir(specsDir, { recursive: true });

    await fs.writeFile(
      path.join(changeDir, 'proposal.md'),
      '# Change: Test\n\n## Why\nTest\n\n## What Changes\n- **auth:** Add login'
    );
    await fs.writeFile(
      path.join(specsDir, 'auth.md'),
      `## ADDED Requirements

### Requirement: User Login
Users can log in`
    );

    const originalCwd = process.cwd();
    try {
      process.chdir(testDir);
      const output = execSync(
        `node ${plxBin} get change --id test-change --json --deltas-only`,
        { encoding: 'utf-8' }
      );
      const json = JSON.parse(output);
      expect(json.changeId).toBe('test-change');
      expect(json.deltas).toBeDefined();
      expect(Array.isArray(json.deltas)).toBe(true);
      expect(json.proposal).toBeUndefined();
      expect(json.tasks).toBeUndefined();
    } finally {
      process.chdir(originalCwd);
    }
  });
});

describe('get spec command', () => {
  const projectRoot = process.cwd();
  const testDir = path.join(projectRoot, 'test-get-spec-tmp');
  const specsDir = path.join(testDir, 'workspace', 'specs');
  const plxBin = path.join(projectRoot, 'bin', 'plx.js');

  beforeEach(async () => {
    await createValidPlxWorkspace(testDir);
    await fs.mkdir(specsDir, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
  });

  it('retrieves a spec by ID', async () => {
    const specDir = path.join(specsDir, 'user-auth');
    await fs.mkdir(specDir, { recursive: true });

    await fs.writeFile(
      path.join(specDir, 'spec.md'),
      '# Spec: User Authentication\n\n## Requirements\n- Users can log in'
    );

    const originalCwd = process.cwd();
    try {
      process.chdir(testDir);
      const output = execSync(
        `node ${plxBin} get spec --id user-auth`,
        { encoding: 'utf-8' }
      );
      expect(output).toContain('Spec: user-auth');
      expect(output).toContain('User Authentication');
      expect(output).toContain('Users can log in');
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
          `node ${plxBin} get spec --id nonexistent --json`,
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

  it('outputs JSON format', async () => {
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
        `node ${plxBin} get spec --id test-spec --json`,
        { encoding: 'utf-8' }
      );
      const json = JSON.parse(output);
      expect(json.specId).toBe('test-spec');
      expect(json.content).toContain('Requirement 1');
    } finally {
      process.chdir(originalCwd);
    }
  });

  it('supports --requirements filter', async () => {
    const specDir = path.join(specsDir, 'test-spec');
    await fs.mkdir(specDir, { recursive: true });

    await fs.writeFile(
      path.join(specDir, 'spec.md'),
      `## Purpose
Test spec

## Requirements

### Requirement: User Login
User can log in

#### Scenario: Valid credentials
When user enters valid credentials`
    );

    const originalCwd = process.cwd();
    try {
      process.chdir(testDir);
      const output = execSync(
        `node ${plxBin} get spec --id test-spec --json --requirements`,
        { encoding: 'utf-8' }
      );
      const json = JSON.parse(output);
      expect(json.specId).toBe('test-spec');
      expect(json.requirements).toBeDefined();
      expect(json.requirements[0].text).toBe('User can log in');
      expect(json.requirements[0].scenarios).toHaveLength(0);
    } finally {
      process.chdir(originalCwd);
    }
  });

  it('supports --no-scenarios filter', async () => {
    const specDir = path.join(specsDir, 'test-spec');
    await fs.mkdir(specDir, { recursive: true });

    await fs.writeFile(
      path.join(specDir, 'spec.md'),
      `## Purpose
Test spec

## Requirements

### Requirement: User Login
User can log in

#### Scenario: Valid credentials
When user enters valid credentials`
    );

    const originalCwd = process.cwd();
    try {
      process.chdir(testDir);
      const output = execSync(
        `node ${plxBin} get spec --id test-spec --json --no-scenarios`,
        { encoding: 'utf-8' }
      );
      const json = JSON.parse(output);
      expect(json.specId).toBe('test-spec');
      expect(json.requirements).toBeDefined();
      expect(json.requirements[0].text).toBe('User can log in');
      expect(json.requirements[0].scenarios).toHaveLength(0);
    } finally {
      process.chdir(originalCwd);
    }
  });

  it('supports -r filter for specific requirement', async () => {
    const specDir = path.join(specsDir, 'test-spec');
    await fs.mkdir(specDir, { recursive: true });

    await fs.writeFile(
      path.join(specDir, 'spec.md'),
      `## Purpose
Test spec

## Requirements

### Requirement: First
First requirement

### Requirement: Second
Second requirement`
    );

    const originalCwd = process.cwd();
    try {
      process.chdir(testDir);
      const output = execSync(
        `node ${plxBin} get spec --id test-spec --json -r 2`,
        { encoding: 'utf-8' }
      );
      const json = JSON.parse(output);
      expect(json.specId).toBe('test-spec');
      expect(json.requirements).toHaveLength(1);
      expect(json.requirements[0].text).toBe('Second requirement');
    } finally {
      process.chdir(originalCwd);
    }
  });
});

describe('get tasks command', () => {
  const projectRoot = process.cwd();
  const testDir = path.join(projectRoot, 'test-get-tasks-tmp');
  const changesDir = path.join(testDir, 'workspace', 'changes');
  const centralTasksDir = path.join(testDir, 'workspace', 'tasks');
  const plxBin = path.join(projectRoot, 'bin', 'plx.js');

  beforeEach(async () => {
    await createValidPlxWorkspace(testDir);
    await fs.mkdir(changesDir, { recursive: true });
    await fs.mkdir(centralTasksDir, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
  });

  it('lists all open tasks', async () => {
    const change1Dir = path.join(changesDir, 'change-one');
    await fs.mkdir(change1Dir, { recursive: true });
    const change2Dir = path.join(changesDir, 'change-two');
    await fs.mkdir(change2Dir, { recursive: true });

    await fs.writeFile(
      path.join(change1Dir, 'proposal.md'),
      '# Change: One\n\n## Why\nTest\n\n## What Changes\n- Test'
    );
    await fs.writeFile(
      path.join(change2Dir, 'proposal.md'),
      '# Change: Two\n\n## Why\nTest\n\n## What Changes\n- Test'
    );

    await fs.writeFile(
      path.join(centralTasksDir, '001-change-one-task-a.md'),
      `---
status: in-progress
parent-type: change
parent-id: change-one
---
# Task A`
    );
    await fs.writeFile(
      path.join(centralTasksDir, '002-change-one-task-b.md'),
      `---
status: to-do
parent-type: change
parent-id: change-one
---
# Task B`
    );
    await fs.writeFile(
      path.join(centralTasksDir, '003-change-two-task-c.md'),
      `---
status: to-do
parent-type: change
parent-id: change-two
---
# Task C`
    );

    const originalCwd = process.cwd();
    try {
      process.chdir(testDir);
      const output = execSync(`node ${plxBin} get tasks --json`, {
        encoding: 'utf-8',
      });
      const json = JSON.parse(output);
      expect(json.tasks).toHaveLength(3);
      expect(json.tasks.map((t: { id: string }) => t.id)).toContain('001-change-one-task-a');
      expect(json.tasks.map((t: { id: string }) => t.id)).toContain('002-change-one-task-b');
      expect(json.tasks.map((t: { id: string }) => t.id)).toContain('003-change-two-task-c');
    } finally {
      process.chdir(originalCwd);
    }
  });

  it('lists tasks for a specific change', async () => {
    const changeDir = path.join(changesDir, 'my-change');
    await fs.mkdir(changeDir, { recursive: true });

    await fs.writeFile(
      path.join(changeDir, 'proposal.md'),
      '# Change: My\n\n## Why\nTest\n\n## What Changes\n- Test'
    );
    await fs.writeFile(
      path.join(centralTasksDir, '001-my-change-first.md'),
      `---
status: done
parent-type: change
parent-id: my-change
---
# First`
    );
    await fs.writeFile(
      path.join(centralTasksDir, '002-my-change-second.md'),
      `---
status: in-progress
parent-type: change
parent-id: my-change
---
# Second`
    );

    const originalCwd = process.cwd();
    try {
      process.chdir(testDir);
      const output = execSync(
        `node ${plxBin} get tasks --parent-id my-change --json`,
        { encoding: 'utf-8' }
      );
      const json = JSON.parse(output);
      expect(json.parentId).toBe('my-change');
      expect(json.tasks).toHaveLength(2);
    } finally {
      process.chdir(originalCwd);
    }
  });

  it('shows info when no open tasks exist', async () => {
    const changeDir = path.join(changesDir, 'complete-change');
    await fs.mkdir(changeDir, { recursive: true });

    await fs.writeFile(
      path.join(changeDir, 'proposal.md'),
      '# Change: Complete\n\n## Why\nTest\n\n## What Changes\n- Test'
    );
    await fs.writeFile(
      path.join(centralTasksDir, '001-complete-change-done.md'),
      `---
status: done
parent-type: change
parent-id: complete-change
---
# Done`
    );

    const originalCwd = process.cwd();
    try {
      process.chdir(testDir);
      const output = execSync(`node ${plxBin} get tasks --json`, {
        encoding: 'utf-8',
      });
      const json = JSON.parse(output);
      expect(json.tasks).toHaveLength(0);
    } finally {
      process.chdir(originalCwd);
    }
  });

  it('displays table format for text output', async () => {
    const changeDir = path.join(changesDir, 'test-change');
    await fs.mkdir(changeDir, { recursive: true });

    await fs.writeFile(
      path.join(changeDir, 'proposal.md'),
      '# Change: Test\n\n## Why\nTest\n\n## What Changes\n- Test'
    );
    await fs.writeFile(
      path.join(centralTasksDir, '001-test-change-my-task.md'),
      `---
status: in-progress
parent-type: change
parent-id: test-change
---
# My Task`
    );

    const originalCwd = process.cwd();
    try {
      process.chdir(testDir);
      const output = execSync(`node ${plxBin} get tasks`, {
        encoding: 'utf-8',
      });
      expect(output).toContain('Open Tasks');
      expect(output).toContain('my-task');
      expect(output).toContain('in-progress');
      expect(output).toContain('test-change');
    } finally {
      process.chdir(originalCwd);
    }
  });

  describe('task ID format', () => {
    it('includes full filename (with sequence prefix) as ID in JSON output', async () => {
      const changeDir = path.join(changesDir, 'test-change');
      await fs.mkdir(changeDir, { recursive: true });

      await fs.writeFile(
        path.join(changeDir, 'proposal.md'),
        '# Change: Test\n\n## Why\nTest\n\n## What Changes\n- Test'
      );
      await fs.writeFile(
        path.join(centralTasksDir, '001-first-task.md'),
        `---
status: in-progress
---
# First Task`
      );
      await fs.writeFile(
        path.join(centralTasksDir, '002-second-task.md'),
        `---
status: to-do
---
# Second Task`
      );

      const originalCwd = process.cwd();
      try {
        process.chdir(testDir);
        const output = execSync(`node ${plxBin} get tasks --json`, {
          encoding: 'utf-8',
        });
        const json = JSON.parse(output);

        // IDs should be full filenames without .md (e.g., "001-first-task")
        const ids = json.tasks.map((t: { id: string }) => t.id);
        expect(ids).toContain('001-first-task');
        expect(ids).toContain('002-second-task');

        // IDs should NOT contain change ID prefix
        expect(ids.every((id: string) => !id.includes('/'))).toBe(true);
      } finally {
        process.chdir(originalCwd);
      }
    });

    it('displays full filename as ID in text output table', async () => {
      const changeDir = path.join(changesDir, 'my-change');
      await fs.mkdir(changeDir, { recursive: true });

      await fs.writeFile(
        path.join(changeDir, 'proposal.md'),
        '# Change: My\n\n## Why\nTest\n\n## What Changes\n- Test'
      );
      await fs.writeFile(
        path.join(centralTasksDir, '003-my-change-my-task.md'),
        `---
status: to-do
parent-type: change
parent-id: my-change
---
# My Task`
      );

      const originalCwd = process.cwd();
      try {
        process.chdir(testDir);
        const output = execSync(`node ${plxBin} get tasks`, {
          encoding: 'utf-8',
        });

        // Should display "003-my-change-my-task" (full filename without .md)
        expect(output).toContain('003-my-change-my-task');
      } finally {
        process.chdir(originalCwd);
      }
    });

    it('task ID from get tasks can be used with complete command', async () => {
      const changeDir = path.join(changesDir, 'test-change');
      await fs.mkdir(changeDir, { recursive: true });

      await fs.writeFile(
        path.join(changeDir, 'proposal.md'),
        '# Change: Test\n\n## Why\nTest\n\n## What Changes\n- Test'
      );
      await fs.writeFile(
        path.join(centralTasksDir, '001-completable-task.md'),
        `---
status: in-progress
---
# Completable Task

## Implementation Checklist
- [ ] Item one
- [ ] Item two`
      );

      const originalCwd = process.cwd();
      try {
        process.chdir(testDir);

        // Get the task ID from get tasks
        const listOutput = execSync(`node ${plxBin} get tasks --json`, {
          encoding: 'utf-8',
        });
        const json = JSON.parse(listOutput);
        const taskId = json.tasks[0].id;

        // The ID should be usable with complete command
        const completeOutput = execSync(
          `node ${plxBin} complete task --id ${taskId} --json`,
          { encoding: 'utf-8' }
        );
        const completeJson = JSON.parse(completeOutput);
        expect(completeJson.newStatus).toBe('done');
        expect(completeJson.taskId).toBe('001-completable-task');
      } finally {
        process.chdir(originalCwd);
      }
    });

    it('task ID from get tasks can be used with undo command', async () => {
      const changeDir = path.join(changesDir, 'test-change');
      await fs.mkdir(changeDir, { recursive: true });

      await fs.writeFile(
        path.join(changeDir, 'proposal.md'),
        '# Change: Test\n\n## Why\nTest\n\n## What Changes\n- Test'
      );
      await fs.writeFile(
        path.join(centralTasksDir, '001-undoable-task.md'),
        `---
status: done
---
# Undoable Task

## Implementation Checklist
- [x] Done item`
      );

      const originalCwd = process.cwd();
      try {
        process.chdir(testDir);

        // The task ID should work with undo command
        const undoOutput = execSync(
          `node ${plxBin} undo task --id 001-undoable-task --json`,
          { encoding: 'utf-8' }
        );
        const undoJson = JSON.parse(undoOutput);
        expect(undoJson.newStatus).toBe('to-do');
        expect(undoJson.taskId).toBe('001-undoable-task');
      } finally {
        process.chdir(originalCwd);
      }
    });

    it('includes full filename as ID in tasks list for specific change', async () => {
      const changeDir = path.join(changesDir, 'specific-change');
      await fs.mkdir(changeDir, { recursive: true });

      await fs.writeFile(
        path.join(changeDir, 'proposal.md'),
        '# Change: Specific\n\n## Why\nTest\n\n## What Changes\n- Test'
      );
      await fs.writeFile(
        path.join(centralTasksDir, '001-specific-change-task-one.md'),
        `---
status: to-do
parent-type: change
parent-id: specific-change
---
# Task One`
      );
      await fs.writeFile(
        path.join(centralTasksDir, '002-specific-change-task-two.md'),
        `---
status: to-do
parent-type: change
parent-id: specific-change
---
# Task Two`
      );

      const originalCwd = process.cwd();
      try {
        process.chdir(testDir);
        const output = execSync(
          `node ${plxBin} get tasks --parent-id specific-change --json`,
          { encoding: 'utf-8' }
        );
        const json = JSON.parse(output);

        // IDs should be full filenames without .md
        const ids = json.tasks.map((t: { id: string }) => t.id);
        expect(ids).toContain('001-specific-change-task-one');
        expect(ids).toContain('002-specific-change-task-two');
      } finally {
        process.chdir(originalCwd);
      }
    });
  });
});

describe('get changes command', () => {
  const projectRoot = process.cwd();
  const testDir = path.join(projectRoot, 'test-get-changes-tmp');
  const changesDir = path.join(testDir, 'workspace', 'changes');
  const plxBin = path.join(projectRoot, 'bin', 'plx.js');

  beforeEach(async () => {
    await createValidPlxWorkspace(testDir);
    await fs.mkdir(changesDir, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
  });

  it('shows "No active changes found" when no changes exist', () => {
    const originalCwd = process.cwd();
    try {
      process.chdir(testDir);
      const output = execSync(`node ${plxBin} get changes 2>&1`, {
        encoding: 'utf-8',
      });
      expect(output).toContain('No active changes found');
    } finally {
      process.chdir(originalCwd);
    }
  });

  it('lists all active changes', async () => {
    const change1Dir = path.join(changesDir, 'change-alpha');
    const tasks1Dir = path.join(change1Dir, 'tasks');
    await fs.mkdir(tasks1Dir, { recursive: true });

    await fs.writeFile(
      path.join(change1Dir, 'proposal.md'),
      '# Change: Alpha\n\n## Why\nTest\n\n## What Changes\n- Test'
    );
    await fs.writeFile(
      path.join(tasks1Dir, '001-task.md'),
      `---
status: done
---
# Task`
    );

    const change2Dir = path.join(changesDir, 'change-beta');
    const tasks2Dir = path.join(change2Dir, 'tasks');
    await fs.mkdir(tasks2Dir, { recursive: true });

    await fs.writeFile(
      path.join(change2Dir, 'proposal.md'),
      '# Change: Beta\n\n## Why\nTest\n\n## What Changes\n- Test'
    );
    await fs.writeFile(
      path.join(tasks2Dir, '001-task.md'),
      `---
status: to-do
---
# Task`
    );

    const originalCwd = process.cwd();
    try {
      process.chdir(testDir);
      const output = execSync(`node ${plxBin} get changes`, {
        encoding: 'utf-8',
      });
      expect(output).toContain('Changes:');
      expect(output).toContain('change-alpha');
      expect(output).toContain('change-beta');
    } finally {
      process.chdir(originalCwd);
    }
  });

  it('outputs JSON format', async () => {
    const changeDir = path.join(changesDir, 'test-change');
    await fs.mkdir(changeDir, { recursive: true });

    // Create centralized tasks directory
    const centralTasksDir = path.join(testDir, 'workspace', 'tasks');
    await fs.mkdir(centralTasksDir, { recursive: true });

    await fs.writeFile(
      path.join(changeDir, 'proposal.md'),
      '# Change: Test\n\n## Why\nTest\n\n## What Changes\n- Test'
    );
    // Tasks now stored in centralized workspace/tasks with parent frontmatter
    await fs.writeFile(
      path.join(centralTasksDir, '001-test-change-task.md'),
      `---
status: in-progress
parent-type: change
parent-id: test-change
---
# Task
## Implementation Checklist
- [x] Done
- [ ] Not done`
    );

    const originalCwd = process.cwd();
    try {
      process.chdir(testDir);
      const output = execSync(`node ${plxBin} get changes --json`, {
        encoding: 'utf-8',
      });
      const json = JSON.parse(output);
      expect(json.changes).toHaveLength(1);
      expect(json.changes[0].id).toBe('test-change');
      expect(json.changes[0].completedTasks).toBe(1);
      expect(json.changes[0].totalTasks).toBe(2);
    } finally {
      process.chdir(originalCwd);
    }
  });

  it('includes tracked issue in output', async () => {
    const changeDir = path.join(changesDir, 'tracked-change');
    await fs.mkdir(changeDir, { recursive: true });

    await fs.writeFile(
      path.join(changeDir, 'proposal.md'),
      `---
tracked-issues:
  - tracker: linear
    id: PROJ-123
    url: https://linear.app/proj/issue/PROJ-123
---

# Change: Tracked

## Why
Test

## What Changes
- Test`
    );

    const originalCwd = process.cwd();
    try {
      process.chdir(testDir);
      const output = execSync(`node ${plxBin} get changes --json`, {
        encoding: 'utf-8',
      });
      const json = JSON.parse(output);
      expect(json.changes[0].trackedIssue).toBe('PROJ-123');
    } finally {
      process.chdir(originalCwd);
    }
  });
});

describe('get specs command', () => {
  const projectRoot = process.cwd();
  const testDir = path.join(projectRoot, 'test-get-specs-tmp');
  const specsDir = path.join(testDir, 'workspace', 'specs');
  const plxBin = path.join(projectRoot, 'bin', 'plx.js');

  beforeEach(async () => {
    await createValidPlxWorkspace(testDir);
    await fs.mkdir(specsDir, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
  });

  it('shows "No specs found" when no specs exist', () => {
    const originalCwd = process.cwd();
    try {
      process.chdir(testDir);
      const output = execSync(`node ${plxBin} get specs 2>&1`, {
        encoding: 'utf-8',
      });
      expect(output).toContain('No specs found');
    } finally {
      process.chdir(originalCwd);
    }
  });

  it('lists all specs', async () => {
    const spec1Dir = path.join(specsDir, 'auth');
    await fs.mkdir(spec1Dir, { recursive: true });
    await fs.writeFile(
      path.join(spec1Dir, 'spec.md'),
      '# Spec: Auth\n\n## Purpose\nAuthentication spec\n\n## Requirements\n### Login\nUsers can log in'
    );

    const spec2Dir = path.join(specsDir, 'users');
    await fs.mkdir(spec2Dir, { recursive: true });
    await fs.writeFile(
      path.join(spec2Dir, 'spec.md'),
      '# Spec: Users\n\n## Purpose\nUser management spec\n\n## Requirements\n### Create\nCreate users\n### Delete\nDelete users'
    );

    const originalCwd = process.cwd();
    try {
      process.chdir(testDir);
      const output = execSync(`node ${plxBin} get specs`, {
        encoding: 'utf-8',
      });
      expect(output).toContain('Specs:');
      expect(output).toContain('auth');
      expect(output).toContain('users');
    } finally {
      process.chdir(originalCwd);
    }
  });

  it('outputs JSON format', async () => {
    const specDir = path.join(specsDir, 'test-spec');
    await fs.mkdir(specDir, { recursive: true });
    await fs.writeFile(
      path.join(specDir, 'spec.md'),
      '# Spec: Test\n\n## Purpose\nTest spec purpose\n\n## Requirements\n### First\nFirst requirement\n### Second\nSecond requirement'
    );

    const originalCwd = process.cwd();
    try {
      process.chdir(testDir);
      const output = execSync(`node ${plxBin} get specs --json`, {
        encoding: 'utf-8',
      });
      const json = JSON.parse(output);
      expect(json.specs).toHaveLength(1);
      expect(json.specs[0].id).toBe('test-spec');
      expect(json.specs[0].requirementCount).toBe(2);
    } finally {
      process.chdir(originalCwd);
    }
  });
});

describe('get reviews command', () => {
  const projectRoot = process.cwd();
  const testDir = path.join(projectRoot, 'test-get-reviews-tmp');
  const reviewsDir = path.join(testDir, 'workspace', 'reviews');
  const plxBin = path.join(projectRoot, 'bin', 'plx.js');

  beforeEach(async () => {
    await createValidPlxWorkspace(testDir);
    await fs.mkdir(reviewsDir, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
  });

  it('shows "No active reviews found" when no reviews exist', () => {
    const originalCwd = process.cwd();
    try {
      process.chdir(testDir);
      const output = execSync(`node ${plxBin} get reviews 2>&1`, {
        encoding: 'utf-8',
      });
      expect(output).toContain('No active reviews found');
    } finally {
      process.chdir(originalCwd);
    }
  });

  it('lists all active reviews', async () => {
    const reviewDir = path.join(reviewsDir, 'test-review');
    const tasksDir = path.join(reviewDir, 'tasks');
    await fs.mkdir(tasksDir, { recursive: true });

    await fs.writeFile(
      path.join(reviewDir, 'review.md'),
      `---
parent-type: change
parent-id: some-change
reviewed-at: 2024-01-01T00:00:00Z
---

# Review: Test Review`
    );
    await fs.writeFile(
      path.join(tasksDir, '001-review-task.md'),
      `---
status: to-do
---
# Review Task`
    );

    const originalCwd = process.cwd();
    try {
      process.chdir(testDir);
      const output = execSync(`node ${plxBin} get reviews`, {
        encoding: 'utf-8',
      });
      expect(output).toContain('Reviews:');
      expect(output).toContain('test-review');
      expect(output).toContain('change');
    } finally {
      process.chdir(originalCwd);
    }
  });

  it('outputs JSON format', async () => {
    const reviewDir = path.join(reviewsDir, 'json-review');
    const tasksDir = path.join(reviewDir, 'tasks');
    await fs.mkdir(tasksDir, { recursive: true });

    await fs.writeFile(
      path.join(reviewDir, 'review.md'),
      `---
parent-type: spec
parent-id: user-auth
reviewed-at: 2024-01-01T00:00:00Z
---

# Review: JSON Review`
    );
    await fs.writeFile(
      path.join(tasksDir, '001-task.md'),
      `---
status: done
---
# Task
## Implementation Checklist
- [x] Done`
    );

    const originalCwd = process.cwd();
    try {
      process.chdir(testDir);
      const output = execSync(`node ${plxBin} get reviews --json`, {
        encoding: 'utf-8',
      });
      const json = JSON.parse(output);
      expect(json.reviews).toHaveLength(1);
      expect(json.reviews[0].id).toBe('json-review');
      expect(json.reviews[0].parentType).toBe('spec');
      expect(json.reviews[0].parentId).toBe('user-auth');
    } finally {
      process.chdir(originalCwd);
    }
  });
});

describe('get review command', () => {
  const projectRoot = process.cwd();
  const testDir = path.join(projectRoot, 'test-get-review-tmp');
  const reviewsDir = path.join(testDir, 'workspace', 'reviews');
  const plxBin = path.join(projectRoot, 'bin', 'plx.js');

  beforeEach(async () => {
    await createValidPlxWorkspace(testDir);
    await fs.mkdir(reviewsDir, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
  });

  it('retrieves a review by ID', async () => {
    const reviewDir = path.join(reviewsDir, 'my-review');
    await fs.mkdir(reviewDir, { recursive: true });

    await fs.writeFile(
      path.join(reviewDir, 'review.md'),
      `---
parent-type: change
parent-id: my-change
reviewed-at: 2024-01-01T00:00:00Z
---

# Review: My Review

Some review content here.`
    );

    const originalCwd = process.cwd();
    try {
      process.chdir(testDir);
      const output = execSync(`node ${plxBin} get review --id my-review`, {
        encoding: 'utf-8',
      });
      expect(output).toContain('Review: my-review');
      expect(output).toContain('Parent: change/my-change');
      expect(output).toContain('Some review content here.');
    } finally {
      process.chdir(originalCwd);
    }
  });

  it('returns error when review not found', async () => {
    const originalCwd = process.cwd();
    try {
      process.chdir(testDir);
      try {
        execSync(`node ${plxBin} get review --id nonexistent --json`, {
          encoding: 'utf-8',
        });
      } catch (error: any) {
        const json = JSON.parse(error.stdout);
        expect(json.error).toContain('Review not found');
      }
    } finally {
      process.chdir(originalCwd);
    }
  });

  it('outputs JSON format', async () => {
    const reviewDir = path.join(reviewsDir, 'json-test-review');
    await fs.mkdir(reviewDir, { recursive: true });

    await fs.writeFile(
      path.join(reviewDir, 'review.md'),
      `---
parent-type: task
parent-id: some-task
reviewed-at: 2024-06-15T12:00:00Z
---

# Review: JSON Test

Content for JSON output.`
    );

    const originalCwd = process.cwd();
    try {
      process.chdir(testDir);
      const output = execSync(
        `node ${plxBin} get review --id json-test-review --json`,
        { encoding: 'utf-8' }
      );
      const json = JSON.parse(output);
      expect(json.reviewId).toBe('json-test-review');
      expect(json.parentType).toBe('task');
      expect(json.parentId).toBe('some-task');
      expect(json.content).toContain('JSON Test');
    } finally {
      process.chdir(originalCwd);
    }
  });
});
