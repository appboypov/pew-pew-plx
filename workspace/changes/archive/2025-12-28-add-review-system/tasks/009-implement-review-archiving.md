---
status: done
---

# Task: Implement Review Archiving

## End Goal

Extend the archive command to support archiving reviews with spec updates.

## Currently

Archive command only supports changes. No review archiving exists.

## Should

Modify `/src/core/archive.ts` to:
- Auto-detect entity type (change or review) from ID
- Support `--type change|review` flag for disambiguation
- Archive reviews following same pattern as changes
- Apply spec deltas from `reviews/<id>/specs/` if present
- Update review.md frontmatter on archive

## Constraints

- Must preserve existing change archiving behavior
- Must follow same confirmation/validation patterns
- Must update review.md frontmatter (status, archived-at, spec-updates-applied)
- Must support --skip-specs for reviews

## Acceptance Criteria

- [ ] `plx archive <review-id>` archives a review
- [ ] Auto-detects entity type from changes/ vs reviews/
- [ ] `--type review` forces review archiving
- [ ] Prompts for confirmation if incomplete tasks
- [ ] Applies spec deltas if reviews/<id>/specs/ exists
- [ ] Updates review.md: status=archived, archived-at, spec-updates-applied
- [ ] Moves to reviews/archive/YYYY-MM-DD-<id>/
- [ ] --skip-specs works for reviews

## Implementation Checklist

- [x] Add entity type detection in archive command
- [x] Add --type flag for disambiguation
- [x] Implement archiveReview() function
- [x] Check task completion in reviews/<id>/tasks/
- [x] Process spec deltas from reviews/<id>/specs/
- [x] Update review.md frontmatter
- [x] Move to archive directory
- [x] Display success message with spec update summary
- [x] Test review archiving
- [x] Test ambiguous ID handling

## Notes

Review.md frontmatter updates on archive:
```yaml
---
status: archived
archived-at: 2025-01-15T12:00:00Z
spec-updates-applied: true
---
```
