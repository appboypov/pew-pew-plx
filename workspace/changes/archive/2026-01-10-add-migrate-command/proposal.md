# Change: Add migrate tasks command

## Why

The centralized task storage refactor (PLX-44) introduces a new task storage structure where all tasks live in `workspace/tasks/` with parent linking via frontmatter. Existing projects have tasks nested in `workspace/changes/<name>/tasks/` and `workspace/reviews/<name>/tasks/`. A migration command is needed to move existing tasks to the new centralized location with proper filename and frontmatter updates.

## What Changes

- **BREAKING**: Add `plx migrate tasks` command that:
  - Scans `workspace/changes/*/tasks/` for existing task files
  - Scans `workspace/reviews/*/tasks/` for existing task files
  - Moves each task file to `workspace/tasks/`
  - Renames files to include parent-id: `NNN-<parent-id>-<name>.md`
  - Adds frontmatter fields: `parent-type` and `parent-id`
  - Reports migration results (files moved, errors encountered)
- No dual-structure support after migration (breaking change)

## Impact

- Affected specs: New `cli-migrate` capability
- Affected code: `src/commands/migrate.ts` (new), `src/cli/index.ts` (register command)
- Dependencies: Requires `centralize-task-storage` change to be implemented first (defines target structure)
