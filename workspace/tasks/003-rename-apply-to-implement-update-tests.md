---
status: done
parent-type: change
parent-id: rename-apply-to-implement
---
# Update Tests

## End Goal

All tests pass with the renamed `implement` command.

## Currently

`test/core/init.test.ts` contains 50+ references to `apply` in:
- File path assertions (e.g., `.claude/commands/plx/apply.md`)
- Variable names (e.g., `applyPath`, `applyContent`, `wsApply`)
- Content assertions (e.g., `'name: Pew Pew Plx: Apply'`, `'id: plx-apply'`)

`test/utils/file-system.test.ts` has 2 references in path examples.

## Should

- All path assertions use `implement` instead of `apply`
- All variable names use `implement` instead of `apply`
- All content assertions check for `Implement` instead of `Apply`

## Constraints

- Test behavior remains the same, only names/paths change
- Preserve test structure and assertions

## Acceptance Criteria

- [x] All tests in `test/core/init.test.ts` updated
- [x] All tests in `test/utils/file-system.test.ts` updated
- [x] `pnpm test` passes

## Implementation Checklist

- [x] Update `test/core/init.test.ts`: rename `wsApply` → `wsImplement` variable
- [x] Update `test/core/init.test.ts`: rename `agApply` → `agImplement` variable
- [x] Update `test/core/init.test.ts`: rename `claudeApply` → `claudeImplement` variable
- [x] Update `test/core/init.test.ts`: rename `cursorApply` → `cursorImplement` variable
- [x] Update `test/core/init.test.ts`: rename `geminiApply` → `geminiImplement` variable
- [x] Update `test/core/init.test.ts`: rename `iflowApply` → `iflowImplement` variable
- [x] Update `test/core/init.test.ts`: rename `openCodeApply` → `openCodeImplement` variable
- [x] Update `test/core/init.test.ts`: rename `applyPath` → `implementPath` variable (multiple occurrences)
- [x] Update `test/core/init.test.ts`: rename `applyContent` → `implementContent` variable (multiple occurrences)
- [x] Update `test/core/init.test.ts`: rename `clineApply` → `clineImplement` variable
- [x] Update `test/core/init.test.ts`: rename `factoryApply` → `factoryImplement` variable
- [x] Update `test/core/init.test.ts`: update all file path strings from `*apply*` to `*implement*`
- [x] Update `test/core/init.test.ts`: update content assertions from `Apply` to `Implement`
- [x] Update `test/utils/file-system.test.ts`: update path examples from `plx-apply.md` to `plx-implement.md`
- [x] Run `pnpm test` to verify all tests pass

## Notes

Use search and replace with care - some paths are tool-specific (e.g., `.toml` vs `.md`).
