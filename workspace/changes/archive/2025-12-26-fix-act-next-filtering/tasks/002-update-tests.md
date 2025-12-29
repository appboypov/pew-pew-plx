# Task: Update tests for filtering behavior

## End Goal

Test coverage verifies that `getPrioritizedChange()` correctly filters out non-actionable changes and that `plx act next` command behaves correctly with the new filtering.

## Currently

Existing tests in `test/utils/change-prioritization.test.ts` and `test/commands/act.test.ts` do not cover the scenario where completed changes should be skipped.

## Should

Tests verify:
- 100% complete changes are skipped
- 0 checkbox changes are skipped
- Actionable changes are prioritized correctly
- `null` is returned when only non-actionable changes exist

## Constraints

- [ ] Must follow existing test patterns in the codebase
- [ ] Must use Vitest testing framework
- [ ] Must create proper fixture directories for test scenarios

## Acceptance Criteria

- [ ] Test: Change with 100% complete checkboxes is skipped
- [ ] Test: Change with 0 checkboxes is skipped
- [ ] Test: Returns highest completion actionable change
- [ ] Test: Returns `null` when all changes are complete
- [ ] Test: `act next` command reflects filtering behavior
- [ ] All tests pass with `npm test`

## Implementation Checklist

- [x] 2.1 Add test case in `test/utils/change-prioritization.test.ts`: "skips changes with all checkboxes complete"
- [x] 2.2 Add test case: "skips changes with zero checkboxes"
- [x] 2.3 Add test case: "returns null when only non-actionable changes exist"
- [x] 2.4 Add test case: "prioritizes actionable changes by completion percentage"
- [x] 2.5 Update `test/commands/act.test.ts` to verify `act next` skips completed changes
- [x] 2.6 Run `npm test` to verify all tests pass

## Notes

Test fixtures should create task files with varying checkbox states:
- Complete: `- [x]` only
- Incomplete: mix of `- [ ]` and `- [x]`
- Empty: no checkboxes at all

Key test files:
- `test/utils/change-prioritization.test.ts`
- `test/commands/act.test.ts`
