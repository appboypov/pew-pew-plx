---
status: done
skill-level: medior
parent-type: change
parent-id: fix-view-command-task-progress
---

# Task: Add tests for ViewCommand centralized task discovery

## End Goal

Test coverage validates that `plx view` correctly uses centralized task storage for change progress calculation.

## Currently

Tests for `ViewCommand` may exist but do not cover the centralized task storage scenario where tasks are in `workspace/tasks/` with `parent-id` linking.

## Should

Tests verify:
1. Changes with linked tasks in centralized storage show correct progress
2. Changes without `proposal.md` are excluded
3. Edge cases (0 tasks, all done, partially done) display correctly

## Constraints

- [ ] Use existing test patterns from `test/` directory
- [ ] Create fixtures that mimic centralized task storage structure
- [ ] Tests must pass in CI environment

## Acceptance Criteria

- [ ] Test case: Change with linked tasks shows as "active" with progress bar
- [ ] Test case: Change without `proposal.md` is excluded from display
- [ ] Test case: Change with all tasks done shows as "completed"
- [ ] Test case: Change with 0 linked tasks shows as "completed"
- [ ] All existing tests continue to pass

## Implementation Checklist

- [x] 2.1 Review existing ViewCommand tests in `test/`
- [x] 2.2 Create test fixtures with centralized task structure
- [x] 2.3 Add test for active change with partial task completion
- [x] 2.4 Add test for filtering changes without proposal.md
- [x] 2.5 Add test for completed change (all tasks done)
- [x] 2.6 Run full test suite to verify no regressions

## Notes

Look at `test/test-utils.ts` for `createValidPlxWorkspace` helper if available.
