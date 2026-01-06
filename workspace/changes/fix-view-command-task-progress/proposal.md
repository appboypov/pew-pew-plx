# Change: Fix view command task progress calculation

## Why

The `plx view` command displays incorrect change status because it uses legacy task discovery (`getTaskProgressForChange`) which looks for tasks in `{changeDir}/tasks/` or `{changeDir}/tasks.md`. Since the centralized task storage migration (tasks now stored in `workspace/tasks/` with `parent-id` frontmatter linking), `plx view` reports all changes as "completed" when they have no tasks in the legacy location.

Additionally, `plx view` scans all directories under `workspace/changes/` without filtering for `proposal.md`, causing non-change directories (like folders with only `request.md`) to appear as completed changes.

## What Changes

- Update `ViewCommand` to use centralized task discovery via `EntityListingService.listChanges()` or equivalent logic using `discoverTasks` and `filterTasksByParent` from `centralized-task-discovery.ts`
- Filter change directories to only include those with `proposal.md` (matching behavior of `getActiveChangeIds`)
- Align task progress calculation with `plx get changes` which correctly uses centralized storage

## Impact

- Affected specs: `cli-view`
- Affected code:
  - `src/core/view.ts` - Replace `getTaskProgressForChange` with centralized task discovery
  - Potentially import and use `EntityListingService` or directly use centralized task discovery utilities
