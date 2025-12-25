## RENAMED Requirements

- FROM: `### Requirement: Act Next Command`
- TO: `### Requirement: Get Task Command`

- FROM: `### Requirement: Previous Task Completion Flag`
- TO: `### Requirement: Task Completion Flag`

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
- **AND** task status remains unchanged

#### Scenario: No active changes

- **WHEN** user runs `openspec get task`
- **AND** no active changes exist in `openspec/changes/`
- **THEN** the system displays "No active changes found"

#### Scenario: All tasks complete

- **WHEN** user runs `openspec get task`
- **AND** all tasks in all changes have status `done`
- **THEN** the system displays "All tasks complete"

### Requirement: Task Completion Flag

The CLI SHALL support a `--did-complete-previous` flag that completes the in-progress task with full checkbox marking and shows only the next task.

#### Scenario: Complete previous and advance to next

- **WHEN** user runs `openspec get task --did-complete-previous`
- **AND** a task has status `in-progress`
- **THEN** all unchecked items in `## Implementation Checklist` are marked as `[x]`
- **AND** checkboxes in `## Constraints` section are NOT modified
- **AND** checkboxes in `## Acceptance Criteria` section are NOT modified
- **AND** the in-progress task status is updated to `done`
- **AND** the next to-do task status is updated to `in-progress`
- **AND** only the next task content is displayed (no change documents)
- **AND** output shows completed task name and list of marked checkbox items

#### Scenario: Flag used with no in-progress task

- **WHEN** user runs `openspec get task --did-complete-previous`
- **AND** no task has status `in-progress`
- **THEN** the system displays a warning "No in-progress task found"
- **AND** the next to-do task status is updated to `in-progress`
- **AND** only that task content is displayed

#### Scenario: JSON output includes completed task info

- **WHEN** user runs `openspec get task --did-complete-previous --json`
- **AND** a task was completed
- **THEN** the JSON output includes `completedTask` object with `name` and `completedItems` array

### Requirement: JSON Output

The CLI SHALL support a `--json` flag for machine-readable output.

#### Scenario: JSON output structure

- **WHEN** user runs `openspec get task --json`
- **THEN** the output is valid JSON containing:
  - `changeId`: selected change directory name
  - `task`: object with filename, filepath, sequence, name, status
  - `taskContent`: full task markdown content
  - `changeDocuments`: optional object with proposal and design content
  - `completedTask`: optional object with name and completedItems when `--did-complete-previous` used
  - `warning`: optional warning message
