---
status: done
skill-level: medior
parent-type: change
parent-id: add-migrate-command
---
# Task: Implement migrate tasks command

## End Goal

A working `plx migrate tasks` command that moves all existing nested tasks from `workspace/changes/*/tasks/` and `workspace/reviews/*/tasks/` to the centralized `workspace/tasks/` location with proper filename and frontmatter updates.

## Currently

- Tasks are stored in nested folders: `workspace/changes/<name>/tasks/` and `workspace/reviews/<name>/tasks/`
- Task filenames follow format: `NNN-<name>.md` (e.g., `001-implement.md`)
- Task frontmatter contains `status` and optional `skill-level` fields
- No migration tooling exists for the nested-to-centralized transition

## Should

- New `migrate` command registered in CLI under `src/commands/migrate.ts`
- `plx migrate tasks` subcommand implemented
- Command scans both `workspace/changes/*/tasks/` and `workspace/reviews/*/tasks/`
- For each task file found:
  - Reads current content
  - Extracts parent-id from directory name (e.g., `add-feature` from `changes/add-feature/tasks/`)
  - Determines parent-type from path (`change` or `review`)
  - Generates new filename: `NNN-<parent-id>-<name>.md`
  - Adds `parent-type` and `parent-id` to frontmatter
  - Writes file to `workspace/tasks/`
  - Removes original file
- Command reports migration results with counts and any errors
- Multi-workspace support: operates on each discovered workspace separately

## Constraints

- [ ] Must not overwrite existing files in `workspace/tasks/` without explicit confirmation
- [ ] Must preserve all original task content (only add frontmatter, no modifications)
- [ ] Must handle filename collisions gracefully (different parents can have `001-implement.md`)
- [ ] Must create `workspace/tasks/` directory if it does not exist
- [ ] Must clean up empty `tasks/` directories after migration
- [ ] Must support `--dry-run` flag to preview changes without executing
- [ ] Must support `--json` flag for machine-readable output
- [ ] Must follow existing command patterns in codebase

## Acceptance Criteria

- [ ] `plx migrate tasks` successfully moves all nested tasks to centralized location
- [ ] Migrated files have correct new filename format: `NNN-<parent-id>-<name>.md`
- [ ] Migrated files have `parent-type` and `parent-id` in frontmatter
- [ ] Original task files are removed after successful migration
- [ ] Empty source `tasks/` directories are cleaned up
- [ ] Migration report shows: total found, migrated, skipped, errors
- [ ] `--dry-run` shows what would happen without making changes
- [ ] `--json` outputs structured migration results
- [ ] Multi-workspace: each workspace migrates independently
- [ ] Command exits with non-zero status on errors

## Implementation Checklist

- [x] 1.1 Create `src/commands/migrate.ts` with command skeleton
- [x] 1.2 Register `migrate` command in `src/cli/index.ts`
- [x] 1.3 Add `tasks` subcommand to migrate command
- [x] 1.4 Implement workspace discovery and scanning logic
- [x] 1.5 Implement task file scanning in `changes/*/tasks/` directories
- [x] 1.6 Implement task file scanning in `reviews/*/tasks/` directories
- [x] 1.7 Implement filename transformation: `NNN-<name>.md` -> `NNN-<parent-id>-<name>.md`
- [x] 1.8 Implement frontmatter injection (add `parent-type`, `parent-id`)
- [x] 1.9 Implement file move operation with collision detection
- [x] 1.10 Implement empty directory cleanup
- [x] 1.11 Add `--dry-run` flag implementation
- [x] 1.12 Add `--json` flag implementation
- [x] 1.13 Add migration summary output (terminal and JSON)
- [x] 1.14 Add error handling and reporting

## Notes

- This command assumes the `centralize-task-storage` change has been implemented first, defining the target structure
- The existing `src/utils/task-migration.ts` handles legacy `tasks.md` to `tasks/` folder migration - this is a different migration path
- Parent-id is derived from the directory name, not file content
- Numbering is preserved from original files (no renumbering)
