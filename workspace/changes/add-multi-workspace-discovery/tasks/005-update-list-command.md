---
status: to-do
---

# Task: Update list command for multi-workspace

## End Goal
The `plx list` command in `src/core/list.ts` discovers and aggregates items from all workspaces, respecting the --workspace filter.

## Currently
Command only looks at `{resolvedPath}/workspace/changes/` or `/specs/` or `/reviews/`.

## Should
Update command to:
- Discover workspaces at start using `discoverWorkspaces`
- Apply --workspace filter if provided
- Aggregate changes/specs/reviews from filtered workspaces
- Display items with `projectName/` prefix in multi-workspace mode
- Sort by projectName, then by item name

## Constraints
- [ ] Single workspace output format unchanged (backward compatible)
- [ ] Root workspace items show without prefix in single-workspace mode
- [ ] Multi-workspace sorts: root first, then alphabetically by projectName

## Acceptance Criteria
- [ ] `plx list` from monorepo shows all workspace changes
- [ ] `plx list --specs` aggregates specs from all workspaces
- [ ] `plx list --reviews` aggregates reviews from all workspaces
- [ ] `plx list --workspace X` shows only X workspace items
- [ ] Single-workspace project has identical output to before

## Implementation Checklist
- [ ] 5.1 Import workspace discovery utilities
- [ ] 5.2 Import workspace filter helper
- [ ] 5.3 Discover workspaces at start of execute method
- [ ] 5.4 Apply workspace filter to discovered workspaces
- [ ] 5.5 Update changes mode to aggregate from all workspaces
- [ ] 5.6 Update specs mode to aggregate from all workspaces
- [ ] 5.7 Update reviews mode to aggregate from all workspaces
- [ ] 5.8 Update display logic to show workspace prefix when multi
- [ ] 5.9 Update sorting to include projectName as primary key

## Notes
Depends on tasks 001, 002, and 004.
