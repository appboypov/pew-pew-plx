---
status: to-do
skill-level: medior
parent-type: change
parent-id: move-root-files-to-workspace
---

# Task: Verify changes and run tests

## End Goal
All changes are complete, tests pass, and the migration works correctly.

## Currently
Implementation tasks completed but not verified end-to-end.

## Should
All tests pass and manual verification confirms:
- Migration works for all scenarios
- Init creates files in correct location
- Update runs migration and creates files correctly
- Create progress uses correct path
- Transfer uses correct paths
- Slash commands have correct references

## Constraints
- [ ] All existing tests must pass
- [ ] New tests must cover migration scenarios
- [ ] Build must complete without errors

## Acceptance Criteria
- [ ] `pnpm test` passes
- [ ] `pnpm build` succeeds
- [ ] Manual test: `plx init` in new directory creates workspace files
- [ ] Manual test: `plx update` in project with root files migrates them
- [ ] Validation passes: `plx validate change --id move-root-files-to-workspace --strict`

## Implementation Checklist
- [ ] 9.1 Run `pnpm test` and fix any failures
- [ ] 9.2 Run `pnpm build` and fix any errors
- [ ] 9.3 Manual test init in clean directory
- [ ] 9.4 Manual test update with root files present
- [ ] 9.5 Manual test update with files in both locations
- [ ] 9.6 Validate the change passes strict validation

## Notes
This is the verification and cleanup task.
