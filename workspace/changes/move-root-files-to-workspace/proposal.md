# Change: Move Root Files to Workspace Directory

## Why

PLX-managed template files (ARCHITECTURE.md, REVIEW.md, RELEASE.md, TESTING.md, PROGRESS.md) are currently created in the project root, mixed with user files. Moving them to `workspace/` keeps all PLX-managed files in one location, improving organization and making the PLX footprint clearer.

## What Changes

- **BREAKING**: Template files created in `workspace/` instead of project root
- `plx init` creates ARCHITECTURE.md, REVIEW.md, RELEASE.md, TESTING.md in `workspace/`
- `plx update` creates missing template files in `workspace/` and runs migration
- `plx create progress` creates PROGRESS.md in `workspace/`
- `plx transfer` creates template files in target `workspace/`
- Automatic migration moves existing root files to `workspace/` during `plx update`
- All slash command references update from `@ARCHITECTURE.md` to `@workspace/ARCHITECTURE.md` (etc.)
- Documentation updates (ARCHITECTURE.md, AGENTS.md, README.md)

## Impact

- Affected specs: cli-init, cli-update
- Affected code:
  - `src/core/init.ts` - Change file creation paths
  - `src/core/update.ts` - Add migration, change file creation paths
  - `src/commands/create.ts` - Change PROGRESS.md path
  - `src/services/transfer-service.ts` - Change template file paths
  - `src/core/templates/slash-command-templates.ts` - Update all `@` references
  - `src/core/templates/agents-template.ts` - Update ARCHITECTURE.md references
  - `src/utils/root-files-migration.ts` - New migration utility

## Migration Behavior

- Runs automatically in `plx update` after OpenSpec migration
- If file exists in root but not in workspace: move it
- If file exists in both: keep workspace version, delete root version
- If file exists only in workspace: no action needed
- Log migration results when files are migrated
- Silent if no files to migrate
