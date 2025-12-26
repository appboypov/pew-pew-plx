---
tracked-issues:
  - tracker: linear
    id: PLX-18
    url: https://linear.app/de-app-specialist/issue/PLX-18/improve-plx-get-task-to-auto-complete-finished-tasks-and-show-next
---

# Change: Add automatic task completion detection

## Why

The `plx get task` command requires manual intervention with the `--did-complete-previous` flag to mark a task as done and advance to the next one. Users who have already checked all Implementation Checklist items must still remember to use the flag. Automatic detection of completed tasks reduces friction and keeps the workflow moving.

## What Changes

- Detect when the current in-progress task has all Implementation Checklist items checked
- Automatically mark the task as `done` when fully complete
- Advance to the next to-do task and mark it as `in-progress`
- Display the next task (without change documents, similar to `--did-complete-previous`)
- Show feedback message indicating auto-completion occurred
- Support both text and JSON output formats
- Preserve existing `--did-complete-previous` flag behavior for manual override

## Impact

- Affected specs: cli-get-task
- Affected code:
  - `src/commands/get.ts` - add auto-completion logic in `task()` method
