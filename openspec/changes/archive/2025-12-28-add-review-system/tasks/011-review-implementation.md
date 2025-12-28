---
status: done
---

# Task: Review Implementation

## End Goal

Verify all implementation tasks are complete and working correctly.

## Currently

N/A - this is the review task.

## Should

Review all implemented code:
1. Comment markers utility
2. REVIEW.md template
3. Review schema
4. Review discovery
5. Feedback scanner service
6. Parse feedback command
7. Review command
8. List reviews mode
9. Review archiving
10. Slash command templates

## Constraints

- Must verify all acceptance criteria from previous tasks
- Must check for edge cases
- Must verify CLI help text is correct

## Acceptance Criteria

- [x] All comment styles parse correctly
- [x] REVIEW.md is created during init/update
- [x] Review schema validates correctly
- [x] Review discovery finds active and archived reviews
- [x] Feedback scanner respects .gitignore
- [x] Parse feedback command creates valid reviews
- [x] Review command shows correct output
- [x] List --reviews works
- [x] Review archiving applies spec deltas
- [x] All slash commands generate correctly

## Implementation Checklist

- [x] Test comment-markers with all file types
- [x] Test init creates REVIEW.md
- [x] Test update creates REVIEW.md if missing
- [x] Test review schema validation
- [x] Test getActiveReviewIds()
- [x] Test getArchivedReviewIds()
- [x] Test feedback scanning
- [x] Test parse feedback command
- [x] Test review list command
- [x] Test review show command
- [x] Test list --reviews
- [x] Test archive review
- [x] Test archive review with spec deltas
- [x] Test all new slash commands

## Notes

Run manual testing:
```bash
# Test init/update
plx init ./test-project
plx update ./test-project

# Test parse feedback
plx parse feedback test-review

# Test review commands
plx review list
plx review show test-review

# Test list
plx list --reviews

# Test archive
plx archive test-review
```
