---
status: done
---

# Task: Merge Base Configurator

## End Goal
A single `SlashCommandConfigurator` base class with all 13 commands in `ALL_COMMANDS`.

## Currently
- `base.ts` has `ALL_COMMANDS` with 3 commands
- `plx-base.ts` has `ALL_PLX_COMMANDS` with 10 commands
- Different method signatures (`generateAll` has `workspaceDir` param in regular, not in PLX)

## Should
- `base.ts` has `ALL_COMMANDS` with all 13 commands
- `plx-base.ts` is deleted
- Method signature uses simplified PLX version (no `workspaceDir`)

## Constraints
- [ ] Remove unused `workspaceDir` parameter from `generateAll` and `updateExisting`
- [ ] Keep all other base class functionality intact

## Acceptance Criteria
- [ ] `ALL_COMMANDS` array contains all 13 command IDs
- [ ] `generateAll(projectPath)` signature (no workspaceDir)
- [ ] `updateExisting(projectPath)` signature (no workspaceDir)
- [ ] `plx-base.ts` is deleted

## Implementation Checklist
- [x] 2.1 Update `ALL_COMMANDS` to include all 13 commands
- [x] 2.2 Remove `_workspaceDir` parameter from `generateAll`
- [x] 2.3 Remove `_workspaceDir` parameter from `updateExisting`
- [x] 2.4 Delete `plx-base.ts`

## Notes
The `workspaceDir` parameter is prefixed with `_` indicating it's unused.
