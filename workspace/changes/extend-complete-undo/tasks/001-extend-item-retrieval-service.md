---
status: done
skill-level: medior
---

# Task: Extend ItemRetrievalService with review and spec task retrieval

## End Goal

The `ItemRetrievalService` provides methods to retrieve reviews by ID and to get tasks linked to specs, enabling the complete/undo commands to operate on these entity types.

## Currently

- `ItemRetrievalService` has `getChangeById()` and `getTasksForChange()` methods
- Reviews are discovered via `getActiveReviewIdsMulti()` in item-discovery.ts but there is no `getReviewById()` method
- Specs are retrieved via `getSpecById()` but there is no `getTasksForSpec()` method
- Tasks for changes and reviews are retrieved via `getTasksForChange()` which searches both paths

## Should

- Add `getReviewById(reviewId: string)` method that returns review metadata (similar pattern to `getChangeById()`)
- Add `getTasksForSpec(specId: string)` method that queries the centralized task storage for tasks with `parent-type: spec` and matching `parent-id`
- Add `getTasksForReview(reviewId: string)` method that retrieves tasks from the review's tasks directory (similar to existing change pattern)

## Constraints

- [x] Methods must support multi-workspace prefixed IDs (e.g., `projectName/reviewId`)
- [x] Methods must return null/empty array when entity not found (no exceptions)
- [x] Pattern must match existing service architecture

## Acceptance Criteria

- [x] `getReviewById()` returns review content and workspace context or null
- [x] `getTasksForSpec()` returns tasks linked to the spec via centralized storage
- [x] `getTasksForReview()` returns tasks from the review's tasks directory
- [x] All methods support both prefixed and unprefixed IDs
- [x] TypeScript interfaces exported for return types

## Implementation Checklist

- [x] 1.1 Add `ReviewWithWorkspace` interface to item-retrieval.ts
- [x] 1.2 Implement `getReviewById()` method following `getChangeById()` pattern
- [x] 1.3 Add `getTasksForReview()` method (alias/refactor of existing review task retrieval)
- [x] 1.4 Implement `getTasksForSpec()` method querying centralized task storage
- [x] 1.5 Add unit tests for new methods

## Notes

This task depends on the centralized task storage being implemented (Proposal 4). The `getTasksForSpec()` method specifically requires the new storage structure where tasks have `parent-type` and `parent-id` frontmatter fields.
