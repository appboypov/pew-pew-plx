## ADDED Requirements

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
