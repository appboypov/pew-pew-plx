import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { platform } from 'os';
import { createValidPlxWorkspace } from '../test-utils.js';

const isMacOS = platform() === 'darwin';

describe.skipIf(!isMacOS)('paste request command', () => {
  const projectRoot = process.cwd();
  const testDir = path.join(projectRoot, 'test-paste-request-tmp');
  const draftsDir = path.join(testDir, 'workspace', 'drafts');
  const plxBin = path.join(projectRoot, 'bin', 'plx.js');

  beforeEach(async () => {
    await createValidPlxWorkspace(testDir);
  });

  afterEach(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
  });

  it('saves clipboard content to drafts/request.md', async () => {
    const originalCwd = process.cwd();
    try {
      process.chdir(testDir);

      // Set clipboard content (macOS only for this test)
      execSync('echo "test request content" | pbcopy');

      const output = execSync(
        `node ${plxBin} paste request --json`,
        { encoding: 'utf-8' }
      );
      const json = JSON.parse(output);

      expect(json.success).toBe(true);
      expect(json.path).toBe('workspace/drafts/request.md');
      expect(json.characters).toBeGreaterThan(0);

      // Verify file was created
      const content = await fs.readFile(
        path.join(draftsDir, 'request.md'),
        'utf-8'
      );
      expect(content).toContain('test request content');
    } finally {
      process.chdir(originalCwd);
    }
  });

  it('creates drafts directory if it does not exist', async () => {
    const originalCwd = process.cwd();
    try {
      process.chdir(testDir);

      // Verify drafts directory doesn't exist
      await expect(fs.access(draftsDir)).rejects.toThrow();

      // Set clipboard content
      execSync('echo "new request" | pbcopy');

      execSync(
        `node ${plxBin} paste request`,
        { encoding: 'utf-8' }
      );

      // Verify directory and file were created
      const stats = await fs.stat(draftsDir);
      expect(stats.isDirectory()).toBe(true);

      const content = await fs.readFile(
        path.join(draftsDir, 'request.md'),
        'utf-8'
      );
      expect(content).toContain('new request');
    } finally {
      process.chdir(originalCwd);
    }
  });

  it('overwrites existing request.md', async () => {
    const originalCwd = process.cwd();
    try {
      process.chdir(testDir);

      // Create initial file
      await fs.mkdir(draftsDir, { recursive: true });
      await fs.writeFile(
        path.join(draftsDir, 'request.md'),
        'old content'
      );

      // Set new clipboard content
      execSync('echo "new content" | pbcopy');

      execSync(
        `node ${plxBin} paste request`,
        { encoding: 'utf-8' }
      );

      // Verify file was overwritten
      const content = await fs.readFile(
        path.join(draftsDir, 'request.md'),
        'utf-8'
      );
      expect(content).toContain('new content');
      expect(content).not.toContain('old content');
    } finally {
      process.chdir(originalCwd);
    }
  });

  it('outputs JSON with success structure', async () => {
    const originalCwd = process.cwd();
    try {
      process.chdir(testDir);

      execSync('echo "json test" | pbcopy');

      const output = execSync(
        `node ${plxBin} paste request --json`,
        { encoding: 'utf-8' }
      );
      const json = JSON.parse(output);

      expect(json).toHaveProperty('path');
      expect(json).toHaveProperty('characters');
      expect(json).toHaveProperty('success');
      expect(json.path).toBe('workspace/drafts/request.md');
      expect(json.success).toBe(true);
      expect(typeof json.characters).toBe('number');
    } finally {
      process.chdir(originalCwd);
    }
  });

  it('outputs JSON error when clipboard is empty', async () => {
    const originalCwd = process.cwd();
    try {
      process.chdir(testDir);

      // Clear clipboard
      execSync('pbcopy < /dev/null');

      const result = execSync(
        `node ${plxBin} paste request --json 2>&1 || true`,
        { encoding: 'utf-8' }
      );
      const json = JSON.parse(result.trim());
      expect(json.error).toContain('Clipboard is empty');
    } finally {
      process.chdir(originalCwd);
    }
  });
});

