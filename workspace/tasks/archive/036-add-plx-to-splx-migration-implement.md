---
status: done
skill-level: medior
parent-type: change
parent-id: add-plx-to-splx-migration
---

# Task: Implement PLX to SPLX migration command

## End Goal
A `splx migrate plx-to-splx` command that renames old `plx` artifacts to `splx` equivalents across all AI tool integrations.

## Currently
No migration path exists for users with projects initialized using the old `plx` naming convention.

## Should
`src/commands/migrate.ts` provides a `plx-to-splx` subcommand that:
- Renames `.claude/commands/plx/` to `.claude/commands/splx/`
- Renames `plx-*.md` files to `splx-*.md` in other AI tool directories
- Updates internal references from `plx` to `splx`
- Supports `--dry-run` and `--json` flags

## Constraints
- [x] Follow the pattern established in the existing `migrate tasks` subcommand
- [x] Handle file/directory conflicts gracefully
- [x] Preserve file permissions during rename operations
- [x] Support multi-workspace environments

## Acceptance Criteria
- [x] `splx migrate plx-to-splx` renames Claude commands directory
- [x] `splx migrate plx-to-splx` renames files in other AI tool directories
- [x] `splx migrate plx-to-splx --dry-run` shows planned changes without executing
- [x] `splx migrate plx-to-splx --json` outputs machine-readable results
- [x] Migration report shows counts of renamed directories/files

## Implementation Checklist
- [x] 1.1 Create `src/utils/plx-to-splx-migration.ts` with detection logic
- [x] 1.2 Add `detectPlxArtifacts(projectPath)` to find old naming
- [x] 1.3 Add `migratePlxToSplx(projectPath, options)` main migration function
- [x] 1.4 Implement directory rename logic for `.claude/commands/plx/`
- [x] 1.5 Implement file rename logic for `plx-*.md` patterns
- [x] 1.6 Implement content update logic for internal references
- [x] 1.7 Add `plx-to-splx` subcommand to `src/commands/migrate.ts`
- [x] 1.8 Wire up `--dry-run` and `--json` flags
- [x] 1.9 Update shell completion registry with new subcommand

## Notes
AI tool directories to check:
- `.claude/commands/plx/` → `.claude/commands/splx/`
- `.cursor/commands/plx-*.md` → `.cursor/commands/splx-*.md`
- `.amazonq/prompts/plx-*.md` → `.amazonq/prompts/splx-*.md`
- `.augment/commands/plx-*.md` → `.augment/commands/splx-*.md`
- `.clinerules/workflows/plx-*.md` → `.clinerules/workflows/splx-*.md`
- `.codebuddy/prompts/plx-*.md` → `.codebuddy/prompts/splx-*.md`
- `.agent/workflows/plx-*.md` → `.agent/workflows/splx-*.md`
