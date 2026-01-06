## ADDED Requirements

### Requirement: Deprecation Warning

The show command SHALL emit deprecation warnings directing users to the new `plx get` equivalents.

#### Scenario: Deprecation warning on show

- **WHEN** `plx show <item>` is executed
- **THEN** emit warning to stderr: "Deprecation: 'plx show' is deprecated. Use 'plx get <type> --id <item>' instead."
- **AND** continue with normal show operation

#### Scenario: Deprecation warning with type detection

- **WHEN** `plx show my-change` is executed
- **AND** `my-change` is detected as a change
- **THEN** emit warning: "Deprecation: 'plx show' is deprecated. Use 'plx get change --id my-change' instead."

#### Scenario: Suppressing deprecation warnings

- **WHEN** `plx show <item> --no-deprecation-warnings` is executed
- **THEN** do not emit deprecation warning
- **AND** continue with normal show operation

#### Scenario: JSON output unaffected by deprecation

- **WHEN** `plx show <item> --json` is executed
- **THEN** deprecation warning goes to stderr
- **AND** JSON output goes to stdout
- **AND** JSON remains valid and parseable
