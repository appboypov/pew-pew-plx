---
status: done
---

# Task: Implement automatic task completion detection

## End Goal

The `plx get task` command automatically detects when the current in-progress task is fully complete and advances to the next task.

## Currently

- `plx get task` displays the in-progress task regardless of checklist state
- Users must manually run `plx get task --did-complete-previous` to mark a task done
- The `countTasksFromContent()` function exists to count checklist items

## Should

- Check if in-progress task has all Implementation Checklist items completed
- Automatically mark the task as `done` when fully complete
- Find and mark the next to-do task as `in-progress`
- Display the next task without change documents
- Show feedback message about auto-completion
- Include `autoCompletedTask` in JSON output

## Constraints

- [ ] Use existing `countTasksFromContent()` from task-progress.ts
- [ ] Use `setTaskStatus()` not `completeTaskFully()` (checkboxes already marked)
- [ ] Skip auto-completion when task has 0 checklist items
- [ ] Preserve existing `--did-complete-previous` flag behavior

## Acceptance Criteria

- [ ] In-progress task with all items checked triggers auto-completion
- [ ] Task status changes from `in-progress` to `done`
- [ ] Next task status changes from `to-do` to `in-progress`
- [ ] Text output shows auto-completion message
- [ ] JSON output includes `autoCompletedTask` object
- [ ] Partially complete tasks display normally

## Implementation Checklist

- [x] 1.1 Import `countTasksFromContent` in get.ts
- [x] 1.2 Add auto-completion check after getting prioritized change
- [x] 1.3 Read in-progress task content and count checklist items
- [x] 1.4 Detect full completion (completed === total && total > 0)
- [x] 1.5 Mark in-progress task as done using `setTaskStatus()`
- [x] 1.6 Find next to-do task and mark as in-progress
- [x] 1.7 Add `autoCompletedTask` field to JsonOutput interface
- [x] 1.8 Include auto-completion info in JSON output
- [x] 1.9 Add text output message for auto-completion
- [x] 1.10 Display next task without change documents

## Notes

The auto-completion logic should run before the `--did-complete-previous` check to ensure it works independently. The flow:
1. Get prioritized change
2. Check for auto-completion of in-progress task
3. If auto-completed, continue with next task
4. Otherwise, check `--did-complete-previous` flag for manual completion
