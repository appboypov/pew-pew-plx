---
status: done
---

# Task: Implement checkbox completion functionality

## End Goal

The `task-status.ts` utility has functions to automatically mark all `## Implementation Checklist` checkboxes as complete and return the list of completed items.

## Currently

`task-status.ts` only updates the YAML frontmatter `status:` field. Checkboxes in task files must be manually marked as `[x]`.

## Should

- New `CheckboxCompletionResult` interface with `updatedContent` and `completedItems` properties
- New `completeImplementationChecklist(content)` function that marks `[ ]` as `[x]` in `## Implementation Checklist` section only
- New `completeTaskFully(filePath)` function that completes checkboxes and updates status to `done`
- Checkboxes under `## Constraints` and `## Acceptance Criteria` are NOT modified

## Constraints

- [x] Reuse section detection pattern from `task-progress.ts` for consistency
- [x] Preserve all other content in the task file unchanged
- [x] Handle edge cases: nested checkboxes, empty checklists, missing sections

## Acceptance Criteria

- [x] `completeImplementationChecklist` returns list of item texts that were marked complete
- [x] `completeImplementationChecklist` does not modify Constraints section checkboxes
- [x] `completeImplementationChecklist` does not modify Acceptance Criteria section checkboxes
- [x] `completeTaskFully` updates both checkboxes and status in single atomic operation

## Implementation Checklist

- [x] 1.1 Add `CheckboxCompletionResult` interface to `src/utils/task-status.ts`
- [x] 1.2 Implement `completeImplementationChecklist(content)` function
- [x] 1.3 Implement `completeTaskFully(filePath)` function
- [x] 1.4 Export new types and functions from module
- [x] 1.5 Add unit tests for `completeImplementationChecklist` in `test/utils/task-status.test.ts`
- [x] 1.6 Add unit tests for section exclusion (Constraints, Acceptance Criteria)
- [x] 1.7 Add unit tests for edge cases (empty checklist, already completed items)

## Notes

The regex pattern for unchecked checkboxes: `/^(\s*[-*]\s+)\[ \](.*)$/`
