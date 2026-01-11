## ADDED Requirements

### Requirement: Undo Review Command

The CLI SHALL provide an `undo review` command that reverts all tasks in a review to to-do status.

#### Scenario: Undo all tasks in a review

- **WHEN** user runs `plx undo review --id <review-id>`
- **THEN** all tasks in the review are reverted to to-do status
- **THEN** all Implementation Checklist items in each task are unchecked
- **THEN** already to-do tasks are skipped with a note

#### Scenario: Undo non-existent review

- **WHEN** user runs `plx undo review --id <invalid-id>`
- **THEN** an error message is displayed
- **THEN** the command exits with code 1

#### Scenario: JSON output for undo review

- **WHEN** user runs `plx undo review --id <review-id> --json`
- **THEN** output is valid JSON with reviewId, undoneTasks array, and skippedTasks array

### Requirement: Undo Spec Command

The CLI SHALL provide an `undo spec` command that reverts all tasks linked to a spec to to-do status.

#### Scenario: Undo all tasks linked to a spec

- **WHEN** user runs `plx undo spec --id <spec-id>`
- **THEN** all tasks linked to the spec are reverted to to-do status
- **THEN** all Implementation Checklist items in each task are unchecked
- **THEN** already to-do tasks are skipped with a note

#### Scenario: Undo spec with no linked tasks

- **WHEN** user runs `plx undo spec --id <spec-id>` on a spec with no linked tasks
- **THEN** a message is displayed indicating no tasks found
- **THEN** the command exits with code 0

#### Scenario: Undo non-existent spec

- **WHEN** user runs `plx undo spec --id <invalid-id>`
- **THEN** an error message is displayed
- **THEN** the command exits with code 1

#### Scenario: JSON output for undo spec

- **WHEN** user runs `plx undo spec --id <spec-id> --json`
- **THEN** output is valid JSON with specId, undoneTasks array, and skippedTasks array
