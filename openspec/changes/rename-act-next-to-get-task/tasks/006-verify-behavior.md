---
status: to-do
---

# Task: Verify behavior

## End Goal

All changes work correctly and tests pass.

## Currently

N/A - verification task.

## Should

- All tests pass
- TypeScript compiles without errors
- Manual testing confirms expected behavior

## Constraints

- [ ] Do not proceed if tests fail
- [ ] Fix any issues found during verification

## Acceptance Criteria

- [ ] `pnpm test` passes all tests
- [ ] `pnpm build` completes without errors
- [ ] `openspec get task` returns expected output
- [ ] `openspec get task --did-complete-previous` completes checkboxes correctly
- [ ] `openspec get task --json` returns valid JSON with completedTask field

## Implementation Checklist

- [ ] 6.1 Run `pnpm build` and verify no TypeScript errors
- [ ] 6.2 Run `pnpm test` and verify all tests pass
- [ ] 6.3 Run `pnpm lint` and fix any lint errors
- [ ] 6.4 Manual test: create test change with task containing Implementation Checklist
- [ ] 6.5 Manual test: run `openspec get task` and verify output
- [ ] 6.6 Manual test: run `openspec get task --did-complete-previous` and verify checkboxes marked
- [ ] 6.7 Manual test: verify Constraints/Acceptance Criteria checkboxes unchanged
- [ ] 6.8 Manual test: run `openspec get task --json` and verify JSON structure

## Notes

Manual test setup:
```bash
mkdir -p test-project/openspec/changes/test-change/tasks
# Create task file with Implementation Checklist, Constraints, Acceptance Criteria sections
```
