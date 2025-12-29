---
status: done
---

# Task: Update feedback-scanner.ts

## End Goal
Update FeedbackMarker interface to use parent linkage, add grouping logic, and update review generation to remove specImpact.

## Currently
- `FeedbackMarker` has `specImpact: string | null`
- No grouping logic exists
- `generateTaskContent` writes `spec-impact` frontmatter field

## Should
- `FeedbackMarker` has `parentType: 'task' | 'change' | 'spec' | null` and `parentId: string | null`
- `groupMarkersByParent()` method groups markers by parent and separates unassigned
- `generateTaskContent` no longer writes `spec-impact` frontmatter field

## Constraints
- [x] Grouping must preserve marker order within each group
- [x] Generated task files must have valid status field

## Acceptance Criteria
- [x] `FeedbackMarker` interface uses `parentType`/`parentId` instead of `specImpact`
- [x] `scanFile` populates `parentType`/`parentId` from parsed marker
- [x] `groupMarkersByParent()` returns `{ assigned: GroupedMarkers[], unassigned: FeedbackMarker[] }`
- [x] `generateTaskContent` no longer includes `spec-impact` in frontmatter

## Implementation Checklist
- [x] Update `FeedbackMarker` interface
- [x] Add `GroupedMarkers` and `MarkerGroups` types
- [x] Add `groupMarkersByParent()` method
- [x] Update `scanFile()` to use new `parseFeedbackMarker` return shape
- [x] Update `generateTaskContent()` to remove `spec-impact` field
- [x] Update `generateReviewContent()` to remove spec impact findings section

## Notes
File: `src/services/feedback-scanner.ts`
