---
status: done
skill-level: medior
parent-type: change
parent-id: centralize-task-storage
---
# Task: Validate Behavior

## End Goal
All behavior changes are validated through automated and manual testing.

## Currently
Tests exist for the old nested task structure.

## Should
Tests validate the new centralized task structure and all associated behavior.

## Constraints
- [x] All existing tests must pass (may need updates for new structure)
- [x] New tests must cover centralized storage scenarios
- [x] Edge cases for parent filtering must be tested

## Acceptance Criteria
- [x] All unit tests pass
- [x] All integration tests pass
- [x] Manual testing confirms expected CLI behavior
- [x] Edge cases verified: standalone tasks, missing parents, multi-workspace

## Implementation Checklist
- [x] 6.1 Run `pnpm test` and fix any failing tests
- [x] 6.2 Update existing tests that assume nested structure:
  - Test fixtures use `workspace/tasks/` instead of nested
  - Test helpers create centralized task files
- [x] 6.3 Add tests for new functionality:
  - Parent filtering with `--parent-id`
  - Standalone task handling
  - Archive path exclusion
- [x] 6.4 Manual testing checklist:
  - [x] Create a parented task file manually in `workspace/tasks/`
  - [x] Run `plx get task` and verify it's found
  - [x] Run `plx complete task --id <id>` and verify completion
  - [x] Run `plx undo task --id <id>` and verify undo
  - [x] Test with multiple parent types (change, review, spec)

## Notes
Test fixtures may need significant updates. Focus on behavior correctness, not implementation details.
