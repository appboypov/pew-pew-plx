---
status: done
skill-level: medior
parent-type: change
parent-id: add-typed-template-based-tasks
type: implementation
blocked-by: [044-add-typed-template-based-tasks-update-task-frontmatter-parsing]
---

# Task: ⚙️ Update get task command to display type and blocked-by

## End Goal

`splx get task` command displays task type badge and blocked-by dependencies in output.

## Currently

- `splx get task` shows: status, skill-level, parent info
- No display of task type
- No display of blocking dependencies

## Should

- Task output includes type badge (e.g., `[implementation]`, `[components]`)
- Task output shows blocked-by section when dependencies exist
- `splx get tasks` table includes Type column
- JSON output includes `type` and `blockedBy` fields

## Constraints

- [ ] Type badge styled with appropriate color (match skill-level badges)
- [ ] Blocked-by shows as list of task IDs
- [ ] Advisory warning if blocked-by tasks are not complete
- [ ] JSON output structured consistently with existing fields

## Acceptance Criteria

- [ ] `splx get task` shows type badge in header
- [ ] `splx get task` shows blocked-by list when present
- [ ] `splx get tasks` table has Type column
- [ ] JSON output includes type and blockedBy fields
- [ ] Blocked-by warning shown when blocking tasks not done

## Implementation Checklist

- [x] Update `src/commands/get.ts` task display to show type badge
- [x] Add blocked-by section to task detail output
- [x] Update tasks table to include Type column
- [x] Add type and blockedBy to JSON output structure
- [x] Add advisory warning logic for incomplete blockers
- [x] Style type badge with chalk colors
- [x] Add tests for new display elements

## Notes

Display example:
```
# Task: ⚙️ Implement auth service [implementation] [medior]
Status: in-progress
Blocked by: 043-implement-template-discovery (done), 044-update-parsing (to-do)
⚠️ Warning: This task has incomplete blockers
```
