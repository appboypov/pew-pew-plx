import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { createValidPlxWorkspace } from '../test-utils.js';

describe('create command', () => {
  const projectRoot = process.cwd();
  const testDir = path.join(projectRoot, 'test-create-cmd-tmp');
  const plxBin = path.join(projectRoot, 'bin', 'plx.js');

  beforeEach(async () => {
    await createValidPlxWorkspace(testDir);
  });

  afterEach(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
  });

  describe('create change', () => {
    it('creates change directory with proposal and subdirectories', async () => {
      const originalCwd = process.cwd();
      try {
        process.chdir(testDir);
        const output = execSync(
          `node ${plxBin} create change "My New Feature" --json`,
          { encoding: 'utf-8' }
        );
        const json = JSON.parse(output);

        expect(json.success).toBe(true);
        expect(json.type).toBe('change');

        // Verify files were created
        const proposalPath = path.join(testDir, 'workspace', 'changes', 'my-new-feature', 'proposal.md');
        const tasksDir = path.join(testDir, 'workspace', 'changes', 'my-new-feature', 'tasks');
        const specsDir = path.join(testDir, 'workspace', 'changes', 'my-new-feature', 'specs');

        expect(await fs.stat(proposalPath).then(() => true).catch(() => false)).toBe(true);
        expect(await fs.stat(tasksDir).then(s => s.isDirectory()).catch(() => false)).toBe(true);
        expect(await fs.stat(specsDir).then(s => s.isDirectory()).catch(() => false)).toBe(true);

        const proposalContent = await fs.readFile(proposalPath, 'utf-8');
        expect(proposalContent).toContain('# Change: My New Feature');
      } finally {
        process.chdir(originalCwd);
      }
    });

    it('returns error when change already exists', async () => {
      const changeDir = path.join(testDir, 'workspace', 'changes', 'existing-change');
      await fs.mkdir(changeDir, { recursive: true });

      const originalCwd = process.cwd();
      try {
        process.chdir(testDir);
        try {
          execSync(
            `node ${plxBin} create change "existing change" --json`,
            { encoding: 'utf-8' }
          );
        } catch (error: any) {
          const json = JSON.parse(error.stdout);
          expect(json.error).toContain('already exists');
        }
      } finally {
        process.chdir(originalCwd);
      }
    });

    it('converts name to kebab-case', async () => {
      const originalCwd = process.cwd();
      try {
        process.chdir(testDir);
        execSync(
          `node ${plxBin} create change "Add User Authentication System" --json`,
          { encoding: 'utf-8' }
        );

        const changeDir = path.join(testDir, 'workspace', 'changes', 'add-user-authentication-system');
        expect(await fs.stat(changeDir).then(s => s.isDirectory()).catch(() => false)).toBe(true);
      } finally {
        process.chdir(originalCwd);
      }
    });
  });

  describe('create spec', () => {
    it('creates spec directory with spec.md', async () => {
      const originalCwd = process.cwd();
      try {
        process.chdir(testDir);
        const output = execSync(
          `node ${plxBin} create spec "user-authentication" --json`,
          { encoding: 'utf-8' }
        );
        const json = JSON.parse(output);

        expect(json.success).toBe(true);
        expect(json.type).toBe('spec');

        const specPath = path.join(testDir, 'workspace', 'specs', 'user-authentication', 'spec.md');
        expect(await fs.stat(specPath).then(() => true).catch(() => false)).toBe(true);

        const specContent = await fs.readFile(specPath, 'utf-8');
        expect(specContent).toContain('# user-authentication Specification');
      } finally {
        process.chdir(originalCwd);
      }
    });

    it('returns error when spec already exists', async () => {
      const specDir = path.join(testDir, 'workspace', 'specs', 'existing-spec');
      await fs.mkdir(specDir, { recursive: true });

      const originalCwd = process.cwd();
      try {
        process.chdir(testDir);
        try {
          execSync(
            `node ${plxBin} create spec "existing-spec" --json`,
            { encoding: 'utf-8' }
          );
        } catch (error: any) {
          const json = JSON.parse(error.stdout);
          expect(json.error).toContain('already exists');
        }
      } finally {
        process.chdir(originalCwd);
      }
    });

    it('converts name to kebab-case', async () => {
      const originalCwd = process.cwd();
      try {
        process.chdir(testDir);
        execSync(
          `node ${plxBin} create spec "Payment Processing Flow" --json`,
          { encoding: 'utf-8' }
        );

        const specDir = path.join(testDir, 'workspace', 'specs', 'payment-processing-flow');
        expect(await fs.stat(specDir).then(s => s.isDirectory()).catch(() => false)).toBe(true);
      } finally {
        process.chdir(originalCwd);
      }
    });
  });

  describe('create request', () => {
    it('creates change directory with request.md', async () => {
      const originalCwd = process.cwd();
      try {
        process.chdir(testDir);
        const output = execSync(
          `node ${plxBin} create request "Add dark mode support" --json`,
          { encoding: 'utf-8' }
        );
        const json = JSON.parse(output);

        expect(json.success).toBe(true);
        expect(json.type).toBe('request');

        const requestPath = path.join(testDir, 'workspace', 'changes', 'add-dark-mode-support', 'request.md');
        expect(await fs.stat(requestPath).then(() => true).catch(() => false)).toBe(true);

        const requestContent = await fs.readFile(requestPath, 'utf-8');
        expect(requestContent).toContain('# Request: Add dark mode support');
      } finally {
        process.chdir(originalCwd);
      }
    });

    it('returns error when request already exists', async () => {
      const changeDir = path.join(testDir, 'workspace', 'changes', 'existing-request');
      await fs.mkdir(changeDir, { recursive: true });

      const originalCwd = process.cwd();
      try {
        process.chdir(testDir);
        try {
          execSync(
            `node ${plxBin} create request "existing request" --json`,
            { encoding: 'utf-8' }
          );
        } catch (error: any) {
          const json = JSON.parse(error.stdout);
          expect(json.error).toContain('already exists');
        }
      } finally {
        process.chdir(originalCwd);
      }
    });

    it('converts description to kebab-case', async () => {
      const originalCwd = process.cwd();
      try {
        process.chdir(testDir);
        execSync(
          `node ${plxBin} create request "Implement OAuth 2.0 Login" --json`,
          { encoding: 'utf-8' }
        );

        const changeDir = path.join(testDir, 'workspace', 'changes', 'implement-oauth-2-0-login');
        expect(await fs.stat(changeDir).then(s => s.isDirectory()).catch(() => false)).toBe(true);
      } finally {
        process.chdir(originalCwd);
      }
    });
  });

  describe('create task', () => {
    it('creates task in centralized workspace/tasks', async () => {
      // First create a change
      const changeDir = path.join(testDir, 'workspace', 'changes', 'parent-change');
      await fs.mkdir(changeDir, { recursive: true });
      await fs.writeFile(
        path.join(changeDir, 'proposal.md'),
        '# Change: Parent\n\n## Why\nTest\n\n## What Changes\n- Test'
      );

      const originalCwd = process.cwd();
      try {
        process.chdir(testDir);
        const output = execSync(
          `node ${plxBin} create task "Implement feature" --parent-id parent-change --json`,
          { encoding: 'utf-8' }
        );
        const json = JSON.parse(output);

        expect(json.success).toBe(true);
        expect(json.type).toBe('task');
        expect(json.parentId).toBe('parent-change');
        expect(json.taskId).toBe('parent-change-implement-feature');

        // Tasks are stored in centralized workspace/tasks with parent ID in filename
        const taskPath = path.join(testDir, 'workspace', 'tasks', '001-parent-change-implement-feature.md');
        expect(await fs.stat(taskPath).then(() => true).catch(() => false)).toBe(true);

        const taskContent = await fs.readFile(taskPath, 'utf-8');
        expect(taskContent).toContain('status: to-do');
        expect(taskContent).toContain('parent-type: change');
        expect(taskContent).toContain('parent-id: parent-change');
        expect(taskContent).toContain('# Task: Implement feature');
      } finally {
        process.chdir(originalCwd);
      }
    });

    it('auto-increments task sequence number for same parent', async () => {
      const changeDir = path.join(testDir, 'workspace', 'changes', 'seq-test');
      const tasksDir = path.join(testDir, 'workspace', 'tasks');
      await fs.mkdir(changeDir, { recursive: true });
      await fs.mkdir(tasksDir, { recursive: true });
      await fs.writeFile(
        path.join(changeDir, 'proposal.md'),
        '# Change: Seq Test\n\n## Why\nTest\n\n## What Changes\n- Test'
      );
      // Existing tasks in centralized storage with parent prefix
      await fs.writeFile(
        path.join(tasksDir, '001-seq-test-first.md'),
        '---\nstatus: to-do\nparent-type: change\nparent-id: seq-test\n---\n\n# Task: First'
      );
      await fs.writeFile(
        path.join(tasksDir, '002-seq-test-second.md'),
        '---\nstatus: to-do\nparent-type: change\nparent-id: seq-test\n---\n\n# Task: Second'
      );

      const originalCwd = process.cwd();
      try {
        process.chdir(testDir);
        const output = execSync(
          `node ${plxBin} create task "Third task" --parent-id seq-test --json`,
          { encoding: 'utf-8' }
        );
        const json = JSON.parse(output);

        expect(json.taskId).toBe('seq-test-third-task');
      } finally {
        process.chdir(originalCwd);
      }
    });

    it('returns error when parent not found', async () => {
      const originalCwd = process.cwd();
      try {
        process.chdir(testDir);
        try {
          execSync(
            `node ${plxBin} create task "Test" --parent-id nonexistent --json`,
            { encoding: 'utf-8' }
          );
        } catch (error: any) {
          const json = JSON.parse(error.stdout);
          expect(json.error).toContain('Parent not found');
        }
      } finally {
        process.chdir(originalCwd);
      }
    });

    it('returns error without parent-id', async () => {
      const originalCwd = process.cwd();
      try {
        process.chdir(testDir);
        try {
          execSync(
            `node ${plxBin} create task "Test" --json`,
            { encoding: 'utf-8' }
          );
        } catch (error: any) {
          const json = JSON.parse(error.stdout);
          expect(json.error).toContain('Standalone tasks not yet supported');
        }
      } finally {
        process.chdir(originalCwd);
      }
    });

    it('includes skill-level when specified', async () => {
      const changeDir = path.join(testDir, 'workspace', 'changes', 'skill-test');
      await fs.mkdir(changeDir, { recursive: true });
      await fs.writeFile(
        path.join(changeDir, 'proposal.md'),
        '# Change: Skill Test\n\n## Why\nTest\n\n## What Changes\n- Test'
      );

      const originalCwd = process.cwd();
      try {
        process.chdir(testDir);
        execSync(
          `node ${plxBin} create task "Senior task" --parent-id skill-test --skill-level senior --json`,
          { encoding: 'utf-8' }
        );

        // Tasks are stored in centralized workspace/tasks with parent ID in filename
        const taskPath = path.join(testDir, 'workspace', 'tasks', '001-skill-test-senior-task.md');
        const taskContent = await fs.readFile(taskPath, 'utf-8');
        expect(taskContent).toContain('skill-level: senior');
      } finally {
        process.chdir(originalCwd);
      }
    });

    it('omits skill-level when not specified', async () => {
      const changeDir = path.join(testDir, 'workspace', 'changes', 'no-skill-test');
      await fs.mkdir(changeDir, { recursive: true });
      await fs.writeFile(
        path.join(changeDir, 'proposal.md'),
        '# Change: No Skill Test\n\n## Why\nTest\n\n## What Changes\n- Test'
      );

      const originalCwd = process.cwd();
      try {
        process.chdir(testDir);
        execSync(
          `node ${plxBin} create task "Regular task" --parent-id no-skill-test --json`,
          { encoding: 'utf-8' }
        );

        // Tasks are stored in centralized workspace/tasks with parent ID in filename
        const taskPath = path.join(testDir, 'workspace', 'tasks', '001-no-skill-test-regular-task.md');
        const taskContent = await fs.readFile(taskPath, 'utf-8');
        expect(taskContent).not.toContain('skill-level:');
      } finally {
        process.chdir(originalCwd);
      }
    });

    it('blocks spec parent', async () => {
      const specDir = path.join(testDir, 'workspace', 'specs', 'test-spec');
      await fs.mkdir(specDir, { recursive: true });
      await fs.writeFile(
        path.join(specDir, 'spec.md'),
        '# test-spec Specification\n\n## Purpose\nTest'
      );

      const originalCwd = process.cwd();
      try {
        process.chdir(testDir);
        try {
          execSync(
            `node ${plxBin} create task "Test" --parent-id test-spec --parent-type spec --json`,
            { encoding: 'utf-8' }
          );
        } catch (error: any) {
          const json = JSON.parse(error.stdout);
          expect(json.error).toContain('Specs cannot have tasks');
        }
      } finally {
        process.chdir(originalCwd);
      }
    });

    it('converts task title to kebab-case', async () => {
      const changeDir = path.join(testDir, 'workspace', 'changes', 'kebab-test');
      await fs.mkdir(changeDir, { recursive: true });
      await fs.writeFile(
        path.join(changeDir, 'proposal.md'),
        '# Change: Kebab Test\n\n## Why\nTest\n\n## What Changes\n- Test'
      );

      const originalCwd = process.cwd();
      try {
        process.chdir(testDir);
        execSync(
          `node ${plxBin} create task "Add User Profile Page" --parent-id kebab-test --json`,
          { encoding: 'utf-8' }
        );

        // Tasks are stored in centralized workspace/tasks with parent ID in filename
        const taskPath = path.join(testDir, 'workspace', 'tasks', '001-kebab-test-add-user-profile-page.md');
        expect(await fs.stat(taskPath).then(() => true).catch(() => false)).toBe(true);
      } finally {
        process.chdir(originalCwd);
      }
    });

    it('pads sequence number with zeros in filename', async () => {
      const changeDir = path.join(testDir, 'workspace', 'changes', 'pad-test');
      await fs.mkdir(changeDir, { recursive: true });
      await fs.writeFile(
        path.join(changeDir, 'proposal.md'),
        '# Change: Pad Test\n\n## Why\nTest\n\n## What Changes\n- Test'
      );

      const originalCwd = process.cwd();
      try {
        process.chdir(testDir);
        const output = execSync(
          `node ${plxBin} create task "First task" --parent-id pad-test --json`,
          { encoding: 'utf-8' }
        );
        const json = JSON.parse(output);

        // taskId is now parentId-taskName (no sequence prefix)
        expect(json.taskId).toBe('pad-test-first-task');

        // Verify the filename has the padded sequence number
        const taskPath = path.join(testDir, 'workspace', 'tasks', '001-pad-test-first-task.md');
        expect(await fs.stat(taskPath).then(() => true).catch(() => false)).toBe(true);
      } finally {
        process.chdir(originalCwd);
      }
    });
  });

  describe('workspace validation', () => {
    it('returns error when no workspace found', async () => {
      // Create a deeply nested directory to avoid finding any parent workspace
      const noWorkspaceDir = path.join('/tmp', 'plx-test-no-workspace-' + Date.now());
      await fs.mkdir(noWorkspaceDir, { recursive: true });

      const originalCwd = process.cwd();
      try {
        process.chdir(noWorkspaceDir);
        try {
          execSync(
            `node ${plxBin} create change "Test" --json`,
            { encoding: 'utf-8' }
          );
        } catch (error: any) {
          // Error is thrown before JSON mode engages, so check stderr via error message
          const errorMessage = error.message || '';
          expect(errorMessage).toContain('No PLX workspace found');
        }
      } finally {
        process.chdir(originalCwd);
        await fs.rm(noWorkspaceDir, { recursive: true, force: true });
      }
    });
  });
});
