---
status: done
skill-level: medior
---

# Task: Update Complete and Undo Logic

## End Goal
`plx complete` and `plx undo` commands operate on centralized task storage with parent-aware operations.

## Currently
- `completeTask()` operates on tasks in nested `changes/<name>/tasks/`
- `completeChange()` completes all tasks in a specific change's tasks folder
- `undoTask()` and `undoChange()` follow same nested pattern

## Should
- `completeTask()` operates on tasks in `workspace/tasks/`
- `completeChange()` aggregates tasks by parent-id frontmatter
- `undoTask()` and `undoChange()` use centralized storage
- All operations work with parent filtering

## Constraints
- [x] Must preserve existing status transition behavior
- [x] Must handle Implementation Checklist checkbox marking
- [x] Must work with multi-workspace task discovery

## Acceptance Criteria
- [x] `plx complete task --id <id>` finds and completes task in centralized storage
- [x] `plx complete change --id <id>` finds all tasks with parent-id=<id> and completes them
- [x] `plx undo task --id <id>` reverts task in centralized storage
- [x] `plx undo change --id <id>` reverts all tasks linked to change

## Implementation Checklist
- [x] 4.1 Update `src/commands/complete.ts`:
  - Update task lookup to use centralized discovery
  - Update change completion to filter by parent-id
  - Handle multi-workspace path resolution
- [x] 4.2 Update `src/commands/undo.ts`:
  - Update task lookup to use centralized discovery
  - Update change undo to filter by parent-id
  - Handle multi-workspace path resolution
- [x] 4.3 Update `src/utils/task-status.ts`:
  - Ensure file operations work with new paths
  - No schema changes needed (status field unchanged)
- [x] 4.4 Update integration tests for complete and undo commands

## Notes
The `--id` flag semantics are unchanged. Task ID resolution uses centralized discovery.
