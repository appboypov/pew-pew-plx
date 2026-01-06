## MODIFIED Requirements

### Requirement: Get Task Command

The CLI SHALL provide a `get task` subcommand that displays the next uncompleted task from the highest-priority parent entity.

#### Scenario: Basic invocation shows next task with parent context

- **WHEN** user runs `plx get task`
- **AND** tasks exist in `workspace/tasks/`
- **THEN** the system selects the parent entity with highest completion percentage
- **AND** displays proposal.md content if parent is a change
- **AND** displays design.md content if exists for change parent
- **AND** displays the next uncompleted task content
- **AND** if the task was 'to-do', it is transitioned to 'in-progress'

#### Scenario: No tasks found

- **WHEN** user runs `plx get task`
- **AND** no tasks exist in `workspace/tasks/`
- **THEN** the system displays "No tasks found"

#### Scenario: All tasks complete

- **WHEN** user runs `plx get task`
- **AND** all tasks in `workspace/tasks/` have status `done`
- **THEN** the system displays "All tasks complete"

### Requirement: Task ID Retrieval

The CLI SHALL support an `--id` flag on `get task` to retrieve a specific task by filename without extension.

#### Scenario: Retrieve task by ID

- **WHEN** user runs `plx get task --id 001-add-feature-x-implement`
- **AND** task file `001-add-feature-x-implement.md` exists in `workspace/tasks/`
- **THEN** the system displays the task content
- **AND** does not display parent documents (proposal.md, design.md)

#### Scenario: Task ID not found

- **WHEN** user runs `plx get task --id nonexistent`
- **AND** no task file matches the ID in `workspace/tasks/`
- **THEN** the system displays error "Task 'nonexistent' not found"
- **AND** exits with non-zero status

#### Scenario: Task ID with JSON output

- **WHEN** user runs `plx get task --id 001-add-feature-x-implement --json`
- **THEN** the JSON output includes task metadata and content
- **AND** does not include parentDocuments field

### Requirement: Get Tasks Command

The CLI SHALL provide a `get tasks` subcommand to list tasks.

#### Scenario: List all open tasks

- **WHEN** user runs `plx get tasks`
- **THEN** displays a summary table of all open tasks from `workspace/tasks/`
- **AND** table includes columns: ID, Name, Status, Parent Type, Parent ID

#### Scenario: List tasks for specific parent

- **WHEN** user runs `plx get tasks --parent-id add-feature`
- **AND** tasks exist with `parent-id: add-feature` in frontmatter
- **THEN** displays tasks only from that parent

#### Scenario: Filter tasks by parent type

- **WHEN** user runs `plx get tasks --parent-id add-feature --parent-type change`
- **THEN** displays tasks matching both parent-id and parent-type

#### Scenario: Parent ID conflict

- **WHEN** user runs `plx get tasks --parent-id my-entity`
- **AND** tasks exist with `parent-id: my-entity` for multiple parent types
- **AND** `--parent-type` is not specified
- **THEN** the system displays error indicating ambiguous parent
- **AND** suggests using `--parent-type` to disambiguate

#### Scenario: Tasks JSON output

- **WHEN** user runs `plx get tasks --json`
- **THEN** the output is valid JSON array of task summaries
- **AND** each task includes parentType and parentId fields

## ADDED Requirements

### Requirement: Task Parent Filtering

The CLI SHALL support filtering tasks by parent entity using `--parent-id` and `--parent-type` flags.

#### Scenario: Filter by parent-id only

- **WHEN** user runs `plx get task --parent-id add-feature`
- **THEN** the system searches all parent types for matching parent-id
- **AND** returns the next uncompleted task for that parent

#### Scenario: Filter by parent-id and parent-type

- **WHEN** user runs `plx get task --parent-id add-feature --parent-type change`
- **THEN** the system filters to tasks with exact parent match
- **AND** returns the next uncompleted task for that parent

#### Scenario: Standalone task retrieval

- **WHEN** user runs `plx get task`
- **AND** only standalone tasks exist (no parent linkage)
- **THEN** the system returns the next standalone task
- **AND** does not display any parent context documents

### Requirement: Centralized Task Discovery

The CLI SHALL discover tasks from the centralized `workspace/tasks/` directory.

#### Scenario: Discovery excludes archive

- **WHEN** discovering tasks
- **THEN** tasks in `workspace/tasks/archive/` SHALL be excluded

#### Scenario: Multi-workspace task discovery

- **WHEN** operating in multi-workspace mode
- **THEN** each workspace's `tasks/` directory SHALL be discovered independently
- **AND** workspace prefix SHALL be applied to task IDs in output
