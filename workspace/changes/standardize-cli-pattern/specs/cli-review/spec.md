## ADDED Requirements

### Requirement: Entity Subcommands for Review Initiation

The review command SHALL support entity subcommands for initiating reviews.

#### Scenario: Review a change

- **WHEN** `plx review change --id <id>` is executed
- **THEN** load review context for the specified change
- **AND** display REVIEW.md template if exists
- **AND** display proposal.md, design.md, and tasks content

#### Scenario: Review a spec

- **WHEN** `plx review spec --id <id>` is executed
- **THEN** load review context for the specified spec
- **AND** display REVIEW.md template if exists
- **AND** display spec.md and design.md content

#### Scenario: Review a task

- **WHEN** `plx review task --id <id>` is executed
- **THEN** load review context for the specified task
- **AND** display REVIEW.md template if exists
- **AND** display task content and parent context

#### Scenario: Change not found

- **WHEN** `plx review change --id nonexistent` is executed
- **AND** no change matches the ID
- **THEN** display error: "Change 'nonexistent' not found"
- **AND** exit with non-zero status

#### Scenario: Spec not found

- **WHEN** `plx review spec --id nonexistent` is executed
- **AND** no spec matches the ID
- **THEN** display error: "Spec 'nonexistent' not found"
- **AND** exit with non-zero status

#### Scenario: Task not found

- **WHEN** `plx review task --id nonexistent` is executed
- **AND** no task matches the ID
- **THEN** display error: "Task 'nonexistent' not found"
- **AND** exit with non-zero status

### Requirement: Legacy Flag Deprecation

The review command SHALL emit deprecation warnings for legacy entity-specific flags.

#### Scenario: Deprecation warning on --change-id

- **WHEN** `plx review --change-id <id>` is executed
- **THEN** emit warning to stderr: "Deprecation: '--change-id' is deprecated. Use 'plx review change --id <id>' instead."
- **AND** continue with normal review operation

#### Scenario: Deprecation warning on --spec-id

- **WHEN** `plx review --spec-id <id>` is executed
- **THEN** emit warning to stderr: "Deprecation: '--spec-id' is deprecated. Use 'plx review spec --id <id>' instead."
- **AND** continue with normal review operation

#### Scenario: Deprecation warning on --task-id

- **WHEN** `plx review --task-id <id>` is executed
- **THEN** emit warning to stderr: "Deprecation: '--task-id' is deprecated. Use 'plx review task --id <id>' instead."
- **AND** continue with normal review operation

#### Scenario: Suppressing deprecation warnings

- **WHEN** `plx review --change-id <id> --no-deprecation-warnings` is executed
- **THEN** do not emit deprecation warning
- **AND** continue with normal review operation
