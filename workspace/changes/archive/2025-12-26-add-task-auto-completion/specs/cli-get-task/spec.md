## ADDED Requirements

### Requirement: Automatic Task Completion

The CLI SHALL automatically detect when an in-progress task is fully complete and advance to the next task without requiring the `--did-complete-previous` flag.

#### Scenario: Auto-complete in-progress task with all checklist items done

- **WHEN** user runs `plx get task`
- **AND** the current in-progress task has all Implementation Checklist items checked
- **AND** the task has at least one checklist item
- **THEN** the system updates the in-progress task status to `done`
- **AND** the system finds the next to-do task
- **AND** the system updates the next task status to `in-progress`
- **AND** the system displays only the next task content (no change documents)
- **AND** the system shows a message indicating auto-completion occurred

#### Scenario: No auto-completion for partially complete task

- **WHEN** user runs `plx get task`
- **AND** the current in-progress task has unchecked Implementation Checklist items
- **THEN** the system displays the in-progress task normally with change documents
- **AND** the task status remains `in-progress`

#### Scenario: No auto-completion for task with zero checklist items

- **WHEN** user runs `plx get task`
- **AND** the current in-progress task has no Implementation Checklist items
- **THEN** the system displays the in-progress task normally with change documents
- **AND** the task status remains `in-progress`

#### Scenario: Auto-completion when no more tasks remain

- **WHEN** user runs `plx get task`
- **AND** the current in-progress task has all Implementation Checklist items checked
- **AND** no other to-do tasks exist in the change
- **THEN** the system updates the task status to `done`
- **AND** the system displays "All tasks complete"

#### Scenario: JSON output includes auto-completed task info

- **WHEN** user runs `plx get task --json`
- **AND** a task was auto-completed
- **THEN** the JSON output includes `autoCompletedTask` object with `name` string
