---
status: done
skill-level: medior
---

# Task: Implement undo review and undo spec commands

## End Goal

Users can run `plx undo review --id <id>` and `plx undo spec --id <id>` to revert all tasks associated with a review or spec to to-do status.

## Currently

- `UndoCommand` class has `task()` and `change()` methods
- The command is registered in cli/index.ts with `task` and `change` subcommands
- JSON output follows a consistent schema with entity ID, undoneTasks, and skippedTasks

## Should

- Add `review()` method to `UndoCommand` class
- Add `spec()` method to `UndoCommand` class
- Register `review` and `spec` subcommands in cli/index.ts
- Follow the same pattern as existing `change()` method:
  - Validate entity exists
  - Iterate through linked tasks
  - Skip already to-do tasks
  - Undo remaining tasks
  - Output results (console or JSON)

## Constraints

- [ ] Error handling must match existing patterns (exit code 1 for not found)
- [ ] JSON output must include `reviewId` or `specId` (not `changeId`)
- [ ] Must use `ItemRetrievalService` methods from task 001

## Acceptance Criteria

- [ ] `plx undo review --id <id>` reverts all tasks in the review to to-do
- [ ] `plx undo spec --id <id>` reverts all tasks linked to the spec to to-do
- [ ] Already to-do tasks are skipped with appropriate message
- [ ] Non-existent entities produce error with exit code 1
- [ ] `--json` flag produces valid JSON output
- [ ] Console output matches existing styling (chalk colors, formatting)

## Implementation Checklist

- [ ] 3.1 Add `ReviewOptions` interface to undo.ts
- [ ] 3.2 Add `SpecOptions` interface to undo.ts
- [ ] 3.3 Implement `review()` method in UndoCommand
- [ ] 3.4 Implement `spec()` method in UndoCommand
- [ ] 3.5 Register `undo review` subcommand in cli/index.ts
- [ ] 3.6 Register `undo spec` subcommand in cli/index.ts
- [ ] 3.7 Add integration tests for undo review command
- [ ] 3.8 Add integration tests for undo spec command

## Notes

The `spec()` method handles the case where no tasks are linked to a spec gracefully (message + exit 0), since specs may exist without associated tasks.