describe.skipIf(!isMacOS)('paste task command', () => {
  const projectRoot = process.cwd();
  const testDir = path.join(projectRoot, 'test-paste-task-tmp');
  const plxBin = path.join(projectRoot, 'bin', 'plx.js');

  beforeEach(async () => {
    await createValidPlxWorkspace(testDir);
  });

  afterEach(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
  });

  it('creates task with parented task content from clipboard', async () => {
    const originalCwd = process.cwd();
    try {
      process.chdir(testDir);

      // Create a change to be the parent
      const changesDir = path.join(testDir, 'workspace', 'changes');
      const changeDir = path.join(changesDir, 'test-change');
      await fs.mkdir(changesDir, { recursive: true });
      await fs.mkdir(changeDir, { recursive: true });
      await fs.writeFile(
        path.join(changeDir, 'proposal.md'),
        '# Test Change\n## Why\nTest'
      );

      // Set clipboard content
      execSync('echo "Implement user authentication\nAdd login and signup forms" | pbcopy');

      const output = execSync(
        `node ${plxBin} paste task --parent-id test-change --json`,
        { encoding: 'utf-8' }
      );
      const json = JSON.parse(output);

      expect(json.success).toBe(true);
      expect(json.type).toBe('task');
      expect(json.parentId).toBe('test-change');
      expect(json.parentType).toBe('change');
      expect(json.taskId).toMatch(/^001-implement-user-authentication$/);

      // Verify task file was created with correct structure
      const taskPath = path.join(changeDir, 'tasks', '001-implement-user-authentication.md');
      const taskContent = await fs.readFile(taskPath, 'utf-8');

      expect(taskContent).toContain('status: to-do');
      expect(taskContent).toContain('# Task: Implement user authentication');
      expect(taskContent).toContain('## End Goal');
      expect(taskContent).toContain('Implement user authentication');
      expect(taskContent).toContain('Add login and signup forms');
    } finally {
      process.chdir(originalCwd);
    }
  });

  it('creates task with correct frontmatter', async () => {
    const originalCwd = process.cwd();
    try {
      process.chdir(testDir);

      // Create a change
      const changesDir = path.join(testDir, 'workspace', 'changes');
      const changeDir = path.join(changesDir, 'test-change');
      await fs.mkdir(changesDir, { recursive: true });
      await fs.mkdir(changeDir, { recursive: true });
      await fs.writeFile(
        path.join(changeDir, 'proposal.md'),
        '# Test Change\n## Why\nTest'
      );

      // Set clipboard content
      execSync('echo "Add new feature" | pbcopy');

      execSync(
        `node ${plxBin} paste task --parent-id test-change`,
        { encoding: 'utf-8' }
      );

      // Verify frontmatter
      const taskPath = path.join(changeDir, 'tasks', '001-add-new-feature.md');
      const taskContent = await fs.readFile(taskPath, 'utf-8');

      expect(taskContent).toMatch(/^---\nstatus: to-do\n---/);
    } finally {
      process.chdir(originalCwd);
    }
  });

  it('creates task with skill-level frontmatter when provided', async () => {
    const originalCwd = process.cwd();
    try {
      process.chdir(testDir);

      // Create a change
      const changesDir = path.join(testDir, 'workspace', 'changes');
      const changeDir = path.join(changesDir, 'test-change');
      await fs.mkdir(changesDir, { recursive: true });
      await fs.mkdir(changeDir, { recursive: true });
      await fs.writeFile(
        path.join(changeDir, 'proposal.md'),
        '# Test Change\n## Why\nTest'
      );

      // Set clipboard content
      execSync('echo "Complex refactoring task" | pbcopy');

      execSync(
        `node ${plxBin} paste task --parent-id test-change --skill-level senior`,
        { encoding: 'utf-8' }
      );

      // Verify frontmatter includes skill-level
      const taskPath = path.join(changeDir, 'tasks', '001-complex-refactoring-task.md');
      const taskContent = await fs.readFile(taskPath, 'utf-8');

      expect(taskContent).toMatch(/^---\nstatus: to-do\nskill-level: senior\n---/);
    } finally {
      process.chdir(originalCwd);
    }
  });

  it('error when parent not found', async () => {
    const originalCwd = process.cwd();
    try {
      process.chdir(testDir);

      // Set clipboard content
      execSync('echo "Some task" | pbcopy');

      const result = execSync(
        `node ${plxBin} paste task --parent-id nonexistent --json 2>&1 || true`,
        { encoding: 'utf-8' }
      );
      const json = JSON.parse(result.trim());

      expect(json.error).toContain('Parent not found: nonexistent');
    } finally {
      process.chdir(originalCwd);
    }
  });

  it('error when clipboard is empty', async () => {
    const originalCwd = process.cwd();
    try {
      process.chdir(testDir);

      // Create a change
      const changesDir = path.join(testDir, 'workspace', 'changes');
      const changeDir = path.join(changesDir, 'test-change');
      await fs.mkdir(changesDir, { recursive: true });
      await fs.mkdir(changeDir, { recursive: true });
      await fs.writeFile(
        path.join(changeDir, 'proposal.md'),
        '# Test Change\n## Why\nTest'
      );

      // Clear clipboard
      execSync('pbcopy < /dev/null');

      const result = execSync(
        `node ${plxBin} paste task --parent-id test-change --json 2>&1 || true`,
        { encoding: 'utf-8' }
      );
      const json = JSON.parse(result.trim());

      expect(json.error).toContain('Clipboard is empty');
    } finally {
      process.chdir(originalCwd);
    }
  });

  it('JSON output has correct structure', async () => {
    const originalCwd = process.cwd();
    try {
      process.chdir(testDir);

      // Create a change
      const changesDir = path.join(testDir, 'workspace', 'changes');
      const changeDir = path.join(changesDir, 'test-change');
      await fs.mkdir(changesDir, { recursive: true });
      await fs.mkdir(changeDir, { recursive: true });
      await fs.writeFile(
        path.join(changeDir, 'proposal.md'),
        '# Test Change\n## Why\nTest'
      );

      // Set clipboard content
      execSync('echo "Task title" | pbcopy');

      const output = execSync(
        `node ${plxBin} paste task --parent-id test-change --json`,
        { encoding: 'utf-8' }
      );
      const json = JSON.parse(output);

      expect(json).toHaveProperty('success');
      expect(json).toHaveProperty('type');
      expect(json).toHaveProperty('path');
      expect(json).toHaveProperty('parentId');
      expect(json).toHaveProperty('parentType');
      expect(json).toHaveProperty('taskId');
      expect(json.success).toBe(true);
      expect(json.type).toBe('task');
    } finally {
      process.chdir(originalCwd);
    }
  });

  it('error when trying to attach task to spec directly', async () => {
    const originalCwd = process.cwd();
    try {
      process.chdir(testDir);

      // Create a spec
      const specsDir = path.join(testDir, 'workspace', 'specs');
      const specDir = path.join(specsDir, 'test-spec');
      await fs.mkdir(specsDir, { recursive: true });
      await fs.mkdir(specDir, { recursive: true });
      await fs.writeFile(
        path.join(specDir, 'spec.md'),
        '# Spec: Test Spec\n## Requirements\nTest'
      );

      // Set clipboard content
      execSync('echo "Some task" | pbcopy');

      const result = execSync(
        `node ${plxBin} paste task --parent-id test-spec --json 2>&1 || true`,
        { encoding: 'utf-8' }
      );
      const json = JSON.parse(result.trim());

      expect(json.error).toContain('Specs cannot have tasks directly attached');
    } finally {
      process.chdir(originalCwd);
    }
  });

  it('increments sequence number for multiple tasks', async () => {
    const originalCwd = process.cwd();
    try {
      process.chdir(testDir);

      // Create a change
      const changesDir = path.join(testDir, 'workspace', 'changes');
      const changeDir = path.join(changesDir, 'test-change');
      await fs.mkdir(changesDir, { recursive: true });
      await fs.mkdir(changeDir, { recursive: true });
      await fs.writeFile(
        path.join(changeDir, 'proposal.md'),
        '# Test Change\n## Why\nTest'
      );

      // Create first task
      execSync('echo "First task" | pbcopy');
      execSync(
        `node ${plxBin} paste task --parent-id test-change`,
        { encoding: 'utf-8' }
      );

      // Create second task
      execSync('echo "Second task" | pbcopy');
      const output = execSync(
        `node ${plxBin} paste task --parent-id test-change --json`,
        { encoding: 'utf-8' }
      );
      const json = JSON.parse(output);

      expect(json.taskId).toMatch(/^002-second-task$/);

      // Verify both files exist
      const task1Path = path.join(changeDir, 'tasks', '001-first-task.md');
      const task2Path = path.join(changeDir, 'tasks', '002-second-task.md');

      await expect(fs.access(task1Path)).resolves.not.toThrow();
      await expect(fs.access(task2Path)).resolves.not.toThrow();
    } finally {
      process.chdir(originalCwd);
    }
  });
});

