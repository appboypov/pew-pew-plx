---
status: to-do
---

# Task: Update test files

## End Goal

All tests pass with renamed command and new checkbox completion functionality.

## Currently

- Tests in `test/commands/act.test.ts` test `act next` command
- Tests invoke CLI with `openspec act next`
- Test descriptions reference "act next"

## Should

- Tests in `test/commands/get.test.ts` test `get task` command
- Tests invoke CLI with `openspec get task`
- Test descriptions reference "get task"
- New tests for checkbox completion behavior

## Constraints

- [ ] Maintain test coverage for all existing functionality
- [ ] Add tests for new checkbox completion feature

## Acceptance Criteria

- [ ] All existing tests pass with updated command name
- [ ] New tests verify checkbox completion in Implementation Checklist
- [ ] New tests verify Constraints/Acceptance Criteria checkboxes are NOT modified
- [ ] New tests verify JSON output includes `completedTask` field

## Implementation Checklist

- [ ] 4.1 Rename `test/commands/act.test.ts` to `test/commands/get.test.ts`
- [ ] 4.2 Update describe block from `'act next command'` to `'get task command'`
- [ ] 4.3 Update all CLI invocations from `act next` to `get task`
- [ ] 4.4 Update test descriptions to reference `get task`
- [ ] 4.5 Add test: `--did-complete-previous` marks Implementation Checklist items as complete
- [ ] 4.6 Add test: `--did-complete-previous` does NOT modify Constraints checkboxes
- [ ] 4.7 Add test: `--did-complete-previous` does NOT modify Acceptance Criteria checkboxes
- [ ] 4.8 Add test: JSON output includes `completedTask` with name and completedItems
- [ ] 4.9 Add test: text output shows completed task info
- [ ] 4.10 Update `test/core/templates/plx-slash-command-templates.test.ts` for `'get-task'` ID

## Notes

Test file location: `test/commands/get.test.ts`
