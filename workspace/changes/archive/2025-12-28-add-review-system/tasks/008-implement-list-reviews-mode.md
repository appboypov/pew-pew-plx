---
status: done
---

# Task: Implement List Reviews Mode

## End Goal

Add `--reviews` flag to `plx list` command to list active reviews alongside changes and specs.

## Currently

`plx list` supports `--changes` (default) and `--specs` flags.

## Should

Modify `/src/core/list.ts` to:
- Accept `--reviews` flag
- Scan `workspace/reviews/` for active reviews
- Display reviews with target type and task progress

## Constraints

- Must follow existing list output format
- Must not break existing --changes and --specs behavior
- Must handle empty reviews gracefully

## Acceptance Criteria

- [ ] `plx list --reviews` shows active reviews
- [ ] Output shows review name, target type, task progress
- [ ] Empty state shows "No active reviews found."
- [ ] Existing --changes and --specs continue to work

## Implementation Checklist

- [x] Add --reviews flag to list command in cli/index.ts
- [x] Modify ListCommand to handle reviews mode
- [x] Implement review listing using getActiveReviewIds()
- [x] Parse review.md for metadata (target-type)
- [x] Count tasks in reviews/<id>/tasks/
- [x] Format output similar to changes list
- [x] Test with active reviews
- [x] Test with empty reviews

## Notes

Output format:
```
Reviews:
  security-review        feedback-scan    3/5 tasks
  feature-review         change           ✓ Complete
```
