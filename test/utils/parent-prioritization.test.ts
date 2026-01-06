import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import {
  getCompletionPercentage,
  getChangeCreatedAt,
  getPrioritizedChange,
  getPrioritizedParent,
} from '../../src/utils/parent-prioritization.js';
import { TASKS_DIRECTORY_NAME } from '../../src/utils/task-progress.js';
import { DiscoveredTask } from '../../src/utils/centralized-task-discovery.js';

describe('parent-prioritization', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = path.join(
      os.tmpdir(),
      `plx-change-prioritization-test-${Date.now()}`
    );
    await fs.mkdir(tempDir, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  describe('getCompletionPercentage', () => {
    it('should return 0 for 0/0 tasks', () => {
      expect(getCompletionPercentage({ total: 0, completed: 0 })).toBe(0);
    });

    it('should return 50 for 1/2 tasks', () => {
      expect(getCompletionPercentage({ total: 2, completed: 1 })).toBe(50);
    });

    it('should return 100 for 3/3 tasks', () => {
      expect(getCompletionPercentage({ total: 3, completed: 3 })).toBe(100);
    });

    it('should return 25 for 1/4 tasks', () => {
      expect(getCompletionPercentage({ total: 4, completed: 1 })).toBe(25);
    });

    it('should return 75 for 3/4 tasks', () => {
      expect(getCompletionPercentage({ total: 4, completed: 3 })).toBe(75);
    });
  });

  describe('getChangeCreatedAt', () => {
    it('should return proposal.md creation date', async () => {
      const changeId = 'test-change';
      const changeDir = path.join(tempDir, changeId);
      await fs.mkdir(changeDir, { recursive: true });

      const proposalPath = path.join(changeDir, 'proposal.md');
      await fs.writeFile(proposalPath, '# Proposal');

      const createdAt = await getChangeCreatedAt(tempDir, changeId);
      expect(createdAt).toBeInstanceOf(Date);
      expect(createdAt.getTime()).toBeGreaterThan(0);
    });
  });

  describe('getPrioritizedChange', () => {
    it('should return null for empty directory', async () => {
      const result = await getPrioritizedChange(tempDir);
      expect(result).toBeNull();
    });

    it('should return null for non-existent directory', async () => {
      const result = await getPrioritizedChange('/non/existent/path');
      expect(result).toBeNull();
    });

    it('should select change with highest completion percentage', async () => {
      // Create change-a with 25% completion (1/4)
      const changeA = path.join(tempDir, 'change-a');
      const tasksA = path.join(changeA, TASKS_DIRECTORY_NAME);
      await fs.mkdir(tasksA, { recursive: true });
      await fs.writeFile(path.join(changeA, 'proposal.md'), '# Change A');
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

      // Create change-b with 75% completion (3/4)
      const changeB = path.join(tempDir, 'change-b');
      const tasksB = path.join(changeB, TASKS_DIRECTORY_NAME);
      await fs.mkdir(tasksB, { recursive: true });
      await fs.writeFile(path.join(changeB, 'proposal.md'), '# Change B');
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

      const result = await getPrioritizedChange(tempDir);
      expect(result).not.toBeNull();
      expect(result!.id).toBe('change-b');
      expect(result!.completionPercentage).toBe(75);
    });

    it('should select oldest change when completion percentages are equal', async () => {
      // Create change-a (older) with 50% completion
      const changeA = path.join(tempDir, 'change-a');
      const tasksA = path.join(changeA, TASKS_DIRECTORY_NAME);
      await fs.mkdir(tasksA, { recursive: true });
      await fs.writeFile(path.join(changeA, 'proposal.md'), '# Change A');
      await fs.writeFile(
        path.join(tasksA, '001-task.md'),
        `# Task
## Implementation Checklist
- [x] Done
- [ ] Not done
`
      );

      // Wait a bit to ensure different timestamps
      await new Promise((resolve) => setTimeout(resolve, 50));

      // Create change-b (newer) with 50% completion
      const changeB = path.join(tempDir, 'change-b');
      const tasksB = path.join(changeB, TASKS_DIRECTORY_NAME);
      await fs.mkdir(tasksB, { recursive: true });
      await fs.writeFile(path.join(changeB, 'proposal.md'), '# Change B');
      await fs.writeFile(
        path.join(tasksB, '001-task.md'),
        `# Task
## Implementation Checklist
- [x] Done
- [ ] Not done
`
      );

      const result = await getPrioritizedChange(tempDir);
      expect(result).not.toBeNull();
      expect(result!.id).toBe('change-a');
      expect(result!.completionPercentage).toBe(50);
    });

    it('should prefer change with tasks over change with zero tasks', async () => {
      // Create change-a with 0 tasks (0%)
      const changeA = path.join(tempDir, 'change-a');
      const tasksA = path.join(changeA, TASKS_DIRECTORY_NAME);
      await fs.mkdir(tasksA, { recursive: true });
      await fs.writeFile(path.join(changeA, 'proposal.md'), '# Change A');
      await fs.writeFile(path.join(tasksA, '001-task.md'), '# Task with no checkboxes');

      // Create change-b with 50% completion
      const changeB = path.join(tempDir, 'change-b');
      const tasksB = path.join(changeB, TASKS_DIRECTORY_NAME);
      await fs.mkdir(tasksB, { recursive: true });
      await fs.writeFile(path.join(changeB, 'proposal.md'), '# Change B');
      await fs.writeFile(
        path.join(tasksB, '001-task.md'),
        `# Task
## Implementation Checklist
- [x] Done
- [ ] Not done
`
      );

      const result = await getPrioritizedChange(tempDir);
      expect(result).not.toBeNull();
      expect(result!.id).toBe('change-b');
      expect(result!.completionPercentage).toBe(50);
    });

    it('should detect in-progress task', async () => {
      const changeId = 'test-change';
      const changeDir = path.join(tempDir, changeId);
      const tasksDir = path.join(changeDir, TASKS_DIRECTORY_NAME);
      await fs.mkdir(tasksDir, { recursive: true });
      await fs.writeFile(path.join(changeDir, 'proposal.md'), '# Proposal');

      await fs.writeFile(
        path.join(tasksDir, '001-task.md'),
        `---
status: done
---

# Task 1
## Implementation Checklist
- [x] Done
`
      );

      await fs.writeFile(
        path.join(tasksDir, '002-task.md'),
        `---
status: in-progress
---

# Task 2
## Implementation Checklist
- [ ] Not done
`
      );

      await fs.writeFile(
        path.join(tasksDir, '003-task.md'),
        `---
status: to-do
---

# Task 3
## Implementation Checklist
- [ ] Not done
`
      );

      const result = await getPrioritizedChange(tempDir);
      expect(result).not.toBeNull();
      expect(result!.inProgressTask).not.toBeNull();
      expect(result!.inProgressTask!.filename).toBe('002-task.md');
      expect(result!.nextTask!.filename).toBe('002-task.md');
    });

    it('should fall back to first to-do when no in-progress task', async () => {
      const changeId = 'test-change';
      const changeDir = path.join(tempDir, changeId);
      const tasksDir = path.join(changeDir, TASKS_DIRECTORY_NAME);
      await fs.mkdir(tasksDir, { recursive: true });
      await fs.writeFile(path.join(changeDir, 'proposal.md'), '# Proposal');

      await fs.writeFile(
        path.join(tasksDir, '001-task.md'),
        `---
status: done
---

# Task 1
## Implementation Checklist
- [x] Done
`
      );

      await fs.writeFile(
        path.join(tasksDir, '002-task.md'),
        `---
status: done
---

# Task 2
## Implementation Checklist
- [x] Done
`
      );

      await fs.writeFile(
        path.join(tasksDir, '003-task.md'),
        `---
status: to-do
---

# Task 3
## Implementation Checklist
- [ ] Not done
`
      );

      const result = await getPrioritizedChange(tempDir);
      expect(result).not.toBeNull();
      expect(result!.inProgressTask).toBeNull();
      expect(result!.nextTask).not.toBeNull();
      expect(result!.nextTask!.filename).toBe('003-task.md');
    });

    it('should return null when only change has all tasks complete', async () => {
      const changeId = 'test-change';
      const changeDir = path.join(tempDir, changeId);
      const tasksDir = path.join(changeDir, TASKS_DIRECTORY_NAME);
      await fs.mkdir(tasksDir, { recursive: true });
      await fs.writeFile(path.join(changeDir, 'proposal.md'), '# Proposal');

      await fs.writeFile(
        path.join(tasksDir, '001-task.md'),
        `---
status: done
---

# Task 1
## Implementation Checklist
- [x] Done
`
      );

      const result = await getPrioritizedChange(tempDir);
      expect(result).toBeNull();
    });

    it('should include task files in result', async () => {
      const changeId = 'test-change';
      const changeDir = path.join(tempDir, changeId);
      const tasksDir = path.join(changeDir, TASKS_DIRECTORY_NAME);
      await fs.mkdir(tasksDir, { recursive: true });
      await fs.writeFile(path.join(changeDir, 'proposal.md'), '# Proposal');

      await fs.writeFile(
        path.join(tasksDir, '001-first.md'),
        `# Task 1
## Implementation Checklist
- [x] Done
`
      );
      await fs.writeFile(
        path.join(tasksDir, '002-second.md'),
        `# Task 2
## Implementation Checklist
- [ ] Not done
`
      );

      const result = await getPrioritizedChange(tempDir);
      expect(result).not.toBeNull();
      expect(result!.taskFiles.length).toBe(2);
      expect(result!.taskFiles[0].filename).toBe('001-first.md');
      expect(result!.taskFiles[1].filename).toBe('002-second.md');
    });

    it('should skip changes with all task files done', async () => {
      // Create complete-change with all tasks done
      const completeChange = path.join(tempDir, 'complete-change');
      const completeTasks = path.join(completeChange, TASKS_DIRECTORY_NAME);
      await fs.mkdir(completeTasks, { recursive: true });
      await fs.writeFile(
        path.join(completeChange, 'proposal.md'),
        '# Complete Change'
      );
      await fs.writeFile(
        path.join(completeTasks, '001-task.md'),
        `---
status: done
---

# Task
## Implementation Checklist
- [x] Done
- [x] Also done
`
      );

      // Create actionable-change with to-do task
      const actionableChange = path.join(tempDir, 'actionable-change');
      const actionableTasks = path.join(actionableChange, TASKS_DIRECTORY_NAME);
      await fs.mkdir(actionableTasks, { recursive: true });
      await fs.writeFile(
        path.join(actionableChange, 'proposal.md'),
        '# Actionable Change'
      );
      await fs.writeFile(
        path.join(actionableTasks, '001-task.md'),
        `# Task
## Implementation Checklist
- [x] Done
- [ ] Not done
`
      );

      const result = await getPrioritizedChange(tempDir);
      expect(result).not.toBeNull();
      expect(result!.id).toBe('actionable-change');
    });

    it('should skip changes with zero checkboxes', async () => {
      // Create change with no checkboxes
      const noCheckboxChange = path.join(tempDir, 'no-checkbox-change');
      const noCheckboxTasks = path.join(noCheckboxChange, TASKS_DIRECTORY_NAME);
      await fs.mkdir(noCheckboxTasks, { recursive: true });
      await fs.writeFile(
        path.join(noCheckboxChange, 'proposal.md'),
        '# No Checkbox Change'
      );
      await fs.writeFile(
        path.join(noCheckboxTasks, '001-task.md'),
        `# Task
## Implementation Checklist
No checkboxes here
`
      );

      // Create actionable-change with 25% completion
      const actionableChange = path.join(tempDir, 'actionable-change');
      const actionableTasks = path.join(actionableChange, TASKS_DIRECTORY_NAME);
      await fs.mkdir(actionableTasks, { recursive: true });
      await fs.writeFile(
        path.join(actionableChange, 'proposal.md'),
        '# Actionable Change'
      );
      await fs.writeFile(
        path.join(actionableTasks, '001-task.md'),
        `# Task
## Implementation Checklist
- [x] Done
- [ ] Not done
- [ ] Not done
- [ ] Not done
`
      );

      const result = await getPrioritizedChange(tempDir);
      expect(result).not.toBeNull();
      expect(result!.id).toBe('actionable-change');
    });

    it('should return null when only non-actionable changes exist', async () => {
      // Create complete-change with all tasks done
      const completeChange = path.join(tempDir, 'complete-change');
      const completeTasks = path.join(completeChange, TASKS_DIRECTORY_NAME);
      await fs.mkdir(completeTasks, { recursive: true });
      await fs.writeFile(
        path.join(completeChange, 'proposal.md'),
        '# Complete Change'
      );
      await fs.writeFile(
        path.join(completeTasks, '001-task.md'),
        `---
status: done
---

# Task
## Implementation Checklist
- [x] Done
`
      );

      // Create change with all tasks done (no checkboxes)
      const noCheckboxChange = path.join(tempDir, 'no-checkbox-change');
      const noCheckboxTasks = path.join(noCheckboxChange, TASKS_DIRECTORY_NAME);
      await fs.mkdir(noCheckboxTasks, { recursive: true });
      await fs.writeFile(
        path.join(noCheckboxChange, 'proposal.md'),
        '# No Checkbox Change'
      );
      await fs.writeFile(
        path.join(noCheckboxTasks, '001-task.md'),
        `---
status: done
---

# Task
No checkboxes
`
      );

      const result = await getPrioritizedChange(tempDir);
      expect(result).toBeNull();
    });

    it('should detect in-progress task when archive directory exists', async () => {
      // Create archive directory (should be ignored)
      const archiveDir = path.join(tempDir, 'archive');
      await fs.mkdir(archiveDir, { recursive: true });

      // Create a real change with in-progress task
      const changeId = 'test-change';
      const changeDir = path.join(tempDir, changeId);
      const tasksDir = path.join(changeDir, TASKS_DIRECTORY_NAME);
      await fs.mkdir(tasksDir, { recursive: true });
      await fs.writeFile(path.join(changeDir, 'proposal.md'), '# Proposal');

      await fs.writeFile(
        path.join(tasksDir, '001-task.md'),
        `---
status: in-progress
---

# Task 1
## Implementation Checklist
- [ ] Not done
`
      );

      const result = await getPrioritizedChange(tempDir);
      expect(result).not.toBeNull();
      expect(result!.inProgressTask).not.toBeNull();
      expect(result!.inProgressTask!.filename).toBe('001-task.md');
    });

    it('should prioritize actionable changes by completion percentage', async () => {
      // Create complete-change (should be skipped - all tasks done)
      const completeChange = path.join(tempDir, 'complete-change');
      const completeTasks = path.join(completeChange, TASKS_DIRECTORY_NAME);
      await fs.mkdir(completeTasks, { recursive: true });
      await fs.writeFile(
        path.join(completeChange, 'proposal.md'),
        '# Complete Change'
      );
      await fs.writeFile(
        path.join(completeTasks, '001-task.md'),
        `---
status: done
---

# Task
## Implementation Checklist
- [x] Done
`
      );

      // Create low-progress-change with 25% completion
      const lowChange = path.join(tempDir, 'low-progress-change');
      const lowTasks = path.join(lowChange, TASKS_DIRECTORY_NAME);
      await fs.mkdir(lowTasks, { recursive: true });
      await fs.writeFile(path.join(lowChange, 'proposal.md'), '# Low Progress');
      await fs.writeFile(
        path.join(lowTasks, '001-task.md'),
        `# Task
## Implementation Checklist
- [x] Done
- [ ] Not done
- [ ] Not done
- [ ] Not done
`
      );

      // Create high-progress-change with 75% completion
      const highChange = path.join(tempDir, 'high-progress-change');
      const highTasks = path.join(highChange, TASKS_DIRECTORY_NAME);
      await fs.mkdir(highTasks, { recursive: true });
      await fs.writeFile(
        path.join(highChange, 'proposal.md'),
        '# High Progress'
      );
      await fs.writeFile(
        path.join(highTasks, '001-task.md'),
        `# Task
## Implementation Checklist
- [x] Done
- [x] Done
- [x] Done
- [ ] Not done
`
      );

      const result = await getPrioritizedChange(tempDir);
      expect(result).not.toBeNull();
      expect(result!.id).toBe('high-progress-change');
      expect(result!.completionPercentage).toBe(75);
    });
  });

  describe('getPrioritizedParent', () => {
    it('should return null for empty task array', () => {
      const result = getPrioritizedParent([]);
      expect(result).toBeNull();
    });

    it('should return null when all tasks are standalone (no parentId)', () => {
      const tasks: DiscoveredTask[] = [
        {
          filename: '001-task.md',
          filepath: '/path/001-task.md',
          sequence: 1,
          name: 'task',
          content: '',
          status: 'to-do',
        },
        {
          filename: '002-task.md',
          filepath: '/path/002-task.md',
          sequence: 2,
          name: 'task',
          content: '',
          status: 'to-do',
        },
      ];

      const result = getPrioritizedParent(tasks);
      expect(result).toBeNull();
    });

    it('should group tasks by parentId and calculate completion', () => {
      const tasks: DiscoveredTask[] = [
        {
          filename: '001-task.md',
          filepath: '/path/001-task.md',
          sequence: 1,
          name: 'task-1',
          content: '',
          status: 'done',
          parentId: 'change-a',
          parentType: 'change',
        },
        {
          filename: '002-task.md',
          filepath: '/path/002-task.md',
          sequence: 2,
          name: 'task-2',
          content: '',
          status: 'to-do',
          parentId: 'change-a',
          parentType: 'change',
        },
      ];

      const result = getPrioritizedParent(tasks);
      expect(result).not.toBeNull();
      expect(result!.parentId).toBe('change-a');
      expect(result!.parentType).toBe('change');
      expect(result!.totalCount).toBe(2);
      expect(result!.completedCount).toBe(1);
      expect(result!.completionPercentage).toBe(50);
    });

    it('should select parent with highest completion percentage', () => {
      const tasks: DiscoveredTask[] = [
        // change-a: 25% (1/4)
        {
          filename: '001-a.md',
          filepath: '/path/001-a.md',
          sequence: 1,
          name: 'task-a1',
          content: '',
          status: 'done',
          parentId: 'change-a',
          parentType: 'change',
        },
        {
          filename: '002-a.md',
          filepath: '/path/002-a.md',
          sequence: 2,
          name: 'task-a2',
          content: '',
          status: 'to-do',
          parentId: 'change-a',
          parentType: 'change',
        },
        {
          filename: '003-a.md',
          filepath: '/path/003-a.md',
          sequence: 3,
          name: 'task-a3',
          content: '',
          status: 'to-do',
          parentId: 'change-a',
          parentType: 'change',
        },
        {
          filename: '004-a.md',
          filepath: '/path/004-a.md',
          sequence: 4,
          name: 'task-a4',
          content: '',
          status: 'to-do',
          parentId: 'change-a',
          parentType: 'change',
        },
        // change-b: 75% (3/4)
        {
          filename: '001-b.md',
          filepath: '/path/001-b.md',
          sequence: 5,
          name: 'task-b1',
          content: '',
          status: 'done',
          parentId: 'change-b',
          parentType: 'change',
        },
        {
          filename: '002-b.md',
          filepath: '/path/002-b.md',
          sequence: 6,
          name: 'task-b2',
          content: '',
          status: 'done',
          parentId: 'change-b',
          parentType: 'change',
        },
        {
          filename: '003-b.md',
          filepath: '/path/003-b.md',
          sequence: 7,
          name: 'task-b3',
          content: '',
          status: 'done',
          parentId: 'change-b',
          parentType: 'change',
        },
        {
          filename: '004-b.md',
          filepath: '/path/004-b.md',
          sequence: 8,
          name: 'task-b4',
          content: '',
          status: 'to-do',
          parentId: 'change-b',
          parentType: 'change',
        },
      ];

      const result = getPrioritizedParent(tasks);
      expect(result).not.toBeNull();
      expect(result!.parentId).toBe('change-b');
      expect(result!.completionPercentage).toBe(75);
    });

    it('should use oldest sequence as tiebreaker when completion percentages are equal', () => {
      const tasks: DiscoveredTask[] = [
        // change-a: 50% (1/2) - older (sequence 10)
        {
          filename: '010-a.md',
          filepath: '/path/010-a.md',
          sequence: 10,
          name: 'task-a1',
          content: '',
          status: 'done',
          parentId: 'change-a',
          parentType: 'change',
        },
        {
          filename: '011-a.md',
          filepath: '/path/011-a.md',
          sequence: 11,
          name: 'task-a2',
          content: '',
          status: 'to-do',
          parentId: 'change-a',
          parentType: 'change',
        },
        // change-b: 50% (1/2) - newer (sequence 20)
        {
          filename: '020-b.md',
          filepath: '/path/020-b.md',
          sequence: 20,
          name: 'task-b1',
          content: '',
          status: 'done',
          parentId: 'change-b',
          parentType: 'change',
        },
        {
          filename: '021-b.md',
          filepath: '/path/021-b.md',
          sequence: 21,
          name: 'task-b2',
          content: '',
          status: 'to-do',
          parentId: 'change-b',
          parentType: 'change',
        },
      ];

      const result = getPrioritizedParent(tasks);
      expect(result).not.toBeNull();
      expect(result!.parentId).toBe('change-a'); // Older (lower sequence)
    });

    it('should identify in-progress and next tasks correctly', () => {
      const tasks: DiscoveredTask[] = [
        {
          filename: '001-task.md',
          filepath: '/path/001-task.md',
          sequence: 1,
          name: 'task-1',
          content: '',
          status: 'done',
          parentId: 'change-a',
          parentType: 'change',
        },
        {
          filename: '002-task.md',
          filepath: '/path/002-task.md',
          sequence: 2,
          name: 'task-2',
          content: '',
          status: 'in-progress',
          parentId: 'change-a',
          parentType: 'change',
        },
        {
          filename: '003-task.md',
          filepath: '/path/003-task.md',
          sequence: 3,
          name: 'task-3',
          content: '',
          status: 'to-do',
          parentId: 'change-a',
          parentType: 'change',
        },
      ];

      const result = getPrioritizedParent(tasks);
      expect(result).not.toBeNull();
      expect(result!.inProgressTask).not.toBeNull();
      expect(result!.inProgressTask!.filename).toBe('002-task.md');
      expect(result!.nextTask!.filename).toBe('002-task.md'); // Prefer in-progress
    });

    it('should fall back to first to-do when no in-progress task', () => {
      const tasks: DiscoveredTask[] = [
        {
          filename: '001-task.md',
          filepath: '/path/001-task.md',
          sequence: 1,
          name: 'task-1',
          content: '',
          status: 'done',
          parentId: 'change-a',
          parentType: 'change',
        },
        {
          filename: '002-task.md',
          filepath: '/path/002-task.md',
          sequence: 2,
          name: 'task-2',
          content: '',
          status: 'to-do',
          parentId: 'change-a',
          parentType: 'change',
        },
        {
          filename: '003-task.md',
          filepath: '/path/003-task.md',
          sequence: 3,
          name: 'task-3',
          content: '',
          status: 'to-do',
          parentId: 'change-a',
          parentType: 'change',
        },
      ];

      const result = getPrioritizedParent(tasks);
      expect(result).not.toBeNull();
      expect(result!.inProgressTask).toBeNull();
      expect(result!.nextTask).not.toBeNull();
      expect(result!.nextTask!.filename).toBe('002-task.md'); // First to-do
    });

    it('should skip parents with all tasks done', () => {
      const tasks: DiscoveredTask[] = [
        // change-a: all done
        {
          filename: '001-a.md',
          filepath: '/path/001-a.md',
          sequence: 1,
          name: 'task-a1',
          content: '',
          status: 'done',
          parentId: 'change-a',
          parentType: 'change',
        },
        {
          filename: '002-a.md',
          filepath: '/path/002-a.md',
          sequence: 2,
          name: 'task-a2',
          content: '',
          status: 'done',
          parentId: 'change-a',
          parentType: 'change',
        },
        // change-b: has actionable tasks
        {
          filename: '001-b.md',
          filepath: '/path/001-b.md',
          sequence: 3,
          name: 'task-b1',
          content: '',
          status: 'done',
          parentId: 'change-b',
          parentType: 'change',
        },
        {
          filename: '002-b.md',
          filepath: '/path/002-b.md',
          sequence: 4,
          name: 'task-b2',
          content: '',
          status: 'to-do',
          parentId: 'change-b',
          parentType: 'change',
        },
      ];

      const result = getPrioritizedParent(tasks);
      expect(result).not.toBeNull();
      expect(result!.parentId).toBe('change-b'); // Skip change-a (all done)
    });

    it('should return null when all parents have no actionable tasks', () => {
      const tasks: DiscoveredTask[] = [
        {
          filename: '001-task.md',
          filepath: '/path/001-task.md',
          sequence: 1,
          name: 'task-1',
          content: '',
          status: 'done',
          parentId: 'change-a',
          parentType: 'change',
        },
        {
          filename: '002-task.md',
          filepath: '/path/002-task.md',
          sequence: 2,
          name: 'task-2',
          content: '',
          status: 'done',
          parentId: 'change-a',
          parentType: 'change',
        },
      ];

      const result = getPrioritizedParent(tasks);
      expect(result).toBeNull();
    });

    it('should handle different parent types', () => {
      const tasks: DiscoveredTask[] = [
        {
          filename: '001-task.md',
          filepath: '/path/001-task.md',
          sequence: 1,
          name: 'task-1',
          content: '',
          status: 'done',
          parentId: 'spec-a',
          parentType: 'spec',
        },
        {
          filename: '002-task.md',
          filepath: '/path/002-task.md',
          sequence: 2,
          name: 'task-2',
          content: '',
          status: 'to-do',
          parentId: 'spec-a',
          parentType: 'spec',
        },
      ];

      const result = getPrioritizedParent(tasks);
      expect(result).not.toBeNull();
      expect(result!.parentId).toBe('spec-a');
      expect(result!.parentType).toBe('spec');
    });

    it('should sort tasks by sequence within a parent', () => {
      const tasks: DiscoveredTask[] = [
        {
          filename: '003-task.md',
          filepath: '/path/003-task.md',
          sequence: 3,
          name: 'task-3',
          content: '',
          status: 'to-do',
          parentId: 'change-a',
          parentType: 'change',
        },
        {
          filename: '001-task.md',
          filepath: '/path/001-task.md',
          sequence: 1,
          name: 'task-1',
          content: '',
          status: 'done',
          parentId: 'change-a',
          parentType: 'change',
        },
        {
          filename: '002-task.md',
          filepath: '/path/002-task.md',
          sequence: 2,
          name: 'task-2',
          content: '',
          status: 'to-do',
          parentId: 'change-a',
          parentType: 'change',
        },
      ];

      const result = getPrioritizedParent(tasks);
      expect(result).not.toBeNull();
      expect(result!.tasks.length).toBe(3);
      expect(result!.tasks[0].sequence).toBe(1);
      expect(result!.tasks[1].sequence).toBe(2);
      expect(result!.tasks[2].sequence).toBe(3);
    });
  });
});
