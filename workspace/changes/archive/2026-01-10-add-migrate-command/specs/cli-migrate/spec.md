# cli-migrate Specification

## Purpose

The `migrate` command provides migration utilities for transitioning PLX workspaces between different storage structures.

## ADDED Requirements

### Requirement: Migrate Command

The CLI SHALL provide a `migrate` command with subcommands for different migration operations.

#### Scenario: Help displays available migrations

- **WHEN** user runs `plx migrate --help`
- **THEN** the system displays available migration subcommands
- **AND** includes description for each migration type

### Requirement: Migrate Tasks Subcommand

The CLI SHALL provide a `migrate tasks` subcommand that moves nested task files to centralized storage.

#### Scenario: Basic task migration from changes

- **WHEN** user runs `plx migrate tasks`
- **AND** tasks exist in `workspace/changes/<name>/tasks/`
- **THEN** each task file is moved to `workspace/tasks/`
- **AND** filename is transformed to `NNN-<parent-id>-<name>.md`
- **AND** frontmatter `parent-type: change` is added
- **AND** frontmatter `parent-id: <name>` is added
- **AND** original file is removed
- **AND** empty source directories are cleaned up

#### Scenario: Basic task migration from reviews

- **WHEN** user runs `plx migrate tasks`
- **AND** tasks exist in `workspace/reviews/<name>/tasks/`
- **THEN** each task file is moved to `workspace/tasks/`
- **AND** filename is transformed to `NNN-<parent-id>-<name>.md`
- **AND** frontmatter `parent-type: review` is added
- **AND** frontmatter `parent-id: <name>` is added
- **AND** original file is removed
- **AND** empty source directories are cleaned up

#### Scenario: No tasks to migrate

- **WHEN** user runs `plx migrate tasks`
- **AND** no tasks exist in nested locations
- **THEN** the system displays "No tasks found to migrate"
- **AND** exits with success status

#### Scenario: Target directory creation

- **WHEN** user runs `plx migrate tasks`
- **AND** `workspace/tasks/` does not exist
- **THEN** the directory is created before migration

### Requirement: Dry Run Mode

The CLI SHALL support a `--dry-run` flag that previews migration without executing changes.

#### Scenario: Dry run shows planned changes

- **WHEN** user runs `plx migrate tasks --dry-run`
- **AND** tasks exist to migrate
- **THEN** the system displays each file that would be moved
- **AND** displays source and destination paths
- **AND** no files are actually moved
- **AND** no directories are created or deleted

#### Scenario: Dry run with no tasks

- **WHEN** user runs `plx migrate tasks --dry-run`
- **AND** no tasks exist to migrate
- **THEN** the system displays "No tasks found to migrate"

### Requirement: JSON Output

The CLI SHALL support a `--json` flag for machine-readable migration results.

#### Scenario: JSON output structure

- **WHEN** user runs `plx migrate tasks --json`
- **THEN** the output is valid JSON containing:
  - `totalFound`: number of task files found
  - `migrated`: array of migration results with source, destination, parentType, parentId
  - `skipped`: array of skipped files with reason
  - `errors`: array of errors with file and message
  - `success`: boolean overall status

#### Scenario: JSON output with dry-run

- **WHEN** user runs `plx migrate tasks --dry-run --json`
- **THEN** the output is valid JSON
- **AND** `dryRun: true` is included in the output
- **AND** migration results show planned (not executed) changes

### Requirement: Migration Report

The CLI SHALL display a summary report after migration completes.

#### Scenario: Successful migration report

- **WHEN** user runs `plx migrate tasks`
- **AND** migration completes successfully
- **THEN** the system displays:
  - Total tasks found
  - Tasks migrated count
  - Tasks skipped count (if any)
  - Errors encountered (if any)

#### Scenario: Migration with errors report

- **WHEN** user runs `plx migrate tasks`
- **AND** some files fail to migrate
- **THEN** the system displays error details for each failed file
- **AND** continues with remaining files
- **AND** exits with non-zero status

### Requirement: File Collision Handling

The CLI SHALL handle filename collisions in the target directory.

#### Scenario: Collision detected

- **WHEN** user runs `plx migrate tasks`
- **AND** a target filename already exists in `workspace/tasks/`
- **THEN** the file is skipped
- **AND** the collision is reported in the summary
- **AND** original file is preserved

### Requirement: Multi-Workspace Support

The CLI SHALL support migration in multi-workspace environments.

#### Scenario: Multi-workspace migration

- **WHEN** user runs `plx migrate tasks`
- **AND** multiple workspaces are discovered
- **THEN** each workspace is migrated independently
- **AND** tasks are moved to each workspace's `tasks/` directory
- **AND** report shows results per workspace

#### Scenario: Workspace filter

- **WHEN** user runs `plx migrate tasks --workspace project-a`
- **THEN** only the specified workspace is migrated

### Requirement: Shell Completion Support

The CLI SHALL include `migrate` command in shell completion registry.

#### Scenario: Migrate command completions

- **WHEN** user types `plx migrate <TAB>`
- **THEN** completions include: tasks

#### Scenario: Migrate tasks flag completions

- **WHEN** user types `plx migrate tasks --<TAB>`
- **THEN** completions include: dry-run, json, workspace
