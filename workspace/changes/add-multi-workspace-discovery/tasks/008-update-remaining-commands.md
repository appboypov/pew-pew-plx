---
status: to-do
---

# Task: Update remaining commands for multi-workspace

## End Goal
All remaining commands that interact with workspace items support multi-workspace discovery and the --workspace filter.

## Currently
Commands like `change`, `view`, `review`, `paste` use hardcoded workspace paths.

## Should
Update each command:
- **ChangeCommand** (`src/commands/change.ts`): Update show/list/validate for multi-workspace
- **ViewCommand** (`src/core/view.ts`): Aggregate dashboard data from filtered workspaces
- **ReviewCommand** (`src/commands/review.ts`): Pass workspace context for document resolution
- **PasteCommand** (`src/commands/paste.ts`): Use nearest workspace (root if exists, else first child)

## Constraints
- [ ] Single workspace behavior unchanged for all commands
- [ ] Respect --workspace filter when provided
- [ ] Use consistent prefix format across all commands

## Acceptance Criteria
- [ ] `plx change show add-feature` works with prefix in multi-workspace
- [ ] `plx view` shows aggregated dashboard from all workspaces
- [ ] `plx review --change-id X` resolves across workspaces
- [ ] `plx paste request` uses appropriate workspace

## Implementation Checklist
- [ ] 8.1 Update ChangeCommand.show to handle workspace prefix
- [ ] 8.2 Update ChangeCommand.list to aggregate from workspaces
- [ ] 8.3 Update ChangeCommand.validate to aggregate from workspaces
- [ ] 8.4 Update ViewCommand to aggregate dashboard data
- [ ] 8.5 Update ReviewCommand to resolve workspace from ID
- [ ] 8.6 Update PasteCommand to select appropriate workspace
- [ ] 8.7 Ensure all commands respect --workspace filter

## Notes
Depends on tasks 001, 002, 004, and ideally 005-007 for consistency.
