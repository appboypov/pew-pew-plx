---
status: done
---

# Task: Implement undo command

## End Goal

Add `plx undo task` and `plx undo change` CLI commands.

## Currently

No undo functionality exists. Once a task is marked done, there's no CLI way to revert it.

## Should

- `plx undo task --id <task-id>` reverts task to to-do and unchecks Implementation Checklist items
- `plx undo change --id <change-id>` reverts all tasks in a change to to-do
- Both support `--json` output

## Constraints

- [ ] Follow existing command patterns from `GetCommand`
- [ ] Reuse `ItemRetrievalService` for task/change retrieval
- [ ] Use new `undoTaskFully()` for task undo

## Acceptance Criteria

- [ ] `plx undo task --id X` reverts task X to to-do
- [ ] Implementation Checklist items are unchecked when undoing
- [ ] Constraints and Acceptance Criteria remain unchanged
- [ ] `plx undo change --id X` reverts all tasks in change X
- [ ] Already to-do tasks are skipped with a note
- [ ] JSON output includes uncheckedItems array

## Implementation Checklist

- [x] 3.1 Create `src/commands/undo.ts` with `UndoCommand` class
- [x] 3.2 Implement `task(options: { id: string; json?: boolean })` method
- [x] 3.3 Implement `change(options: { id: string; json?: boolean })` method
- [x] 3.4 Register `undo task` subcommand in `src/cli/index.ts`
- [x] 3.5 Register `undo change` subcommand in `src/cli/index.ts`

## Notes

Handle edge cases: task not found, change not found, already to-do.
