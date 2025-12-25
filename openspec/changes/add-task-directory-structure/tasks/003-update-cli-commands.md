# Task: Update CLI commands to use tasks directory

## End Goal

All CLI commands work with the tasks/ directory structure, triggering migration when needed and displaying aggregate progress.

## Currently

CLI commands (`list`, `archive`, `show`, `validate`) read from single `tasks.md` file using `getTaskProgressForChange()`. They do not support directory-based task files.

## Should

- `list` command shows aggregate progress from tasks/ directory
- `archive` command moves entire tasks/ directory to archive location
- `show` command displays task file list from tasks/ directory
- `validate` command validates each task file individually
- All commands trigger migration when legacy `tasks.md` detected
- All commands use new `getTaskStructureForChange()` for task info
- Existing tests pass after modifications

## Constraints

- [ ] Maintain existing CLI interface and output format where possible
- [ ] Progress display format remains consistent (e.g., "3/5 tasks")
- [ ] Archive maintains date-prefixed naming convention
- [ ] Migration must happen before any task-related operation

## Acceptance Criteria

- [ ] `list` shows aggregate progress from tasks/ directory
- [ ] `archive` moves entire tasks/ directory to archive
- [ ] `show` lists task files from tasks/ directory
- [ ] `validate` validates each task file
- [ ] All commands trigger migration when legacy tasks.md detected
- [ ] Existing tests pass after modifications

## Implementation Checklist

- [x] Update `src/core/list.ts` to use `getTaskStructureForChange()`
- [x] Update `src/core/list.ts` to trigger migration via `migrateIfNeeded()`
- [x] Update `src/core/archive.ts` to move tasks/ directory
- [x] Update `src/core/archive.ts` to trigger migration
- [x] Update `src/commands/show.ts` to display task file list
- [x] Update `src/commands/show.ts` to trigger migration
- [x] Update `src/commands/validate.ts` for task file validation
- [x] Update `src/commands/validate.ts` to trigger migration
- [x] Update `src/commands/change.ts` if it has task-related code
- [x] Run existing tests and fix any failures

## Notes

Complexity: 4

Depends on sub-issues 1 (task progress) and 2 (migration) being complete.
