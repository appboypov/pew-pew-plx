## ADDED Requirements

### Requirement: Act Next Command

The CLI SHALL provide an `act next` subcommand that displays the next uncompleted task from the highest-priority change.

#### Scenario: Basic invocation shows next task with change context

- **WHEN** user runs `openspec act next`
- **AND** active changes exist
- **THEN** the system selects the change with highest completion percentage
- **AND** displays proposal.md content
- **AND** displays design.md content if exists
- **AND** displays the next uncompleted task content
- **AND** task status remains unchanged

#### Scenario: No active changes

- **WHEN** user runs `openspec act next`
- **AND** no active changes exist in `openspec/changes/`
- **THEN** the system displays "No active changes found"

#### Scenario: All tasks complete

- **WHEN** user runs `openspec act next`
- **AND** all tasks in all changes have status `done`
- **THEN** the system displays "All tasks complete"

### Requirement: Change Prioritization by Completion

The CLI SHALL select the change with the highest completion percentage.

#### Scenario: Higher completion percentage selected

- **WHEN** change-a has 25% completion
- **AND** change-b has 75% completion
- **THEN** the system selects change-b

#### Scenario: Equal completion uses age as tiebreaker

- **WHEN** change-a has 50% completion and was created on Dec 20
- **AND** change-b has 50% completion and was created on Dec 25
- **THEN** the system selects change-a (older)

#### Scenario: Zero tasks treated as zero percent

- **WHEN** change-a has 0 tasks (0/0)
- **AND** change-b has 1/2 tasks (50%)
- **THEN** the system selects change-b

### Requirement: Task Status Tracking

Task files SHALL support a status field in YAML frontmatter with values: `to-do`, `in-progress`, `done`.

#### Scenario: Parse status from frontmatter

- **WHEN** task file contains frontmatter with `status: in-progress`
- **THEN** the system parses status as `in-progress`

#### Scenario: Default status when frontmatter missing

- **WHEN** task file has no frontmatter
- **THEN** the system defaults status to `to-do`

#### Scenario: Default status when status field missing

- **WHEN** task file has frontmatter but no status field
- **THEN** the system defaults status to `to-do`

### Requirement: Previous Task Completion Flag

The CLI SHALL support a `--did-complete-previous` flag that completes the in-progress task and shows only the next task.

#### Scenario: Complete previous and advance to next

- **WHEN** user runs `openspec act next --did-complete-previous`
- **AND** a task has status `in-progress`
- **THEN** the in-progress task status is updated to `done`
- **AND** the next to-do task status is updated to `in-progress`
- **AND** only the next task content is displayed (no change documents)

#### Scenario: Flag used with no in-progress task

- **WHEN** user runs `openspec act next --did-complete-previous`
- **AND** no task has status `in-progress`
- **THEN** the system displays a warning "No in-progress task found"
- **AND** the next to-do task status is updated to `in-progress`
- **AND** only that task content is displayed

### Requirement: JSON Output

The CLI SHALL support a `--json` flag for machine-readable output.

#### Scenario: JSON output structure

- **WHEN** user runs `openspec act next --json`
- **THEN** the output is valid JSON containing:
  - `changeId`: selected change directory name
  - `task`: object with filename, filepath, sequence, name, status
  - `taskContent`: full task markdown content
  - `changeDocuments`: optional object with proposal and design content
  - `warning`: optional warning message

### Requirement: Next Uncompleted Task Selection

The CLI SHALL select the next uncompleted task, preferring in-progress over to-do.

#### Scenario: In-progress task exists

- **WHEN** tasks 001 is done, 002 is in-progress, 003 is to-do
- **THEN** the system selects task 002 (the in-progress task)

#### Scenario: No in-progress, falls back to first to-do

- **WHEN** tasks 001 is done, 002 is done, 003 is to-do
- **THEN** the system selects task 003 (first to-do task)
