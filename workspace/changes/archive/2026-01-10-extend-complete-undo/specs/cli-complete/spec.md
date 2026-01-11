## ADDED Requirements

### Requirement: Complete Review Command

The CLI SHALL provide a `complete review` command that marks all tasks in a review as done.

#### Scenario: Complete all tasks in a review

- **WHEN** user runs `plx complete review --id <review-id>`
- **THEN** all tasks in the review are marked as done
- **THEN** all Implementation Checklist items in each task are checked
- **THEN** already-done tasks are skipped with a note

#### Scenario: Complete non-existent review

- **WHEN** user runs `plx complete review --id <invalid-id>`
- **THEN** an error message is displayed
- **THEN** the command exits with code 1

#### Scenario: JSON output for complete review

- **WHEN** user runs `plx complete review --id <review-id> --json`
- **THEN** output is valid JSON with reviewId, completedTasks array, and skippedTasks array

### Requirement: Complete Spec Command

The CLI SHALL provide a `complete spec` command that marks all tasks linked to a spec as done.

#### Scenario: Complete all tasks linked to a spec

- **WHEN** user runs `plx complete spec --id <spec-id>`
- **THEN** all tasks linked to the spec are marked as done
- **THEN** all Implementation Checklist items in each task are checked
- **THEN** already-done tasks are skipped with a note

#### Scenario: Complete spec with no linked tasks

- **WHEN** user runs `plx complete spec --id <spec-id>` on a spec with no linked tasks
- **THEN** a message is displayed indicating no tasks found
- **THEN** the command exits with code 0

#### Scenario: Complete non-existent spec

- **WHEN** user runs `plx complete spec --id <invalid-id>`
- **THEN** an error message is displayed
- **THEN** the command exits with code 1

#### Scenario: JSON output for complete spec

- **WHEN** user runs `plx complete spec --id <spec-id> --json`
- **THEN** output is valid JSON with specId, completedTasks array, and skippedTasks array
