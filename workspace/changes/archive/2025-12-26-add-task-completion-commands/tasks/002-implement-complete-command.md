---
status: done
---

# Task: Implement complete command

## End Goal

Add `plx complete task` and `plx complete change` CLI commands.

## Currently

No `complete` command exists. Task completion only via `get task --did-complete-previous`.

## Should

- `plx complete task --id <task-id>` marks task as done and checks Implementation Checklist items
- `plx complete change --id <change-id>` completes all tasks in a change
- Both support `--json` output

## Constraints

- [ ] Follow existing command patterns from `GetCommand`
- [ ] Reuse `ItemRetrievalService` for task/change retrieval
- [ ] Use existing `completeTaskFully()` for task completion

## Acceptance Criteria

- [ ] `plx complete task --id X` marks task X as done
- [ ] Implementation Checklist items are checked when completing
- [ ] Constraints and Acceptance Criteria remain unchanged
- [ ] `plx complete change --id X` completes all tasks in change X
- [ ] Already-done tasks are skipped with a note
- [ ] JSON output includes completedItems array

## Implementation Checklist

- [x] 2.1 Create `src/commands/complete.ts` with `CompleteCommand` class
- [x] 2.2 Implement `task(options: { id: string; json?: boolean })` method
- [x] 2.3 Implement `change(options: { id: string; json?: boolean })` method
- [x] 2.4 Register `complete task` subcommand in `src/cli/index.ts`
- [x] 2.5 Register `complete change` subcommand in `src/cli/index.ts`

## Notes

Handle edge cases: task not found, change not found, already complete.
