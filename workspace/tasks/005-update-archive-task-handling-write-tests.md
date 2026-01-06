---
status: done
skill-level: medior
parent-type: change
parent-id: update-archive-task-handling
---
# Task: Write Tests

## End Goal

Test coverage for archive task handling with centralized storage, covering task discovery, move operations, completion checking, and output.

## Currently

Archive tests cover:
- Nested task directory archiving
- Legacy `tasks.md` auto-migration
- Spec updates and confirmation

## Should

Archive tests cover:
- Task discovery by frontmatter parent-type and parent-id
- Moving tasks to `workspace/tasks/archive/`
- Filename preservation and duplicate handling
- Completion check using frontmatter status
- Output messaging for archived tasks

## Constraints

- [ ] Use existing test patterns from `test/core/archive.test.ts`
- [ ] Use test utilities from `test/test-utils.ts`
- [ ] Cover edge cases (no tasks, all complete, some incomplete)
- [ ] Do not test migration (separate concern)

## Acceptance Criteria

- [ ] Tests for task discovery with matching frontmatter
- [ ] Tests for task archive move operation
- [ ] Tests for duplicate filename handling
- [ ] Tests for completion check with frontmatter status
- [ ] Tests for output with and without tasks
- [ ] All tests pass

## Implementation Checklist

- [x] 5.1 Add test fixtures for centralized task storage
- [x] 5.2 Write tests for task discovery by parent
- [x] 5.3 Write tests for task archive move
- [x] 5.4 Write tests for duplicate filename handling
- [x] 5.5 Write tests for completion check updates
- [x] 5.6 Write tests for output messaging
- [x] 5.7 Run full test suite and verify pass

## Notes

Create test fixtures in `test/fixtures/` with sample tasks in centralized storage format.
