## ADDED Requirements

### Requirement: Auto-Transition to In-Progress

The CLI SHALL automatically transition to-do tasks to in-progress when retrieved.

#### Scenario: Auto-transition on prioritized retrieval

- **WHEN** user runs `openspec get task`
- **AND** the next task has status 'to-do'
- **THEN** the task status is automatically set to 'in-progress'
- **THEN** the output indicates the transition occurred

#### Scenario: Auto-transition on ID-based retrieval

- **WHEN** user runs `openspec get task --id <task-id>`
- **AND** the task has status 'to-do'
- **THEN** the task status is automatically set to 'in-progress'
- **THEN** the output indicates the transition occurred

#### Scenario: No transition for in-progress task

- **WHEN** user runs `openspec get task --id <task-id>`
- **AND** the task has status 'in-progress'
- **THEN** the task status remains 'in-progress'
- **THEN** no transition message is displayed

#### Scenario: No transition for done task

- **WHEN** user runs `openspec get task --id <task-id>`
- **AND** the task has status 'done'
- **THEN** the task status remains 'done'
- **THEN** no transition message is displayed

#### Scenario: JSON output includes transition flag

- **WHEN** user runs `openspec get task --json`
- **AND** a to-do task was transitioned to in-progress
- **THEN** the JSON output includes `transitionedToInProgress: true`

## MODIFIED Requirements

### Requirement: Get Task Command

The CLI SHALL provide a `get task` subcommand that displays the next uncompleted task from the highest-priority change.

#### Scenario: Basic invocation shows next task with change context

- **WHEN** user runs `openspec get task`
- **AND** active changes exist
- **THEN** the system selects the change with highest completion percentage
- **AND** displays proposal.md content
- **AND** displays design.md content if exists
- **AND** displays the next uncompleted task content
- **AND** if the task was 'to-do', it is transitioned to 'in-progress'

#### Scenario: No active changes

- **WHEN** user runs `openspec get task`
- **AND** no active changes exist in `openspec/changes/`
- **THEN** the system displays "No active changes found"

#### Scenario: All tasks complete

- **WHEN** user runs `openspec get task`
- **AND** all tasks in all changes have status `done`
- **THEN** the system displays "All tasks complete"