describe.skipIf(!isMacOS)('paste change command', () => {
  const projectRoot = process.cwd();
  const testDir = path.join(projectRoot, 'test-paste-change-tmp');
  const plxBin = path.join(projectRoot, 'bin', 'plx.js');

  beforeEach(async () => {
    await createValidPlxWorkspace(testDir);
  });

  afterEach(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
  });

  it('creates change directory structure', async () => {
    const originalCwd = process.cwd();
    try {
      process.chdir(testDir);

      // Set clipboard content
      execSync('echo "Add user authentication feature\nImplement login and signup" | pbcopy');

      const output = execSync(
        `node ${plxBin} paste change --json`,
        { encoding: 'utf-8' }
      );
      const json = JSON.parse(output);

      expect(json.success).toBe(true);
      expect(json.type).toBe('change');
      expect(json.changeName).toBe('add-user-authentication-feature');

      // Verify directory structure
      const changeDir = path.join(testDir, 'workspace', 'changes', 'add-user-authentication-feature');
      const proposalPath = path.join(changeDir, 'proposal.md');
      const tasksDir = path.join(changeDir, 'tasks');
      const specsDir = path.join(changeDir, 'specs');

      await expect(fs.access(proposalPath)).resolves.not.toThrow();
      await expect(fs.access(tasksDir)).resolves.not.toThrow();
      await expect(fs.access(specsDir)).resolves.not.toThrow();

      const stats = await fs.stat(tasksDir);
      expect(stats.isDirectory()).toBe(true);
    } finally {
      process.chdir(originalCwd);
    }
  });

  it('detects verb prefix from first line', async () => {
    const originalCwd = process.cwd();
    try {
      process.chdir(testDir);

      // Test different verb prefixes
      const verbs = ['add', 'update', 'fix', 'refactor', 'remove', 'create'];

      for (const verb of verbs) {
        execSync(`echo "${verb} feature name" | pbcopy`);

        const output = execSync(
          `node ${plxBin} paste change --json`,
          { encoding: 'utf-8' }
        );
        const json = JSON.parse(output);

        expect(json.changeName).toMatch(new RegExp(`^${verb}-feature-name(-\\d+)?$`));
      }
    } finally {
      process.chdir(originalCwd);
    }
  });

  it('adds draft prefix when no verb detected', async () => {
    const originalCwd = process.cwd();
    try {
      process.chdir(testDir);

      // Set clipboard content without verb prefix
      execSync('echo "Some random feature name" | pbcopy');

      const output = execSync(
        `node ${plxBin} paste change --json`,
        { encoding: 'utf-8' }
      );
      const json = JSON.parse(output);

      expect(json.changeName).toBe('draft-some-random-feature-name');
    } finally {
      process.chdir(originalCwd);
    }
  });

  it('handles duplicate with numeric suffix', async () => {
    const originalCwd = process.cwd();
    try {
      process.chdir(testDir);

      // Set clipboard content
      execSync('echo "Add feature" | pbcopy');

      // Create first change
      const output1 = execSync(
        `node ${plxBin} paste change --json`,
        { encoding: 'utf-8' }
      );
      const json1 = JSON.parse(output1);
      expect(json1.changeName).toBe('add-feature');

      // Create duplicate
      execSync('echo "Add feature" | pbcopy');
      const output2 = execSync(
        `node ${plxBin} paste change --json`,
        { encoding: 'utf-8' }
      );
      const json2 = JSON.parse(output2);
      expect(json2.changeName).toBe('add-feature-2');

      // Create another duplicate
      execSync('echo "Add feature" | pbcopy');
      const output3 = execSync(
        `node ${plxBin} paste change --json`,
        { encoding: 'utf-8' }
      );
      const json3 = JSON.parse(output3);
      expect(json3.changeName).toBe('add-feature-3');
    } finally {
      process.chdir(originalCwd);
    }
  });

  it('populates Why section with clipboard content', async () => {
    const originalCwd = process.cwd();
    try {
      process.chdir(testDir);

      const clipboardContent = 'Add user authentication feature\nThis will improve security';
      execSync(`echo "${clipboardContent}" | pbcopy`);

      execSync(
        `node ${plxBin} paste change`,
        { encoding: 'utf-8' }
      );

      // Verify Why section contains clipboard content
      const proposalPath = path.join(
        testDir,
        'workspace',
        'changes',
        'add-user-authentication-feature',
        'proposal.md'
      );
      const proposalContent = await fs.readFile(proposalPath, 'utf-8');

      expect(proposalContent).toContain('## Why');
      expect(proposalContent).toContain(clipboardContent);
      expect(proposalContent).not.toContain('TBD - 1-2 sentences on problem/opportunity');
    } finally {
      process.chdir(originalCwd);
    }
  });

  it('JSON output has correct structure', async () => {
    const originalCwd = process.cwd();
    try {
      process.chdir(testDir);

      execSync('echo "Add feature" | pbcopy');

      const output = execSync(
        `node ${plxBin} paste change --json`,
        { encoding: 'utf-8' }
      );
      const json = JSON.parse(output);

      expect(json).toHaveProperty('success');
      expect(json).toHaveProperty('type');
      expect(json).toHaveProperty('path');
      expect(json).toHaveProperty('changeName');
      expect(json.success).toBe(true);
      expect(json.type).toBe('change');
    } finally {
      process.chdir(originalCwd);
    }
  });

  it('error when clipboard is empty', async () => {
    const originalCwd = process.cwd();
    try {
      process.chdir(testDir);

      // Clear clipboard
      execSync('pbcopy < /dev/null');

      const result = execSync(
        `node ${plxBin} paste change --json 2>&1 || true`,
        { encoding: 'utf-8' }
      );
      const json = JSON.parse(result.trim());

      expect(json.error).toContain('Clipboard is empty');
    } finally {
      process.chdir(originalCwd);
    }
  });
});

