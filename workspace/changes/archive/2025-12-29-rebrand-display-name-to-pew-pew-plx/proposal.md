# Change: Rebrand Display Name from "PLX" to "OpenSplx"

## Why

The recent openspec-to-splx rebrand established "PLX" as the technical identifier. Now we need a friendlier, more distinctive display name for user-facing text. "OpenSplx" provides brand personality while keeping "splx" as the concise CLI command.

## What Changes

- Update user-facing display names from "PLX" to "OpenSplx"
- Update CLI command descriptions
- Update dashboard title
- Update agent instruction templates
- Update slash command display names
- Update documentation (README.md, CLAUDE.md)
- Update user prompts and success messages

## Non-Changes (Preserved As-Is)

- CLI command: `splx` (stays lowercase)
- Binary name: `bin/splx.js`
- Package.json bin entry: `"splx"`
- Markers: `<!-- PLX:START -->` / `<!-- PLX:END -->`
- Internal constants: `PLX_DIR_NAME`, `PLX_MARKERS`, etc.
- Environment variables: `PLX_CONCURRENCY`
- Directory structure: `workspace/`, `.splx/`
- File paths: `.claude/commands/splx/`

## Impact

- Affected specs: None (display name only, no behavior changes)
- Affected code: User-facing strings in CLI, templates, and documentation
- Breaking changes: None
- Migration: None required

## Constraints

1. CLI command references in documentation must stay as `splx` (the command)
2. Markers and constants are technical identifiers - do not change
3. Slash command filenames stay as `splx-*.md` (only display names change)
4. Tests must pass after all changes
