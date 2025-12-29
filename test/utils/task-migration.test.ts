import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { migrateIfNeeded, migrate } from '../../src/utils/task-migration.js';
import { TASKS_DIRECTORY_NAME } from '../../src/utils/task-progress.js';

describe('task-migration', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = path.join(os.tmpdir(), `plx-migration-test-${Date.now()}`);
    await fs.mkdir(tempDir, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  describe('migrateIfNeeded', () => {
    it('should migrate tasks.md when tasks/ directory does not exist', async () => {
      const changeDir = path.join(tempDir, 'my-change');
      await fs.mkdir(changeDir, { recursive: true });
      await fs.writeFile(path.join(changeDir, 'tasks.md'), '- [ ] Task 1\n- [x] Task 2\n');

      const result = await migrateIfNeeded(changeDir);

      expect(result).not.toBeNull();
      expect(result!.migrated).toBe(true);
      expect(result!.fromPath).toBe(path.join(changeDir, 'tasks.md'));
      expect(result!.toPath).toBe(path.join(changeDir, TASKS_DIRECTORY_NAME, '001-tasks.md'));

      // Verify file moved
      const newContent = await fs.readFile(result!.toPath, 'utf-8');
      expect(newContent).toBe('- [ ] Task 1\n- [x] Task 2\n');

      // Verify old file deleted
      await expect(fs.access(path.join(changeDir, 'tasks.md'))).rejects.toThrow();
    });

    it('should preserve checkbox states during migration', async () => {
      const changeDir = path.join(tempDir, 'my-change');
      await fs.mkdir(changeDir, { recursive: true });
      const content = `# Tasks
- [x] Completed task 1
- [x] Completed task 2
- [ ] Incomplete task 1
- [ ] Incomplete task 2
`;
      await fs.writeFile(path.join(changeDir, 'tasks.md'), content);

      const result = await migrateIfNeeded(changeDir);
      expect(result!.migrated).toBe(true);

      const newContent = await fs.readFile(result!.toPath, 'utf-8');
      expect(newContent).toBe(content);
    });

    it('should return null when tasks/ directory already exists with valid files', async () => {
      const changeDir = path.join(tempDir, 'my-change');
      const tasksDir = path.join(changeDir, TASKS_DIRECTORY_NAME);
      await fs.mkdir(tasksDir, { recursive: true });
      await fs.writeFile(path.join(tasksDir, '001-implement.md'), '- [ ] Step 1\n');

      const result = await migrateIfNeeded(changeDir);
      expect(result).toBeNull();
    });

    it('should cleanup orphan tasks.md when tasks/ directory exists with valid files', async () => {
      const changeDir = path.join(tempDir, 'my-change');
      const tasksDir = path.join(changeDir, TASKS_DIRECTORY_NAME);
      await fs.mkdir(tasksDir, { recursive: true });
      await fs.writeFile(path.join(tasksDir, '001-implement.md'), '- [ ] Step 1\n');
      await fs.writeFile(path.join(changeDir, 'tasks.md'), 'orphan content\n');

      const result = await migrateIfNeeded(changeDir);
      expect(result).toBeNull();

      // Verify orphan tasks.md was deleted
      await expect(fs.access(path.join(changeDir, 'tasks.md'))).rejects.toThrow();
    });

    it('should return null when neither tasks.md nor tasks/ exists', async () => {
      const changeDir = path.join(tempDir, 'my-change');
      await fs.mkdir(changeDir, { recursive: true });

      const result = await migrateIfNeeded(changeDir);
      expect(result).toBeNull();
    });

    it('should migrate when tasks/ exists but is empty', async () => {
      const changeDir = path.join(tempDir, 'my-change');
      const tasksDir = path.join(changeDir, TASKS_DIRECTORY_NAME);
      await fs.mkdir(tasksDir, { recursive: true });
      await fs.writeFile(path.join(changeDir, 'tasks.md'), '- [ ] Task\n');

      const result = await migrateIfNeeded(changeDir);
      expect(result!.migrated).toBe(true);
    });

    it('should migrate when tasks/ exists but has no valid task files', async () => {
      const changeDir = path.join(tempDir, 'my-change');
      const tasksDir = path.join(changeDir, TASKS_DIRECTORY_NAME);
      await fs.mkdir(tasksDir, { recursive: true });
      await fs.writeFile(path.join(tasksDir, 'README.md'), 'Documentation\n');
      await fs.writeFile(path.join(changeDir, 'tasks.md'), '- [ ] Task\n');

      const result = await migrateIfNeeded(changeDir);
      expect(result!.migrated).toBe(true);
    });
  });

  describe('migrate', () => {
    it('should force migration even when called directly', async () => {
      const changeDir = path.join(tempDir, 'my-change');
      await fs.mkdir(changeDir, { recursive: true });
      await fs.writeFile(path.join(changeDir, 'tasks.md'), '- [ ] Task\n');

      const result = await migrate(changeDir);

      expect(result.migrated).toBe(true);
      expect(result.fromPath).toBe(path.join(changeDir, 'tasks.md'));
      expect(result.toPath).toBe(path.join(changeDir, TASKS_DIRECTORY_NAME, '001-tasks.md'));
    });

    it('should create tasks/ directory if it does not exist', async () => {
      const changeDir = path.join(tempDir, 'my-change');
      await fs.mkdir(changeDir, { recursive: true });
      await fs.writeFile(path.join(changeDir, 'tasks.md'), '- [ ] Task\n');

      await migrate(changeDir);

      const stat = await fs.stat(path.join(changeDir, TASKS_DIRECTORY_NAME));
      expect(stat.isDirectory()).toBe(true);
    });
  });
});
