---
status: done
skill-level: senior
---

# Task: Update Task Discovery Logic

## End Goal
Task discovery scans `workspace/tasks/` instead of nested directories, with support for parent filtering.

## Currently
- `ItemRetrievalService.getTaskById()` scans `changes/*/tasks/` and `reviews/*/tasks/`
- `ItemRetrievalService.getAllOpenTasks()` aggregates from nested directories
- `ItemRetrievalService.getTasksForChange()` only looks in specific change's tasks folder

## Should
- `ItemRetrievalService.getTaskById()` scans centralized `workspace/tasks/`
- `ItemRetrievalService.getAllOpenTasks()` scans `workspace/tasks/` directly
- `ItemRetrievalService.getTasksForParent(parentId, parentType?)` filters by frontmatter
- Discovery excludes `workspace/tasks/archive/`
- Multi-workspace: each workspace's `tasks/` folder is discovered independently

## Constraints
- [ ] Must handle both parented and standalone tasks
- [ ] Must support filtering by parent-id only (searches all parent types)
- [ ] Must error on parent-id conflict across multiple parent types
- [ ] Must exclude archived tasks from active queries

## Acceptance Criteria
- [ ] `getTaskById()` finds tasks in centralized location
- [ ] `getAllOpenTasks()` returns all non-done tasks from `workspace/tasks/`
- [ ] `getTasksForParent()` filters correctly by parent linkage
- [ ] Parent-type filtering is optional (searches all if omitted)
- [ ] Archived tasks are excluded from discovery

## Implementation Checklist
- [x] 2.1 Create `src/utils/centralized-task-discovery.ts`:
  - `discoverTasks(workspacePath)` returns all task files
  - `filterTasksByParent(tasks, parentId, parentType?)` filters by frontmatter
  - `getTasksDir(workspacePath)` returns absolute path to tasks/
  - `getTasksArchiveDir(workspacePath)` returns path to tasks/archive/
- [x] 2.2 Update `src/services/item-retrieval.ts`:
  - Refactor `getTaskById()` to use centralized discovery
  - Add `getTasksForParent(parentId, parentType?)` method
  - Update `getAllOpenTasks()` to use centralized discovery
- [x] 2.3 Update `src/utils/item-discovery.ts`:
  - Add functions for task discovery in centralized location
  - Handle multi-workspace task aggregation
- [x] 2.4 Update task discovery in `src/commands/get.ts`:
  - Use new centralized discovery functions
  - Handle `--parent-id` and `--parent-type` filtering (assumes standardize-cli-pattern done)
- [x] 2.5 Add integration tests for centralized task discovery

## Notes
This task depends on task 001 for filename parsing utilities.
