## ADDED Requirements

### Requirement: Deprecation Warning

The list command SHALL emit deprecation warnings directing users to the new `splx get` equivalents.

#### Scenario: Deprecation warning on list

- **WHEN** `splx list` is executed
- **THEN** emit warning to stderr: "Deprecation: 'splx list' is deprecated. Use 'splx get changes' instead."
- **AND** continue with normal list operation

#### Scenario: Deprecation warning on list specs

- **WHEN** `splx list --specs` is executed
- **THEN** emit warning to stderr: "Deprecation: 'splx list --specs' is deprecated. Use 'splx get specs' instead."
- **AND** continue with normal list operation

#### Scenario: Deprecation warning on list reviews

- **WHEN** `splx list --reviews` is executed
- **THEN** emit warning to stderr: "Deprecation: 'splx list --reviews' is deprecated. Use 'splx get reviews' instead."
- **AND** continue with normal list operation

#### Scenario: Suppressing deprecation warnings

- **WHEN** `splx list --no-deprecation-warnings` is executed
- **THEN** do not emit deprecation warning
- **AND** continue with normal list operation

#### Scenario: JSON output unaffected by deprecation

- **WHEN** `splx list --json` is executed
- **THEN** deprecation warning goes to stderr
- **AND** JSON output goes to stdout
- **AND** JSON remains valid and parseable
