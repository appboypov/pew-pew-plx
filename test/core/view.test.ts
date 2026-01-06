import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { ViewCommand } from '../../src/core/view.js';
import { createValidPlxWorkspace } from '../test-utils.js';

const stripAnsi = (input: string): string => input.replace(/\u001b\[[0-9;]*m/g, '');

describe('ViewCommand', () => {
  let tempDir: string;
  let originalLog: typeof console.log;
  let logOutput: string[] = [];

  beforeEach(async () => {
    tempDir = path.join(os.tmpdir(), `plx-view-test-${Date.now()}`);
    await fs.mkdir(tempDir, { recursive: true });

    originalLog = console.log;
    console.log = (...args: any[]) => {
      logOutput.push(args.join(' '));
    };

    logOutput = [];
  });

  afterEach(async () => {
    console.log = originalLog;
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  it('sorts active changes by completion percentage ascending with deterministic tie-breakers', async () => {
    await createValidPlxWorkspace(tempDir);
    const changesDir = path.join(tempDir, 'workspace', 'changes');
    const tasksDir = path.join(tempDir, 'workspace', 'tasks');
    await fs.mkdir(changesDir, { recursive: true });
    await fs.mkdir(tasksDir, { recursive: true });

    // Create changes with proposal.md files
    await fs.mkdir(path.join(changesDir, 'gamma-change'), { recursive: true });
    await fs.writeFile(path.join(changesDir, 'gamma-change', 'proposal.md'), '# Gamma Change\n');

    await fs.mkdir(path.join(changesDir, 'beta-change'), { recursive: true });
    await fs.writeFile(path.join(changesDir, 'beta-change', 'proposal.md'), '# Beta Change\n');

    await fs.mkdir(path.join(changesDir, 'delta-change'), { recursive: true });
    await fs.writeFile(path.join(changesDir, 'delta-change', 'proposal.md'), '# Delta Change\n');

    await fs.mkdir(path.join(changesDir, 'alpha-change'), { recursive: true });
    await fs.writeFile(path.join(changesDir, 'alpha-change', 'proposal.md'), '# Alpha Change\n');

    // Create centralized task files
    // gamma-change: 2/3 done (66%)
    await fs.writeFile(
      path.join(tasksDir, '001-gamma-task.md'),
      `---
status: to-do
parent-type: change
parent-id: gamma-change
---

# Task: Gamma Task

## Implementation Checklist
- [x] Done
- [x] Also done
- [ ] Not done
`
    );

    // beta-change: 1/2 done (50%)
    await fs.writeFile(
      path.join(tasksDir, '002-beta-task.md'),
      `---
status: to-do
parent-type: change
parent-id: beta-change
---

# Task: Beta Task

## Implementation Checklist
- [x] Task 1
- [ ] Task 2
`
    );

    // delta-change: 1/2 done (50%)
    await fs.writeFile(
      path.join(tasksDir, '003-delta-task.md'),
      `---
status: to-do
parent-type: change
parent-id: delta-change
---

# Task: Delta Task

## Implementation Checklist
- [x] Task 1
- [ ] Task 2
`
    );

    // alpha-change: 0/2 done (0%)
    await fs.writeFile(
      path.join(tasksDir, '004-alpha-task.md'),
      `---
status: to-do
parent-type: change
parent-id: alpha-change
---

# Task: Alpha Task

## Implementation Checklist
- [ ] Task 1
- [ ] Task 2
`
    );

    const viewCommand = new ViewCommand();
    await viewCommand.execute(tempDir);

    const activeLines = logOutput
      .map(stripAnsi)
      .filter(line => line.includes('◉'));

    const activeOrder = activeLines.map(line => {
      const afterBullet = line.split('◉')[1] ?? '';
      return afterBullet.split('[')[0]?.trim();
    });

    expect(activeOrder).toEqual([
      'alpha-change',
      'beta-change',
      'delta-change',
      'gamma-change'
    ]);
  });

  it('filters out changes without proposal.md', async () => {
    await createValidPlxWorkspace(tempDir);
    const changesDir = path.join(tempDir, 'workspace', 'changes');
    const tasksDir = path.join(tempDir, 'workspace', 'tasks');
    await fs.mkdir(changesDir, { recursive: true });
    await fs.mkdir(tasksDir, { recursive: true });

    // Create change WITH proposal.md
    await fs.mkdir(path.join(changesDir, 'valid-change'), { recursive: true });
    await fs.writeFile(path.join(changesDir, 'valid-change', 'proposal.md'), '# Valid Change\n');

    // Create change WITHOUT proposal.md
    await fs.mkdir(path.join(changesDir, 'no-proposal'), { recursive: true });
    await fs.writeFile(path.join(changesDir, 'no-proposal', 'readme.md'), '# Just a readme\n');

    // Create task for valid change
    await fs.writeFile(
      path.join(tasksDir, '001-valid-task.md'),
      `---
status: to-do
parent-type: change
parent-id: valid-change
---

# Task: Valid Task

## Implementation Checklist
- [ ] Task item
`
    );

    const viewCommand = new ViewCommand();
    await viewCommand.execute(tempDir);

    const output = logOutput.map(stripAnsi).join('\n');

    // Should include valid-change
    expect(output).toContain('valid-change');

    // Should NOT include no-proposal
    expect(output).not.toContain('no-proposal');
  });

  it('displays completed changes when all tasks are done', async () => {
    await createValidPlxWorkspace(tempDir);
    const changesDir = path.join(tempDir, 'workspace', 'changes');
    const tasksDir = path.join(tempDir, 'workspace', 'tasks');
    await fs.mkdir(changesDir, { recursive: true });
    await fs.mkdir(tasksDir, { recursive: true });

    // Create change with proposal.md
    await fs.mkdir(path.join(changesDir, 'completed-change'), { recursive: true });
    await fs.writeFile(path.join(changesDir, 'completed-change', 'proposal.md'), '# Completed Change\n');

    // Create task with all checkboxes complete
    await fs.writeFile(
      path.join(tasksDir, '001-completed-task.md'),
      `---
status: done
parent-type: change
parent-id: completed-change
---

# Task: Completed Task

## Implementation Checklist
- [x] Task 1
- [x] Task 2
- [x] Task 3
`
    );

    const viewCommand = new ViewCommand();
    await viewCommand.execute(tempDir);

    const output = logOutput.map(stripAnsi).join('\n');

    // Should appear in "Completed Changes" section
    expect(output).toContain('Completed Changes');
    expect(output).toContain('✓');
    expect(output).toContain('completed-change');

    // Should NOT appear in "Active Changes" section
    const activeLines = logOutput.map(stripAnsi).filter(line => line.includes('◉'));
    const hasCompletedInActive = activeLines.some(line => line.includes('completed-change'));
    expect(hasCompletedInActive).toBe(false);
  });

  it('displays changes with zero linked tasks as completed', async () => {
    await createValidPlxWorkspace(tempDir);
    const changesDir = path.join(tempDir, 'workspace', 'changes');
    const tasksDir = path.join(tempDir, 'workspace', 'tasks');
    await fs.mkdir(changesDir, { recursive: true });
    await fs.mkdir(tasksDir, { recursive: true });

    // Create change with proposal.md but no linked tasks
    await fs.mkdir(path.join(changesDir, 'no-tasks-change'), { recursive: true });
    await fs.writeFile(path.join(changesDir, 'no-tasks-change', 'proposal.md'), '# Change Without Tasks\n');

    // Create a task for a different change to ensure tasks exist in the directory
    await fs.writeFile(
      path.join(tasksDir, '001-other-task.md'),
      `---
status: to-do
parent-type: change
parent-id: other-change
---

# Task: Other Task

## Implementation Checklist
- [ ] Task 1
`
    );

    const viewCommand = new ViewCommand();
    await viewCommand.execute(tempDir);

    const output = logOutput.map(stripAnsi).join('\n');

    // Should appear in "Completed Changes" section
    expect(output).toContain('Completed Changes');
    expect(output).toContain('no-tasks-change');

    // Should NOT appear in "Active Changes" section
    const activeLines = logOutput.map(stripAnsi).filter(line => line.includes('◉'));
    const hasNoTasksInActive = activeLines.some(line => line.includes('no-tasks-change'));
    expect(hasNoTasksInActive).toBe(false);
  });

  it('calculates progress correctly for changes with partial task completion', async () => {
    await createValidPlxWorkspace(tempDir);
    const changesDir = path.join(tempDir, 'workspace', 'changes');
    const tasksDir = path.join(tempDir, 'workspace', 'tasks');
    await fs.mkdir(changesDir, { recursive: true });
    await fs.mkdir(tasksDir, { recursive: true });

    // Create change
    await fs.mkdir(path.join(changesDir, 'partial-change'), { recursive: true });
    await fs.writeFile(path.join(changesDir, 'partial-change', 'proposal.md'), '# Partial Change\n');

    // Create task with 2 out of 5 items done (40%)
    await fs.writeFile(
      path.join(tasksDir, '001-partial-task.md'),
      `---
status: in-progress
parent-type: change
parent-id: partial-change
---

# Task: Partial Task

## Implementation Checklist
- [x] Done item 1
- [x] Done item 2
- [ ] Todo item 1
- [ ] Todo item 2
- [ ] Todo item 3
`
    );

    const viewCommand = new ViewCommand();
    await viewCommand.execute(tempDir);

    const output = logOutput.map(stripAnsi).join('\n');

    // Should appear in "Active Changes" section
    expect(output).toContain('Active Changes');
    expect(output).toContain('partial-change');

    // Should show progress bar (contains █ or ░)
    const activeLine = logOutput.map(stripAnsi).find(line => line.includes('partial-change'));
    expect(activeLine).toBeDefined();
    expect(activeLine).toMatch(/[█░]/);

    // Should show 40% completion
    expect(activeLine).toContain('40%');
  });
});

