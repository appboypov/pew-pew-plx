# cli-undo Specification

## Purpose
TBD - created by archiving change add-task-completion-commands. Update Purpose after archive.
## Requirements
### Requirement: Undo Task Command

The CLI SHALL provide an `undo task` command that reverts a task to to-do status and unchecks all Implementation Checklist items.

#### Scenario: Undo task by ID

- **WHEN** user runs `openspec undo task --id <task-id>`
- **THEN** the task status is set to 'to-do'
- **THEN** all checked items in Implementation Checklist are unchecked
- **THEN** Constraints and Acceptance Criteria checkboxes remain unchanged

#### Scenario: Undo already to-do task

- **WHEN** user runs `openspec undo task --id <task-id>` on a task with status 'to-do'
- **THEN** a warning message is displayed
- **THEN** the command exits with code 0

#### Scenario: Undo non-existent task

- **WHEN** user runs `openspec undo task --id <invalid-id>`
- **THEN** an error message is displayed
- **THEN** the command exits with code 1

### Requirement: Undo Change Command

The CLI SHALL provide an `undo change` command that reverts all tasks in a change to to-do status.

#### Scenario: Undo all tasks in a change

- **WHEN** user runs `openspec undo change --id <change-id>`
- **THEN** all tasks in the change are reverted to to-do status
- **THEN** all Implementation Checklist items in each task are unchecked
- **THEN** already to-do tasks are skipped with a note

#### Scenario: Undo non-existent change

- **WHEN** user runs `openspec undo change --id <invalid-id>`
- **THEN** an error message is displayed
- **THEN** the command exits with code 1

### Requirement: Undo Command JSON Output

The CLI SHALL support `--json` flag for machine-readable output.

#### Scenario: JSON output for undo task

- **WHEN** user runs `openspec undo task --id <task-id> --json`
- **THEN** output is valid JSON with taskId, changeId, previousStatus, newStatus, and uncheckedItems fields

#### Scenario: JSON output for undo change

- **WHEN** user runs `openspec undo change --id <change-id> --json`
- **THEN** output is valid JSON with changeId, undoneTaskCount, and skippedTasks array

