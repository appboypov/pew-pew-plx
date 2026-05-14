## ADDED Requirements

### Requirement: Parent Command Deprecation

The spec parent command SHALL emit deprecation warnings directing users to the standardized alternatives.

#### Scenario: Deprecation warning on spec show

- **WHEN** `splx spec show <id>` is executed
- **THEN** emit warning to stderr: "Deprecation: 'splx spec show' is deprecated. Use 'splx get spec --id <id>' instead."
- **AND** continue with normal show operation

#### Scenario: Deprecation warning on spec list

- **WHEN** `splx spec list` is executed
- **THEN** emit warning to stderr: "Deprecation: 'splx spec list' is deprecated. Use 'splx get specs' instead."
- **AND** continue with normal list operation

#### Scenario: Deprecation warning on spec validate

- **WHEN** `splx spec validate <id>` is executed
- **THEN** emit warning to stderr: "Deprecation: 'splx spec validate' is deprecated. Use 'splx validate spec --id <id>' instead."
- **AND** continue with normal validate operation

#### Scenario: Suppressing deprecation warnings

- **WHEN** `splx spec show <id> --no-deprecation-warnings` is executed
- **THEN** do not emit deprecation warning
- **AND** continue with normal operation

#### Scenario: JSON output unaffected

- **WHEN** `splx spec show <id> --json` is executed
- **THEN** deprecation warning goes to stderr
- **AND** JSON output goes to stdout
- **AND** JSON remains valid
