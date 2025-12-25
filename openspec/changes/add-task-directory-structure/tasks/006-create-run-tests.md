# Task: Create and run tests for PLX-9

## End Goal

Comprehensive test coverage for PLX-9 functionality. All tests pass.

## Currently

No tests exist for the new task directory functionality. Testing strategy per project.md: manual testing via `pnpm link`, smoke tests for critical paths.

## Should

- Unit tests for task progress with directory structure
- Unit tests for migration service
- Integration tests for CLI commands
- E2E test for full workflow (create → list → archive)
- E2E test for migration scenario
- All tests pass
- Follow-up tasks created if test gaps found

## Constraints

- [ ] Follow project testing strategy (minimal unit tests, smoke tests for critical paths)
- [ ] Tests should verify business logic, not implementation details
- [ ] Use Gherkin BDD structure as documented in design.md

## Acceptance Criteria

- [ ] Unit tests for task progress with directory structure
- [ ] Unit tests for migration service
- [ ] Integration tests for CLI commands
- [ ] E2E test for full workflow (create → list → archive)
- [ ] E2E test for migration scenario
- [ ] All tests pass
- [ ] Follow-up tasks created if test gaps found

## Implementation Checklist

- [x] Create unit tests for `parseTaskFilename()`
- [x] Create unit tests for `sortTaskFilesBySequence()`
- [x] Create unit tests for `getTaskStructureForChange()`
- [x] Create unit tests for `migrateIfNeeded()`
- [x] Create integration test for `list` command with tasks/ directory
- [x] Create integration test for `archive` command with tasks/ directory
- [x] Create E2E test: create change with tasks/ → list → archive
- [x] Create E2E test: legacy tasks.md auto-migration
- [x] Run all tests and verify they pass
- [x] Document any test gaps as new task files

## Notes

Complexity: 2

Must be done after sub-issues 1-4 are complete. If test gaps are found, create new task files to address them.

Reference the TDD Gherkin tests in design.md for expected test scenarios.
