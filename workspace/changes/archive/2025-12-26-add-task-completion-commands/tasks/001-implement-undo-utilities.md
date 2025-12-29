---
status: done
---

# Task: Implement undo utilities in task-status.ts

## End Goal

Add utility functions to uncomplete implementation checklist items and revert task status.

## Currently

`task-status.ts` has `completeImplementationChecklist()` and `completeTaskFully()` but no reverse operations.

## Should

- `uncompleteImplementationChecklist(content)` unchecks `[x]` → `[ ]` in Implementation Checklist only
- `undoTaskFully(filePath)` unchecks items and sets status to 'to-do'

## Constraints

- [ ] Preserve Constraints and Acceptance Criteria checkboxes unchanged
- [ ] Match the pattern of existing `completeImplementationChecklist()` function
- [ ] Handle case-insensitive `[X]` and `[x]` checkbox patterns

## Acceptance Criteria

- [ ] `uncompleteImplementationChecklist()` unchecks only Implementation Checklist items
- [ ] `undoTaskFully()` reverts status to 'to-do' and unchecks items
- [ ] Constraints and Acceptance Criteria sections remain untouched

## Implementation Checklist

- [x] 1.1 Add `uncompleteImplementationChecklist(content: string): CheckboxCompletionResult` function
- [x] 1.2 Add `undoTaskFully(filePath: string): Promise<string[]>` function
- [x] 1.3 Export new functions from module

## Notes

Reuse the section detection logic from `completeImplementationChecklist()`.
