## MODIFIED Requirements
### Requirement: Task Completion Flag
The CLI SHALL support a `--did-complete-previous` flag that completes the in-progress task by marking all unchecked markdown checkboxes and shows only the next task.

#### Scenario: Complete previous and advance to next
- **WHEN** user runs `splx get task --did-complete-previous`
- **AND** a task has status `in-progress`
- **THEN** all unchecked markdown checkbox items in the task file are marked as `[x]`
- **AND** the in-progress task status is updated to `done`
- **AND** the next to-do task status is updated to `in-progress`
- **AND** only the next task content is displayed (no change documents)
- **AND** output shows completed task name and list of marked checkbox items

#### Scenario: Flag used with no in-progress task
- **WHEN** user runs `splx get task --did-complete-previous`
- **AND** no task has status `in-progress`
- **THEN** the system displays a warning "No in-progress task found"
- **AND** the next to-do task status is updated to `in-progress`
- **AND** only that task content is displayed

#### Scenario: JSON output includes completed task info
- **WHEN** user runs `splx get task --did-complete-previous --json`
- **AND** a task was completed
- **THEN** the JSON output includes `completedTask` object with `name` and `completedItems` array

### Requirement: Automatic Task Completion
The CLI SHALL automatically detect when an in-progress task has no unchecked markdown checkboxes and advance to the next task without requiring the `--did-complete-previous` flag.

#### Scenario: Auto-completion for task with no unchecked checkboxes
- **WHEN** user runs `splx get task`
- **AND** the current in-progress task has no unchecked markdown checkboxes
- **THEN** the task status is updated to `done`
- **AND** the system advances to the next to-do task (if any)
- **AND** the system shows a message indicating auto-completion occurred

#### Scenario: No auto-completion for partially complete task
- **WHEN** user runs `splx get task`
- **AND** the current in-progress task has one or more unchecked markdown checkboxes
- **THEN** the task is not auto-completed
- **AND** the same in-progress task is displayed

#### Scenario: Auto-completion when no more tasks remain
- **WHEN** user runs `splx get task`
- **AND** the current in-progress task has no unchecked markdown checkboxes
- **AND** there are no remaining to-do tasks
- **THEN** the task status is updated to `done`
- **AND** the system displays "All tasks complete"
