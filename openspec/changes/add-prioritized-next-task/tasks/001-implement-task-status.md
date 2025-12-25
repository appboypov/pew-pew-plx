# Task: Implement task status utilities

## End Goal

Create utilities for parsing and updating task status in YAML frontmatter.

## Currently

Task files have no status field. The `task-progress.ts` module counts checkboxes but doesn't track task-level status.

## Should

New `src/utils/task-status.ts` module provides:
- `parseStatus(content: string): TaskStatus` - extracts status from frontmatter
- `updateStatus(content: string, newStatus: TaskStatus): string` - updates or adds status in frontmatter
- `TaskStatus` type: `'to-do' | 'in-progress' | 'done'`
- `DEFAULT_TASK_STATUS` constant: `'to-do'`

## Constraints

- [ ] Must preserve other frontmatter fields when updating status
- [ ] Must handle files without frontmatter by adding it
- [ ] Must default to `to-do` when status field is missing

## Acceptance Criteria

- [ ] `parseStatus` returns correct status for all three values
- [ ] `parseStatus` returns `to-do` for missing frontmatter
- [ ] `parseStatus` returns `to-do` for frontmatter without status
- [ ] `updateStatus` modifies existing status in frontmatter
- [ ] `updateStatus` adds frontmatter with status when missing
- [ ] `updateStatus` preserves other frontmatter fields

## Implementation Checklist

- [x] 1.1 Create `src/utils/task-status.ts` with type definitions
- [x] 1.2 Implement `parseStatus` function with frontmatter regex
- [x] 1.3 Implement `updateStatus` function for existing frontmatter
- [x] 1.4 Handle edge case: add frontmatter when missing
- [x] 1.5 Export from `src/utils/index.ts`
- [x] 1.6 Add unit tests in `test/utils/task-status.test.ts`

## Notes

Use regex pattern `^---\n([\s\S]*?)\n---` to match frontmatter block. The status line pattern is `status:\s*(to-do|in-progress|done)`.
