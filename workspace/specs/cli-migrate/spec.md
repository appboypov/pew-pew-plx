# cli-migrate Specification

## Purpose
TBD - created by archiving change add-migrate-command. Update Purpose after archive.
## Requirements
### Requirement: Migrate Command

The CLI SHALL provide a `migrate` command with subcommands for different migration operations.

#### Scenario: Help displays available migrations

- **WHEN** user runs `splx migrate --help`
- **THEN** the system displays available migration subcommands
- **AND** includes description for each migration type

### Requirement: Migrate Tasks Subcommand
The CLI SHALL provide a `migrate tasks` subcommand that moves task files to their canonical storage locations based on parent type.

#### Scenario: Rehoming centralized change tasks
- **WHEN** user runs `splx migrate tasks`
- **AND** tasks exist in `workspace/tasks/` with `parent-type: change`
- **THEN** each task file is moved to `workspace/changes/<parent-id>/tasks/`
- **AND** filename is transformed to `NNN-<task-name>.md`
- **AND** original file is removed
- **AND** empty source directories are cleaned up

#### Scenario: Basic task migration from reviews
- **WHEN** user runs `splx migrate tasks`
- **AND** tasks exist in `workspace/reviews/<name>/tasks/`
- **THEN** each task file is moved to `workspace/tasks/`
- **AND** filename is transformed to `NNN-<parent-id>-<task-name>.md`
- **AND** frontmatter `parent-type: review` is added
- **AND** frontmatter `parent-id: <name>` is added
- **AND** original file is removed
- **AND** empty source directories are cleaned up

#### Scenario: No tasks to migrate
- **WHEN** user runs `splx migrate tasks`
- **AND** no tasks exist in non-canonical locations
- **THEN** the system displays "No tasks found to migrate"
- **AND** exits with success status

#### Scenario: Target directory creation
- **WHEN** user runs `splx migrate tasks`
- **AND** required target directories do not exist
- **THEN** create `workspace/tasks/` and any needed `workspace/changes/<id>/tasks/` directories before migration

### Requirement: Dry Run Mode

The CLI SHALL support a `--dry-run` flag that previews migration without executing changes.

#### Scenario: Dry run shows planned changes

- **WHEN** user runs `splx migrate tasks --dry-run`
- **AND** tasks exist to migrate
- **THEN** the system displays each file that would be moved
- **AND** displays source and destination paths
- **AND** no files are actually moved
- **AND** no directories are created or deleted

#### Scenario: Dry run with no tasks

- **WHEN** user runs `splx migrate tasks --dry-run`
- **AND** no tasks exist to migrate
- **THEN** the system displays "No tasks found to migrate"

### Requirement: JSON Output

The CLI SHALL support a `--json` flag for machine-readable migration results.

#### Scenario: JSON output structure

- **WHEN** user runs `splx migrate tasks --json`
- **THEN** the output is valid JSON containing:
  - `totalFound`: number of task files found
  - `migrated`: array of migration results with source, destination, parentType, parentId
  - `skipped`: array of skipped files with reason
  - `errors`: array of errors with file and message
  - `success`: boolean overall status

#### Scenario: JSON output with dry-run

- **WHEN** user runs `splx migrate tasks --dry-run --json`
- **THEN** the output is valid JSON
- **AND** `dryRun: true` is included in the output
- **AND** migration results show planned (not executed) changes

### Requirement: Migration Report

The CLI SHALL display a summary report after migration completes.

#### Scenario: Successful migration report

- **WHEN** user runs `splx migrate tasks`
- **AND** migration completes successfully
- **THEN** the system displays:
  - Total tasks found
  - Tasks migrated count
  - Tasks skipped count (if any)
  - Errors encountered (if any)

#### Scenario: Migration with errors report

- **WHEN** user runs `splx migrate tasks`
- **AND** some files fail to migrate
- **THEN** the system displays error details for each failed file
- **AND** continues with remaining files
- **AND** exits with non-zero status

### Requirement: File Collision Handling

The CLI SHALL handle filename collisions in the target directory.

#### Scenario: Collision detected

- **WHEN** user runs `splx migrate tasks`
- **AND** a target filename already exists in `workspace/tasks/`
- **THEN** the file is skipped
- **AND** the collision is reported in the summary
- **AND** original file is preserved

### Requirement: Multi-Workspace Support

The CLI SHALL support migration in multi-workspace environments.

#### Scenario: Multi-workspace migration

- **WHEN** user runs `splx migrate tasks`
- **AND** multiple workspaces are discovered
- **THEN** each workspace is migrated independently
- **AND** tasks are moved to each workspace's `tasks/` directory
- **AND** report shows results per workspace

#### Scenario: Workspace filter

- **WHEN** user runs `splx migrate tasks --workspace project-a`
- **THEN** only the specified workspace is migrated

### Requirement: Shell Completion Support

The CLI SHALL include `migrate` command in shell completion registry.

#### Scenario: Migrate command completions

- **WHEN** user types `splx migrate <TAB>`
- **THEN** completions include: tasks

#### Scenario: Migrate tasks flag completions

- **WHEN** user types `splx migrate tasks --<TAB>`
- **THEN** completions include: dry-run, json, workspace

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

