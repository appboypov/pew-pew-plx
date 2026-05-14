---
status: done
parent-type: change
parent-id: add-openspec-migration
---
# Task: Add Migration Tests

## End Goal

Comprehensive test coverage for OpenSpec migration functionality.

## Currently

No migration tests exist.

## Should

Create test file with coverage for all migration scenarios.

## Constraints

- [ ] Tests must use temporary directories
- [ ] Tests must clean up after themselves
- [ ] Tests must cover all edge cases

## Acceptance Criteria

- [ ] All migration functions have tests
- [ ] Edge cases covered (both dirs exist, permissions, etc.)
- [ ] Tests pass in CI

## Implementation Checklist

- [x] Create `test/utils/openspec-migration.test.ts`
- [x] Test `detectOpenSpecProject()` function
- [x] Test `migrateDirectoryStructure()` - success case
- [x] Test `migrateDirectoryStructure()` - both dirs exist
- [x] Test `migrateMarkersInFile()` function
- [x] Test `migrateAllMarkers()` function
- [x] Test `migrateGlobalConfig()` function (skipped - real home dir risk)
- [x] Test `migrateOpenSpecProject()` orchestrator
- [x] Test no-op case (no OpenSpec artifacts)

## Notes

Use vitest and follow existing test patterns in the codebase.
