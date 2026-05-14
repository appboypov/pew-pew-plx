## ADDED Requirements

### Requirement: Entity Subcommands

The validate command SHALL support entity subcommands with singular/plural distinction.

#### Scenario: Validate specific change

- **WHEN** `splx validate change --id <id>` is executed
- **THEN** validate the specified change
- **AND** display validation results

#### Scenario: Validate all changes

- **WHEN** `splx validate changes` is executed
- **THEN** validate all changes in workspace/changes/ (excluding archive)
- **AND** display results for each change
- **AND** show summary statistics

#### Scenario: Validate specific spec

- **WHEN** `splx validate spec --id <id>` is executed
- **THEN** validate the specified spec
- **AND** display validation results

#### Scenario: Validate all specs

- **WHEN** `splx validate specs` is executed
- **THEN** validate all specs in workspace/specs/
- **AND** display results for each spec
- **AND** show summary statistics

#### Scenario: Strict validation with subcommand

- **WHEN** `splx validate change --id <id> --strict` is executed
- **THEN** apply strict validation
- **AND** treat warnings as errors

#### Scenario: JSON output with subcommand

- **WHEN** `splx validate changes --json` is executed
- **THEN** output validation results as JSON
- **AND** include detailed issues for each item

### Requirement: Legacy Command Deprecation

The validate command SHALL emit deprecation warnings for legacy syntax.

#### Scenario: Deprecation warning on positional argument

- **WHEN** `splx validate <item>` is executed (without subcommand)
- **THEN** emit warning to stderr: "Deprecation: 'splx validate <item>' is deprecated. Use 'splx validate <type> --id <item>' instead."
- **AND** continue with normal validation

#### Scenario: Deprecation warning on --changes flag

- **WHEN** `splx validate --changes` is executed
- **THEN** emit warning to stderr: "Deprecation: 'splx validate --changes' is deprecated. Use 'splx validate changes' instead."
- **AND** continue with normal validation

#### Scenario: Deprecation warning on --specs flag

- **WHEN** `splx validate --specs` is executed
- **THEN** emit warning to stderr: "Deprecation: 'splx validate --specs' is deprecated. Use 'splx validate specs' instead."
- **AND** continue with normal validation

#### Scenario: Suppressing deprecation warnings

- **WHEN** `splx validate --changes --no-deprecation-warnings` is executed
- **THEN** do not emit deprecation warning
- **AND** continue with normal validation
