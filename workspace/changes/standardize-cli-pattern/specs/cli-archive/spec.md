## ADDED Requirements

### Requirement: Entity Subcommands

The archive command SHALL support entity subcommands for explicit type specification.

#### Scenario: Archive specific change

- **WHEN** `plx archive change --id <id>` is executed
- **THEN** archive the specified change
- **AND** follow existing archive process (task check, spec updates, move to archive)

#### Scenario: Archive specific review

- **WHEN** `plx archive review --id <id>` is executed
- **THEN** archive the specified review
- **AND** follow existing review archive process

#### Scenario: Archive change with options

- **WHEN** `plx archive change --id <id> --yes` is executed
- **THEN** skip confirmation prompts
- **AND** proceed with archive

#### Scenario: Archive change skipping specs

- **WHEN** `plx archive change --id <id> --skip-specs` is executed
- **THEN** skip spec update phase
- **AND** proceed with archive

#### Scenario: Change not found via subcommand

- **WHEN** `plx archive change --id nonexistent` is executed
- **AND** no change matches the ID
- **THEN** display error: "Change 'nonexistent' not found"
- **AND** exit with non-zero status

#### Scenario: Review not found via subcommand

- **WHEN** `plx archive review --id nonexistent` is executed
- **AND** no review matches the ID
- **THEN** display error: "Review 'nonexistent' not found"
- **AND** exit with non-zero status

#### Scenario: Interactive selection with subcommand

- **WHEN** `plx archive change` is executed without `--id`
- **THEN** display interactive list of available changes
- **AND** allow user to select one to archive

### Requirement: Legacy Command Deprecation

The archive command SHALL emit deprecation warnings for legacy syntax.

#### Scenario: Deprecation warning on positional argument

- **WHEN** `plx archive <id>` is executed (without subcommand)
- **THEN** emit warning to stderr: "Deprecation: 'plx archive <id>' is deprecated. Use 'plx archive <type> --id <id>' instead."
- **AND** continue with normal archive operation

#### Scenario: Deprecation warning on --type flag

- **WHEN** `plx archive <id> --type review` is executed
- **THEN** emit warning to stderr: "Deprecation: '--type' flag is deprecated. Use 'plx archive review --id <id>' instead."
- **AND** continue with normal archive operation

#### Scenario: Suppressing deprecation warnings

- **WHEN** `plx archive <id> --no-deprecation-warnings` is executed
- **THEN** do not emit deprecation warning
- **AND** continue with normal archive operation
