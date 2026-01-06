---
status: done
parent-type: change
parent-id: fix-review-task-retrieval
---
# Task: Add Review Task Support to ItemRetrievalService

## End Goal

`ItemRetrievalService` searches both `workspace/changes` and `workspace/reviews` for task retrieval, enabling `plx get tasks --id <review-id>` and `plx get task --id <review-id>/<task-id>` to work with reviews.

## Currently

`ItemRetrievalService` only searches `workspace/changes`:
- `getTaskById()` uses `getActiveChangeIds()` only
- `getTasksForChange()` only searches `changesPath`
- `getAllOpenTasks()` only iterates through changes
- No `reviewsPath` property exists

## Should

`ItemRetrievalService` searches both changes and reviews:
- Add `reviewsPath` property to constructor
- `getTaskById()` searches changes first, then reviews
- `getTasksForChange()` searches changes first, then reviews
- `getAllOpenTasks()` includes review tasks in prioritization

## Constraints

- [x] Changes take precedence over reviews (search changes first)
- [x] Review tasks use `changeId` field to store `reviewId` for consistency with existing interfaces
- [x] No changes to public interface signatures

## Acceptance Criteria

- [x] `plx get tasks --id <review-id>` lists tasks from the review
- [x] `plx get task --id <review-id>/<task-id>` retrieves the specific review task
- [x] `plx get task` includes review tasks in prioritization workflow
- [x] Short task ID format (just `001-fix`) searches both changes and reviews

## Implementation Checklist

- [x] 2.1 Add import for `getActiveReviewIds` from `../utils/item-discovery.js` in `src/services/item-retrieval.ts`
- [x] 2.2 Add `private reviewsPath: string;` property declaration
- [x] 2.3 Initialize `reviewsPath` in constructor: `this.reviewsPath = path.join(root, 'workspace', 'reviews');`
- [x] 2.4 Add `findTaskInReview()` private method mirroring `findTaskInChange()`
- [x] 2.5 Extend `getTaskById()` to search reviews after changes when not found
- [x] 2.6 Extend `getTasksForChange()` to search `reviewsPath` if not found in `changesPath`
- [x] 2.7 Extend `getAllOpenTasks()` to iterate through reviews using `getActiveReviewIds()`

## Notes

Reviews have identical task structure to changes: `workspace/reviews/<review-id>/tasks/NNN-name.md` with same frontmatter format.
