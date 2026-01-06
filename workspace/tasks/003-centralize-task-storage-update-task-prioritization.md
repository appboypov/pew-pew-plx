---
status: done
skill-level: medior
parent-type: change
parent-id: centralize-task-storage
---
# Task: Update Task Prioritization Logic

## End Goal
Task prioritization considers parent entity completion status using frontmatter linkage.

## Currently
- `getPrioritizedChange()` in `src/utils/change-prioritization.ts` selects highest-completion change
- Tasks are retrieved from nested `changes/<name>/tasks/` based on selected change
- Prioritization does not consider reviews or specs

## Should
- Task prioritization supports all parent types (change, review, spec)
- Completion percentage calculated per parent entity
- `plx get task` without filters returns next task from highest-priority parent
- Standalone tasks are deprioritized (no parent = lower priority)

## Constraints
- [x] Must maintain backward compatibility with change-based prioritization
- [x] Must handle standalone tasks (no parent linkage)
- [x] Must work with multi-workspace task aggregation

## Acceptance Criteria
- [x] Prioritization calculates completion per parent entity
- [x] All parent types (change, review, spec) are considered
- [x] Standalone tasks appear after parented tasks
- [x] `plx get task` returns expected next task based on prioritization

## Implementation Checklist
- [x] 3.1 Refactor `src/utils/change-prioritization.ts`:
  - Rename to `parent-prioritization.ts` (update imports)
  - Add `getPrioritizedParent(tasks)` function
  - Calculate completion per unique parent-id
  - Handle standalone tasks (group separately)
- [x] 3.2 Update priority calculation:
  - Group tasks by parent-id
  - Calculate done/total per parent
  - Sort by completion percentage (highest first), then creation date
- [x] 3.3 Update `src/commands/get.ts`:
  - Use new prioritization for `get task` without filters
  - Retrieve tasks for prioritized parent
- [x] 3.4 Add unit tests for parent-based prioritization

## Notes
Standalone task handling may be refined in future proposals. Current behavior: standalone tasks sorted by filename, shown after parented tasks.
