# Change: Rebrand Display Name from "PLX" to "Pew Pew Plx"

## Why

The recent openspec-to-plx rebrand established "PLX" as the technical identifier. Now we need a friendlier, more distinctive display name for user-facing text. "Pew Pew Plx" provides brand personality while keeping "plx" as the concise CLI command.

## What Changes

- Update user-facing display names from "PLX" to "Pew Pew Plx"
- Update CLI command descriptions
- Update dashboard title
- Update agent instruction templates
- Update slash command display names
- Update documentation (README.md, CLAUDE.md)
- Update user prompts and success messages

## Non-Changes (Preserved As-Is)

- CLI command: `plx` (stays lowercase)
- Binary name: `bin/plx.js`
- Package.json bin entry: `"plx"`
- Markers: `<!-- PLX:START -->` / `<!-- PLX:END -->`
- Internal constants: `PLX_DIR_NAME`, `PLX_MARKERS`, etc.
- Environment variables: `PLX_CONCURRENCY`
- Directory structure: `workspace/`, `.plx/`
- File paths: `.claude/commands/plx/`

## Impact

- Affected specs: None (display name only, no behavior changes)
- Affected code: User-facing strings in CLI, templates, and documentation
- Breaking changes: None
- Migration: None required

## Constraints

1. CLI command references in documentation must stay as `plx` (the command)
2. Markers and constants are technical identifiers - do not change
3. Slash command filenames stay as `plx-*.md` (only display names change)
4. Tests must pass after all changes
