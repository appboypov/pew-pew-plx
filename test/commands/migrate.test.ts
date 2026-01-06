import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { createValidPlxWorkspace } from '../test-utils.js';

describe('migrate tasks command', () => {
  const projectRoot = process.cwd();
  const testDir = path.join(projectRoot, 'test-migrate-cmd-tmp');
  const plxBin = path.join(projectRoot, 'bin', 'plx.js');

  beforeEach(async () => {
    await createValidPlxWorkspace(testDir);
  });

  afterEach(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
  });

  describe('migrate tasks', () => {
    it('migrates tasks from changes/*/tasks/ to workspace/tasks/', async () => {
      const changeDir = path.join(testDir, 'workspace', 'changes', 'my-feature');
      const tasksDir = path.join(changeDir, 'tasks');
      await fs.mkdir(tasksDir, { recursive: true });

      const task1 = path.join(tasksDir, '001-implement.md');
      const task2 = path.join(tasksDir, '002-test.md');
      await fs.writeFile(task1, '---\nstatus: to-do\n---\n\n# Task 001: Implement');
      await fs.writeFile(task2, '---\nstatus: in-progress\n---\n\n# Task 002: Test');

      const originalCwd = process.cwd();
      try {
        process.chdir(testDir);
        const output = execSync(
          `node ${plxBin} migrate tasks --json`,
          { encoding: 'utf-8' }
        );
        const result = JSON.parse(output);

        expect(result.success).toBe(true);
        expect(result.summary.totalFound).toBe(2);
        expect(result.summary.migrated).toBe(2);
        expect(result.summary.skipped).toBe(0);
        expect(result.summary.errors).toBe(0);

        // Verify new files exist
        const centralTasksDir = path.join(testDir, 'workspace', 'tasks');
        const newTask1 = path.join(centralTasksDir, '001-my-feature-implement.md');
        const newTask2 = path.join(centralTasksDir, '002-my-feature-test.md');

        expect(await fs.stat(newTask1).then(() => true).catch(() => false)).toBe(true);
        expect(await fs.stat(newTask2).then(() => true).catch(() => false)).toBe(true);

        // Verify frontmatter was updated
        const content1 = await fs.readFile(newTask1, 'utf-8');
        const content2 = await fs.readFile(newTask2, 'utf-8');

        expect(content1).toContain('parent-type: change');
        expect(content1).toContain('parent-id: my-feature');
        expect(content2).toContain('parent-type: change');
        expect(content2).toContain('parent-id: my-feature');

        // Verify original files were deleted
        expect(await fs.stat(task1).then(() => true).catch(() => false)).toBe(false);
        expect(await fs.stat(task2).then(() => true).catch(() => false)).toBe(false);

        // Verify empty tasks directory was cleaned up
        expect(await fs.stat(tasksDir).then(() => true).catch(() => false)).toBe(false);
      } finally {
        process.chdir(originalCwd);
      }
    });

    it('migrates tasks from reviews/*/tasks/ to workspace/tasks/', async () => {
      const reviewDir = path.join(testDir, 'workspace', 'reviews', 'code-review');
      const tasksDir = path.join(reviewDir, 'tasks');
      await fs.mkdir(tasksDir, { recursive: true });

      const task = path.join(tasksDir, '001-fix-issues.md');
      await fs.writeFile(task, '---\nstatus: to-do\n---\n\n# Fix Issues');

      const originalCwd = process.cwd();
      try {
        process.chdir(testDir);
        const output = execSync(
          `node ${plxBin} migrate tasks --json`,
          { encoding: 'utf-8' }
        );
        const result = JSON.parse(output);

        expect(result.success).toBe(true);
        expect(result.summary.migrated).toBe(1);

        const centralTasksDir = path.join(testDir, 'workspace', 'tasks');
        const newTask = path.join(centralTasksDir, '001-code-review-fix-issues.md');

        expect(await fs.stat(newTask).then(() => true).catch(() => false)).toBe(true);

        const content = await fs.readFile(newTask, 'utf-8');
        expect(content).toContain('parent-type: review');
        expect(content).toContain('parent-id: code-review');
      } finally {
        process.chdir(originalCwd);
      }
    });

    it('handles --dry-run flag without making changes', async () => {
      const changeDir = path.join(testDir, 'workspace', 'changes', 'my-feature');
      const tasksDir = path.join(changeDir, 'tasks');
      await fs.mkdir(tasksDir, { recursive: true });

      const task = path.join(tasksDir, '001-implement.md');
      await fs.writeFile(task, '---\nstatus: to-do\n---\n\n# Task');

      const originalCwd = process.cwd();
      try {
        process.chdir(testDir);
        const output = execSync(
          `node ${plxBin} migrate tasks --dry-run --json`,
          { encoding: 'utf-8' }
        );
        const result = JSON.parse(output);

        expect(result.success).toBe(true);
        expect(result.summary.migrated).toBe(1);

        // Verify original file still exists
        expect(await fs.stat(task).then(() => true).catch(() => false)).toBe(true);

        // Verify new file was NOT created
        const centralTasksDir = path.join(testDir, 'workspace', 'tasks');
        const newTask = path.join(centralTasksDir, '001-my-feature-implement.md');
        expect(await fs.stat(newTask).then(() => true).catch(() => false)).toBe(false);
      } finally {
        process.chdir(originalCwd);
      }
    });

    it('skips tasks when target file already exists', async () => {
      const changeDir = path.join(testDir, 'workspace', 'changes', 'my-feature');
      const tasksDir = path.join(changeDir, 'tasks');
      await fs.mkdir(tasksDir, { recursive: true });

      const task = path.join(tasksDir, '001-implement.md');
      await fs.writeFile(task, '---\nstatus: to-do\n---\n\n# Task');

      // Pre-create the target file
      const centralTasksDir = path.join(testDir, 'workspace', 'tasks');
      await fs.mkdir(centralTasksDir, { recursive: true });
      const existingTask = path.join(centralTasksDir, '001-my-feature-implement.md');
      await fs.writeFile(existingTask, 'existing content');

      const originalCwd = process.cwd();
      try {
        process.chdir(testDir);
        const output = execSync(
          `node ${plxBin} migrate tasks --json`,
          { encoding: 'utf-8' }
        );
        const result = JSON.parse(output);

        expect(result.success).toBe(true);
        expect(result.summary.skipped).toBe(1);
        expect(result.summary.migrated).toBe(0);

        // Verify original file still exists
        expect(await fs.stat(task).then(() => true).catch(() => false)).toBe(true);

        // Verify existing file was not overwritten
        const content = await fs.readFile(existingTask, 'utf-8');
        expect(content).toBe('existing content');
      } finally {
        process.chdir(originalCwd);
      }
    });

    it('migrates tasks from multiple changes and reviews', async () => {
      const change1Dir = path.join(testDir, 'workspace', 'changes', 'feature-a');
      const change2Dir = path.join(testDir, 'workspace', 'changes', 'feature-b');
      const reviewDir = path.join(testDir, 'workspace', 'reviews', 'review-1');

      await fs.mkdir(path.join(change1Dir, 'tasks'), { recursive: true });
      await fs.mkdir(path.join(change2Dir, 'tasks'), { recursive: true });
      await fs.mkdir(path.join(reviewDir, 'tasks'), { recursive: true });

      await fs.writeFile(path.join(change1Dir, 'tasks', '001-impl.md'), '---\nstatus: to-do\n---\n\n# Task');
      await fs.writeFile(path.join(change2Dir, 'tasks', '001-impl.md'), '---\nstatus: to-do\n---\n\n# Task');
      await fs.writeFile(path.join(reviewDir, 'tasks', '001-check.md'), '---\nstatus: to-do\n---\n\n# Task');

      const originalCwd = process.cwd();
      try {
        process.chdir(testDir);
        const output = execSync(
          `node ${plxBin} migrate tasks --json`,
          { encoding: 'utf-8' }
        );
        const result = JSON.parse(output);

        expect(result.success).toBe(true);
        expect(result.summary.totalFound).toBe(3);
        expect(result.summary.migrated).toBe(3);

        const centralTasksDir = path.join(testDir, 'workspace', 'tasks');
        expect(await fs.stat(path.join(centralTasksDir, '001-feature-a-impl.md')).then(() => true).catch(() => false)).toBe(true);
        expect(await fs.stat(path.join(centralTasksDir, '001-feature-b-impl.md')).then(() => true).catch(() => false)).toBe(true);
        expect(await fs.stat(path.join(centralTasksDir, '001-review-1-check.md')).then(() => true).catch(() => false)).toBe(true);
      } finally {
        process.chdir(originalCwd);
      }
    });

    it('preserves existing frontmatter fields while adding parent fields', async () => {
      const changeDir = path.join(testDir, 'workspace', 'changes', 'my-feature');
      const tasksDir = path.join(changeDir, 'tasks');
      await fs.mkdir(tasksDir, { recursive: true });

      const task = path.join(tasksDir, '001-implement.md');
      await fs.writeFile(task, '---\nstatus: in-progress\nskill-level: senior\n---\n\n# Task');

      const originalCwd = process.cwd();
      try {
        process.chdir(testDir);
        execSync(`node ${plxBin} migrate tasks --json`, { encoding: 'utf-8' });

        const centralTasksDir = path.join(testDir, 'workspace', 'tasks');
        const newTask = path.join(centralTasksDir, '001-my-feature-implement.md');
        const content = await fs.readFile(newTask, 'utf-8');

        expect(content).toContain('status: in-progress');
        expect(content).toContain('skill-level: senior');
        expect(content).toContain('parent-type: change');
        expect(content).toContain('parent-id: my-feature');
      } finally {
        process.chdir(originalCwd);
      }
    });

    it('handles tasks without frontmatter', async () => {
      const changeDir = path.join(testDir, 'workspace', 'changes', 'my-feature');
      const tasksDir = path.join(changeDir, 'tasks');
      await fs.mkdir(tasksDir, { recursive: true });

      const task = path.join(tasksDir, '001-implement.md');
      await fs.writeFile(task, '# Task without frontmatter\n\nSome content here.');

      const originalCwd = process.cwd();
      try {
        process.chdir(testDir);
        execSync(`node ${plxBin} migrate tasks --json`, { encoding: 'utf-8' });

        const centralTasksDir = path.join(testDir, 'workspace', 'tasks');
        const newTask = path.join(centralTasksDir, '001-my-feature-implement.md');
        const content = await fs.readFile(newTask, 'utf-8');

        expect(content).toContain('parent-type: change');
        expect(content).toContain('parent-id: my-feature');
        expect(content).toContain('# Task without frontmatter');
      } finally {
        process.chdir(originalCwd);
      }
    });

    it('handles empty workspace with no tasks to migrate', async () => {
      // Create changes and reviews without tasks directories
      const changeDir = path.join(testDir, 'workspace', 'changes', 'my-feature');
      const reviewDir = path.join(testDir, 'workspace', 'reviews', 'my-review');
      await fs.mkdir(changeDir, { recursive: true });
      await fs.mkdir(reviewDir, { recursive: true });

      // Add some other files but no tasks
      await fs.writeFile(path.join(changeDir, 'README.md'), '# Feature');
      await fs.writeFile(path.join(reviewDir, 'notes.md'), '# Review notes');

      const originalCwd = process.cwd();
      try {
        process.chdir(testDir);
        const output = execSync(
          `node ${plxBin} migrate tasks --json`,
          { encoding: 'utf-8' }
        );
        const result = JSON.parse(output);

        expect(result.success).toBe(true);
        expect(result.summary.totalFound).toBe(0);
        expect(result.summary.migrated).toBe(0);
        expect(result.summary.skipped).toBe(0);
        expect(result.summary.errors).toBe(0);
      } finally {
        process.chdir(originalCwd);
      }
    });

    it('handles multi-workspace scenarios with nested workspaces', async () => {
      // Create a monorepo structure with nested workspaces
      const packageADir = path.join(testDir, 'packages', 'package-a');
      const packageBDir = path.join(testDir, 'packages', 'package-b');

      // Set up workspace A
      await createValidPlxWorkspace(packageADir);
      const changeADir = path.join(packageADir, 'workspace', 'changes', 'feature-a');
      const tasksADir = path.join(changeADir, 'tasks');
      await fs.mkdir(tasksADir, { recursive: true });
      await fs.writeFile(
        path.join(tasksADir, '001-task-a.md'),
        '---\nstatus: to-do\n---\n\n# Task A'
      );

      // Set up workspace B
      await createValidPlxWorkspace(packageBDir);
      const changeBDir = path.join(packageBDir, 'workspace', 'changes', 'feature-b');
      const tasksBDir = path.join(changeBDir, 'tasks');
      await fs.mkdir(tasksBDir, { recursive: true });
      await fs.writeFile(
        path.join(tasksBDir, '001-task-b.md'),
        '---\nstatus: to-do\n---\n\n# Task B'
      );

      const originalCwd = process.cwd();
      try {
        // Migrate workspace A
        process.chdir(packageADir);
        const outputA = execSync(
          `node ${plxBin} migrate tasks --json`,
          { encoding: 'utf-8' }
        );
        const resultA = JSON.parse(outputA);

        expect(resultA.success).toBe(true);
        expect(resultA.summary.migrated).toBe(1);

        const centralTasksADir = path.join(packageADir, 'workspace', 'tasks');
        const newTaskA = path.join(centralTasksADir, '001-feature-a-task-a.md');
        expect(await fs.stat(newTaskA).then(() => true).catch(() => false)).toBe(true);

        const contentA = await fs.readFile(newTaskA, 'utf-8');
        expect(contentA).toContain('parent-id: feature-a');

        // Migrate workspace B
        process.chdir(packageBDir);
        const outputB = execSync(
          `node ${plxBin} migrate tasks --json`,
          { encoding: 'utf-8' }
        );
        const resultB = JSON.parse(outputB);

        expect(resultB.success).toBe(true);
        expect(resultB.summary.migrated).toBe(1);

        const centralTasksBDir = path.join(packageBDir, 'workspace', 'tasks');
        const newTaskB = path.join(centralTasksBDir, '001-feature-b-task-b.md');
        expect(await fs.stat(newTaskB).then(() => true).catch(() => false)).toBe(true);

        const contentB = await fs.readFile(newTaskB, 'utf-8');
        expect(contentB).toContain('parent-id: feature-b');

        // Verify tasks are isolated to their respective workspaces
        expect(await fs.stat(path.join(centralTasksADir, '001-feature-b-task-b.md')).then(() => true).catch(() => false)).toBe(false);
        expect(await fs.stat(path.join(centralTasksBDir, '001-feature-a-task-a.md')).then(() => true).catch(() => false)).toBe(false);
      } finally {
        process.chdir(originalCwd);
        // Clean up nested workspaces
        await fs.rm(path.join(testDir, 'packages'), { recursive: true, force: true });
      }
    });

    it('handles error conditions with invalid task filename format', async () => {
      const changeDir = path.join(testDir, 'workspace', 'changes', 'my-feature');
      const tasksDir = path.join(changeDir, 'tasks');
      await fs.mkdir(tasksDir, { recursive: true });

      // Create tasks with invalid filename formats
      const invalidTask1 = path.join(tasksDir, 'no-number.md');
      const invalidTask2 = path.join(tasksDir, '1-wrong.md'); // Should be 001
      const validTask = path.join(tasksDir, '001-valid.md');

      await fs.writeFile(invalidTask1, '---\nstatus: to-do\n---\n\n# Invalid');
      await fs.writeFile(invalidTask2, '---\nstatus: to-do\n---\n\n# Wrong format');
      await fs.writeFile(validTask, '---\nstatus: to-do\n---\n\n# Valid');

      const originalCwd = process.cwd();
      try {
        process.chdir(testDir);
        const output = execSync(
          `node ${plxBin} migrate tasks --json`,
          { encoding: 'utf-8' }
        );
        const result = JSON.parse(output);

        // Only the valid task should be migrated
        expect(result.success).toBe(true);
        expect(result.summary.migrated).toBe(1);

        const centralTasksDir = path.join(testDir, 'workspace', 'tasks');
        const newValidTask = path.join(centralTasksDir, '001-my-feature-valid.md');
        expect(await fs.stat(newValidTask).then(() => true).catch(() => false)).toBe(true);

        // Invalid tasks should still exist in original location
        expect(await fs.stat(invalidTask1).then(() => true).catch(() => false)).toBe(true);
        expect(await fs.stat(invalidTask2).then(() => true).catch(() => false)).toBe(true);
      } finally {
        process.chdir(originalCwd);
      }
    });
  });
});
