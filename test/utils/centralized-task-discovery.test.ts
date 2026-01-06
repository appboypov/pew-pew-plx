import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import {
  discoverTasks,
  filterTasksByParent,
  checkParentIdConflicts,
  getTasksDir,
  getTasksArchiveDir,
  DiscoveredTask,
} from '../../src/utils/centralized-task-discovery.js';
import { DiscoveredWorkspace } from '../../src/utils/workspace-discovery.js';

describe('centralized-task-discovery', () => {
  let tempDir: string;
  let workspace: DiscoveredWorkspace;

  beforeEach(async () => {
    tempDir = path.join(
      os.tmpdir(),
      `plx-centralized-task-test-${Date.now()}`
    );
    await fs.mkdir(tempDir, { recursive: true });

    // Create workspace structure
    const workspacePath = path.join(tempDir, 'workspace');
    await fs.mkdir(workspacePath, { recursive: true });
    await fs.mkdir(path.join(workspacePath, 'tasks'), { recursive: true });
    await fs.writeFile(
      path.join(workspacePath, 'AGENTS.md'),
      '# Agents'
    );

    workspace = {
      path: workspacePath,
      relativePath: '.',
      projectName: '',
      isRoot: true,
    };
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  async function createTask(
    filename: string,
    content: string
  ): Promise<void> {
    const tasksDir = path.join(workspace.path, 'tasks');
    await fs.writeFile(path.join(tasksDir, filename), content);
  }

  async function createArchivedTask(
    filename: string,
    content: string
  ): Promise<void> {
    const archiveDir = path.join(workspace.path, 'tasks', 'archive');
    await fs.mkdir(archiveDir, { recursive: true });
    await fs.writeFile(path.join(archiveDir, filename), content);
  }

  describe('getTasksDir', () => {
    it('should return correct tasks directory path', () => {
      const result = getTasksDir('/some/workspace');
      expect(result).toBe('/some/workspace/tasks');
    });
  });

  describe('getTasksArchiveDir', () => {
    it('should return correct tasks archive directory path', () => {
      const result = getTasksArchiveDir('/some/workspace');
      expect(result).toBe('/some/workspace/tasks/archive');
    });
  });

  describe('discoverTasks', () => {
    it('should discover standalone task in workspace/tasks/', async () => {
      await createTask(
        '001-fix-typo.md',
        `---
status: to-do
---

# Task: Fix Typo`
      );

      const result = await discoverTasks(workspace);

      expect(result.tasks).toHaveLength(1);
      expect(result.tasks[0].filename).toBe('001-fix-typo.md');
      expect(result.tasks[0].sequence).toBe(1);
      expect(result.tasks[0].name).toBe('fix-typo');
      expect(result.tasks[0].status).toBe('to-do');
      expect(result.tasks[0].parentType).toBeUndefined();
      expect(result.tasks[0].parentId).toBeUndefined();
    });

    it('should discover parented task with frontmatter', async () => {
      await createTask(
        '001-my-change-implement.md',
        `---
status: in-progress
parent-type: change
parent-id: my-change
skill-level: senior
---

# Task: Implement Feature`
      );

      const result = await discoverTasks(workspace);

      expect(result.tasks).toHaveLength(1);
      expect(result.tasks[0].filename).toBe('001-my-change-implement.md');
      expect(result.tasks[0].sequence).toBe(1);
      expect(result.tasks[0].name).toBe('implement');
      expect(result.tasks[0].status).toBe('in-progress');
      expect(result.tasks[0].parentType).toBe('change');
      expect(result.tasks[0].parentId).toBe('my-change');
      expect(result.tasks[0].skillLevel).toBe('senior');
    });

    it('should discover multiple tasks sorted by sequence', async () => {
      await createTask(
        '003-third.md',
        `---
status: to-do
---
# Third`
      );
      await createTask(
        '001-first.md',
        `---
status: done
---
# First`
      );
      await createTask(
        '002-second.md',
        `---
status: in-progress
---
# Second`
      );

      const result = await discoverTasks(workspace);

      expect(result.tasks).toHaveLength(3);
      expect(result.tasks[0].sequence).toBe(1);
      expect(result.tasks[1].sequence).toBe(2);
      expect(result.tasks[2].sequence).toBe(3);
    });

    it('should exclude archived tasks', async () => {
      await createTask(
        '001-active.md',
        `---
status: to-do
---
# Active`
      );
      await createArchivedTask(
        '002-archived.md',
        `---
status: done
---
# Archived`
      );

      const result = await discoverTasks(workspace);

      expect(result.tasks).toHaveLength(1);
      expect(result.tasks[0].filename).toBe('001-active.md');
    });

    it('should return empty array when tasks directory does not exist', async () => {
      await fs.rm(path.join(workspace.path, 'tasks'), {
        recursive: true,
        force: true,
      });

      const result = await discoverTasks(workspace);

      expect(result.tasks).toHaveLength(0);
    });

    it('should skip tasks with invalid frontmatter (missing parent-id with parent-type)', async () => {
      await createTask(
        '001-valid.md',
        `---
status: to-do
---
# Valid`
      );
      await createTask(
        '002-invalid.md',
        `---
status: to-do
parent-type: change
---
# Invalid - missing parent-id`
      );

      const result = await discoverTasks(workspace);

      expect(result.tasks).toHaveLength(1);
      expect(result.tasks[0].filename).toBe('001-valid.md');
    });

    it('should skip files that do not match task filename pattern', async () => {
      await createTask(
        '001-valid.md',
        `---
status: to-do
---
# Valid`
      );
      await createTask('README.md', '# Not a task');
      await createTask('notes.md', '# Just notes');

      const result = await discoverTasks(workspace);

      expect(result.tasks).toHaveLength(1);
      expect(result.tasks[0].filename).toBe('001-valid.md');
    });

    it('should include workspace info in result', async () => {
      await createTask(
        '001-task.md',
        `---
status: to-do
---
# Task`
      );

      const result = await discoverTasks(workspace);

      expect(result.workspacePath).toBe(workspace.path);
      expect(result.projectName).toBe('');
    });

    it('should handle tasks with different parent types', async () => {
      await createTask(
        '001-change-task.md',
        `---
status: to-do
parent-type: change
parent-id: my-change
---
# Change Task`
      );
      await createTask(
        '002-review-task.md',
        `---
status: to-do
parent-type: review
parent-id: my-review
---
# Review Task`
      );
      await createTask(
        '003-spec-task.md',
        `---
status: to-do
parent-type: spec
parent-id: my-spec
---
# Spec Task`
      );

      const result = await discoverTasks(workspace);

      expect(result.tasks).toHaveLength(3);
      expect(result.tasks[0].parentType).toBe('change');
      expect(result.tasks[1].parentType).toBe('review');
      expect(result.tasks[2].parentType).toBe('spec');
    });

    it('should read task content', async () => {
      const taskContent = `---
status: to-do
---

# Task: Example

## Implementation Checklist
- [ ] Step 1
- [ ] Step 2`;

      await createTask('001-example.md', taskContent);

      const result = await discoverTasks(workspace);

      expect(result.tasks[0].content).toBe(taskContent);
    });
  });

  describe('filterTasksByParent', () => {
    const tasks: DiscoveredTask[] = [
      {
        filename: '001-my-change-impl.md',
        filepath: '/workspace/tasks/001-my-change-impl.md',
        sequence: 1,
        name: 'impl',
        content: '',
        status: 'to-do',
        parentType: 'change',
        parentId: 'my-change',
      },
      {
        filename: '002-my-change-test.md',
        filepath: '/workspace/tasks/002-my-change-test.md',
        sequence: 2,
        name: 'test',
        content: '',
        status: 'to-do',
        parentType: 'change',
        parentId: 'my-change',
      },
      {
        filename: '003-other-change-design.md',
        filepath: '/workspace/tasks/003-other-change-design.md',
        sequence: 3,
        name: 'design',
        content: '',
        status: 'to-do',
        parentType: 'change',
        parentId: 'other-change',
      },
      {
        filename: '004-my-review-fix.md',
        filepath: '/workspace/tasks/004-my-review-fix.md',
        sequence: 4,
        name: 'fix',
        content: '',
        status: 'to-do',
        parentType: 'review',
        parentId: 'my-review',
      },
      {
        filename: '005-standalone.md',
        filepath: '/workspace/tasks/005-standalone.md',
        sequence: 5,
        name: 'standalone',
        content: '',
        status: 'to-do',
      },
    ];

    it('should filter tasks by parent ID only', () => {
      const result = filterTasksByParent(tasks, 'my-change');

      expect(result).toHaveLength(2);
      expect(result[0].filename).toBe('001-my-change-impl.md');
      expect(result[1].filename).toBe('002-my-change-test.md');
    });

    it('should filter tasks by parent ID and parent type', () => {
      const result = filterTasksByParent(tasks, 'my-change', 'change');

      expect(result).toHaveLength(2);
    });

    it('should return empty array when no tasks match parent ID', () => {
      const result = filterTasksByParent(tasks, 'non-existent');

      expect(result).toHaveLength(0);
    });

    it('should return empty array when parent type does not match', () => {
      const result = filterTasksByParent(tasks, 'my-change', 'review');

      expect(result).toHaveLength(0);
    });

    it('should not include standalone tasks when filtering by parent', () => {
      const result = filterTasksByParent(tasks, 'standalone');

      expect(result).toHaveLength(0);
    });
  });

  describe('checkParentIdConflicts', () => {
    it('should return empty array when no tasks have the parent ID', () => {
      const tasks: DiscoveredTask[] = [
        {
          filename: '001-task.md',
          filepath: '/workspace/tasks/001-task.md',
          sequence: 1,
          name: 'task',
          content: '',
          status: 'to-do',
          parentType: 'change',
          parentId: 'other-id',
        },
      ];

      const result = checkParentIdConflicts(tasks, 'my-id');

      expect(result).toHaveLength(0);
    });

    it('should return single parent type when no conflict', () => {
      const tasks: DiscoveredTask[] = [
        {
          filename: '001-task.md',
          filepath: '/workspace/tasks/001-task.md',
          sequence: 1,
          name: 'task',
          content: '',
          status: 'to-do',
          parentType: 'change',
          parentId: 'my-id',
        },
        {
          filename: '002-task.md',
          filepath: '/workspace/tasks/002-task.md',
          sequence: 2,
          name: 'task2',
          content: '',
          status: 'to-do',
          parentType: 'change',
          parentId: 'my-id',
        },
      ];

      const result = checkParentIdConflicts(tasks, 'my-id');

      expect(result).toHaveLength(1);
      expect(result).toContain('change');
    });

    it('should return multiple parent types when conflict exists', () => {
      const tasks: DiscoveredTask[] = [
        {
          filename: '001-task.md',
          filepath: '/workspace/tasks/001-task.md',
          sequence: 1,
          name: 'task',
          content: '',
          status: 'to-do',
          parentType: 'change',
          parentId: 'shared-id',
        },
        {
          filename: '002-task.md',
          filepath: '/workspace/tasks/002-task.md',
          sequence: 2,
          name: 'task2',
          content: '',
          status: 'to-do',
          parentType: 'spec',
          parentId: 'shared-id',
        },
      ];

      const result = checkParentIdConflicts(tasks, 'shared-id');

      expect(result).toHaveLength(2);
      expect(result).toContain('change');
      expect(result).toContain('spec');
    });

    it('should ignore standalone tasks without parent type', () => {
      const tasks: DiscoveredTask[] = [
        {
          filename: '001-task.md',
          filepath: '/workspace/tasks/001-task.md',
          sequence: 1,
          name: 'task',
          content: '',
          status: 'to-do',
          parentType: 'change',
          parentId: 'my-id',
        },
        {
          filename: '002-standalone.md',
          filepath: '/workspace/tasks/002-standalone.md',
          sequence: 2,
          name: 'standalone',
          content: '',
          status: 'to-do',
        },
      ];

      const result = checkParentIdConflicts(tasks, 'my-id');

      expect(result).toHaveLength(1);
      expect(result).toContain('change');
    });
  });

  describe('getTasksForParent', () => {
    it('should return tasks matching parent ID and type', async () => {
      await createTask(
        '001-my-change-impl.md',
        `---
status: to-do
parent-type: change
parent-id: my-change
---
# Task: Implement`
      );
      await createTask(
        '002-my-change-test.md',
        `---
status: done
parent-type: change
parent-id: my-change
---
# Task: Test`
      );
      await createTask(
        '003-other-change-task.md',
        `---
status: to-do
parent-type: change
parent-id: other-change
---
# Task: Other`
      );

      const { getTasksForParent } = await import('../../src/utils/centralized-task-discovery.js');
      const result = await getTasksForParent(workspace.path, 'my-change', 'change');

      expect(result).toHaveLength(2);
      expect(result[0].filename).toBe('001-my-change-impl.md');
      expect(result[1].filename).toBe('002-my-change-test.md');
    });

    it('should return empty array when no tasks match', async () => {
      await createTask(
        '001-task.md',
        `---
status: to-do
parent-type: change
parent-id: some-change
---
# Task`
      );

      const { getTasksForParent } = await import('../../src/utils/centralized-task-discovery.js');
      const result = await getTasksForParent(workspace.path, 'non-existent', 'change');

      expect(result).toHaveLength(0);
    });

    it('should filter correctly by parent type', async () => {
      await createTask(
        '001-change-task.md',
        `---
status: to-do
parent-type: change
parent-id: my-id
---
# Change Task`
      );
      await createTask(
        '002-review-task.md',
        `---
status: to-do
parent-type: review
parent-id: my-id
---
# Review Task`
      );

      const { getTasksForParent } = await import('../../src/utils/centralized-task-discovery.js');
      const changeResult = await getTasksForParent(workspace.path, 'my-id', 'change');
      const reviewResult = await getTasksForParent(workspace.path, 'my-id', 'review');

      expect(changeResult).toHaveLength(1);
      expect(changeResult[0].parentType).toBe('change');
      expect(reviewResult).toHaveLength(1);
      expect(reviewResult[0].parentType).toBe('review');
    });
  });

  describe('archiveTasksForParent', () => {
    it('should move tasks to archive directory', async () => {
      await createTask(
        '001-my-change-impl.md',
        `---
status: done
parent-type: change
parent-id: my-change
---
# Task: Implement`
      );
      await createTask(
        '002-my-change-test.md',
        `---
status: done
parent-type: change
parent-id: my-change
---
# Task: Test`
      );

      const { archiveTasksForParent } = await import('../../src/utils/centralized-task-discovery.js');
      const result = await archiveTasksForParent(workspace.path, 'my-change', 'change');

      expect(result.movedTasks).toHaveLength(2);
      expect(result.movedTasks).toContain('001-my-change-impl.md');
      expect(result.movedTasks).toContain('002-my-change-test.md');
      expect(result.errors).toHaveLength(0);

      // Verify tasks moved to archive
      const archiveDir = path.join(workspace.path, 'tasks', 'archive');
      const archiveFiles = await fs.readdir(archiveDir);
      expect(archiveFiles).toHaveLength(2);
      expect(archiveFiles).toContain('001-my-change-impl.md');
      expect(archiveFiles).toContain('002-my-change-test.md');

      // Verify tasks removed from main directory
      const tasksDir = path.join(workspace.path, 'tasks');
      const taskFiles = await fs.readdir(tasksDir);
      expect(taskFiles.filter(f => f.endsWith('.md'))).toHaveLength(0);
    });

    it('should create archive directory if it does not exist', async () => {
      await createTask(
        '001-task.md',
        `---
status: done
parent-type: change
parent-id: my-change
---
# Task`
      );

      const archiveDir = path.join(workspace.path, 'tasks', 'archive');

      // Verify archive doesn't exist yet
      await expect(fs.access(archiveDir)).rejects.toThrow();

      const { archiveTasksForParent } = await import('../../src/utils/centralized-task-discovery.js');
      await archiveTasksForParent(workspace.path, 'my-change', 'change');

      // Verify archive was created
      await expect(fs.access(archiveDir)).resolves.not.toThrow();
    });

    it('should preserve filename and content when moving', async () => {
      const taskContent = `---
status: done
parent-type: change
parent-id: my-change
---

# Task: Implement Feature

## Implementation Checklist
- [x] Step 1
- [x] Step 2`;

      await createTask('001-my-change-impl.md', taskContent);

      const { archiveTasksForParent } = await import('../../src/utils/centralized-task-discovery.js');
      await archiveTasksForParent(workspace.path, 'my-change', 'change');

      // Verify content preserved
      const archiveDir = path.join(workspace.path, 'tasks', 'archive');
      const archivedContent = await fs.readFile(
        path.join(archiveDir, '001-my-change-impl.md'),
        'utf-8'
      );
      expect(archivedContent).toBe(taskContent);
    });

    it('should handle duplicate filenames with numeric suffix', async () => {
      // Create a task and archive it
      await createTask(
        '001-my-change-task.md',
        `---
status: done
parent-type: change
parent-id: my-change
---
# Task 1`
      );

      const { archiveTasksForParent } = await import('../../src/utils/centralized-task-discovery.js');
      await archiveTasksForParent(workspace.path, 'my-change', 'change');

      // Create another task with same filename for different parent
      await createTask(
        '001-my-change-task.md',
        `---
status: done
parent-type: change
parent-id: my-change
---
# Task 2`
      );

      // Archive again - should create duplicate with suffix
      const result = await archiveTasksForParent(workspace.path, 'my-change', 'change');

      expect(result.movedTasks).toHaveLength(1);
      expect(result.errors).toHaveLength(0);

      // Verify both files exist in archive
      const archiveDir = path.join(workspace.path, 'tasks', 'archive');
      const archiveFiles = await fs.readdir(archiveDir);
      expect(archiveFiles).toHaveLength(2);
      expect(archiveFiles).toContain('001-my-change-task.md');
      expect(archiveFiles).toContain('001-my-change-task-2.md');
    });

    it('should handle multiple duplicate filenames with incrementing suffixes', async () => {
      // Create and archive first task
      await createTask(
        '001-task.md',
        `---
status: done
parent-type: change
parent-id: change-1
---
# Task 1`
      );

      const { archiveTasksForParent } = await import('../../src/utils/centralized-task-discovery.js');
      await archiveTasksForParent(workspace.path, 'change-1', 'change');

      // Create and archive second task with same filename
      await createTask(
        '001-task.md',
        `---
status: done
parent-type: change
parent-id: change-2
---
# Task 2`
      );
      await archiveTasksForParent(workspace.path, 'change-2', 'change');

      // Create and archive third task with same filename
      await createTask(
        '001-task.md',
        `---
status: done
parent-type: change
parent-id: change-3
---
# Task 3`
      );
      await archiveTasksForParent(workspace.path, 'change-3', 'change');

      // Verify all three files exist with correct suffixes
      const archiveDir = path.join(workspace.path, 'tasks', 'archive');
      const archiveFiles = await fs.readdir(archiveDir);
      expect(archiveFiles).toHaveLength(3);
      expect(archiveFiles).toContain('001-task.md');
      expect(archiveFiles).toContain('001-task-2.md');
      expect(archiveFiles).toContain('001-task-3.md');
    });

    it('should return empty result when no tasks match parent', async () => {
      await createTask(
        '001-other-task.md',
        `---
status: done
parent-type: change
parent-id: other-change
---
# Task`
      );

      const { archiveTasksForParent } = await import('../../src/utils/centralized-task-discovery.js');
      const result = await archiveTasksForParent(workspace.path, 'my-change', 'change');

      expect(result.movedTasks).toHaveLength(0);
      expect(result.errors).toHaveLength(0);
    });

    it('should only archive tasks matching both parent ID and type', async () => {
      await createTask(
        '001-change-task.md',
        `---
status: done
parent-type: change
parent-id: my-id
---
# Change Task`
      );
      await createTask(
        '002-review-task.md',
        `---
status: done
parent-type: review
parent-id: my-id
---
# Review Task`
      );

      const { archiveTasksForParent } = await import('../../src/utils/centralized-task-discovery.js');
      const result = await archiveTasksForParent(workspace.path, 'my-id', 'change');

      expect(result.movedTasks).toHaveLength(1);
      expect(result.movedTasks[0]).toBe('001-change-task.md');

      // Verify review task still in main directory
      const tasksDir = path.join(workspace.path, 'tasks');
      const taskFiles = await fs.readdir(tasksDir);
      expect(taskFiles.filter(f => f.endsWith('.md'))).toContain('002-review-task.md');
    });

    it('should archive tasks with different statuses', async () => {
      await createTask(
        '001-done-task.md',
        `---
status: done
parent-type: change
parent-id: my-change
---
# Done Task`
      );
      await createTask(
        '002-todo-task.md',
        `---
status: to-do
parent-type: change
parent-id: my-change
---
# To-do Task`
      );
      await createTask(
        '003-inprogress-task.md',
        `---
status: in-progress
parent-type: change
parent-id: my-change
---
# In Progress Task`
      );

      const { archiveTasksForParent } = await import('../../src/utils/centralized-task-discovery.js');
      const result = await archiveTasksForParent(workspace.path, 'my-change', 'change');

      expect(result.movedTasks).toHaveLength(3);
      expect(result.errors).toHaveLength(0);
    });

    it('should report errors if archive directory creation fails', async () => {
      await createTask(
        '001-task.md',
        `---
status: done
parent-type: change
parent-id: my-change
---
# Task`
      );

      // Create a file where archive directory should be to cause error
      const archiveDir = path.join(workspace.path, 'tasks', 'archive');
      await fs.writeFile(archiveDir, 'blocking file');

      const { archiveTasksForParent } = await import('../../src/utils/centralized-task-discovery.js');
      const result = await archiveTasksForParent(workspace.path, 'my-change', 'change');

      expect(result.movedTasks).toHaveLength(0);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toContain('Failed to create archive directory');

      // Cleanup
      await fs.unlink(archiveDir);
    });
  });

  describe('multi-workspace scenarios', () => {
    let secondWorkspace: DiscoveredWorkspace;

    beforeEach(async () => {
      const secondWorkspacePath = path.join(tempDir, 'project-b', 'workspace');
      await fs.mkdir(secondWorkspacePath, { recursive: true });
      await fs.mkdir(path.join(secondWorkspacePath, 'tasks'), {
        recursive: true,
      });
      await fs.writeFile(
        path.join(secondWorkspacePath, 'AGENTS.md'),
        '# Agents'
      );

      secondWorkspace = {
        path: secondWorkspacePath,
        relativePath: 'project-b',
        projectName: 'project-b',
        isRoot: false,
      };
    });

    it('should discover tasks independently per workspace', async () => {
      await createTask(
        '001-task-a.md',
        `---
status: to-do
---
# Task A`
      );

      const secondTasksDir = path.join(secondWorkspace.path, 'tasks');
      await fs.writeFile(
        path.join(secondTasksDir, '001-task-b.md'),
        `---
status: to-do
---
# Task B`
      );

      const result1 = await discoverTasks(workspace);
      const result2 = await discoverTasks(secondWorkspace);

      expect(result1.tasks).toHaveLength(1);
      expect(result1.tasks[0].filename).toBe('001-task-a.md');
      expect(result1.projectName).toBe('');

      expect(result2.tasks).toHaveLength(1);
      expect(result2.tasks[0].filename).toBe('001-task-b.md');
      expect(result2.projectName).toBe('project-b');
    });
  });
});
