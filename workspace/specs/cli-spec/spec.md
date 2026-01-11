# cli-spec Specification

## Purpose
TBD - created by archiving change add-interactive-show-command. Update Purpose after archive.
## Requirements
### Requirement: Interactive spec show

The spec show command SHALL support interactive selection when no spec-id is provided.

#### Scenario: Interactive spec selection for show

- **WHEN** executing `plx spec show` without arguments
- **THEN** display an interactive list of available specs
- **AND** allow the user to select a spec to show
- **AND** display the selected spec content
- **AND** maintain all existing show options (--json, --requirements, --no-scenarios, -r)

#### Scenario: Non-interactive fallback keeps current behavior

- **GIVEN** stdin is not a TTY or `--no-interactive` is provided or environment variable `PLX_INTERACTIVE=0`
- **WHEN** executing `plx spec show` without a spec-id
- **THEN** do not prompt interactively
- **AND** print the existing error message for missing spec-id
- **AND** set non-zero exit code

### Requirement: Spec Command

The system SHALL provide a `spec` command with subcommands for displaying, listing, and validating specifications.

#### Scenario: Show spec as JSON

- **WHEN** executing `plx spec show init --json`
- **THEN** parse the markdown spec file
- **AND** extract headings and content hierarchically
- **AND** output valid JSON to stdout

#### Scenario: List all specs

- **WHEN** executing `plx spec list`
- **THEN** scan the workspace/specs directory
- **AND** return list of all available capabilities
- **AND** support JSON output with `--json` flag

#### Scenario: Filter spec content

- **WHEN** executing `plx spec show init --requirements`
- **THEN** display only requirement names and SHALL statements
- **AND** exclude scenario content

#### Scenario: Validate spec structure

- **WHEN** executing `plx spec validate init`
- **THEN** parse the spec file
- **AND** validate against Zod schema
- **AND** report any structural issues

### Requirement: JSON Schema Definition

The system SHALL define Zod schemas that accurately represent the spec structure for runtime validation.

#### Scenario: Schema validation

- **WHEN** parsing a spec into JSON
- **THEN** validate the structure using Zod schemas
- **AND** ensure all required fields are present
- **AND** provide clear error messages for validation failures

### Requirement: Interactive spec validation

The spec validate command SHALL support interactive selection when no spec-id is provided.

#### Scenario: Interactive spec selection for validation

- **WHEN** executing `plx spec validate` without arguments
- **THEN** display an interactive list of available specs
- **AND** allow the user to select a spec to validate
- **AND** validate the selected spec
- **AND** maintain all existing validation options (--strict, --json)

#### Scenario: Non-interactive fallback keeps current behavior

- **GIVEN** stdin is not a TTY or `--no-interactive` is provided or environment variable `PLX_INTERACTIVE=0`
- **WHEN** executing `plx spec validate` without a spec-id
- **THEN** do not prompt interactively
- **AND** print the existing error message for missing spec-id
- **AND** set non-zero exit code

### Requirement: Parent Command Deprecation

The spec parent command SHALL emit deprecation warnings directing users to the standardized alternatives.

#### Scenario: Deprecation warning on spec show

- **WHEN** `plx spec show <id>` is executed
- **THEN** emit warning to stderr: "Deprecation: 'plx spec show' is deprecated. Use 'plx get spec --id <id>' instead."
- **AND** continue with normal show operation

#### Scenario: Deprecation warning on spec list

- **WHEN** `plx spec list` is executed
- **THEN** emit warning to stderr: "Deprecation: 'plx spec list' is deprecated. Use 'plx get specs' instead."
- **AND** continue with normal list operation

#### Scenario: Deprecation warning on spec validate

- **WHEN** `plx spec validate <id>` is executed
- **THEN** emit warning to stderr: "Deprecation: 'plx spec validate' is deprecated. Use 'plx validate spec --id <id>' instead."
- **AND** continue with normal validate operation

#### Scenario: Suppressing deprecation warnings

- **WHEN** `plx spec show <id> --no-deprecation-warnings` is executed
- **THEN** do not emit deprecation warning
- **AND** continue with normal operation

#### Scenario: JSON output unaffected

- **WHEN** `plx spec show <id> --json` is executed
- **THEN** deprecation warning goes to stderr
- **AND** JSON output goes to stdout
- **AND** JSON remains valid

