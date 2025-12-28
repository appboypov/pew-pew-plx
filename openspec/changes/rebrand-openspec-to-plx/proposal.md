# Change: Rebrand OpenSpec to PLX across codebase and documentation

## Why

OpenSplx is a fork that needs a distinct identity to coexist with the original OpenSpec. Currently, the codebase mixes "OpenSpec" and "PLX" terminology, with both CLI commands available. Users expect `plx` to be the sole command, with all directories and documentation using PLX terminology.

## What Changes

- **BREAKING**: Remove `openspec` CLI command entirely - only `plx` command remains
- **BREAKING**: Rename project directory from `openspec/` to `workspace/`
- **BREAKING**: Change markers from `<!-- OPENSPEC:START -->` to `<!-- PLX:START -->`
- **BREAKING**: Rename global config directory from `~/.openspec/` to `~/.plx/`
- **BREAKING**: Rename environment variable from `OPENSPEC_CONCURRENCY` to `PLX_CONCURRENCY`
- Update all internal constants, variables, and imports
- Update all templates and agent instructions
- Update all slash commands to use PLX terminology
- Update all documentation (README.md, AGENTS.md, etc.)
- Update all test fixtures and expectations
- Rename `openspec-conventions` spec to `plx-conventions`

## Impact

- Affected specs: `plx-conventions` (renamed from `openspec-conventions`)
- Affected code: All source files, templates, tests, and configuration files
- Breaking changes: Users must use `plx` command instead of `openspec`
- Migration: Existing `openspec/` directories in user projects will need manual rename to `workspace/`

## Constraints

1. CHANGELOG.md is left unchanged (historical record)
2. docs/artifact_poc.md is left unchanged (POC document)
3. Tests must pass after all changes
4. bin/openspec.js is removed entirely - no backward compatibility alias
5. Archive files ARE updated with PLX terminology (full rebrand)
