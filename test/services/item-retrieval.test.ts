import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { ItemRetrievalService } from '../../src/services/item-retrieval.js';
import { DiscoveredWorkspace } from '../../src/utils/workspace-discovery.js';

describe('ItemRetrievalService', () => {
  let tempDir: string;
  let workspacePath: string;
  let workspace: DiscoveredWorkspace;
  let service: ItemRetrievalService;

  beforeEach(async () => {
    tempDir = path.join(os.tmpdir(), `plx-item-retrieval-test-${Date.now()}`);
    await fs.mkdir(tempDir, { recursive: true });

    // Create workspace structure with centralized tasks directory
    workspacePath = path.join(tempDir, 'workspace');
    const changesDir = path.join(workspacePath, 'changes');
    const specsDir = path.join(workspacePath, 'specs');
    const tasksDir = path.join(workspacePath, 'tasks');
    await fs.mkdir(changesDir, { recursive: true });
    await fs.mkdir(specsDir, { recursive: true });
    await fs.mkdir(tasksDir, { recursive: true });

    // Create AGENTS.md to make it a valid workspace
    await fs.writeFile(path.join(workspacePath, 'AGENTS.md'), '# Agents');

    workspace = {
      path: workspacePath,
      relativePath: '.',
      projectName: '',
      isRoot: true,
    };

    service = await ItemRetrievalService.create(tempDir, [workspace]);
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  async function createChange(
    changeId: string,
    proposal: string,
    design?: string
  ) {
    const changeDir = path.join(workspacePath, 'changes', changeId);
    await fs.mkdir(changeDir, { recursive: true });
    await fs.writeFile(path.join(changeDir, 'proposal.md'), proposal);
    if (design) {
      await fs.writeFile(path.join(changeDir, 'design.md'), design);
    }
  }

  async function createCentralizedTask(
    filename: string,
    content: string
  ): Promise<void> {
    const tasksDir = path.join(workspacePath, 'tasks');
    await fs.writeFile(path.join(tasksDir, filename), content);
  }

  async function createSpec(specId: string, content: string) {
    const specDir = path.join(workspacePath, 'specs', specId);
    await fs.mkdir(specDir, { recursive: true });
    await fs.writeFile(path.join(specDir, 'spec.md'), content);
  }

  async function createReview(reviewId: string, content: string) {
    const reviewDir = path.join(workspacePath, 'reviews', reviewId);
    await fs.mkdir(reviewDir, { recursive: true });
    await fs.writeFile(path.join(reviewDir, 'review.md'), content);
  }

  describe('getTaskById', () => {
    it('should find task by filename in centralized tasks directory', async () => {
      await createCentralizedTask(
        '001-implement.md',
        `---
status: to-do
---

# Task: Implement`
      );

      const result = await service.getTaskById('001-implement');
      expect(result).not.toBeNull();
      expect(result!.task.sequence).toBe(1);
      expect(result!.task.name).toBe('implement');
      expect(result!.content).toContain('# Task: Implement');
    });

    it('should find parented task and include parent info', async () => {
      await createChange('my-change', '# Proposal');
      await createCentralizedTask(
        '001-my-change-implement.md',
        `---
status: in-progress
parent-type: change
parent-id: my-change
---

# Task: Implement for my-change`
      );

      const result = await service.getTaskById('001-my-change-implement');
      expect(result).not.toBeNull();
      expect(result!.changeId).toBe('my-change');
      expect(result!.task.name).toBe('implement');
    });

    it('should return null for non-existent task', async () => {
      const result = await service.getTaskById('999-missing');
      expect(result).toBeNull();
    });

    it('should handle task filename with .md extension', async () => {
      await createCentralizedTask(
        '001-test.md',
        `---
status: to-do
---
# Task`
      );

      const result = await service.getTaskById('001-test.md');
      expect(result).not.toBeNull();
      expect(result!.task.name).toBe('test');
    });

    it('should return null when no tasks exist', async () => {
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
      expect(result!.content).toContain('# Spec');
      expect(result!.content).toContain('## Requirements');
    });

    it('should return null for non-existent spec', async () => {
      const result = await service.getSpecById('missing-spec');
      expect(result).toBeNull();
    });
  });

  describe('getReviewById', () => {
    it('should retrieve review content', async () => {
      await createReview(
        'my-review',
        '# Review\n\n## Findings\n\nNeeds improvement.'
      );

      const result = await service.getReviewById('my-review');
      expect(result).not.toBeNull();
      expect(result!.content).toContain('# Review');
      expect(result!.content).toContain('## Findings');
    });

    it('should return null for non-existent review', async () => {
      const result = await service.getReviewById('missing-review');
      expect(result).toBeNull();
    });
  });

  describe('getTasksForParent', () => {
    it('should return all tasks for a change from centralized directory', async () => {
      await createChange('my-change', '# Proposal');
      await createCentralizedTask(
        '001-my-change-first.md',
        `---
status: done
parent-type: change
parent-id: my-change
---
# First`
      );
      await createCentralizedTask(
        '002-my-change-second.md',
        `---
status: to-do
parent-type: change
parent-id: my-change
---
# Second`
      );
      await createCentralizedTask(
        '003-my-change-third.md',
        `---
status: to-do
parent-type: change
parent-id: my-change
---
# Third`
      );

      const result = await service.getTasksForParent('my-change');
      expect(result).toHaveLength(3);
      expect(result[0].name).toBe('first');
      expect(result[1].name).toBe('second');
      expect(result[2].name).toBe('third');
    });

    it('should return empty array when no tasks match parent', async () => {
      await createChange('no-tasks', '# Proposal');

      const result = await service.getTasksForParent('no-tasks');
      expect(result).toEqual([]);
    });

    it('should filter by parent type when specified', async () => {
      await createCentralizedTask(
        '001-shared-id-implement.md',
        `---
status: to-do
parent-type: change
parent-id: shared-id
---
# Change Task`
      );
      await createCentralizedTask(
        '002-shared-id-review.md',
        `---
status: to-do
parent-type: review
parent-id: shared-id
---
# Review Task`
      );

      const changeResult = await service.getTasksForParent(
        'shared-id',
        'change'
      );
      expect(changeResult).toHaveLength(1);
      expect(changeResult[0].name).toBe('implement');

      const reviewResult = await service.getTasksForParent(
        'shared-id',
        'review'
      );
      expect(reviewResult).toHaveLength(1);
      expect(reviewResult[0].name).toBe('review');
    });

    it('should throw error when parent ID has conflicts and no type specified', async () => {
      await createCentralizedTask(
        '001-shared-id-change.md',
        `---
status: to-do
parent-type: change
parent-id: shared-id
---
# Change Task`
      );
      await createCentralizedTask(
        '002-shared-id-spec.md',
        `---
status: to-do
parent-type: spec
parent-id: shared-id
---
# Spec Task`
      );

      await expect(service.getTasksForParent('shared-id')).rejects.toThrow(
        'Parent ID "shared-id" matches multiple parent types'
      );
    });
  });

  describe('getAllOpenTasks', () => {
    it('should return all to-do and in-progress tasks from centralized directory', async () => {
      await createCentralizedTask(
        '001-done.md',
        `---
status: done
---
# Done`
      );
      await createCentralizedTask(
        '002-todo.md',
        `---
status: to-do
---
# Todo`
      );
      await createCentralizedTask(
        '003-wip.md',
        `---
status: in-progress
---
# WIP`
      );

      const result = await service.getAllOpenTasks();
      expect(result).toHaveLength(2);

      const taskIds = result.map((t) => t.taskId);
      expect(taskIds).toContain('002-todo');
      expect(taskIds).toContain('003-wip');
    });

    it('should return empty array when no open tasks exist', async () => {
      await createCentralizedTask(
        '001-complete.md',
        `---
status: done
---
# Complete`
      );

      const result = await service.getAllOpenTasks();
      expect(result).toEqual([]);
    });

    it('should return empty array when no tasks exist', async () => {
      const result = await service.getAllOpenTasks();
      expect(result).toEqual([]);
    });

    it('should include correct status for each task', async () => {
      await createCentralizedTask(
        '001-a.md',
        `---
status: to-do
---
# A`
      );
      await createCentralizedTask(
        '002-b.md',
        `---
status: in-progress
---
# B`
      );

      const result = await service.getAllOpenTasks();
      expect(result).toHaveLength(2);

      const todoTask = result.find((t) => t.task.name === 'a');
      const wipTask = result.find((t) => t.task.name === 'b');

      expect(todoTask!.status).toBe('to-do');
      expect(wipTask!.status).toBe('in-progress');
    });

    it('should filter by parent type when specified', async () => {
      await createCentralizedTask(
        '001-change-task.md',
        `---
status: to-do
parent-type: change
parent-id: my-change
---
# Change Task`
      );
      await createCentralizedTask(
        '002-review-task.md',
        `---
status: to-do
parent-type: review
parent-id: my-review
---
# Review Task`
      );

      const changeResult = await service.getAllOpenTasks('change');
      expect(changeResult).toHaveLength(1);
      expect(changeResult[0].parentType).toBe('change');

      const reviewResult = await service.getAllOpenTasks('review');
      expect(reviewResult).toHaveLength(1);
      expect(reviewResult[0].parentType).toBe('review');
    });

    it('should include skill level when present', async () => {
      await createCentralizedTask(
        '001-senior-task.md',
        `---
status: to-do
skill-level: senior
---
# Senior Task`
      );
      await createCentralizedTask(
        '002-no-level.md',
        `---
status: to-do
---
# No Level`
      );

      const result = await service.getAllOpenTasks();
      expect(result).toHaveLength(2);

      const seniorTask = result.find((t) => t.task.name === 'senior-task');
      const noLevelTask = result.find((t) => t.task.name === 'no-level');

      expect(seniorTask!.skillLevel).toBe('senior');
      expect(noLevelTask!.skillLevel).toBeUndefined();
    });
  });

  describe('archived tasks exclusion', () => {
    it('should exclude archived tasks from getTaskById', async () => {
      const archiveDir = path.join(workspacePath, 'tasks', 'archive');
      await fs.mkdir(archiveDir, { recursive: true });
      await fs.writeFile(
        path.join(archiveDir, '001-archived.md'),
        `---
status: done
---
# Archived`
      );

      const result = await service.getTaskById('001-archived');
      expect(result).toBeNull();
    });

    it('should exclude archived tasks from getAllOpenTasks', async () => {
      await createCentralizedTask(
        '001-active.md',
        `---
status: to-do
---
# Active`
      );

      const archiveDir = path.join(workspacePath, 'tasks', 'archive');
      await fs.mkdir(archiveDir, { recursive: true });
      await fs.writeFile(
        path.join(archiveDir, '002-archived.md'),
        `---
status: to-do
---
# Archived but should not appear`
      );

      const result = await service.getAllOpenTasks();
      expect(result).toHaveLength(1);
      expect(result[0].taskId).toBe('001-active');
    });
  });

  describe('standalone tasks', () => {
    it('should support standalone tasks without parent info', async () => {
      await createCentralizedTask(
        '001-standalone.md',
        `---
status: to-do
---
# Standalone Task`
      );

      const result = await service.getTaskById('001-standalone');
      expect(result).not.toBeNull();
      expect(result!.changeId).toBe('');
    });

    it('should include standalone tasks in getAllOpenTasks', async () => {
      await createCentralizedTask(
        '001-standalone.md',
        `---
status: to-do
---
# Standalone`
      );
      await createCentralizedTask(
        '002-parented.md',
        `---
status: to-do
parent-type: change
parent-id: my-change
---
# Parented`
      );

      const result = await service.getAllOpenTasks();
      expect(result).toHaveLength(2);
    });

    it('should exclude standalone tasks from parent type filtering', async () => {
      await createCentralizedTask(
        '001-standalone.md',
        `---
status: to-do
---
# Standalone`
      );
      await createCentralizedTask(
        '002-change-task.md',
        `---
status: to-do
parent-type: change
parent-id: my-change
---
# Change Task`
      );

      const result = await service.getAllOpenTasks('change');
      expect(result).toHaveLength(1);
      expect(result[0].taskId).toBe('002-change-task');
    });
  });

  describe('review and spec task retrieval', () => {
    it('should return tasks for review parent type', async () => {
      await createCentralizedTask(
        '001-my-review-fix.md',
        `---
status: to-do
parent-type: review
parent-id: my-review
---
# Fix`
      );

      const result = await service.getTasksForParent('my-review', 'review');
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('fix');
    });

    it('should return tasks for spec parent type', async () => {
      await createCentralizedTask(
        '001-my-spec-update.md',
        `---
status: to-do
parent-type: spec
parent-id: my-spec
---
# Update`
      );

      const result = await service.getTasksForParent('my-spec', 'spec');
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('update');
    });

    it('should include review tasks in getAllOpenTasks', async () => {
      await createCentralizedTask(
        '001-review-task.md',
        `---
status: in-progress
parent-type: review
parent-id: my-review
---
# Review Task`
      );

      const result = await service.getAllOpenTasks();
      expect(result.some((t) => t.parentId === 'my-review')).toBe(true);
      expect(result.some((t) => t.parentType === 'review')).toBe(true);
    });
  });

  describe('getTasksForReview', () => {
    it('should return tasks for review using convenience method', async () => {
      await createCentralizedTask(
        '001-my-review-fix-bug.md',
        `---
status: to-do
parent-type: review
parent-id: my-review
---
# Fix Bug`
      );
      await createCentralizedTask(
        '002-my-review-update-docs.md',
        `---
status: to-do
parent-type: review
parent-id: my-review
---
# Update Docs`
      );

      const result = await service.getTasksForReview('my-review');
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('bug');
      expect(result[1].name).toBe('docs');
    });

    it('should return empty array when no review tasks exist', async () => {
      const result = await service.getTasksForReview('non-existent-review');
      expect(result).toEqual([]);
    });
  });

  describe('getTasksForSpec', () => {
    it('should return tasks for spec using convenience method', async () => {
      await createCentralizedTask(
        '001-my-spec-implement.md',
        `---
status: to-do
parent-type: spec
parent-id: my-spec
---
# Implement`
      );
      await createCentralizedTask(
        '002-my-spec-test.md',
        `---
status: in-progress
parent-type: spec
parent-id: my-spec
---
# Test`
      );

      const result = await service.getTasksForSpec('my-spec');
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('implement');
      expect(result[1].name).toBe('test');
    });

    it('should return empty array when no spec tasks exist', async () => {
      const result = await service.getTasksForSpec('non-existent-spec');
      expect(result).toEqual([]);
    });
  });
});
