# Task: Implement actionable change filtering

## End Goal

`getPrioritizedChange()` filters out non-actionable changes before prioritization so `plx act next` only returns changes with incomplete checkboxes.

## Currently

`getPrioritizedChange()` in `src/utils/change-prioritization.ts` collects all changes and sorts by completion percentage (highest first), causing 100% complete changes to be selected before incomplete ones.

## Should

`getPrioritizedChange()` filters out changes where:
- `total == 0` (no checkboxes at all)
- `completed == total` (all checkboxes complete)

Only changes with `total > 0 && completed < total` are considered.

## Constraints

- [ ] Must preserve existing sorting logic (highest completion %, then oldest creation date)
- [ ] Must return `null` when no actionable changes exist (not when all changes are complete)
- [ ] Must not break existing JSON/text output formats in `act.ts`

## Acceptance Criteria

- [ ] Running `plx act next` skips changes with all checkboxes complete
- [ ] Running `plx act next` skips changes with zero checkboxes
- [ ] Returns actionable change with highest completion percentage
- [ ] Returns `null` / "No active changes" when no actionable changes exist

## Implementation Checklist

- [x] 1.1 Modify `getPrioritizedChange()` in `src/utils/change-prioritization.ts` to filter changes after collection
- [x] 1.2 Add filter condition: `total > 0 && completed < total`
- [x] 1.3 Apply filter before sorting, return `null` if filtered list is empty
- [x] 1.4 Run `npm run typecheck` to verify no type errors
- [x] 1.5 Run `npm run build` to verify successful build

## Notes

Key code location: `src/utils/change-prioritization.ts:107-148`

The filtering should happen after line 133 (after the for loop) and before line 139 (before sorting). The filtered array should be used for sorting instead of the original `changes` array.
