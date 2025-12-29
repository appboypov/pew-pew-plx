---
status: done
---

# Task: Update test files

## End Goal

All tests pass with renamed command and new checkbox completion functionality.

## Currently

- Tests in `test/commands/act.test.ts` test `act next` command
- Tests invoke CLI with `plx get task`
- Test descriptions reference "act next"

## Should

- Tests in `test/commands/get.test.ts` test `get task` command
- Tests invoke CLI with `plx get task`
- Test descriptions reference "get task"
- New tests for checkbox completion behavior

## Constraints

- [x] Maintain test coverage for all existing functionality
- [x] Add tests for new checkbox completion feature

## Acceptance Criteria

- [x] All existing tests pass with updated command name
- [x] New tests verify checkbox completion in Implementation Checklist
- [x] New tests verify Constraints/Acceptance Criteria checkboxes are NOT modified
- [x] New tests verify JSON output includes `completedTask` field

## Implementation Checklist

- [x] 4.1 Rename `test/commands/act.test.ts` to `test/commands/get.test.ts`
- [x] 4.2 Update describe block from `'act next command'` to `'get task command'`
- [x] 4.3 Update all CLI invocations from `act next` to `get task`
- [x] 4.4 Update test descriptions to reference `get task`
- [x] 4.5 Add test: `--did-complete-previous` marks Implementation Checklist items as complete
- [x] 4.6 Add test: `--did-complete-previous` does NOT modify Constraints checkboxes
- [x] 4.7 Add test: `--did-complete-previous` does NOT modify Acceptance Criteria checkboxes
- [x] 4.8 Add test: JSON output includes `completedTask` with name and completedItems
- [x] 4.9 Add test: text output shows completed task info
- [x] 4.10 Update `test/core/templates/plx-slash-command-templates.test.ts` for `'get-task'` ID

## Notes

Test file location: `test/commands/get.test.ts`
