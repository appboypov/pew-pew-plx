import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { ItemRetrievalService } from '../../src/services/item-retrieval.js';

describe('ItemRetrievalService', () => {
  let tempDir: string;
  let service: ItemRetrievalService;

  beforeEach(async () => {
    tempDir = path.join(os.tmpdir(), `plx-item-retrieval-test-${Date.now()}`);
    await fs.mkdir(tempDir, { recursive: true });

    // Create workspace structure
    const changesDir = path.join(tempDir, 'workspace', 'changes');
    const specsDir = path.join(tempDir, 'workspace', 'specs');
    await fs.mkdir(changesDir, { recursive: true });
    await fs.mkdir(specsDir, { recursive: true });

    service = new ItemRetrievalService(tempDir);
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  async function createChange(changeId: string, proposal: string, design?: string) {
    const changeDir = path.join(tempDir, 'workspace', 'changes', changeId);
    await fs.mkdir(changeDir, { recursive: true });
    await fs.writeFile(path.join(changeDir, 'proposal.md'), proposal);
    if (design) {
      await fs.writeFile(path.join(changeDir, 'design.md'), design);
    }
  }

  async function createTask(changeId: string, filename: string, content: string) {
    const tasksDir = path.join(tempDir, 'workspace', 'changes', changeId, 'tasks');
    await fs.mkdir(tasksDir, { recursive: true });
    await fs.writeFile(path.join(tasksDir, filename), content);
  }

  async function createSpec(specId: string, content: string) {
    const specDir = path.join(tempDir, 'workspace', 'specs', specId);
    await fs.mkdir(specDir, { recursive: true });
    await fs.writeFile(path.join(specDir, 'spec.md'), content);
  }

  describe('getTaskById', () => {
    it('should find task by full ID (changeId/taskFilename)', async () => {
      await createChange('my-change', '# Proposal');
      await createTask('my-change', '001-implement.md', `---
status: to-do
---

# Task: Implement`);

      const result = await service.getTaskById('my-change/001-implement');
      expect(result).not.toBeNull();
      expect(result!.changeId).toBe('my-change');
      expect(result!.task.sequence).toBe(1);
      expect(result!.task.name).toBe('implement');
      expect(result!.content).toContain('# Task: Implement');
    });

    it('should find task by short ID (searches all changes)', async () => {
      await createChange('first-change', '# First');
      await createChange('second-change', '# Second');
      await createTask('second-change', '002-review.md', `---
status: in-progress
---

# Task: Review`);

      const result = await service.getTaskById('002-review');
      expect(result).not.toBeNull();
      expect(result!.changeId).toBe('second-change');
      expect(result!.task.name).toBe('review');
    });

    it('should return null for non-existent task', async () => {
      await createChange('my-change', '# Proposal');

      const result = await service.getTaskById('my-change/999-missing');
      expect(result).toBeNull();
    });

    it('should handle task filename with .md extension', async () => {
      await createChange('my-change', '# Proposal');
      await createTask('my-change', '001-test.md', '# Task');

      const result = await service.getTaskById('my-change/001-test.md');
      expect(result).not.toBeNull();
      expect(result!.task.name).toBe('test');
    });

    it('should return null when no active changes exist', async () => {
      const result = await service.getTaskById('001-anything');
      expect(result).toBeNull();
    });
  });

  describe('getChangeById', () => {
    it('should retrieve change with proposal only', async () => {
      await createChange('simple-change', '# Simple Proposal\n\nContent here.');

      const result = await service.getChangeById('simple-change');
      expect(result).not.toBeNull();
      expect(result!.proposal).toContain('# Simple Proposal');
      expect(result!.design).toBeNull();
      expect(result!.tasks).toEqual([]);
    });

    it('should retrieve change with proposal and design', async () => {
      await createChange('full-change', '# Proposal', '# Design Document');

      const result = await service.getChangeById('full-change');
      expect(result).not.toBeNull();
      expect(result!.proposal).toContain('# Proposal');
      expect(result!.design).toContain('# Design Document');
    });

    it('should retrieve change with tasks', async () => {
      await createChange('with-tasks', '# Proposal');
      await createTask('with-tasks', '001-first.md', '---\nstatus: to-do\n---\n# First');
      await createTask('with-tasks', '002-second.md', '---\nstatus: to-do\n---\n# Second');

      const result = await service.getChangeById('with-tasks');
      expect(result).not.toBeNull();
      expect(result!.tasks).toHaveLength(2);
      expect(result!.tasks[0].sequence).toBe(1);
      expect(result!.tasks[1].sequence).toBe(2);
    });

    it('should return null for non-existent change', async () => {
      const result = await service.getChangeById('non-existent');
      expect(result).toBeNull();
    });
  });

  describe('getSpecById', () => {
    it('should retrieve spec content', async () => {
      await createSpec('my-spec', '# Spec\n\n## Requirements\n\nMust work.');

      const result = await service.getSpecById('my-spec');
      expect(result).not.toBeNull();
      expect(result).toContain('# Spec');
      expect(result).toContain('## Requirements');
    });

    it('should return null for non-existent spec', async () => {
      const result = await service.getSpecById('missing-spec');
      expect(result).toBeNull();
    });
  });

  describe('getTasksForChange', () => {
    it('should return all tasks for a change', async () => {
      await createChange('my-change', '# Proposal');
      await createTask('my-change', '001-first.md', '---\nstatus: done\n---\n# First');
      await createTask('my-change', '002-second.md', '---\nstatus: to-do\n---\n# Second');
      await createTask('my-change', '003-third.md', '---\nstatus: to-do\n---\n# Third');

      const result = await service.getTasksForChange('my-change');
      expect(result).toHaveLength(3);
      expect(result[0].name).toBe('first');
      expect(result[1].name).toBe('second');
      expect(result[2].name).toBe('third');
    });

    it('should return empty array for change without tasks', async () => {
      await createChange('no-tasks', '# Proposal');

      const result = await service.getTasksForChange('no-tasks');
      expect(result).toEqual([]);
    });

    it('should return empty array for non-existent change', async () => {
      const result = await service.getTasksForChange('non-existent');
      expect(result).toEqual([]);
    });
  });

  describe('getAllOpenTasks', () => {
    it('should return all to-do and in-progress tasks', async () => {
      await createChange('change-a', '# A');
      await createTask('change-a', '001-done.md', '---\nstatus: done\n---\n# Done');
      await createTask('change-a', '002-todo.md', '---\nstatus: to-do\n---\n# Todo');

      await createChange('change-b', '# B');
      await createTask('change-b', '001-wip.md', '---\nstatus: in-progress\n---\n# WIP');

      const result = await service.getAllOpenTasks();
      expect(result).toHaveLength(2);

      const taskIds = result.map((t) => t.taskId);
      expect(taskIds).toContain('002-todo');
      expect(taskIds).toContain('001-wip');
    });

    it('should return empty array when no open tasks exist', async () => {
      await createChange('all-done', '# Done');
      await createTask('all-done', '001-complete.md', '---\nstatus: done\n---\n# Complete');

      const result = await service.getAllOpenTasks();
      expect(result).toEqual([]);
    });

    it('should return empty array when no changes exist', async () => {
      const result = await service.getAllOpenTasks();
      expect(result).toEqual([]);
    });

    it('should include correct status for each task', async () => {
      await createChange('mixed', '# Mixed');
      await createTask('mixed', '001-a.md', '---\nstatus: to-do\n---\n# A');
      await createTask('mixed', '002-b.md', '---\nstatus: in-progress\n---\n# B');

      const result = await service.getAllOpenTasks();
      expect(result).toHaveLength(2);

      const todoTask = result.find((t) => t.task.name === 'a');
      const wipTask = result.find((t) => t.task.name === 'b');

      expect(todoTask!.status).toBe('to-do');
      expect(wipTask!.status).toBe('in-progress');
    });
  });
});
