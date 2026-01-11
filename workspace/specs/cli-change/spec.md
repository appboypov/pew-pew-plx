# cli-change Specification

## Purpose
TBD - created by archiving change add-change-commands. Update Purpose after archive.
## Requirements
### Requirement: Change Command

The system SHALL provide a `change` command with subcommands for displaying, listing, and validating change proposals.

#### Scenario: Show change as JSON

- **WHEN** executing `plx change show update-error --json`
- **THEN** parse the markdown change file
- **AND** extract change structure and deltas
- **AND** output valid JSON to stdout

#### Scenario: List all changes

- **WHEN** executing `plx change list`
- **THEN** scan the workspace/changes directory
- **AND** return list of all pending changes
- **AND** support JSON output with `--json` flag

#### Scenario: Show only requirement changes

- **WHEN** executing `plx change show update-error --requirements-only`
- **THEN** display only the requirement changes (ADDED/MODIFIED/REMOVED/RENAMED)
- **AND** exclude why and what changes sections

#### Scenario: Validate change structure

- **WHEN** executing `plx change validate update-error`
- **THEN** parse the change file
- **AND** validate against Zod schema
- **AND** ensure deltas are well-formed

### Requirement: Legacy Compatibility

The system SHALL maintain backward compatibility with the existing `list` command while showing deprecation notices.

#### Scenario: Legacy list command

- **WHEN** executing `plx list`
- **THEN** display current list of changes (existing behavior)
- **AND** show deprecation notice: "Note: 'plx list' is deprecated. Use 'plx change list' instead."

#### Scenario: Legacy list with --all flag

- **WHEN** executing `plx list --all`
- **THEN** display all changes (existing behavior)
- **AND** show same deprecation notice

### Requirement: Interactive show selection

The change show command SHALL support interactive selection when no change name is provided.

#### Scenario: Interactive change selection for show

- **WHEN** executing `plx change show` without arguments
- **THEN** display an interactive list of available changes
- **AND** allow the user to select a change to show
- **AND** display the selected change content
- **AND** maintain all existing show options (--json, --deltas-only)

#### Scenario: Non-interactive fallback keeps current behavior

- **GIVEN** stdin is not a TTY or `--no-interactive` is provided or environment variable `PLX_INTERACTIVE=0`
- **WHEN** executing `plx change show` without a change name
- **THEN** do not prompt interactively
- **AND** print the existing hint including available change IDs
- **AND** set `process.exitCode = 1`

### Requirement: Interactive validation selection

The change validate command SHALL support interactive selection when no change name is provided.

#### Scenario: Interactive change selection for validation

- **WHEN** executing `plx change validate` without arguments
- **THEN** display an interactive list of available changes
- **AND** allow the user to select a change to validate
- **AND** validate the selected change

#### Scenario: Non-interactive fallback keeps current behavior

- **GIVEN** stdin is not a TTY or `--no-interactive` is provided or environment variable `PLX_INTERACTIVE=0`
- **WHEN** executing `plx change validate` without a change name
- **THEN** do not prompt interactively
- **AND** print the existing hint including available change IDs
- **AND** set `process.exitCode = 1`

### Requirement: Parent Command Deprecation

The change parent command SHALL emit deprecation warnings directing users to the standardized alternatives.

#### Scenario: Deprecation warning on change show

- **WHEN** `plx change show <id>` is executed
- **THEN** emit warning to stderr: "Deprecation: 'plx change show' is deprecated. Use 'plx get change --id <id>' instead."
- **AND** continue with normal show operation

#### Scenario: Deprecation warning on change list

- **WHEN** `plx change list` is executed
- **THEN** emit warning to stderr: "Deprecation: 'plx change list' is deprecated. Use 'plx get changes' instead."
- **AND** continue with normal list operation

#### Scenario: Deprecation warning on change validate

- **WHEN** `plx change validate <id>` is executed
- **THEN** emit warning to stderr: "Deprecation: 'plx change validate' is deprecated. Use 'plx validate change --id <id>' instead."
- **AND** continue with normal validate operation

#### Scenario: Suppressing deprecation warnings

- **WHEN** `plx change show <id> --no-deprecation-warnings` is executed
- **THEN** do not emit deprecation warning
- **AND** continue with normal operation

#### Scenario: JSON output unaffected

- **WHEN** `plx change show <id> --json` is executed
- **THEN** deprecation warning goes to stderr
- **AND** JSON output goes to stdout
- **AND** JSON remains valid

