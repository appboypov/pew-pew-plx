## ADDED Requirements

### Requirement: Deprecation Warning

The list command SHALL emit deprecation warnings directing users to the new `plx get` equivalents.

#### Scenario: Deprecation warning on list

- **WHEN** `plx list` is executed
- **THEN** emit warning to stderr: "Deprecation: 'plx list' is deprecated. Use 'plx get changes' instead."
- **AND** continue with normal list operation

#### Scenario: Deprecation warning on list specs

- **WHEN** `plx list --specs` is executed
- **THEN** emit warning to stderr: "Deprecation: 'plx list --specs' is deprecated. Use 'plx get specs' instead."
- **AND** continue with normal list operation

#### Scenario: Deprecation warning on list reviews

- **WHEN** `plx list --reviews` is executed
- **THEN** emit warning to stderr: "Deprecation: 'plx list --reviews' is deprecated. Use 'plx get reviews' instead."
- **AND** continue with normal list operation

#### Scenario: Suppressing deprecation warnings

- **WHEN** `plx list --no-deprecation-warnings` is executed
- **THEN** do not emit deprecation warning
- **AND** continue with normal list operation

#### Scenario: JSON output unaffected by deprecation

- **WHEN** `plx list --json` is executed
- **THEN** deprecation warning goes to stderr
- **AND** JSON output goes to stdout
- **AND** JSON remains valid and parseable
