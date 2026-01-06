---
status: done
parent-type: change
parent-id: unify-slash-command-systems
---
# Task: Update Consumption Points

## End Goal
`init.ts` and `update.ts` use only the unified `SlashCommandRegistry`.

## Currently
- `init.ts` calls both `SlashCommandRegistry` and `PlxSlashCommandRegistry`
- `update.ts` calls both registries with conditional PLX updates
- Both use different parameters for generateAll

## Should
- `init.ts` calls only `SlashCommandRegistry`
- `update.ts` calls only `SlashCommandRegistry`
- Single `generateAll(projectPath)` call per tool

## Constraints
- [ ] Remove all `PlxSlashCommandRegistry` imports and usages
- [ ] Simplify update logic (no conditional PLX updates)
- [ ] Update method calls to new signature (no workspaceDir)

## Acceptance Criteria
- [ ] `init.ts` has no PLX registry references
- [ ] `update.ts` has no PLX registry references
- [ ] Both files compile without errors

## Implementation Checklist
- [x] 5.1 Update `init.ts` to remove `PlxSlashCommandRegistry` import
- [x] 5.2 Update `init.ts` to remove PLX registry generateAll call
- [x] 5.3 Update `init.ts` to use new `generateAll(projectPath)` signature
- [x] 5.4 Update `update.ts` to remove `PlxSlashCommandRegistry` import
- [x] 5.5 Update `update.ts` to remove conditional PLX update logic
- [x] 5.6 Update `update.ts` to use new signature

## Notes
The PLX registry was only called after the regular registry, so removal is straightforward.
