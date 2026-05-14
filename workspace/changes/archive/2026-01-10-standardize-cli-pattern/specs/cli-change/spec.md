## ADDED Requirements

### Requirement: Parent Command Deprecation

The change parent command SHALL emit deprecation warnings directing users to the standardized alternatives.

#### Scenario: Deprecation warning on change show

- **WHEN** `splx change show <id>` is executed
- **THEN** emit warning to stderr: "Deprecation: 'splx change show' is deprecated. Use 'splx get change --id <id>' instead."
- **AND** continue with normal show operation

#### Scenario: Deprecation warning on change list

- **WHEN** `splx change list` is executed
- **THEN** emit warning to stderr: "Deprecation: 'splx change list' is deprecated. Use 'splx get changes' instead."
- **AND** continue with normal list operation

#### Scenario: Deprecation warning on change validate

- **WHEN** `splx change validate <id>` is executed
- **THEN** emit warning to stderr: "Deprecation: 'splx change validate' is deprecated. Use 'splx validate change --id <id>' instead."
- **AND** continue with normal validate operation

#### Scenario: Suppressing deprecation warnings

- **WHEN** `splx change show <id> --no-deprecation-warnings` is executed
- **THEN** do not emit deprecation warning
- **AND** continue with normal operation

#### Scenario: JSON output unaffected

- **WHEN** `splx change show <id> --json` is executed
- **THEN** deprecation warning goes to stderr
- **AND** JSON output goes to stdout
- **AND** JSON remains valid
