## MODIFIED Requirements
### Requirement: Undo Task Command
The CLI SHALL provide an `undo task` command that reverts a task to to-do status and unchecks all markdown checkbox items in the task file.

#### Scenario: Undo task by ID
- **WHEN** user runs `splx undo task --id <task-id>`
- **THEN** the task status is set to 'to-do'
- **THEN** all checked markdown checkbox items are unchecked

#### Scenario: Undo already to-do task
- **WHEN** user runs `splx undo task --id <task-id>` on a task with status 'to-do'
- **THEN** a warning message is displayed
- **THEN** the command exits with code 0

#### Scenario: Undo non-existent task
- **WHEN** user runs `splx undo task --id <invalid-id>`
- **THEN** an error message is displayed
- **THEN** the command exits with code 1

### Requirement: Undo Change Command
The CLI SHALL provide an `undo change` command that reverts all tasks in a change to to-do status.

#### Scenario: Undo all tasks in a change
- **WHEN** user runs `splx undo change --id <change-id>`
- **THEN** all tasks in the change are reverted to to-do status
- **THEN** all markdown checkbox items in each task are unchecked
- **THEN** already to-do tasks are skipped with a note

#### Scenario: Undo non-existent change
- **WHEN** user runs `splx undo change --id <invalid-id>`
- **THEN** an error message is displayed
- **THEN** the command exits with code 1

### Requirement: Undo Review Command
The CLI SHALL provide an `undo review` command that reverts all tasks in a review to to-do status.

#### Scenario: Undo all tasks in a review
- **WHEN** user runs `splx undo review --id <review-id>`
- **THEN** all tasks in the review are reverted to to-do status
- **THEN** all markdown checkbox items in each task are unchecked
- **THEN** already to-do tasks are skipped with a note

#### Scenario: Undo non-existent review
- **WHEN** user runs `splx undo review --id <invalid-id>`
- **THEN** an error message is displayed
- **THEN** the command exits with code 1

### Requirement: Undo Spec Command
The CLI SHALL provide an `undo spec` command that reverts all tasks linked to a spec to to-do status.

#### Scenario: Undo all tasks linked to a spec
- **WHEN** user runs `splx undo spec --id <spec-id>`
- **THEN** all tasks linked to the spec are reverted to to-do status
- **THEN** all markdown checkbox items in each task are unchecked
- **THEN** already to-do tasks are skipped with a note

#### Scenario: Undo spec with no linked tasks
- **WHEN** user runs `splx undo spec --id <spec-id>` on a spec with no linked tasks
- **THEN** a message is displayed indicating no tasks found
- **THEN** the command exits with code 0

#### Scenario: Undo non-existent spec
- **WHEN** user runs `splx undo spec --id <invalid-id>`
- **THEN** an error message is displayed
- **THEN** the command exits with code 1
