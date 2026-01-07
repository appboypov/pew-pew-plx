# Change: Add CLI self-upgrade command

## Why

Currently `plx update` only refreshes project instruction files (AGENTS.md, slash commands, etc.) but does not update the CLI binary itself. Users must manually run `npm update -g @appboypov/pew-pew-plx` to get new CLI versions. This is confusing because `plx update` sounds like it should update the CLI, and users have no built-in way to check if a newer version is available.

## What Changes

- Add `plx upgrade` command to self-update the CLI via npm/pnpm
- Add version check that compares local version against npm registry
- Display clear messaging about what's being updated (CLI vs project files)
- Support `--check` flag to only check for updates without installing

## Impact

- Affected specs: New `cli-upgrade` spec
- Affected code: `src/cli/index.ts`, new `src/core/upgrade.ts`
- No breaking changes to existing commands
