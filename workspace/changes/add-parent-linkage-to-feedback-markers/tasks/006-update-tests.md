---
status: done
---

# Task: Update tests

## End Goal
Update all tests to use new marker format and verify new functionality.

## Currently
- Tests use old `(spec:id)` format
- No tests for grouping logic
- No tests for multi-review generation

## Should
- Tests use new `{type}:{id} |` format
- Tests cover `groupMarkersByParent()` logic
- Tests cover multi-review generation and unassigned marker handling

## Constraints
- [x] Tests must cover all three parent types (task, change, spec)
- [x] Tests must cover markers with and without parent linkage
- [x] Tests must cover single and multiple parent group scenarios

## Acceptance Criteria
- [x] `comment-markers.test.ts` updated for new regex and interfaces
- [x] `feedback-scanner.test.ts` updated for new interface and grouping
- [x] `parse-feedback.test.ts` updated for multi-review and unassigned handling
- [x] `review.schema.test.ts` updated to remove specImpact tests
- [x] All tests pass

## Implementation Checklist
- [x] Update `test/utils/comment-markers.test.ts`
- [x] Update `test/services/feedback-scanner.test.ts`
- [x] Update `test/commands/parse-feedback.test.ts`
- [x] Update `test/core/schemas/review.schema.test.ts`
- [x] Run tests and verify all pass

## Notes
Files:
- `test/utils/comment-markers.test.ts`
- `test/services/feedback-scanner.test.ts`
- `test/commands/parse-feedback.test.ts`
- `test/core/schemas/review.schema.test.ts`
