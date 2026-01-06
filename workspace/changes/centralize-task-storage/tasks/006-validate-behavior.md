---
status: done
skill-level: medior
---

# Task: Validate Behavior

## End Goal
All behavior changes are validated through automated and manual testing.

## Currently
Tests exist for the old nested task structure.

## Should
Tests validate the new centralized task structure and all associated behavior.

## Constraints
- [ ] All existing tests must pass (may need updates for new structure)
- [ ] New tests must cover centralized storage scenarios
- [ ] Edge cases for parent filtering must be tested

## Acceptance Criteria
- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] Manual testing confirms expected CLI behavior
- [ ] Edge cases verified: standalone tasks, missing parents, multi-workspace

## Implementation Checklist
- [ ] 6.1 Run `pnpm test` and fix any failing tests
- [ ] 6.2 Update existing tests that assume nested structure:
  - Test fixtures use `workspace/tasks/` instead of nested
  - Test helpers create centralized task files
- [ ] 6.3 Add tests for new functionality:
  - Parent filtering with `--parent-id`
  - Standalone task handling
  - Archive path exclusion
- [ ] 6.4 Manual testing checklist:
  - [ ] Create a parented task file manually in `workspace/tasks/`
  - [ ] Run `plx get task` and verify it's found
  - [ ] Run `plx complete task --id <id>` and verify completion
  - [ ] Run `plx undo task --id <id>` and verify undo
  - [ ] Test with multiple parent types (change, review, spec)

## Notes
Test fixtures may need significant updates. Focus on behavior correctness, not implementation details.
