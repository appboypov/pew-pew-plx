## ADDED Requirements

### Requirement: Migrate PLX to SPLX Subcommand

The CLI SHALL provide a `migrate plx-to-splx` subcommand that renames old `plx` artifacts to `splx`.

#### Scenario: Basic migration for Claude Code

- **WHEN** user runs `splx migrate plx-to-splx`
- **AND** `.claude/commands/plx/` directory exists
- **THEN** the directory is renamed to `.claude/commands/splx/`
- **AND** internal command references are updated from `plx` to `splx`
- **AND** file frontmatter tags are updated from `plx` to `splx`

#### Scenario: Migration for other AI tools

- **WHEN** user runs `splx migrate plx-to-splx`
- **AND** files matching `plx-*.md` exist in AI tool directories
- **THEN** files are renamed to `splx-*.md`
- **AND** internal command references are updated from `plx` to `splx`

#### Scenario: Update CLAUDE.md references

- **WHEN** user runs `splx migrate plx-to-splx`
- **AND** CLAUDE.md contains references to `plx` commands
- **THEN** references are updated to `splx` equivalents

#### Scenario: No PLX artifacts found

- **WHEN** user runs `splx migrate plx-to-splx`
- **AND** no `plx` artifacts exist in the project
- **THEN** the system displays "No PLX artifacts found to migrate"
- **AND** exits with success status

### Requirement: PLX Migration Dry Run

The CLI SHALL support a `--dry-run` flag for the plx-to-splx migration.

#### Scenario: Dry run shows planned renames

- **WHEN** user runs `splx migrate plx-to-splx --dry-run`
- **AND** `plx` artifacts exist
- **THEN** the system displays each file/directory that would be renamed
- **AND** displays content changes that would be made
- **AND** no files are actually modified

### Requirement: PLX Migration JSON Output

The CLI SHALL support a `--json` flag for plx-to-splx migration results.

#### Scenario: JSON output structure

- **WHEN** user runs `splx migrate plx-to-splx --json`
- **THEN** the output is valid JSON containing:
  - `success`: boolean overall status
  - `workspaces`: array of workspace results, each containing:
    - `path`: workspace path
    - `directories`: array of renamed directories with from/to/tool
    - `files`: array of renamed files with from/to/tool
    - `contentUpdates`: array of files with content changes and replacement count
    - `skipped`: array of skipped items with path and reason
    - `errors`: array of errors with path and message
  - `summary`: object containing:
    - `totalDirectories`: count of renamed directories
    - `totalFiles`: count of renamed files
    - `totalContentUpdates`: count of updated files
    - `totalSkipped`: count of skipped items
    - `totalErrors`: count of errors
    - `byTool`: per-tool breakdown of directories and files

### Requirement: PLX Migration Report

The CLI SHALL display a summary report after plx-to-splx migration completes.

#### Scenario: Successful migration report

- **WHEN** user runs `splx migrate plx-to-splx`
- **AND** migration completes successfully
- **THEN** the system displays:
  - Directories renamed count
  - Files renamed count
  - Files updated count
  - Errors encountered (if any)

### Requirement: PLX Migration AI Tool Detection

The CLI SHALL detect and migrate all configured AI tool directories.

#### Scenario: Multi-tool migration

- **WHEN** user runs `splx migrate plx-to-splx`
- **AND** multiple AI tools have `plx` artifacts (Claude, Cursor, Cline, etc.)
- **THEN** all tool directories are migrated
- **AND** report shows results per tool

#### Scenario: Supported tool directories

- **WHEN** user runs `splx migrate plx-to-splx`
- **THEN** the following directories are checked:
  - `.claude/commands/plx/`
  - `.cursor/commands/` (for `plx-*.md` files)
  - `.amazonq/prompts/` (for `plx-*.md` files)
  - `.augment/commands/` (for `plx-*.md` files)
  - `.clinerules/workflows/` (for `plx-*.md` files)
  - `.codebuddy/prompts/` (for `plx-*.md` files)
  - `.agent/workflows/` (for `plx-*.md` files)
