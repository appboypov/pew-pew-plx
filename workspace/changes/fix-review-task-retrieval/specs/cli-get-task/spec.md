## MODIFIED Requirements

### Requirement: Get Tasks Command

The CLI SHALL provide a `get tasks` subcommand to list tasks, searching both changes and reviews.

#### Scenario: List all open tasks

- **WHEN** user runs `plx get tasks`
- **THEN** displays a summary table of all open tasks across all changes and reviews
- **AND** table includes columns: ID, Name, Status, Change/Review

#### Scenario: List tasks for specific change

- **WHEN** user runs `plx get tasks --id add-feature`
- **AND** change `add-feature` exists
- **THEN** displays tasks only from that change

#### Scenario: List tasks for specific review

- **WHEN** user runs `plx get tasks --id my-review`
- **AND** review `my-review` exists in `workspace/reviews/`
- **AND** no change with ID `my-review` exists
- **THEN** displays tasks from that review

#### Scenario: Change takes precedence over review

- **WHEN** user runs `plx get tasks --id some-id`
- **AND** both a change and review exist with ID `some-id`
- **THEN** displays tasks from the change (changes take precedence)

#### Scenario: Tasks JSON output

- **WHEN** user runs `plx get tasks --json`
- **THEN** the output is valid JSON array of task summaries

### Requirement: Task ID Retrieval

The CLI SHALL support an `--id` flag on `get task` to retrieve a specific task by filename without extension, searching both changes and reviews.

#### Scenario: Retrieve task by ID

- **WHEN** user runs `plx get task --id 001-implement`
- **AND** task file `001-implement.md` exists in any active change or review
- **THEN** the system displays the task content
- **AND** does not display change documents (proposal.md, design.md)

#### Scenario: Retrieve task by full ID from review

- **WHEN** user runs `plx get task --id my-review/001-fix`
- **AND** task file `001-fix.md` exists in review `my-review`
- **THEN** the system displays the task content

#### Scenario: Task ID not found

- **WHEN** user runs `plx get task --id nonexistent`
- **AND** no task file matches the ID in any change or review
- **THEN** the system displays error "Task 'nonexistent' not found"
- **AND** exits with non-zero status

#### Scenario: Task ID with JSON output

- **WHEN** user runs `plx get task --id 001-implement --json`
- **THEN** the JSON output includes task metadata and content
- **AND** does not include changeDocuments field

### Requirement: Get Task Command

The CLI SHALL provide a `get task` subcommand that displays the next uncompleted task from the highest-priority change or review.

#### Scenario: Basic invocation shows next task with change context

- **WHEN** user runs `plx get task`
- **AND** active changes or reviews exist with open tasks
- **THEN** the system selects the item with highest completion percentage
- **AND** displays proposal.md/review.md content
- **AND** displays design.md content if exists
- **AND** displays the next uncompleted task content
- **AND** if the task was 'to-do', it is transitioned to 'in-progress'

#### Scenario: No active changes or reviews

- **WHEN** user runs `plx get task`
- **AND** no active changes or reviews exist
- **THEN** the system displays "No active changes found"

#### Scenario: All tasks complete

- **WHEN** user runs `plx get task`
- **AND** all tasks in all changes and reviews have status `done`
- **THEN** the system displays "All tasks complete"
