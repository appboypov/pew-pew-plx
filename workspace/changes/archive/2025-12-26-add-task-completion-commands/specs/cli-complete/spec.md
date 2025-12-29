## ADDED Requirements

### Requirement: Complete Task Command

The CLI SHALL provide a `complete task` command that marks a task as done and checks all Implementation Checklist items.

#### Scenario: Complete task by ID

- **WHEN** user runs `plx complete task --id <task-id>`
- **THEN** the task status is set to 'done'
- **THEN** all unchecked items in Implementation Checklist are checked
- **THEN** Constraints and Acceptance Criteria checkboxes remain unchanged

#### Scenario: Complete already-done task

- **WHEN** user runs `plx complete task --id <task-id>` on a task with status 'done'
- **THEN** a warning message is displayed
- **THEN** the command exits with code 0

#### Scenario: Complete non-existent task

- **WHEN** user runs `plx complete task --id <invalid-id>`
- **THEN** an error message is displayed
- **THEN** the command exits with code 1

### Requirement: Complete Change Command

The CLI SHALL provide a `complete change` command that marks all tasks in a change as done.

#### Scenario: Complete all tasks in a change

- **WHEN** user runs `plx complete change --id <change-id>`
- **THEN** all tasks in the change are marked as done
- **THEN** all Implementation Checklist items in each task are checked
- **THEN** already-done tasks are skipped with a note

#### Scenario: Complete non-existent change

- **WHEN** user runs `plx complete change --id <invalid-id>`
- **THEN** an error message is displayed
- **THEN** the command exits with code 1

### Requirement: Complete Command JSON Output

The CLI SHALL support `--json` flag for machine-readable output.

#### Scenario: JSON output for complete task

- **WHEN** user runs `plx complete task --id <task-id> --json`
- **THEN** output is valid JSON with taskId, changeId, previousStatus, newStatus, and completedItems fields

#### Scenario: JSON output for complete change

- **WHEN** user runs `plx complete change --id <change-id> --json`
- **THEN** output is valid JSON with changeId, completedTasks array, and skippedTasks array
