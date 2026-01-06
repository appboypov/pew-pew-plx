---
status: done
skill-level: medior
parent-type: change
parent-id: fix-view-command-task-progress
---

# Task: Update ViewCommand to use centralized task discovery

## End Goal

`plx view` correctly displays change progress using centralized task storage (`workspace/tasks/`) instead of legacy per-change task directories.

## Currently

`ViewCommand.getChangesData()` uses `getTaskProgressForChange()` from `task-progress.ts` which:
1. Looks for tasks in `{changeDir}/tasks/` directory
2. Falls back to `{changeDir}/tasks.md` file
3. Returns `{ total: 0, completed: 0 }` when neither exists

This causes all changes to appear as "completed" since tasks are now in `workspace/tasks/` with `parent-id` frontmatter.

## Should

`ViewCommand.getChangesData()` uses centralized task discovery:
1. Filter change directories to only those with `proposal.md` (matching `getActiveChangeIds` behavior)
2. Use `discoverTasks` and `filterTasksByParent` from `centralized-task-discovery.ts`
3. Calculate progress from matching tasks using `countTasksFromContent`
4. Display accurate progress for active vs completed changes

## Constraints

- [ ] Maintain existing visual output format (summary, active changes, completed changes, specs sections)
- [ ] Keep backward compatibility with multi-workspace support
- [ ] Do not change `task-progress.ts` (it may be used elsewhere for legacy support)

## Acceptance Criteria

- [ ] `plx view` shows changes with tasks linked via `parent-id` as "active" with correct progress
- [ ] Changes without `proposal.md` are excluded from display
- [ ] Changes with all tasks done show as "completed"
- [ ] Changes with 0 linked tasks show as "completed" (matches current intended behavior)
- [ ] Multi-workspace mode continues to work correctly

## Implementation Checklist

- [x] 1.1 Import centralized task discovery utilities in `view.ts`
- [x] 1.2 Update `getChangesData()` to filter directories requiring `proposal.md`
- [x] 1.3 Replace `getTaskProgressForChange` with centralized task discovery logic
- [x] 1.4 Calculate task progress using `countTasksFromContent` on filtered tasks
- [x] 1.5 Update TypeScript types if needed for new imports

## Notes

Reference implementations:
- `EntityListingService.getTaskProgressFromCentralized()` in `src/services/entity-listing.ts:93-111`
- `getActiveChangeIds()` in `src/utils/item-discovery.ts:26-45` for proposal.md filtering logic
