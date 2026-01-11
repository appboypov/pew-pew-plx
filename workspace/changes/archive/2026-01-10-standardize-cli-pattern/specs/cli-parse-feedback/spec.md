## ADDED Requirements

### Requirement: Generic Parent Flags

The parse feedback command SHALL support `--parent-id` and `--parent-type` flags for parent linkage.

#### Scenario: Link feedback to change with explicit type

- **WHEN** `plx parse feedback "name" --parent-id <id> --parent-type change` is executed
- **THEN** create review linked to the specified change
- **AND** set review.md frontmatter: target-type: change, target-id: <id>

#### Scenario: Link feedback to spec with explicit type

- **WHEN** `plx parse feedback "name" --parent-id <id> --parent-type spec` is executed
- **THEN** create review linked to the specified spec
- **AND** set review.md frontmatter: target-type: spec, target-id: <id>

#### Scenario: Link feedback to task with explicit type

- **WHEN** `plx parse feedback "name" --parent-id <id> --parent-type task` is executed
- **THEN** create review linked to the specified task
- **AND** set review.md frontmatter: target-type: task, target-id: <id>

#### Scenario: Auto-detect parent type

- **WHEN** `plx parse feedback "name" --parent-id <id>` is executed (without --parent-type)
- **AND** `<id>` matches exactly one parent type (change, spec, or task)
- **THEN** use the detected type
- **AND** create review with correct target-type frontmatter

#### Scenario: Ambiguous parent ID

- **WHEN** `plx parse feedback "name" --parent-id <id>` is executed
- **AND** `<id>` matches multiple parent types
- **THEN** display error: "Ambiguous parent ID '<id>'. Use --parent-type to specify: change, spec, task"
- **AND** exit with non-zero status

#### Scenario: Parent ID not found

- **WHEN** `plx parse feedback "name" --parent-id <id>` is executed
- **AND** `<id>` matches no existing parent
- **THEN** display error: "Parent '<id>' not found"
- **AND** exit with non-zero status

#### Scenario: Invalid parent type

- **WHEN** `plx parse feedback "name" --parent-id <id> --parent-type invalid` is executed
- **THEN** display error with valid options: change, spec, task
- **AND** exit with non-zero status

### Requirement: Legacy Flag Deprecation

The parse feedback command SHALL emit deprecation warnings for legacy entity-specific flags.

#### Scenario: Deprecation warning on --change-id

- **WHEN** `plx parse feedback "name" --change-id <id>` is executed
- **THEN** emit warning to stderr: "Deprecation: '--change-id' is deprecated. Use '--parent-id <id> --parent-type change' instead."
- **AND** continue with normal operation

#### Scenario: Deprecation warning on --spec-id

- **WHEN** `plx parse feedback "name" --spec-id <id>` is executed
- **THEN** emit warning to stderr: "Deprecation: '--spec-id' is deprecated. Use '--parent-id <id> --parent-type spec' instead."
- **AND** continue with normal operation

#### Scenario: Deprecation warning on --task-id

- **WHEN** `plx parse feedback "name" --task-id <id>` is executed
- **THEN** emit warning to stderr: "Deprecation: '--task-id' is deprecated. Use '--parent-id <id> --parent-type task' instead."
- **AND** continue with normal operation

#### Scenario: Suppressing deprecation warnings

- **WHEN** `plx parse feedback "name" --change-id <id> --no-deprecation-warnings` is executed
- **THEN** do not emit deprecation warning
- **AND** continue with normal operation
