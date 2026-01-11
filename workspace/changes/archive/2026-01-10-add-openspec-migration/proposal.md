# Change: Add OpenSpec to PLX Migration

## Why

Projects created with the original OpenSpec CLI have `openspec/` directories and `<!-- OPENSPEC:START/END -->` markers. When these users upgrade to the PLX CLI and run `plx update` or `plx init`, the CLI should automatically detect and migrate legacy structures to the new PLX format.

## What Changes

- Add automatic migration of `openspec/` directory to `workspace/`
- Add automatic migration of `<!-- OPENSPEC:START/END -->` markers to `<!-- PLX:START/END -->`
- Add automatic migration of `~/.openspec/` global config to `~/.plx/`
- Migration runs silently if no OpenSpec artifacts detected
- Migration logs results when changes are made

## Non-Changes

- No user confirmation required (automatic migration)
- No changes to existing PLX-native projects
- No changes to marker-based update system

## Impact

- Affected specs: `cli-update`, `cli-init`
- Affected code: `src/core/update.ts`, `src/core/init.ts`, new `src/utils/openspec-migration.ts`
- Breaking changes: None (backward compatible)
- Migration: Automatic, transparent to user

## Constraints

1. Migration must merge `openspec/` contents into `workspace/` when both exist (files from openspec/ moved, then openspec/ deleted)
2. Migration must handle partial states gracefully
3. Silent operation when no OpenSpec artifacts found
4. Log clear messages when migration occurs
