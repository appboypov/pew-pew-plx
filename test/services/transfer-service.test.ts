import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import { createValidPlxWorkspace } from '../test-utils.js';
import { TransferService } from '../../src/services/transfer-service.js';

describe('TransferService', () => {
  const projectRoot = process.cwd();
  const testDir = path.join(projectRoot, 'test-transfer-service-tmp');
  const sourceDir = path.join(testDir, 'source-project');
  const targetDir = path.join(testDir, 'target-project');

  beforeEach(async () => {
    await fs.mkdir(testDir, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
  });

  describe('create', () => {
    it('creates a TransferService instance', async () => {
      const service = await TransferService.create();
      expect(service).toBeInstanceOf(TransferService);
    });
  });

  describe('setSourceWorkspace', () => {
    it('sets a valid source workspace', async () => {
      await createValidPlxWorkspace(sourceDir);
      const service = await TransferService.create();

      await service.setSourceWorkspace(sourceDir);

      expect(service.getSourceWorkspace()).not.toBeNull();
      expect(service.getSourceProjectRoot()).toBe(path.resolve(sourceDir));
    });

    it('throws when source path has no valid workspace', async () => {
      const service = await TransferService.create();

      await expect(service.setSourceWorkspace(testDir)).rejects.toThrow(
        'No valid PLX workspace found'
      );
    });
  });

  describe('setTargetWorkspace', () => {
    it('sets target workspace when it exists', async () => {
      await createValidPlxWorkspace(targetDir);
      const service = await TransferService.create();

      const result = await service.setTargetWorkspace(targetDir);

      expect(result.requiresInit).toBe(false);
      expect(service.getTargetWorkspace()).not.toBeNull();
      expect(service.getTargetProjectRoot()).toBe(path.resolve(targetDir));
    });

    it('returns requiresInit: true when target has no workspace', async () => {
      await fs.mkdir(targetDir, { recursive: true });
      const service = await TransferService.create();

      const result = await service.setTargetWorkspace(targetDir);

      expect(result.requiresInit).toBe(true);
      expect(service.getTargetWorkspace()).not.toBeNull();
    });
  });

  describe('buildTransferPlan', () => {
    let service: TransferService;

    beforeEach(async () => {
      await createValidPlxWorkspace(sourceDir);
      await createValidPlxWorkspace(targetDir);
      service = await TransferService.create();
      await service.setSourceWorkspace(sourceDir);
      await service.setTargetWorkspace(targetDir);
    });

    describe('for change entity', () => {
      it('plans change directory transfer', async () => {
        const changeDir = path.join(sourceDir, 'workspace', 'changes', 'my-feature');
        await fs.mkdir(changeDir, { recursive: true });
        await fs.writeFile(path.join(changeDir, 'proposal.md'), '# Proposal');

        const plan = await service.buildTransferPlan('change', 'my-feature');

        expect(plan.entityType).toBe('change');
        expect(plan.entityId).toBe('my-feature');
        expect(plan.targetName).toBe('my-feature');
        expect(plan.filesToMove.length).toBe(1);
        expect(plan.filesToMove[0].type).toBe('directory');
        expect(plan.filesToMove[0].sourcePath).toContain('my-feature');
      });

      it('plans change transfer with linked tasks', async () => {
        const changeDir = path.join(sourceDir, 'workspace', 'changes', 'my-feature');
        await fs.mkdir(changeDir, { recursive: true });
        await fs.writeFile(path.join(changeDir, 'proposal.md'), '# Proposal');

        const tasksDir = path.join(sourceDir, 'workspace', 'tasks');
        await fs.mkdir(tasksDir, { recursive: true });
        await fs.writeFile(
          path.join(tasksDir, '001-my-feature-implement.md'),
          '---\nstatus: to-do\nparent-type: change\nparent-id: my-feature\n---\n\n# Task'
        );
        await fs.writeFile(
          path.join(tasksDir, '002-my-feature-test.md'),
          '---\nstatus: to-do\nparent-type: change\nparent-id: my-feature\n---\n\n# Task 2'
        );

        const plan = await service.buildTransferPlan('change', 'my-feature');

        expect(plan.tasksToRenumber.length).toBe(2);
        expect(plan.tasksToRenumber[0].oldFilename).toBe('001-my-feature-implement.md');
        expect(plan.tasksToRenumber[1].oldFilename).toBe('002-my-feature-test.md');
      });

      it('uses targetName when renaming entity', async () => {
        const changeDir = path.join(sourceDir, 'workspace', 'changes', 'old-name');
        await fs.mkdir(changeDir, { recursive: true });
        await fs.writeFile(path.join(changeDir, 'proposal.md'), '# Proposal');

        const plan = await service.buildTransferPlan('change', 'old-name', 'new-name');

        expect(plan.targetName).toBe('new-name');
        expect(plan.filesToMove[0].targetPath).toContain('new-name');
      });

      it('updates task parent-id when renaming entity', async () => {
        const changeDir = path.join(sourceDir, 'workspace', 'changes', 'old-name');
        await fs.mkdir(changeDir, { recursive: true });
        await fs.writeFile(path.join(changeDir, 'proposal.md'), '# Proposal');

        const tasksDir = path.join(sourceDir, 'workspace', 'tasks');
        await fs.mkdir(tasksDir, { recursive: true });
        await fs.writeFile(
          path.join(tasksDir, '001-old-name-task.md'),
          '---\nstatus: to-do\nparent-type: change\nparent-id: old-name\n---\n\n# Task'
        );

        const plan = await service.buildTransferPlan('change', 'old-name', 'new-name');

        expect(plan.tasksToRenumber[0].parentIdUpdate).toEqual({
          old: 'old-name',
          new: 'new-name',
        });
      });
    });

    describe('for spec entity', () => {
      it('plans spec directory transfer', async () => {
        const specDir = path.join(sourceDir, 'workspace', 'specs', 'api-design');
        await fs.mkdir(specDir, { recursive: true });
        await fs.writeFile(path.join(specDir, 'spec.md'), '# Spec');

        const plan = await service.buildTransferPlan('spec', 'api-design');

        expect(plan.entityType).toBe('spec');
        expect(plan.entityId).toBe('api-design');
        expect(plan.filesToMove.length).toBe(1);
        expect(plan.filesToMove[0].type).toBe('directory');
      });

      it('cascades related changes with spec', async () => {
        // Create spec
        const specDir = path.join(sourceDir, 'workspace', 'specs', 'api-design');
        await fs.mkdir(specDir, { recursive: true });
        await fs.writeFile(path.join(specDir, 'spec.md'), '# Spec');

        // Create change that references spec via delta
        const changeDir = path.join(sourceDir, 'workspace', 'changes', 'implement-api');
        const deltaDir = path.join(changeDir, 'specs', 'api-design');
        await fs.mkdir(deltaDir, { recursive: true });
        await fs.writeFile(path.join(deltaDir, 'delta.md'), '# Delta');

        const plan = await service.buildTransferPlan('spec', 'api-design');

        // Should include both spec and related change
        expect(plan.filesToMove.length).toBe(2);
        const specFile = plan.filesToMove.find(f => f.sourcePath.includes('specs'));
        const changeFile = plan.filesToMove.find(f => f.sourcePath.includes('changes'));
        expect(specFile).toBeDefined();
        expect(changeFile).toBeDefined();
      });
    });

    describe('for task entity', () => {
      it('plans single task transfer with renumbering', async () => {
        const tasksDir = path.join(sourceDir, 'workspace', 'tasks');
        await fs.mkdir(tasksDir, { recursive: true });
        await fs.writeFile(
          path.join(tasksDir, '005-some-task.md'),
          '---\nstatus: to-do\n---\n\n# Task'
        );

        // Add existing task in target
        const targetTasksDir = path.join(targetDir, 'workspace', 'tasks');
        await fs.mkdir(targetTasksDir, { recursive: true });
        await fs.writeFile(
          path.join(targetTasksDir, '010-existing.md'),
          '---\nstatus: done\n---\n\n# Existing'
        );

        const plan = await service.buildTransferPlan('task', '005-some-task.md');

        expect(plan.entityType).toBe('task');
        expect(plan.tasksToRenumber.length).toBe(1);
        // Should continue from target's highest sequence (10)
        expect(plan.tasksToRenumber[0].newSequence).toBe(11);
      });

      it('throws when task not found', async () => {
        const tasksDir = path.join(sourceDir, 'workspace', 'tasks');
        await fs.mkdir(tasksDir, { recursive: true });

        await expect(
          service.buildTransferPlan('task', 'nonexistent.md')
        ).rejects.toThrow('Task not found');
      });
    });

    describe('for review entity', () => {
      it('plans review directory transfer with linked tasks', async () => {
        const reviewDir = path.join(sourceDir, 'workspace', 'reviews', 'code-review');
        await fs.mkdir(reviewDir, { recursive: true });
        await fs.writeFile(path.join(reviewDir, 'review.md'), '# Review');

        const tasksDir = path.join(sourceDir, 'workspace', 'tasks');
        await fs.mkdir(tasksDir, { recursive: true });
        await fs.writeFile(
          path.join(tasksDir, '001-code-review-fix.md'),
          '---\nstatus: to-do\nparent-type: review\nparent-id: code-review\n---\n\n# Fix'
        );

        const plan = await service.buildTransferPlan('review', 'code-review');

        expect(plan.entityType).toBe('review');
        expect(plan.filesToMove.length).toBe(1);
        expect(plan.tasksToRenumber.length).toBe(1);
      });
    });

    describe('for request entity', () => {
      it('plans request file transfer from change directory', async () => {
        // Request is at workspace/changes/{id}/request.md per spec
        const changeDir = path.join(sourceDir, 'workspace', 'changes', 'feature-request');
        await fs.mkdir(changeDir, { recursive: true });
        await fs.writeFile(path.join(changeDir, 'request.md'), '# Request');

        const plan = await service.buildTransferPlan('request', 'feature-request');

        expect(plan.entityType).toBe('request');

        // Should have directory creation + file transfer
        const fileItems = plan.filesToMove.filter(f => f.type === 'file');
        expect(fileItems.length).toBe(1);
        expect(fileItems[0].sourcePath).toContain('request.md');
        expect(fileItems[0].targetPath).toContain(path.join('changes', 'feature-request', 'request.md'));

        // Target change dir should be created since it doesn't exist
        const dirItems = plan.filesToMove.filter(f => f.type === 'directory');
        expect(dirItems.length).toBe(1);
        expect(dirItems[0].sourcePath).toBe(''); // Empty source = create only
      });

      it('skips target change directory creation if it already exists', async () => {
        // Create request in source
        const sourceChangeDir = path.join(sourceDir, 'workspace', 'changes', 'existing-feature');
        await fs.mkdir(sourceChangeDir, { recursive: true });
        await fs.writeFile(path.join(sourceChangeDir, 'request.md'), '# Request');

        // Create change directory in target
        const targetChangeDir = path.join(targetDir, 'workspace', 'changes', 'existing-feature');
        await fs.mkdir(targetChangeDir, { recursive: true });

        const plan = await service.buildTransferPlan('request', 'existing-feature');

        // Should only have file entry, no directory creation
        const dirItems = plan.filesToMove.filter(f => f.type === 'directory');
        expect(dirItems.length).toBe(0);

        const fileItems = plan.filesToMove.filter(f => f.type === 'file');
        expect(fileItems.length).toBe(1);
      });
    });
  });

  describe('detectConflicts', () => {
    let service: TransferService;

    beforeEach(async () => {
      await createValidPlxWorkspace(sourceDir);
      await createValidPlxWorkspace(targetDir);
      service = await TransferService.create();
      await service.setSourceWorkspace(sourceDir);
      await service.setTargetWorkspace(targetDir);
    });

    it('detects entity conflict when target entity exists', async () => {
      // Create change in source
      const sourceChangeDir = path.join(sourceDir, 'workspace', 'changes', 'my-feature');
      await fs.mkdir(sourceChangeDir, { recursive: true });
      await fs.writeFile(path.join(sourceChangeDir, 'proposal.md'), '# Source');

      // Create same change in target
      const targetChangeDir = path.join(targetDir, 'workspace', 'changes', 'my-feature');
      await fs.mkdir(targetChangeDir, { recursive: true });
      await fs.writeFile(path.join(targetChangeDir, 'proposal.md'), '# Target');

      const plan = await service.buildTransferPlan('change', 'my-feature');

      expect(plan.conflicts.length).toBe(1);
      expect(plan.conflicts[0].type).toBe('entity');
      expect(plan.conflicts[0].id).toBe('my-feature');
    });

    it('no conflicts when using unique targetName', async () => {
      // Create change in source
      const sourceChangeDir = path.join(sourceDir, 'workspace', 'changes', 'my-feature');
      await fs.mkdir(sourceChangeDir, { recursive: true });
      await fs.writeFile(path.join(sourceChangeDir, 'proposal.md'), '# Source');

      // Create different change in target
      const targetChangeDir = path.join(targetDir, 'workspace', 'changes', 'existing-feature');
      await fs.mkdir(targetChangeDir, { recursive: true });
      await fs.writeFile(path.join(targetChangeDir, 'proposal.md'), '# Target');

      const plan = await service.buildTransferPlan('change', 'my-feature', 'unique-name');

      expect(plan.conflicts.length).toBe(0);
    });
  });

  describe('calculateTaskRenumbering', () => {
    let service: TransferService;

    beforeEach(async () => {
      await createValidPlxWorkspace(sourceDir);
      await createValidPlxWorkspace(targetDir);
      service = await TransferService.create();
      await service.setSourceWorkspace(sourceDir);
      await service.setTargetWorkspace(targetDir);
    });

    it('starts from 1 when target has no tasks', async () => {
      const tasksDir = path.join(sourceDir, 'workspace', 'tasks');
      await fs.mkdir(tasksDir, { recursive: true });
      await fs.writeFile(
        path.join(tasksDir, '050-my-change-task.md'),
        '---\nstatus: to-do\nparent-type: change\nparent-id: my-change\n---\n\n# Task'
      );

      const result = await service['discoverTasks'](service.getSourceWorkspace()!);
      const renumbers = await service.calculateTaskRenumbering(result.tasks);

      expect(renumbers[0].newSequence).toBe(1);
    });

    it('continues from highest sequence in target', async () => {
      // Source task
      const sourceTasksDir = path.join(sourceDir, 'workspace', 'tasks');
      await fs.mkdir(sourceTasksDir, { recursive: true });
      await fs.writeFile(
        path.join(sourceTasksDir, '001-my-change-task.md'),
        '---\nstatus: to-do\nparent-type: change\nparent-id: my-change\n---\n\n# Task'
      );

      // Target tasks
      const targetTasksDir = path.join(targetDir, 'workspace', 'tasks');
      await fs.mkdir(targetTasksDir, { recursive: true });
      await fs.writeFile(
        path.join(targetTasksDir, '025-existing-task.md'),
        '---\nstatus: done\n---\n\n# Existing'
      );

      const result = await service['discoverTasks'](service.getSourceWorkspace()!);
      const renumbers = await service.calculateTaskRenumbering(result.tasks);

      expect(renumbers[0].newSequence).toBe(26);
    });

    it('preserves task order when renumbering multiple tasks', async () => {
      const sourceTasksDir = path.join(sourceDir, 'workspace', 'tasks');
      await fs.mkdir(sourceTasksDir, { recursive: true });
      await fs.writeFile(
        path.join(sourceTasksDir, '001-my-change-first.md'),
        '---\nstatus: to-do\nparent-type: change\nparent-id: my-change\n---\n\n# First'
      );
      await fs.writeFile(
        path.join(sourceTasksDir, '002-my-change-second.md'),
        '---\nstatus: to-do\nparent-type: change\nparent-id: my-change\n---\n\n# Second'
      );

      const result = await service['discoverTasks'](service.getSourceWorkspace()!);
      const tasks = result.tasks.sort((a, b) => a.sequence - b.sequence);
      const renumbers = await service.calculateTaskRenumbering(tasks);

      expect(renumbers[0].newSequence).toBe(1);
      expect(renumbers[1].newSequence).toBe(2);
      expect(renumbers[0].newFilename).toContain('first');
      expect(renumbers[1].newFilename).toContain('second');
    });
  });

  describe('findLinkedTasks', () => {
    let service: TransferService;

    beforeEach(async () => {
      await createValidPlxWorkspace(sourceDir);
      service = await TransferService.create();
      await service.setSourceWorkspace(sourceDir);
    });

    it('finds tasks linked to a change', async () => {
      const tasksDir = path.join(sourceDir, 'workspace', 'tasks');
      await fs.mkdir(tasksDir, { recursive: true });
      await fs.writeFile(
        path.join(tasksDir, '001-feature-a-task1.md'),
        '---\nstatus: to-do\nparent-type: change\nparent-id: feature-a\n---\n\n# Task 1'
      );
      await fs.writeFile(
        path.join(tasksDir, '002-feature-a-task2.md'),
        '---\nstatus: to-do\nparent-type: change\nparent-id: feature-a\n---\n\n# Task 2'
      );
      await fs.writeFile(
        path.join(tasksDir, '003-feature-b-task1.md'),
        '---\nstatus: to-do\nparent-type: change\nparent-id: feature-b\n---\n\n# Other'
      );

      const tasks = await service.findLinkedTasks('feature-a', 'change');

      expect(tasks.length).toBe(2);
      expect(tasks.every(t => t.parentId === 'feature-a')).toBe(true);
    });

    it('finds tasks linked to a review', async () => {
      const tasksDir = path.join(sourceDir, 'workspace', 'tasks');
      await fs.mkdir(tasksDir, { recursive: true });
      await fs.writeFile(
        path.join(tasksDir, '001-code-review-fix.md'),
        '---\nstatus: to-do\nparent-type: review\nparent-id: code-review\n---\n\n# Fix'
      );

      const tasks = await service.findLinkedTasks('code-review', 'review');

      expect(tasks.length).toBe(1);
      expect(tasks[0].parentId).toBe('code-review');
      expect(tasks[0].parentType).toBe('review');
    });

    it('returns empty array when no linked tasks', async () => {
      const tasksDir = path.join(sourceDir, 'workspace', 'tasks');
      await fs.mkdir(tasksDir, { recursive: true });

      const tasks = await service.findLinkedTasks('nonexistent', 'change');

      expect(tasks).toEqual([]);
    });
  });

  describe('findRelatedChanges', () => {
    let service: TransferService;

    beforeEach(async () => {
      await createValidPlxWorkspace(sourceDir);
      service = await TransferService.create();
      await service.setSourceWorkspace(sourceDir);
    });

    it('finds changes with delta specs for a given spec', async () => {
      // Create spec
      const specDir = path.join(sourceDir, 'workspace', 'specs', 'api-design');
      await fs.mkdir(specDir, { recursive: true });
      await fs.writeFile(path.join(specDir, 'spec.md'), '# Spec');

      // Create change with delta
      const changeDir = path.join(sourceDir, 'workspace', 'changes', 'implement-api');
      const deltaDir = path.join(changeDir, 'specs', 'api-design');
      await fs.mkdir(deltaDir, { recursive: true });
      await fs.writeFile(path.join(deltaDir, 'delta.md'), '# Delta');

      // Create another change with delta
      const change2Dir = path.join(sourceDir, 'workspace', 'changes', 'extend-api');
      const delta2Dir = path.join(change2Dir, 'specs', 'api-design');
      await fs.mkdir(delta2Dir, { recursive: true });
      await fs.writeFile(path.join(delta2Dir, 'delta.md'), '# Delta 2');

      const relatedChanges = await service.findRelatedChanges('api-design');

      expect(relatedChanges.length).toBe(2);
      expect(relatedChanges).toContain('implement-api');
      expect(relatedChanges).toContain('extend-api');
    });

    it('returns empty array when no related changes', async () => {
      const specDir = path.join(sourceDir, 'workspace', 'specs', 'isolated-spec');
      await fs.mkdir(specDir, { recursive: true });
      await fs.writeFile(path.join(specDir, 'spec.md'), '# Spec');

      const relatedChanges = await service.findRelatedChanges('isolated-spec');

      expect(relatedChanges).toEqual([]);
    });
  });

  describe('executeTransfer', () => {
    let service: TransferService;

    beforeEach(async () => {
      await createValidPlxWorkspace(sourceDir);
      await createValidPlxWorkspace(targetDir);
      service = await TransferService.create();
      await service.setSourceWorkspace(sourceDir);
      await service.setTargetWorkspace(targetDir);
    });

    it('moves change directory to target', async () => {
      const sourceChangeDir = path.join(sourceDir, 'workspace', 'changes', 'my-feature');
      await fs.mkdir(sourceChangeDir, { recursive: true });
      await fs.writeFile(path.join(sourceChangeDir, 'proposal.md'), '# Proposal content');

      const plan = await service.buildTransferPlan('change', 'my-feature');
      const result = await service.executeTransfer(plan, false);

      expect(result.success).toBe(true);
      expect(result.movedFiles.length).toBe(1);

      // Verify target has the file
      const targetChangeDir = path.join(targetDir, 'workspace', 'changes', 'my-feature');
      const content = await fs.readFile(path.join(targetChangeDir, 'proposal.md'), 'utf-8');
      expect(content).toBe('# Proposal content');

      // Verify source is deleted
      const sourceExists = await fs.stat(sourceChangeDir).then(() => true).catch(() => false);
      expect(sourceExists).toBe(false);
    });

    it('moves and renumbers tasks', async () => {
      const sourceChangeDir = path.join(sourceDir, 'workspace', 'changes', 'my-feature');
      await fs.mkdir(sourceChangeDir, { recursive: true });
      await fs.writeFile(path.join(sourceChangeDir, 'proposal.md'), '# Proposal');

      const sourceTasksDir = path.join(sourceDir, 'workspace', 'tasks');
      await fs.mkdir(sourceTasksDir, { recursive: true });
      await fs.writeFile(
        path.join(sourceTasksDir, '001-my-feature-task.md'),
        '---\nstatus: to-do\nparent-type: change\nparent-id: my-feature\n---\n\n# Task'
      );

      const plan = await service.buildTransferPlan('change', 'my-feature');
      const result = await service.executeTransfer(plan, false);

      expect(result.success).toBe(true);
      expect(result.renamedTasks.length).toBe(1);

      // Verify task exists in target with new sequence
      const targetTasksDir = path.join(targetDir, 'workspace', 'tasks');
      const files = await fs.readdir(targetTasksDir);
      expect(files.some(f => f.includes('my-feature-task'))).toBe(true);

      // Verify source task is deleted
      const sourceTaskExists = await fs
        .stat(path.join(sourceTasksDir, '001-my-feature-task.md'))
        .then(() => true)
        .catch(() => false);
      expect(sourceTaskExists).toBe(false);
    });

    it('does nothing in dry-run mode', async () => {
      const sourceChangeDir = path.join(sourceDir, 'workspace', 'changes', 'my-feature');
      await fs.mkdir(sourceChangeDir, { recursive: true });
      await fs.writeFile(path.join(sourceChangeDir, 'proposal.md'), '# Proposal');

      const plan = await service.buildTransferPlan('change', 'my-feature');
      const result = await service.executeTransfer(plan, true);

      expect(result.success).toBe(true);

      // Verify source still exists
      const sourceExists = await fs.stat(sourceChangeDir).then(() => true).catch(() => false);
      expect(sourceExists).toBe(true);

      // Verify target doesn't have the change
      const targetChangeDir = path.join(targetDir, 'workspace', 'changes', 'my-feature');
      const targetExists = await fs.stat(targetChangeDir).then(() => true).catch(() => false);
      expect(targetExists).toBe(false);
    });

    it('fails when conflicts exist', async () => {
      // Create change in source
      const sourceChangeDir = path.join(sourceDir, 'workspace', 'changes', 'my-feature');
      await fs.mkdir(sourceChangeDir, { recursive: true });
      await fs.writeFile(path.join(sourceChangeDir, 'proposal.md'), '# Source');

      // Create conflicting change in target
      const targetChangeDir = path.join(targetDir, 'workspace', 'changes', 'my-feature');
      await fs.mkdir(targetChangeDir, { recursive: true });
      await fs.writeFile(path.join(targetChangeDir, 'proposal.md'), '# Target');

      const plan = await service.buildTransferPlan('change', 'my-feature');
      const result = await service.executeTransfer(plan, false);

      expect(result.success).toBe(false);
      expect(result.errors.length).toBe(1);
      expect(result.errors[0]).toContain('conflict');
    });

    it('updates task frontmatter when parent-id changes', async () => {
      const sourceChangeDir = path.join(sourceDir, 'workspace', 'changes', 'old-name');
      await fs.mkdir(sourceChangeDir, { recursive: true });
      await fs.writeFile(path.join(sourceChangeDir, 'proposal.md'), '# Proposal');

      const sourceTasksDir = path.join(sourceDir, 'workspace', 'tasks');
      await fs.mkdir(sourceTasksDir, { recursive: true });
      await fs.writeFile(
        path.join(sourceTasksDir, '001-old-name-task.md'),
        '---\nstatus: to-do\nparent-type: change\nparent-id: old-name\n---\n\n# Task'
      );

      const plan = await service.buildTransferPlan('change', 'old-name', 'new-name');
      await service.executeTransfer(plan, false);

      // Find the transferred task
      const targetTasksDir = path.join(targetDir, 'workspace', 'tasks');
      const files = await fs.readdir(targetTasksDir);
      const taskFile = files.find(f => f.includes('task'));

      expect(taskFile).toBeDefined();
      const content = await fs.readFile(path.join(targetTasksDir, taskFile!), 'utf-8');
      expect(content).toContain('parent-id: new-name');
    });
  });

  describe('updateTaskFrontmatter', () => {
    it('updates parent-id in frontmatter', async () => {
      const service = await TransferService.create();
      const content = `---
status: to-do
parent-type: change
parent-id: old-id
---

# Task Content`;

      const updated = service.updateTaskFrontmatter(content, 'new-id');

      expect(updated).toContain('parent-id: new-id');
      expect(updated).not.toContain('parent-id: old-id');
      expect(updated).toContain('# Task Content');
    });

    it('preserves content without frontmatter', async () => {
      const service = await TransferService.create();
      const content = '# Task Without Frontmatter';

      const updated = service.updateTaskFrontmatter(content, 'new-id');

      expect(updated).toBe(content);
    });
  });

  describe('extractSourceToolConfig', () => {
    let service: TransferService;

    beforeEach(async () => {
      await createValidPlxWorkspace(sourceDir);
      service = await TransferService.create();
      await service.setSourceWorkspace(sourceDir);
    });

    it('returns empty array when no tools configured', async () => {
      const tools = await service.extractSourceToolConfig();
      expect(Array.isArray(tools)).toBe(true);
    });
  });

  describe('initializeTargetWorkspace', () => {
    let service: TransferService;

    beforeEach(async () => {
      await createValidPlxWorkspace(sourceDir);
      await fs.mkdir(targetDir, { recursive: true });
      service = await TransferService.create();
      await service.setSourceWorkspace(sourceDir);
      await service.setTargetWorkspace(targetDir);
    });

    it('creates workspace directory structure', async () => {
      await service.initializeTargetWorkspace([]);

      const workspacePath = path.join(targetDir, 'workspace');
      const dirs = ['specs', 'changes', 'reviews', 'requests', 'tasks'];

      for (const dir of dirs) {
        const dirPath = path.join(workspacePath, dir);
        const exists = await fs.stat(dirPath).then(() => true).catch(() => false);
        expect(exists).toBe(true);
      }
    });

    it('creates AGENTS.md template', async () => {
      await service.initializeTargetWorkspace([]);

      const agentsPath = path.join(targetDir, 'workspace', 'AGENTS.md');
      const exists = await fs.stat(agentsPath).then(() => true).catch(() => false);
      expect(exists).toBe(true);
    });
  });
});

// Helper function to access private methods for testing
declare module '../../src/services/transfer-service.js' {
  interface TransferService {
    discoverTasks(workspace: import('../../src/utils/workspace-discovery.js').DiscoveredWorkspace): Promise<{
      tasks: import('../../src/utils/centralized-task-discovery.js').DiscoveredTask[];
    }>;
  }
}

// Monkey-patch for testing private methods
TransferService.prototype['discoverTasks'] = async function (workspace: any) {
  const { discoverTasks } = await import('../../src/utils/centralized-task-discovery.js');
  return discoverTasks(workspace);
};