describe.skipIf(!isMacOS)('paste spec command', () => {
  const projectRoot = process.cwd();
  const testDir = path.join(projectRoot, 'test-paste-spec-tmp');
  const plxBin = path.join(projectRoot, 'bin', 'plx.js');

  beforeEach(async () => {
    await createValidPlxWorkspace(testDir);
  });

  afterEach(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
  });

  it('creates spec directory with spec.md', async () => {
    const originalCwd = process.cwd();
    try {
      process.chdir(testDir);

      // Set clipboard content
      execSync('echo "User authentication specification\nThe system SHALL support login" | pbcopy');

      const output = execSync(
        `node ${plxBin} paste spec --json`,
        { encoding: 'utf-8' }
      );
      const json = JSON.parse(output);

      expect(json.success).toBe(true);
      expect(json.type).toBe('spec');
      expect(json.specName).toBe('user-authentication-specification');

      // Verify spec.md was created
      const specPath = path.join(
        testDir,
        'workspace',
        'specs',
        'user-authentication-specification',
        'spec.md'
      );
      await expect(fs.access(specPath)).resolves.not.toThrow();

      const specContent = await fs.readFile(specPath, 'utf-8');
      expect(specContent).toContain('# user-authentication-specification Specification');
    } finally {
      process.chdir(originalCwd);
    }
  });

  it('derives spec name correctly in kebab-case', async () => {
    const originalCwd = process.cwd();
    try {
      process.chdir(testDir);

      // Set clipboard content with various characters
      execSync('echo "User Authentication & Authorization System!" | pbcopy');

      const output = execSync(
        `node ${plxBin} paste spec --json`,
        { encoding: 'utf-8' }
      );
      const json = JSON.parse(output);

      expect(json.specName).toBe('user-authentication-authorization-system');
    } finally {
      process.chdir(originalCwd);
    }
  });

  it('error when duplicate spec exists', async () => {
    const originalCwd = process.cwd();
    try {
      process.chdir(testDir);

      // Create first spec
      execSync('echo "Authentication spec" | pbcopy');
      execSync(
        `node ${plxBin} paste spec`,
        { encoding: 'utf-8' }
      );

      // Try to create duplicate
      execSync('echo "Authentication spec" | pbcopy');
      const result = execSync(
        `node ${plxBin} paste spec --json 2>&1 || true`,
        { encoding: 'utf-8' }
      );
      const json = JSON.parse(result.trim());

      expect(json.error).toContain('Spec already exists: authentication-spec');
    } finally {
      process.chdir(originalCwd);
    }
  });

  it('populates first requirement with clipboard content', async () => {
    const originalCwd = process.cwd();
    try {
      process.chdir(testDir);

      const clipboardContent = 'Authentication specification\nThe system SHALL support OAuth2';
      execSync(`echo "${clipboardContent}" | pbcopy`);

      execSync(
        `node ${plxBin} paste spec`,
        { encoding: 'utf-8' }
      );

      // Verify first requirement contains clipboard content
      const specPath = path.join(
        testDir,
        'workspace',
        'specs',
        'authentication-specification',
        'spec.md'
      );
      const specContent = await fs.readFile(specPath, 'utf-8');

      expect(specContent).toContain('### Requirement: Example Requirement');
      expect(specContent).toContain(clipboardContent);
      expect(specContent).not.toContain('TBD - Describe what the system SHALL provide.');
    } finally {
      process.chdir(originalCwd);
    }
  });

  it('JSON output has correct structure', async () => {
    const originalCwd = process.cwd();
    try {
      process.chdir(testDir);

      execSync('echo "Test spec" | pbcopy');

      const output = execSync(
        `node ${plxBin} paste spec --json`,
        { encoding: 'utf-8' }
      );
      const json = JSON.parse(output);

      expect(json).toHaveProperty('success');
      expect(json).toHaveProperty('type');
      expect(json).toHaveProperty('path');
      expect(json).toHaveProperty('specName');
      expect(json.success).toBe(true);
      expect(json.type).toBe('spec');
    } finally {
      process.chdir(originalCwd);
    }
  });

  it('error when clipboard is empty', async () => {
    const originalCwd = process.cwd();
    try {
      process.chdir(testDir);

      // Clear clipboard
      execSync('pbcopy < /dev/null');

      const result = execSync(
        `node ${plxBin} paste spec --json 2>&1 || true`,
        { encoding: 'utf-8' }
      );
      const json = JSON.parse(result.trim());

      expect(json.error).toContain('Clipboard is empty');
    } finally {
      process.chdir(originalCwd);
    }
  });
});
