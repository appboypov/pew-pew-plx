---
status: done
parent-type: change
parent-id: add-parent-linkage-to-feedback-markers
---
# Task: Update review.schema.ts

## End Goal
Remove `specImpact` field from `ReviewTaskSchema`.

## Currently
- `ReviewTaskSchema` has `specImpact: z.union([z.literal('none'), z.string()]).default('none')`

## Should
- `ReviewTaskSchema` only has `status` field

## Constraints
- [x] Must not break existing review task parsing for tasks that may still have spec-impact field (graceful ignore)

## Acceptance Criteria
- [x] `ReviewTaskSchema` no longer includes `specImpact` field
- [x] `ReviewTask` type no longer includes `specImpact`

## Implementation Checklist
- [x] Remove `specImpact` from `ReviewTaskSchema`
- [x] Verify no other code depends on `ReviewTask.specImpact`

## Notes
File: `src/core/schemas/review.schema.ts`
