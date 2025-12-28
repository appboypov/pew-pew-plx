import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import {
  countTasksFromContent,
  getTaskStructureForChange,
  getTaskProgressForChange,
  formatTaskStatus,
  TASKS_DIRECTORY_NAME,
} from '../../src/utils/task-progress.js';

describe('task-progress', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = path.join(os.tmpdir(), `openspec-task-progress-test-${Date.now()}`);
    await fs.mkdir(tempDir, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  describe('countTasksFromContent', () => {
    it('should count tasks correctly', () => {
      const content = `# Tasks
- [x] Completed task 1
- [x] Completed task 2
- [ ] Incomplete task 1
- [ ] Incomplete task 2
`;
      const result = countTasksFromContent(content);
      expect(result.total).toBe(4);
      expect(result.completed).toBe(2);
    });

    it('should ignore checkboxes under Constraints section', () => {
      const content = `# Task
## Constraints
- [ ] Constraint 1
- [ ] Constraint 2

## Implementation Checklist
- [ ] Step 1
- [ ] Step 2
`;
      const result = countTasksFromContent(content);
      expect(result.total).toBe(2);
      expect(result.completed).toBe(0);
    });

    it('should ignore checkboxes under Acceptance Criteria section', () => {
      const content = `# Task
## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Implementation Checklist
- [x] Step 1
- [ ] Step 2
`;
      const result = countTasksFromContent(content);
      expect(result.total).toBe(2);
      expect(result.completed).toBe(1);
    });

    it('should exit excluded section when new ## header found', () => {
      const content = `# Task
## Constraints
- [ ] Ignored

## Implementation Checklist
- [ ] Counted
`;
      const result = countTasksFromContent(content);
      expect(result.total).toBe(1);
    });

    it('should handle empty content', () => {
      const result = countTasksFromContent('');
      expect(result.total).toBe(0);
      expect(result.completed).toBe(0);
    });

    it('should ignore checkboxes inside code blocks', () => {
      const content = `## Implementation Checklist
- [x] Real task

## Notes
\`\`\`markdown
## Review Checklist
- [ ] This should be ignored
- [ ] This too
\`\`\`
`;
      const result = countTasksFromContent(content);
      expect(result.total).toBe(1);
      expect(result.completed).toBe(1);
    });

    it('should ignore section headers inside code blocks', () => {
      const content = `## Constraints
- [ ] Ignored constraint

## Implementation Checklist
- [x] Counted task

## Notes
\`\`\`
## Implementation Checklist
- [ ] Fake task inside code block
\`\`\`
`;
      const result = countTasksFromContent(content);
      expect(result.total).toBe(1);
      expect(result.completed).toBe(1);
    });
  });

  describe('getTaskStructureForChange', () => {
    it('should return empty structure when tasks/ directory does not exist', async () => {
      const changesDir = tempDir;
      const changeName = 'test-change';
      await fs.mkdir(path.join(changesDir, changeName), { recursive: true });

      const result = await getTaskStructureForChange(changesDir, changeName);
      expect(result.files).toEqual([]);
      expect(result.aggregateProgress.total).toBe(0);
      expect(result.aggregateProgress.completed).toBe(0);
    });

    it('should detect task files in tasks/ directory', async () => {
      const changesDir = tempDir;
      const changeName = 'test-change';
      const tasksDir = path.join(changesDir, changeName, TASKS_DIRECTORY_NAME);
      await fs.mkdir(tasksDir, { recursive: true });

      await fs.writeFile(path.join(tasksDir, '001-implement.md'), `# Task
## Implementation Checklist
- [x] Step 1
- [ ] Step 2
`);
      await fs.writeFile(path.join(tasksDir, '002-review.md'), `# Task
## Implementation Checklist
- [ ] Step 1
- [ ] Step 2
- [ ] Step 3
`);

      const result = await getTaskStructureForChange(changesDir, changeName);
      expect(result.files.length).toBe(2);
      expect(result.files[0].filename).toBe('001-implement.md');
      expect(result.files[0].sequence).toBe(1);
      expect(result.files[0].progress.total).toBe(2);
      expect(result.files[0].progress.completed).toBe(1);
      expect(result.files[1].filename).toBe('002-review.md');
      expect(result.files[1].sequence).toBe(2);
      expect(result.files[1].progress.total).toBe(3);
    });

    it('should aggregate progress across all task files', async () => {
      const changesDir = tempDir;
      const changeName = 'test-change';
      const tasksDir = path.join(changesDir, changeName, TASKS_DIRECTORY_NAME);
      await fs.mkdir(tasksDir, { recursive: true });

      await fs.writeFile(path.join(tasksDir, '001-a.md'), `# Task
## Implementation Checklist
- [x] Done 1
- [x] Done 2
- [ ] Not done
`);
      await fs.writeFile(path.join(tasksDir, '002-b.md'), `# Task
## Implementation Checklist
- [x] Done
- [ ] Not done 1
- [ ] Not done 2
`);

      const result = await getTaskStructureForChange(changesDir, changeName);
      expect(result.aggregateProgress.total).toBe(6);
      expect(result.aggregateProgress.completed).toBe(3);
    });

    it('should sort files by sequence number', async () => {
      const changesDir = tempDir;
      const changeName = 'test-change';
      const tasksDir = path.join(changesDir, changeName, TASKS_DIRECTORY_NAME);
      await fs.mkdir(tasksDir, { recursive: true });

      await fs.writeFile(path.join(tasksDir, '003-last.md'), '# Task\n');
      await fs.writeFile(path.join(tasksDir, '001-first.md'), '# Task\n');
      await fs.writeFile(path.join(tasksDir, '002-middle.md'), '# Task\n');

      const result = await getTaskStructureForChange(changesDir, changeName);
      expect(result.files[0].filename).toBe('001-first.md');
      expect(result.files[1].filename).toBe('002-middle.md');
      expect(result.files[2].filename).toBe('003-last.md');
    });

    it('should ignore files without valid prefix pattern', async () => {
      const changesDir = tempDir;
      const changeName = 'test-change';
      const tasksDir = path.join(changesDir, changeName, TASKS_DIRECTORY_NAME);
      await fs.mkdir(tasksDir, { recursive: true });

      await fs.writeFile(path.join(tasksDir, '001-valid.md'), '# Task\n- [ ] Step\n');
      await fs.writeFile(path.join(tasksDir, 'README.md'), '# README\n');
      await fs.writeFile(path.join(tasksDir, 'notes.txt'), 'Some notes\n');
      await fs.writeFile(path.join(tasksDir, '1-invalid.md'), '# Invalid prefix\n');

      const result = await getTaskStructureForChange(changesDir, changeName);
      expect(result.files.length).toBe(1);
      expect(result.files[0].filename).toBe('001-valid.md');
    });
  });

  describe('getTaskProgressForChange', () => {
    it('should use tasks/ directory when it exists with valid files', async () => {
      const changesDir = tempDir;
      const changeName = 'test-change';
      const tasksDir = path.join(changesDir, changeName, TASKS_DIRECTORY_NAME);
      await fs.mkdir(tasksDir, { recursive: true });

      await fs.writeFile(path.join(tasksDir, '001-implement.md'), `# Task
## Implementation Checklist
- [x] Done
- [ ] Not done
`);

      const result = await getTaskProgressForChange(changesDir, changeName);
      expect(result.total).toBe(2);
      expect(result.completed).toBe(1);
    });

    it('should fall back to tasks.md when tasks/ does not exist', async () => {
      const changesDir = tempDir;
      const changeName = 'test-change';
      await fs.mkdir(path.join(changesDir, changeName), { recursive: true });

      await fs.writeFile(path.join(changesDir, changeName, 'tasks.md'), `# Tasks
- [x] Done 1
- [x] Done 2
- [ ] Not done
`);

      const result = await getTaskProgressForChange(changesDir, changeName);
      expect(result.total).toBe(3);
      expect(result.completed).toBe(2);
    });

    it('should return zero progress when neither tasks/ nor tasks.md exists', async () => {
      const changesDir = tempDir;
      const changeName = 'test-change';
      await fs.mkdir(path.join(changesDir, changeName), { recursive: true });

      const result = await getTaskProgressForChange(changesDir, changeName);
      expect(result.total).toBe(0);
      expect(result.completed).toBe(0);
    });
  });

  describe('formatTaskStatus', () => {
    it('should return "No tasks" for zero tasks', () => {
      expect(formatTaskStatus({ total: 0, completed: 0 })).toBe('No tasks');
    });

    it('should return "✓ Complete" when all tasks are done', () => {
      expect(formatTaskStatus({ total: 5, completed: 5 })).toBe('✓ Complete');
    });

    it('should return "X/Y tasks" for partial completion', () => {
      expect(formatTaskStatus({ total: 10, completed: 3 })).toBe('3/10 tasks');
    });
  });
});
