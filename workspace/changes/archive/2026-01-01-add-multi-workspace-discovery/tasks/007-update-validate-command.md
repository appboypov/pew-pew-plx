---
status: to-do
---

# Task: Update validate command for multi-workspace

## End Goal
The `plx validate` command in `src/commands/validate.ts` discovers and validates items from all workspaces, respecting the --workspace filter.

## Currently
Command only looks at single workspace for --all, --changes, --specs flags.

## Should
Update command to:
- Discover workspaces for bulk validation modes
- Apply --workspace filter if provided
- Aggregate items from filtered workspaces for --all, --changes, --specs
- Handle prefixed item names for direct validation
- Display workspace prefix in output for multi-workspace

## Constraints
- [ ] Single workspace behavior unchanged
- [ ] Bulk validation aggregates across workspaces
- [ ] Direct validation supports `projectName/itemName` format
- [ ] JSON output includes workspace context

## Acceptance Criteria
- [ ] `plx validate --all` validates all workspaces
- [ ] `plx validate --changes` validates changes from all workspaces
- [ ] `plx validate --specs` validates specs from all workspaces
- [ ] `plx validate --workspace project-a --all` validates only project-a
- [ ] `plx validate project-a/add-feature` validates specific item

## Implementation Checklist
- [ ] 7.1 Import workspace discovery utilities
- [ ] 7.2 Import workspace filter helper
- [ ] 7.3 Discover workspaces in runBulkValidation
- [ ] 7.4 Apply workspace filter to discovered workspaces
- [ ] 7.5 Aggregate change and spec IDs from all workspaces
- [ ] 7.6 Update progress and output to show workspace prefix
- [ ] 7.7 Update validateDirectItem to handle prefixed names
- [ ] 7.8 Update JSON output to include workspace context

## Notes
Depends on tasks 001, 002, and 004.
