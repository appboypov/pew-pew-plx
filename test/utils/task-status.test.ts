import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import {
  parseStatus,
  updateStatus,
  getTaskStatus,
  setTaskStatus,
  DEFAULT_TASK_STATUS,
  completeImplementationChecklist,
  completeTaskFully,
  uncompleteImplementationChecklist,
  undoTaskFully,
  CheckboxUncompleteResult,
} from '../../src/utils/task-status.js';

describe('task-status', () => {
  describe('parseStatus', () => {
    it('should return to-do for status: to-do', () => {
      const content = `---
status: to-do
---

# Task: Example`;
      expect(parseStatus(content)).toBe('to-do');
    });

    it('should return in-progress for status: in-progress', () => {
      const content = `---
status: in-progress
---

# Task: Example`;
      expect(parseStatus(content)).toBe('in-progress');
    });

    it('should return done for status: done', () => {
      const content = `---
status: done
---

# Task: Example`;
      expect(parseStatus(content)).toBe('done');
    });

    it('should return to-do for missing frontmatter', () => {
      const content = `# Task: Example

Some content without frontmatter`;
      expect(parseStatus(content)).toBe('to-do');
    });

    it('should return to-do for frontmatter without status', () => {
      const content = `---
other-field: value
---

# Task: Example`;
      expect(parseStatus(content)).toBe('to-do');
    });

    it('should handle frontmatter with multiple fields', () => {
      const content = `---
title: My Task
status: in-progress
priority: high
---

# Task: Example`;
      expect(parseStatus(content)).toBe('in-progress');
    });

    it('should handle status as first field in frontmatter', () => {
      const content = `---
status: done
other: value
---

# Task`;
      expect(parseStatus(content)).toBe('done');
    });

    it('should handle status as last field in frontmatter', () => {
      const content = `---
other: value
status: in-progress
---

# Task`;
      expect(parseStatus(content)).toBe('in-progress');
    });
  });

  describe('updateStatus', () => {
    it('should add frontmatter with status when missing', () => {
      const content = `# Task: Example

Some content`;
      const result = updateStatus(content, 'in-progress');
      expect(result).toBe(`---
status: in-progress
---

# Task: Example

Some content`);
    });

    it('should update existing status in frontmatter', () => {
      const content = `---
status: to-do
---

# Task: Example`;
      const result = updateStatus(content, 'done');
      expect(result).toBe(`---
status: done
---

# Task: Example`);
    });

    it('should preserve other frontmatter fields when updating status', () => {
      const content = `---
title: My Task
status: to-do
priority: high
---

# Task: Example`;
      const result = updateStatus(content, 'in-progress');
      expect(result).toBe(`---
title: My Task
status: in-progress
priority: high
---

# Task: Example`);
    });

    it('should add status to existing frontmatter without status field', () => {
      const content = `---
title: My Task
priority: high
---

# Task: Example`;
      const result = updateStatus(content, 'in-progress');
      expect(result).toBe(`---
status: in-progress
title: My Task
priority: high
---

# Task: Example`);
    });

    it('should handle empty content', () => {
      const content = '';
      const result = updateStatus(content, 'to-do');
      expect(result).toBe(`---
status: to-do
---

`);
    });
  });

  describe('getTaskStatus and setTaskStatus', () => {
    let tempDir: string;

    beforeEach(async () => {
      tempDir = path.join(os.tmpdir(), `plx-task-status-test-${Date.now()}`);
      await fs.mkdir(tempDir, { recursive: true });
    });

    afterEach(async () => {
      await fs.rm(tempDir, { recursive: true, force: true });
    });

    it('should read status from file', async () => {
      const filePath = path.join(tempDir, '001-task.md');
      await fs.writeFile(filePath, `---
status: in-progress
---

# Task: Test`);

      const status = await getTaskStatus(filePath);
      expect(status).toBe('in-progress');
    });

    it('should update status in file', async () => {
      const filePath = path.join(tempDir, '001-task.md');
      await fs.writeFile(filePath, `---
status: to-do
---

# Task: Test`);

      await setTaskStatus(filePath, 'done');

      const content = await fs.readFile(filePath, 'utf-8');
      expect(content).toContain('status: done');
      expect(content).not.toContain('status: to-do');
    });

    it('should add frontmatter when file has none', async () => {
      const filePath = path.join(tempDir, '001-task.md');
      await fs.writeFile(filePath, `# Task: Test

Content without frontmatter`);

      await setTaskStatus(filePath, 'in-progress');

      const content = await fs.readFile(filePath, 'utf-8');
      expect(content).toContain('---\nstatus: in-progress\n---');
    });
  });

  describe('DEFAULT_TASK_STATUS', () => {
    it('should be to-do', () => {
      expect(DEFAULT_TASK_STATUS).toBe('to-do');
    });
  });

  describe('completeImplementationChecklist', () => {
    it('marks unchecked items in Implementation Checklist as complete', () => {
      const content = `---
status: in-progress
---

# Task

## Implementation Checklist
- [ ] First item
- [x] Already done
- [ ] Third item

## Notes
Some notes`;
      const result = completeImplementationChecklist(content);
      expect(result.completedItems).toEqual(['First item', 'Third item']);
      expect(result.updatedContent).toContain('[x] First item');
      expect(result.updatedContent).toContain('[x] Third item');
      expect(result.updatedContent).toContain('[x] Already done');
    });

    it('does NOT modify checkboxes in Constraints section', () => {
      const content = `---
status: in-progress
---

## Implementation Checklist
- [ ] Implementation item

## Constraints
- [ ] Constraint item

## Notes`;
      const result = completeImplementationChecklist(content);
      expect(result.completedItems).toEqual(['Implementation item']);
      expect(result.updatedContent).toContain('[x] Implementation item');
      expect(result.updatedContent).toContain('## Constraints\n- [ ] Constraint item');
    });

    it('does NOT modify checkboxes in Acceptance Criteria section', () => {
      const content = `---
status: in-progress
---

## Implementation Checklist
- [ ] Implementation item

## Acceptance Criteria
- [ ] Acceptance item

## Notes`;
      const result = completeImplementationChecklist(content);
      expect(result.completedItems).toEqual(['Implementation item']);
      expect(result.updatedContent).toContain('[x] Implementation item');
      expect(result.updatedContent).toContain('## Acceptance Criteria\n- [ ] Acceptance item');
    });

    it('returns empty completedItems when all items already complete', () => {
      const content = `---
status: in-progress
---

## Implementation Checklist
- [x] Already done
- [x] Also done`;
      const result = completeImplementationChecklist(content);
      expect(result.completedItems).toEqual([]);
    });

    it('handles content without Implementation Checklist section', () => {
      const content = `---
status: in-progress
---

## Notes
- [ ] This should not be touched`;
      const result = completeImplementationChecklist(content);
      expect(result.completedItems).toEqual([]);
      expect(result.updatedContent).toContain('- [ ] This should not be touched');
    });

    it('resumes completing after exiting excluded sections', () => {
      const content = `## Implementation Checklist
- [ ] First impl item

## Constraints
- [ ] Constraint

## Implementation Checklist
- [ ] Second impl item

## Acceptance Criteria
- [ ] Acceptance`;
      const result = completeImplementationChecklist(content);
      expect(result.completedItems).toContain('First impl item');
      expect(result.completedItems).toContain('Second impl item');
      expect(result.updatedContent).toContain('## Constraints\n- [ ] Constraint');
      expect(result.updatedContent).toContain('## Acceptance Criteria\n- [ ] Acceptance');
    });
  });

  describe('completeTaskFully', () => {
    let tempDir: string;

    beforeEach(async () => {
      tempDir = path.join(os.tmpdir(), `plx-complete-test-${Date.now()}`);
      await fs.mkdir(tempDir, { recursive: true });
    });

    afterEach(async () => {
      await fs.rm(tempDir, { recursive: true, force: true });
    });

    it('marks checkboxes and updates status to done', async () => {
      const filePath = path.join(tempDir, '001-task.md');
      await fs.writeFile(filePath, `---
status: in-progress
---

# Task: Test

## Implementation Checklist
- [ ] First item
- [ ] Second item

## Constraints
- [ ] Should not be touched`);

      const completedItems = await completeTaskFully(filePath);

      expect(completedItems).toEqual(['First item', 'Second item']);

      const content = await fs.readFile(filePath, 'utf-8');
      expect(content).toContain('status: done');
      expect(content).toContain('[x] First item');
      expect(content).toContain('[x] Second item');
      expect(content).toContain('## Constraints\n- [ ] Should not be touched');
    });

    it('returns empty array when no items to complete', async () => {
      const filePath = path.join(tempDir, '001-task.md');
      await fs.writeFile(filePath, `---
status: in-progress
---

# Task: Test

## Implementation Checklist
- [x] Already done`);

      const completedItems = await completeTaskFully(filePath);

      expect(completedItems).toEqual([]);

      const content = await fs.readFile(filePath, 'utf-8');
      expect(content).toContain('status: done');
    });
  });

  describe('uncompleteImplementationChecklist', () => {
    it('unchecks checked items in Implementation Checklist', () => {
      const content = `---
status: done
---

# Task

## Implementation Checklist
- [x] First item
- [ ] Already unchecked
- [x] Third item

## Notes
Some notes`;
      const result = uncompleteImplementationChecklist(content);
      expect(result.uncheckedItems).toEqual(['First item', 'Third item']);
      expect(result.updatedContent).toContain('[ ] First item');
      expect(result.updatedContent).toContain('[ ] Third item');
      expect(result.updatedContent).toContain('[ ] Already unchecked');
    });

    it('handles uppercase [X] checkbox pattern', () => {
      const content = `## Implementation Checklist
- [X] Uppercase checked
- [x] Lowercase checked`;
      const result = uncompleteImplementationChecklist(content);
      expect(result.uncheckedItems).toEqual(['Uppercase checked', 'Lowercase checked']);
      expect(result.updatedContent).toContain('[ ] Uppercase checked');
      expect(result.updatedContent).toContain('[ ] Lowercase checked');
    });

    it('does NOT modify checkboxes in Constraints section', () => {
      const content = `## Implementation Checklist
- [x] Implementation item

## Constraints
- [x] Constraint item

## Notes`;
      const result = uncompleteImplementationChecklist(content);
      expect(result.uncheckedItems).toEqual(['Implementation item']);
      expect(result.updatedContent).toContain('[ ] Implementation item');
      expect(result.updatedContent).toContain('## Constraints\n- [x] Constraint item');
    });

    it('does NOT modify checkboxes in Acceptance Criteria section', () => {
      const content = `## Implementation Checklist
- [x] Implementation item

## Acceptance Criteria
- [x] Acceptance item

## Notes`;
      const result = uncompleteImplementationChecklist(content);
      expect(result.uncheckedItems).toEqual(['Implementation item']);
      expect(result.updatedContent).toContain('[ ] Implementation item');
      expect(result.updatedContent).toContain('## Acceptance Criteria\n- [x] Acceptance item');
    });

    it('returns empty uncheckedItems when no items to uncheck', () => {
      const content = `## Implementation Checklist
- [ ] Already unchecked
- [ ] Also unchecked`;
      const result = uncompleteImplementationChecklist(content);
      expect(result.uncheckedItems).toEqual([]);
    });

    it('handles content without Implementation Checklist section', () => {
      const content = `## Notes
- [x] This should not be touched`;
      const result = uncompleteImplementationChecklist(content);
      expect(result.uncheckedItems).toEqual([]);
      expect(result.updatedContent).toContain('- [x] This should not be touched');
    });

    it('resumes unchecking after exiting excluded sections', () => {
      const content = `## Implementation Checklist
- [x] First impl item

## Constraints
- [x] Constraint

## Implementation Checklist
- [x] Second impl item

## Acceptance Criteria
- [x] Acceptance`;
      const result = uncompleteImplementationChecklist(content);
      expect(result.uncheckedItems).toContain('First impl item');
      expect(result.uncheckedItems).toContain('Second impl item');
      expect(result.updatedContent).toContain('## Constraints\n- [x] Constraint');
      expect(result.updatedContent).toContain('## Acceptance Criteria\n- [x] Acceptance');
    });
  });

  describe('undoTaskFully', () => {
    let tempDir: string;

    beforeEach(async () => {
      tempDir = path.join(os.tmpdir(), `plx-undo-test-${Date.now()}`);
      await fs.mkdir(tempDir, { recursive: true });
    });

    afterEach(async () => {
      await fs.rm(tempDir, { recursive: true, force: true });
    });

    it('unchecks checkboxes and updates status to to-do', async () => {
      const filePath = path.join(tempDir, '001-task.md');
      await fs.writeFile(filePath, `---
status: done
---

# Task: Test

## Implementation Checklist
- [x] First item
- [x] Second item

## Constraints
- [x] Should not be touched`);

      const uncheckedItems = await undoTaskFully(filePath);

      expect(uncheckedItems).toEqual(['First item', 'Second item']);

      const content = await fs.readFile(filePath, 'utf-8');
      expect(content).toContain('status: to-do');
      expect(content).toContain('[ ] First item');
      expect(content).toContain('[ ] Second item');
      expect(content).toContain('## Constraints\n- [x] Should not be touched');
    });

    it('returns empty array when no items to uncheck', async () => {
      const filePath = path.join(tempDir, '001-task.md');
      await fs.writeFile(filePath, `---
status: in-progress
---

# Task: Test

## Implementation Checklist
- [ ] Already unchecked`);

      const uncheckedItems = await undoTaskFully(filePath);

      expect(uncheckedItems).toEqual([]);

      const content = await fs.readFile(filePath, 'utf-8');
      expect(content).toContain('status: to-do');
    });

    it('handles both [x] and [X] patterns', async () => {
      const filePath = path.join(tempDir, '001-task.md');
      await fs.writeFile(filePath, `---
status: done
---

## Implementation Checklist
- [x] Lowercase
- [X] Uppercase`);

      const uncheckedItems = await undoTaskFully(filePath);

      expect(uncheckedItems).toEqual(['Lowercase', 'Uppercase']);

      const content = await fs.readFile(filePath, 'utf-8');
      expect(content).toContain('[ ] Lowercase');
      expect(content).toContain('[ ] Uppercase');
    });
  });
});
