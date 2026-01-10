import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { createValidPlxWorkspace } from '../test-utils.js';

describe('transfer command', () => {
  const projectRoot = process.cwd();
  const testDir = path.join(projectRoot, 'test-transfer-cmd-tmp');
  const sourceDir = path.join(testDir, 'source-project');
  const targetDir = path.join(testDir, 'target-project');
  const plxBin = path.join(projectRoot, 'bin', 'plx.js');

  beforeEach(async () => {
    await fs.mkdir(testDir, { recursive: true });
    await createValidPlxWorkspace(sourceDir);
    await createValidPlxWorkspace(targetDir);
  });

  afterEach(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
  });

  describe('transfer change', () => {
    it('transfers a change with --json output', async () => {
      const changeDir = path.join(sourceDir, 'workspace', 'changes', 'my-feature');
      await fs.mkdir(changeDir, { recursive: true });
      await fs.writeFile(path.join(changeDir, 'proposal.md'), '# Proposal');

      const originalCwd = process.cwd();
      try {
        process.chdir(sourceDir);
        const output = execSync(
          `node ${plxBin} transfer change --id my-feature --target "${targetDir}" --yes --json`,
          { encoding: 'utf-8' }
        );
        const result = JSON.parse(output);

        expect(result.entityType).toBe('change');
        expect(result.entityId).toBe('my-feature');
        expect(result.result.success).toBe(true);
      } finally {
        process.chdir(originalCwd);
      }
    });

    it('transfers a change with linked tasks', async () => {
      const changeDir = path.join(sourceDir, 'workspace', 'changes', 'my-feature');
      await fs.mkdir(changeDir, { recursive: true });
      await fs.writeFile(path.join(changeDir, 'proposal.md'), '# Proposal');

      const tasksDir = path.join(sourceDir, 'workspace', 'tasks');
      await fs.mkdir(tasksDir, { recursive: true });
      await fs.writeFile(
        path.join(tasksDir, '001-my-feature-implement.md'),
        '---\nstatus: to-do\nparent-type: change\nparent-id: my-feature\n---\n\n# Task'
      );

      const originalCwd = process.cwd();
      try {
        process.chdir(sourceDir);
        const output = execSync(
          `node ${plxBin} transfer change --id my-feature --target "${targetDir}" --yes --json`,
          { encoding: 'utf-8' }
        );
        const result = JSON.parse(output);

        expect(result.result.success).toBe(true);
        expect(result.result.renamedTasks.length).toBe(1);

        // Verify task exists in target
        const targetTasksDir = path.join(targetDir, 'workspace', 'tasks');
        const files = await fs.readdir(targetTasksDir);
        expect(files.some(f => f.includes('my-feature'))).toBe(true);
      } finally {
        process.chdir(originalCwd);
      }
    });

    it('supports --target-name for renaming', async () => {
      const changeDir = path.join(sourceDir, 'workspace', 'changes', 'old-name');
      await fs.mkdir(changeDir, { recursive: true });
      await fs.writeFile(path.join(changeDir, 'proposal.md'), '# Proposal');

      const originalCwd = process.cwd();
      try {
        process.chdir(sourceDir);
        const output = execSync(
          `node ${plxBin} transfer change --id old-name --target "${targetDir}" --target-name new-name --yes --json`,
          { encoding: 'utf-8' }
        );
        const result = JSON.parse(output);

        expect(result.targetName).toBe('new-name');
        expect(result.result.success).toBe(true);

        // Verify change exists with new name in target
        const targetChangeDir = path.join(targetDir, 'workspace', 'changes', 'new-name');
        const exists = await fs.stat(targetChangeDir).then(() => true).catch(() => false);
        expect(exists).toBe(true);
      } finally {
        process.chdir(originalCwd);
      }
    });

    it('shows conflicts when entity exists in target', async () => {
      // Create change in source
      const sourceChangeDir = path.join(sourceDir, 'workspace', 'changes', 'my-feature');
      await fs.mkdir(sourceChangeDir, { recursive: true });
      await fs.writeFile(path.join(sourceChangeDir, 'proposal.md'), '# Source');

      // Create same change in target
      const targetChangeDir = path.join(targetDir, 'workspace', 'changes', 'my-feature');
      await fs.mkdir(targetChangeDir, { recursive: true });
      await fs.writeFile(path.join(targetChangeDir, 'proposal.md'), '# Target');

      const originalCwd = process.cwd();
      try {
        process.chdir(sourceDir);
        const output = execSync(
          `node ${plxBin} transfer change --id my-feature --target "${targetDir}" --json`,
          { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }
        );
        const result = JSON.parse(output);

        expect(result.conflicts.length).toBe(1);
        expect(result.conflicts[0].type).toBe('entity');
        expect(result.conflicts[0].id).toBe('my-feature');
      } catch (error: any) {
        // Command exits with code 1 on conflict
        const output = error.stdout?.toString() || '';
        const result = JSON.parse(output);
        expect(result.conflicts.length).toBe(1);
      } finally {
        process.chdir(originalCwd);
      }
    });
  });

  describe('transfer spec', () => {
    it('transfers a spec directory', async () => {
      const specDir = path.join(sourceDir, 'workspace', 'specs', 'api-design');
      await fs.mkdir(specDir, { recursive: true });
      await fs.writeFile(path.join(specDir, 'spec.md'), '# Spec');

      const originalCwd = process.cwd();
      try {
        process.chdir(sourceDir);
        const output = execSync(
          `node ${plxBin} transfer spec --id api-design --target "${targetDir}" --yes --json`,
          { encoding: 'utf-8' }
        );
        const result = JSON.parse(output);

        expect(result.entityType).toBe('spec');
        expect(result.result.success).toBe(true);

        // Verify spec exists in target
        const targetSpecDir = path.join(targetDir, 'workspace', 'specs', 'api-design');
        const exists = await fs.stat(targetSpecDir).then(() => true).catch(() => false);
        expect(exists).toBe(true);
      } finally {
        process.chdir(originalCwd);
      }
    });
  });

  describe('transfer task', () => {
    it('transfers a single task with renumbering', async () => {
      // Source task
      const sourceTasksDir = path.join(sourceDir, 'workspace', 'tasks');
      await fs.mkdir(sourceTasksDir, { recursive: true });
      await fs.writeFile(
        path.join(sourceTasksDir, '005-standalone-task.md'),
        '---\nstatus: to-do\n---\n\n# Task'
      );

      // Existing task in target
      const targetTasksDir = path.join(targetDir, 'workspace', 'tasks');
      await fs.mkdir(targetTasksDir, { recursive: true });
      await fs.writeFile(
        path.join(targetTasksDir, '010-existing.md'),
        '---\nstatus: done\n---\n\n# Existing'
      );

      const originalCwd = process.cwd();
      try {
        process.chdir(sourceDir);
        const output = execSync(
          `node ${plxBin} transfer task --id 005-standalone-task.md --target "${targetDir}" --yes --json`,
          { encoding: 'utf-8' }
        );
        const result = JSON.parse(output);

        expect(result.entityType).toBe('task');
        expect(result.result.success).toBe(true);
        expect(result.tasksToRenumber.length).toBe(1);
        expect(result.tasksToRenumber[0].newSequence).toBe(11);
      } finally {
        process.chdir(originalCwd);
      }
    });
  });

  describe('transfer review', () => {
    it('transfers a review with linked tasks', async () => {
      const reviewDir = path.join(sourceDir, 'workspace', 'reviews', 'code-review');
      await fs.mkdir(reviewDir, { recursive: true });
      await fs.writeFile(path.join(reviewDir, 'review.md'), '# Review');

      const tasksDir = path.join(sourceDir, 'workspace', 'tasks');
      await fs.mkdir(tasksDir, { recursive: true });
      await fs.writeFile(
        path.join(tasksDir, '001-code-review-fix.md'),
        '---\nstatus: to-do\nparent-type: review\nparent-id: code-review\n---\n\n# Fix'
      );

      const originalCwd = process.cwd();
      try {
        process.chdir(sourceDir);
        const output = execSync(
          `node ${plxBin} transfer review --id code-review --target "${targetDir}" --yes --json`,
          { encoding: 'utf-8' }
        );
        const result = JSON.parse(output);

        expect(result.entityType).toBe('review');
        expect(result.result.success).toBe(true);
        expect(result.result.renamedTasks.length).toBe(1);
      } finally {
        process.chdir(originalCwd);
      }
    });
  });

  describe('transfer request', () => {
    it('transfers a request file from change directory', async () => {
      // Request is at workspace/changes/{id}/request.md per spec
      const changeDir = path.join(sourceDir, 'workspace', 'changes', 'feature-request');
      await fs.mkdir(changeDir, { recursive: true });
      await fs.writeFile(path.join(changeDir, 'request.md'), '# Request');

      const originalCwd = process.cwd();
      try {
        process.chdir(sourceDir);
        const output = execSync(
          `node ${plxBin} transfer request --id feature-request --target "${targetDir}" --yes --json`,
          { encoding: 'utf-8' }
        );
        const result = JSON.parse(output);

        expect(result.entityType).toBe('request');
        expect(result.result.success).toBe(true);

        // Verify request exists in target change directory
        const targetRequestPath = path.join(targetDir, 'workspace', 'changes', 'feature-request', 'request.md');
        const exists = await fs.stat(targetRequestPath).then(() => true).catch(() => false);
        expect(exists).toBe(true);
      } finally {
        process.chdir(originalCwd);
      }
    });
  });

  describe('--dry-run flag', () => {
    it('shows plan without making changes', async () => {
      const changeDir = path.join(sourceDir, 'workspace', 'changes', 'my-feature');
      await fs.mkdir(changeDir, { recursive: true });
      await fs.writeFile(path.join(changeDir, 'proposal.md'), '# Proposal');

      const originalCwd = process.cwd();
      try {
        process.chdir(sourceDir);
        const output = execSync(
          `node ${plxBin} transfer change --id my-feature --target "${targetDir}" --dry-run --json`,
          { encoding: 'utf-8' }
        );
        const result = JSON.parse(output);

        expect(result.dryRun).toBe(true);
        expect(result.filesToMove.length).toBe(1);
        expect(result.result).toBeUndefined();

        // Verify source still exists
        const sourceExists = await fs.stat(changeDir).then(() => true).catch(() => false);
        expect(sourceExists).toBe(true);

        // Verify target doesn't have the change
        const targetChangeDir = path.join(targetDir, 'workspace', 'changes', 'my-feature');
        const targetExists = await fs.stat(targetChangeDir).then(() => true).catch(() => false);
        expect(targetExists).toBe(false);
      } finally {
        process.chdir(originalCwd);
      }
    });
  });

  describe('error handling', () => {
    it('fails when target not specified in non-interactive mode', async () => {
      const changeDir = path.join(sourceDir, 'workspace', 'changes', 'my-feature');
      await fs.mkdir(changeDir, { recursive: true });
      await fs.writeFile(path.join(changeDir, 'proposal.md'), '# Proposal');

      const originalCwd = process.cwd();
      try {
        process.chdir(sourceDir);
        execSync(
          `node ${plxBin} transfer change --id my-feature --no-interactive --json`,
          { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }
        );
        // Should not reach here
        expect.fail('Expected command to fail');
      } catch (error: any) {
        const output = error.stdout?.toString() || '';
        const result = JSON.parse(output);
        expect(result.error).toContain('Target workspace path is required');
      } finally {
        process.chdir(originalCwd);
      }
    });

    it('fails when entity does not exist', async () => {
      const originalCwd = process.cwd();
      try {
        process.chdir(sourceDir);
        // The command may succeed (exit 0) but report failure in the result
        // or may exit with code 1 - handle both cases
        let output: string;
        try {
          output = execSync(
            `node ${plxBin} transfer change --id nonexistent --target "${targetDir}" --yes --json`,
            { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }
          );
        } catch (error: any) {
          output = error.stdout?.toString() || '';
        }
        const result = JSON.parse(output);
        // Either error property or result.success === false with errors
        expect(
          result.error || (result.result?.success === false && result.result?.errors?.length > 0)
        ).toBeTruthy();
      } finally {
        process.chdir(originalCwd);
      }
    });
  });

  describe('workspace auto-initialization', () => {
    it('initializes target workspace when it does not exist', async () => {
      const changeDir = path.join(sourceDir, 'workspace', 'changes', 'my-feature');
      await fs.mkdir(changeDir, { recursive: true });
      await fs.writeFile(path.join(changeDir, 'proposal.md'), '# Proposal');

      // Create an empty target directory (no workspace)
      const emptyTargetDir = path.join(testDir, 'empty-target');
      await fs.mkdir(emptyTargetDir, { recursive: true });

      const originalCwd = process.cwd();
      try {
        process.chdir(sourceDir);
        const output = execSync(
          `node ${plxBin} transfer change --id my-feature --target "${emptyTargetDir}" --yes --json`,
          { encoding: 'utf-8' }
        );
        const result = JSON.parse(output);

        expect(result.requiresInit).toBe(true);
        expect(result.result.success).toBe(true);

        // Verify workspace was created
        const workspaceDir = path.join(emptyTargetDir, 'workspace');
        const exists = await fs.stat(workspaceDir).then(() => true).catch(() => false);
        expect(exists).toBe(true);

        // Verify AGENTS.md was created
        const agentsPath = path.join(workspaceDir, 'AGENTS.md');
        const agentsExists = await fs.stat(agentsPath).then(() => true).catch(() => false);
        expect(agentsExists).toBe(true);
      } finally {
        process.chdir(originalCwd);
      }
    });
  });

  describe('multi-workspace scenarios', () => {
    it('transfers between workspaces in a monorepo', async () => {
      // Create monorepo structure
      const monorepoDir = path.join(testDir, 'monorepo');
      const packageADir = path.join(monorepoDir, 'packages', 'package-a');
      const packageBDir = path.join(monorepoDir, 'packages', 'package-b');

      await createValidPlxWorkspace(packageADir);
      await createValidPlxWorkspace(packageBDir);

      // Create change in package A
      const changeDir = path.join(packageADir, 'workspace', 'changes', 'shared-feature');
      await fs.mkdir(changeDir, { recursive: true });
      await fs.writeFile(path.join(changeDir, 'proposal.md'), '# Shared Feature');

      const originalCwd = process.cwd();
      try {
        process.chdir(packageADir);
        const output = execSync(
          `node ${plxBin} transfer change --id shared-feature --target "${packageBDir}" --yes --json`,
          { encoding: 'utf-8' }
        );
        const result = JSON.parse(output);

        expect(result.result.success).toBe(true);

        // Verify change is in package B
        const targetChangeDir = path.join(packageBDir, 'workspace', 'changes', 'shared-feature');
        const exists = await fs.stat(targetChangeDir).then(() => true).catch(() => false);
        expect(exists).toBe(true);

        // Verify change is removed from package A
        const sourceExists = await fs.stat(changeDir).then(() => true).catch(() => false);
        expect(sourceExists).toBe(false);
      } finally {
        process.chdir(originalCwd);
      }
    });
  });
});
