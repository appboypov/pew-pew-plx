---
status: to-do
skill-level: medior
parent-type: change
parent-id: move-root-files-to-workspace
---

# Task: Test migration scenarios

## End Goal
Comprehensive test coverage for migration scenarios.

## Currently
No tests for root files migration.

## Should
Test coverage for:
- Migration with files in root only
- Migration with files in both locations
- Migration with files already in workspace
- Init creates files in correct location
- Update creates files in correct location
- Create progress creates PROGRESS.md in correct location

## Constraints
- [ ] Follow existing test patterns
- [ ] Use test utilities from `test/test-utils.ts`
- [ ] Cover edge cases (permissions, missing directories)

## Acceptance Criteria
- [ ] All migration scenarios have test coverage
- [ ] Tests are isolated and don't affect each other
- [ ] Tests clean up after themselves

## Implementation Checklist
- [ ] 10.1 Add unit tests for `detectRootFiles()`
- [ ] 10.2 Add unit tests for `migrateRootFiles()` - file in root only
- [ ] 10.3 Add unit tests for `migrateRootFiles()` - file in both locations
- [ ] 10.4 Add unit tests for `migrateRootFiles()` - file in workspace only
- [ ] 10.5 Update init command tests for new file locations
- [ ] 10.6 Update update command tests for migration behavior
- [ ] 10.7 Update create command tests for PROGRESS.md location

## Notes
Consider using temporary directories for isolation.
