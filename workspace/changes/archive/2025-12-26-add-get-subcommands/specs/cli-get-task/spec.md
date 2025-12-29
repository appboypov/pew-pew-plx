## ADDED Requirements

### Requirement: Task ID Retrieval

The CLI SHALL support an `--id` flag on `get task` to retrieve a specific task by filename without extension.

#### Scenario: Retrieve task by ID

- **WHEN** user runs `plx get task --id 001-implement`
- **AND** task file `001-implement.md` exists in any active change
- **THEN** the system displays the task content
- **AND** does not display change documents (proposal.md, design.md)

#### Scenario: Task ID not found

- **WHEN** user runs `plx get task --id nonexistent`
- **AND** no task file matches the ID
- **THEN** the system displays error "Task 'nonexistent' not found"
- **AND** exits with non-zero status

#### Scenario: Task ID with JSON output

- **WHEN** user runs `plx get task --id 001-implement --json`
- **THEN** the JSON output includes task metadata and content
- **AND** does not include changeDocuments field

### Requirement: Content Filtering

The CLI SHALL support `--constraints` and `--acceptance-criteria` flags to filter task content to specific sections.

#### Scenario: Filter to constraints only

- **WHEN** user runs `plx get task --constraints`
- **THEN** only the `## Constraints` section is displayed with its header and content

#### Scenario: Filter to acceptance criteria only

- **WHEN** user runs `plx get task --acceptance-criteria`
- **THEN** only the `## Acceptance Criteria` section is displayed with its header and content

#### Scenario: Combine filter flags

- **WHEN** user runs `plx get task --constraints --acceptance-criteria`
- **THEN** both sections are displayed in original document order
- **AND** no other sections are displayed

#### Scenario: Filter with task ID

- **WHEN** user runs `plx get task --id 001-impl --constraints`
- **THEN** only the Constraints section from task 001-impl is displayed

#### Scenario: Section not found

- **WHEN** user runs `plx get task --constraints`
- **AND** the task does not have a Constraints section
- **THEN** the system displays empty output or a message indicating section not found

### Requirement: Get Change Command

The CLI SHALL provide a `get change` subcommand to retrieve a specific change proposal by ID.

#### Scenario: Retrieve change by ID

- **WHEN** user runs `plx get change --id add-feature`
- **AND** change directory `add-feature` exists
- **THEN** the system displays proposal.md content
- **AND** displays design.md content if exists
- **AND** displays list of tasks with status

#### Scenario: Change not found

- **WHEN** user runs `plx get change --id nonexistent`
- **AND** no change directory matches the ID
- **THEN** the system displays error "Change 'nonexistent' not found"

#### Scenario: Change with content filters

- **WHEN** user runs `plx get change --id add-feature --constraints`
- **THEN** displays Constraints sections from all tasks aggregated with task identifiers

#### Scenario: Change JSON output

- **WHEN** user runs `plx get change --id add-feature --json`
- **THEN** the output is valid JSON with proposal, design, and tasks

### Requirement: Get Spec Command

The CLI SHALL provide a `get spec` subcommand to retrieve a specific specification by ID.

#### Scenario: Retrieve spec by ID

- **WHEN** user runs `plx get spec --id user-auth`
- **AND** spec directory `user-auth` exists
- **THEN** the system displays spec.md content
- **AND** displays design.md content if exists

#### Scenario: Spec not found

- **WHEN** user runs `plx get spec --id nonexistent`
- **AND** no spec directory matches the ID
- **THEN** the system displays error "Spec 'nonexistent' not found"

#### Scenario: Spec JSON output

- **WHEN** user runs `plx get spec --id user-auth --json`
- **THEN** the output is valid JSON with spec content

### Requirement: Get Tasks Command

The CLI SHALL provide a `get tasks` subcommand to list tasks.

#### Scenario: List all open tasks

- **WHEN** user runs `plx get tasks`
- **THEN** displays a summary table of all open tasks across all changes
- **AND** table includes columns: ID, Name, Status, Change

#### Scenario: List tasks for specific change

- **WHEN** user runs `plx get tasks --id add-feature`
- **AND** change `add-feature` exists
- **THEN** displays tasks only from that change

#### Scenario: Tasks JSON output

- **WHEN** user runs `plx get tasks --json`
- **THEN** the output is valid JSON array of task summaries

### Requirement: Shell Completion Support

The CLI SHALL include `get` command in shell completion registry.

#### Scenario: Get command completions

- **WHEN** user types `plx get <TAB>`
- **THEN** completions include: task, change, spec, tasks

#### Scenario: Get task flag completions

- **WHEN** user types `plx get task --<TAB>`
- **THEN** completions include: id, constraints, acceptance-criteria, json, did-complete-previous

#### Scenario: Dynamic ID completions

- **WHEN** user types `plx get change --id <TAB>`
- **THEN** completions include available change IDs

## MODIFIED Requirements

### Requirement: Get Task Command

The CLI SHALL provide a `get task` subcommand that displays the next uncompleted task from the highest-priority change, or a specific task when `--id` is provided.

#### Scenario: Basic invocation shows next task with change context

- **WHEN** user runs `plx get task`
- **AND** active changes exist
- **AND** `--id` flag is not provided
- **THEN** the system selects the change with highest completion percentage
- **AND** displays proposal.md content
- **AND** displays design.md content if exists
- **AND** displays the next uncompleted task content
- **AND** task status remains unchanged

#### Scenario: No active changes

- **WHEN** user runs `plx get task`
- **AND** no active changes exist in `workspace/changes/`
- **THEN** the system displays "No active changes found"

#### Scenario: All tasks complete

- **WHEN** user runs `plx get task`
- **AND** all tasks in all changes have status `done`
- **THEN** the system displays "All tasks complete"
