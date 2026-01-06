---
status: done
skill-level: medior
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
- [ ] Must maintain backward compatibility with change-based prioritization
- [ ] Must handle standalone tasks (no parent linkage)
- [ ] Must work with multi-workspace task aggregation

## Acceptance Criteria
- [ ] Prioritization calculates completion per parent entity
- [ ] All parent types (change, review, spec) are considered
- [ ] Standalone tasks appear after parented tasks
- [ ] `plx get task` returns expected next task based on prioritization

## Implementation Checklist
- [ ] 3.1 Refactor `src/utils/change-prioritization.ts`:
  - Rename to `parent-prioritization.ts` (update imports)
  - Add `getPrioritizedParent(tasks)` function
  - Calculate completion per unique parent-id
  - Handle standalone tasks (group separately)
- [ ] 3.2 Update priority calculation:
  - Group tasks by parent-id
  - Calculate done/total per parent
  - Sort by completion percentage (highest first), then creation date
- [ ] 3.3 Update `src/commands/get.ts`:
  - Use new prioritization for `get task` without filters
  - Retrieve tasks for prioritized parent
- [ ] 3.4 Add unit tests for parent-based prioritization

## Notes
Standalone task handling may be refined in future proposals. Current behavior: standalone tasks sorted by filename, shown after parented tasks.
