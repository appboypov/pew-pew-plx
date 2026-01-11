---
status: done
parent-type: change
parent-id: add-plan-request-command
---
# Task: Update tests for proposal rename

## End Goal
All tests pass after the proposal → plan-proposal rename.

## Currently
Tests reference `proposal.md` and `plx-proposal.md` in various forms.

## Should
- All test references updated to `plan-proposal.md` and `plx-plan-proposal.md`
- All tests pass
- No stale references to old naming

## Constraints
- [ ] Do not change test logic, only update references
- [ ] Ensure all test files are covered

## Acceptance Criteria
- [ ] `npm test` passes
- [ ] No remaining references to `proposal.md` in test files (excluding archived changes)

## Implementation Checklist
- [x] 4.1 Search for `proposal` in test files: `rg proposal test/`
- [x] 4.2 Update `test/core/init.test.ts` references
- [x] 4.3 Update `test/core/update.test.ts` references
- [x] 4.4 Update any command-specific test files
- [x] 4.5 Update test fixtures if any reference proposal
- [x] 4.6 Run `npm test` to verify all tests pass

## Notes
- Focus on test files only, not archived changes in workspace
- Use search to ensure no references are missed
