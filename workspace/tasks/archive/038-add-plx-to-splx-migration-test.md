---
status: to-do
skill-level: medior
parent-type: change
parent-id: add-plx-to-splx-migration
---

# Task: Test PLX to SPLX migration command

## End Goal
Comprehensive test coverage for the plx-to-splx migration command.

## Currently
No tests exist for the new migration subcommand.

## Should
Test file `test/commands/migrate-plx-to-splx.test.ts` covers all scenarios.

## Constraints
- [ ] Follow testing patterns from existing `test/commands/migrate.test.ts`
- [ ] Use test fixtures for mock project structures
- [ ] Test all AI tool directories mentioned in spec

## Acceptance Criteria
- [ ] All scenarios from spec have corresponding tests
- [ ] Tests pass in CI environment
- [ ] Edge cases are covered (no artifacts, partial artifacts, conflicts)

## Implementation Checklist
- [ ] 3.1 Create `test/commands/migrate-plx-to-splx.test.ts`
- [ ] 3.2 Add test fixture with mock plx artifacts
- [ ] 3.3 Test Claude commands directory rename
- [ ] 3.4 Test file rename for other AI tools
- [ ] 3.5 Test content update logic
- [ ] 3.6 Test `--dry-run` flag behavior
- [ ] 3.7 Test `--json` output structure
- [ ] 3.8 Test "no artifacts found" scenario
- [ ] 3.9 Test multi-workspace support
- [ ] 3.10 Run full test suite and fix any failures

## Notes
Create realistic test fixtures that mirror actual project structures after plx init.
