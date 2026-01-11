---
status: done
skill-level: medior
parent-type: change
parent-id: extend-complete-undo
---
# Task: Implement complete review and complete spec commands

## End Goal

Users can run `plx complete review --id <id>` and `plx complete spec --id <id>` to complete all tasks associated with a review or spec.

## Currently

- `CompleteCommand` class has `task()` and `change()` methods
- The command is registered in cli/index.ts with `task` and `change` subcommands
- JSON output follows a consistent schema with entity ID, completedTasks, and skippedTasks

## Should

- Add `review()` method to `CompleteCommand` class
- Add `spec()` method to `CompleteCommand` class
- Register `review` and `spec` subcommands in cli/index.ts
- Follow the same pattern as existing `change()` method:
  - Validate entity exists
  - Iterate through linked tasks
  - Skip already-done tasks
  - Complete remaining tasks
  - Output results (console or JSON)

## Constraints

- [x] Error handling must match existing patterns (exit code 1 for not found)
- [x] JSON output must include `reviewId` or `specId` (not `changeId`)
- [x] Must use `ItemRetrievalService` methods from task 001

## Acceptance Criteria

- [x] `plx complete review --id <id>` completes all tasks in the review
- [x] `plx complete spec --id <id>` completes all tasks linked to the spec
- [x] Already-done tasks are skipped with appropriate message
- [x] Non-existent entities produce error with exit code 1
- [x] `--json` flag produces valid JSON output
- [x] Console output matches existing styling (chalk colors, formatting)

## Implementation Checklist

- [x] 2.1 Add `ReviewOptions` interface to complete.ts
- [x] 2.2 Add `SpecOptions` interface to complete.ts
- [x] 2.3 Implement `review()` method in CompleteCommand
- [x] 2.4 Implement `spec()` method in CompleteCommand
- [x] 2.5 Register `complete review` subcommand in cli/index.ts
- [x] 2.6 Register `complete spec` subcommand in cli/index.ts
- [x] 2.7 Add integration tests for complete review command
- [x] 2.8 Add integration tests for complete spec command

## Notes

The `spec()` method handles the case where no tasks are linked to a spec gracefully (message + exit 0), since specs may exist without associated tasks.
