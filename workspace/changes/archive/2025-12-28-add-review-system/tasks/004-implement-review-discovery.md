---
status: done
---

# Task: Implement Review Discovery

## End Goal

Functions to discover active and archived reviews, following the same pattern as change and spec discovery.

## Currently

`item-discovery.ts` has `getActiveChangeIds()`, `getArchivedChangeIds()`, `getSpecIds()`. No review discovery exists.

## Should

Add to `/src/utils/item-discovery.ts`:
- `getActiveReviewIds(root?)`: Scan `workspace/reviews/` excluding archive
- `getArchivedReviewIds(root?)`: Scan `workspace/reviews/archive/`

Both should look for directories containing `review.md`.

## Constraints

- Must follow existing discovery patterns in item-discovery.ts
- Must exclude hidden directories
- Must exclude archive/ subdirectory for active reviews
- Must return sorted arrays

## Acceptance Criteria

- [ ] getActiveReviewIds() returns review IDs from workspace/reviews/
- [ ] getActiveReviewIds() excludes archive/ subdirectory
- [ ] getActiveReviewIds() only includes directories with review.md
- [ ] getArchivedReviewIds() returns review IDs from workspace/reviews/archive/
- [ ] Both functions return sorted arrays
- [ ] Both functions handle missing directories gracefully

## Implementation Checklist

- [x] Add getActiveReviewIds(root?) function to item-discovery.ts
- [x] Add getArchivedReviewIds(root?) function to item-discovery.ts
- [x] Export both functions
- [x] Test with existing reviews
- [x] Test with empty reviews directory
- [x] Test with missing reviews directory

## Notes

Pattern to follow from existing code:
```typescript
export async function getActiveChangeIds(root: string = process.cwd()): Promise<string[]> {
  const changesDir = path.join(root, WORKSPACE_DIR_NAME, 'changes');
  // ... scan and filter
}
```
