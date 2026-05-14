## ADDED Requirements

### Requirement: Deprecation Warning

The show command SHALL emit deprecation warnings directing users to the new `splx get` equivalents.

#### Scenario: Deprecation warning on show

- **WHEN** `splx show <item>` is executed
- **THEN** emit warning to stderr: "Deprecation: 'splx show' is deprecated. Use 'splx get <type> --id <item>' instead."
- **AND** continue with normal show operation

#### Scenario: Deprecation warning with type detection

- **WHEN** `splx show my-change` is executed
- **AND** `my-change` is detected as a change
- **THEN** emit warning: "Deprecation: 'splx show' is deprecated. Use 'splx get change --id my-change' instead."

#### Scenario: Suppressing deprecation warnings

- **WHEN** `splx show <item> --no-deprecation-warnings` is executed
- **THEN** do not emit deprecation warning
- **AND** continue with normal show operation

#### Scenario: JSON output unaffected by deprecation

- **WHEN** `splx show <item> --json` is executed
- **THEN** deprecation warning goes to stderr
- **AND** JSON output goes to stdout
- **AND** JSON remains valid and parseable
