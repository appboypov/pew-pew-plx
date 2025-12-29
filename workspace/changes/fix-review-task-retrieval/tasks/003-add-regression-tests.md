---
status: done
---

# Task: Add Regression Tests

## End Goal

Comprehensive test coverage for review task retrieval and list command path resolution to prevent future regressions.

## Currently

- `test/services/item-retrieval.test.ts` has no tests for review task retrieval
- `test/core/list.test.ts` only tests with absolute paths, missing the relative path bug

## Should

- Tests verify `ItemRetrievalService` finds tasks in reviews
- Tests verify `ListCommand` handles path resolution correctly

## Constraints

- [x] Follow existing test patterns and structure
- [x] Use vitest framework and existing helper functions where applicable
- [x] Tests must be independent and not rely on external state

## Acceptance Criteria

- [x] Test: `getTaskById()` finds task by full ID (`reviewId/taskFilename`)
- [x] Test: `getTasksForChange()` returns tasks for a review
- [x] Test: `getAllOpenTasks()` includes review tasks
- [x] All new tests pass with implementation changes

## Implementation Checklist

- [x] 3.1 Add `describe('review task retrieval')` block to `test/services/item-retrieval.test.ts`
- [x] 3.2 Add helper functions `createReview()` and `createReviewTask()` for test setup
- [x] 3.3 Add `beforeEach` to create `workspace/reviews` directory
- [x] 3.4 Add test: `should find task by full ID (reviewId/taskFilename)`
- [x] 3.5 Add test: `should return tasks for review via getTasksForChange`
- [x] 3.6 Add test: `should include review tasks in getAllOpenTasks`
- [x] 3.7 Run full test suite to verify no regressions

## Notes

The test structure mirrors existing change task tests but operates on `workspace/reviews`.
