# Task: Implement auto-migration from tasks.md to tasks directory

## End Goal

Legacy changes with `tasks.md` are automatically migrated to `tasks/001-tasks.md` on first CLI access. User sees an info message when migration occurs.

## Currently

No migration mechanism exists. Changes with `tasks.md` would not work with the new task directory structure without manual intervention.

## Should

- `migrateIfNeeded()` checks if migration is required
- Migration triggered when `tasks.md` exists but `tasks/` directory doesn't
- Content moved to `tasks/001-tasks.md` preserving checkbox states exactly
- Original `tasks.md` deleted after successful migration
- Info message displayed: "Migrated tasks.md → tasks/001-tasks.md"
- Orphan `tasks.md` cleaned up if `tasks/` directory already exists with valid files
- Returns `MigrationResult` with migration details or null if no migration needed

## Constraints

- [ ] Must preserve all content including checkbox states
- [ ] Must be idempotent - running multiple times has same effect
- [ ] Must handle edge cases (missing files, permissions)
- [ ] Migration happens transparently before any task-related operation

## Acceptance Criteria

- [ ] Migration triggered when tasks.md exists but tasks/ directory doesn't
- [ ] Content moved to tasks/001-tasks.md preserving checkbox states
- [ ] Original tasks.md deleted after migration
- [ ] Info message displayed: "Migrated tasks.md → tasks/001-tasks.md"
- [ ] Orphan tasks.md cleaned up if tasks/ already exists

## Implementation Checklist

- [x] Create `src/utils/task-migration.ts`
- [x] Define `MigrationResult` interface
- [x] Implement `migrateIfNeeded()` function
- [x] Implement `migrate()` function for forced migration
- [x] Add logic to check for orphan tasks.md and clean up
- [x] Add info message output on migration
- [x] Add unit tests for migration scenarios

## Notes

Complexity: 2

Depends on sub-issue 1 (task progress) being complete.
