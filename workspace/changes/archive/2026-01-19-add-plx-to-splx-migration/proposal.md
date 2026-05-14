# Change: Add PLX to SPLX Migration Command

## Why
Users with existing projects initialized with the old `plx` naming convention need a way to migrate to the new `splx` naming. Manual migration is error-prone and tedious, especially with multiple AI tool integrations.

## What Changes
- Add `splx migrate plx-to-splx` subcommand to handle the rename
- Detect and rename `.claude/commands/plx/` to `.claude/commands/splx/`
- Detect and rename `plx-*.md` files to `splx-*.md` in other AI tool directories
- Update command references inside files from `plx` to `splx`
- Update CLAUDE.md and other instruction files to reference `splx`
- Support `--dry-run` to preview changes without executing
- Support `--json` for machine-readable output

## Impact
- Affected specs: cli-migrate (add new subcommand)
- Affected code:
  - `src/commands/migrate.ts` - add plx-to-splx subcommand
  - `src/utils/plx-to-splx-migration.ts` - migration logic
  - `src/core/completions/command-registry.ts` - add completion
