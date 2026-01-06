## MODIFIED Requirements

### Requirement: Undo Task Command

The CLI SHALL provide an `undo task` command that reverts a task to to-do status and unchecks all Implementation Checklist items.

#### Scenario: Undo task by ID

- **WHEN** user runs `plx undo task --id <task-id>`
- **AND** task exists in `workspace/tasks/`
- **THEN** the task status is set to 'to-do'
- **THEN** all checked items in Implementation Checklist are unchecked
- **THEN** Constraints and Acceptance Criteria checkboxes remain unchanged

#### Scenario: Undo already to-do task

- **WHEN** user runs `plx undo task --id <task-id>` on a task with status 'to-do'
- **THEN** a warning message is displayed
- **THEN** the command exits with code 0

#### Scenario: Undo non-existent task

- **WHEN** user runs `plx undo task --id <invalid-id>`
- **AND** no task matches in `workspace/tasks/`
- **THEN** an error message is displayed
- **THEN** the command exits with code 1

### Requirement: Undo Change Command

The CLI SHALL provide an `undo change` command that reverts all tasks linked to a change to to-do status.

#### Scenario: Undo all tasks in a change

- **WHEN** user runs `plx undo change --id <change-id>`
- **AND** tasks exist with `parent-type: change` and `parent-id: <change-id>`
- **THEN** all matching tasks are reverted to to-do status
- **THEN** all Implementation Checklist items in each task are unchecked
- **THEN** already to-do tasks are skipped with a note

#### Scenario: Undo change with no tasks

- **WHEN** user runs `plx undo change --id <change-id>`
- **AND** no tasks exist with matching parent linkage
- **THEN** a message indicates no tasks found for the change

#### Scenario: Undo non-existent change

- **WHEN** user runs `plx undo change --id <invalid-id>`
- **AND** no change directory exists with that ID
- **THEN** an error message is displayed
- **THEN** the command exits with code 1

### Requirement: Undo Command JSON Output

The CLI SHALL support `--json` flag for machine-readable output.

#### Scenario: JSON output for undo task

- **WHEN** user runs `plx undo task --id <task-id> --json`
- **THEN** output is valid JSON with taskId, parentType, parentId, previousStatus, newStatus, and uncheckedItems fields

#### Scenario: JSON output for undo change

- **WHEN** user runs `plx undo change --id <change-id> --json`
- **THEN** output is valid JSON with changeId, undoneTaskCount, and skippedTasks array
