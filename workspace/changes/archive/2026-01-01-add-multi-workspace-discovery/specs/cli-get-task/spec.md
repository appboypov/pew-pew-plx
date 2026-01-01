## ADDED Requirements

### Requirement: Multi-Workspace Task Discovery
The command SHALL discover and aggregate tasks from all workspace directories when retrieving tasks.

#### Scenario: Prioritize across all workspaces
- **WHEN** user runs `plx get task`
- **AND** multiple workspaces contain active changes
- **THEN** select the highest-priority change across all workspaces
- **AND** display task with workspace context in multi-workspace mode

#### Scenario: Task ID with workspace prefix
- **WHEN** user runs `plx get task --id project-a/001-implement`
- **THEN** resolve the task from the project-a workspace specifically
- **AND** display task content

#### Scenario: Task ID without prefix in multi-workspace
- **WHEN** user runs `plx get task --id 001-implement`
- **AND** multiple workspaces exist
- **THEN** search all workspaces for matching task
- **AND** if found in exactly one workspace, display that task
- **AND** if found in multiple workspaces, display error with available matches

#### Scenario: JSON output includes workspace context
- **WHEN** user runs `plx get task --json` in multi-workspace mode
- **THEN** include `workspacePath` field with absolute path
- **AND** include `projectName` field with workspace project name
- **AND** include `displayId` field with prefixed ID format

### Requirement: Workspace Filter Flag
The command SHALL support a `--workspace` flag to filter task operations to a specific workspace.

#### Scenario: Filter task retrieval to workspace
- **WHEN** user runs `plx get task --workspace project-a`
- **THEN** only consider changes from project-a workspace
- **AND** select highest-priority change from that workspace only

## MODIFIED Requirements

### Requirement: Get Tasks Command
The CLI SHALL provide a `get tasks` subcommand to list tasks, aggregating across all discovered workspaces.

#### Scenario: List all open tasks from all workspaces
- **WHEN** user runs `plx get tasks`
- **AND** multiple workspaces exist
- **THEN** displays a summary table of all open tasks across all workspaces
- **AND** table includes columns: ID (with workspace prefix if multi), Name, Status, Change

#### Scenario: List tasks for specific change with prefix
- **WHEN** user runs `plx get tasks --id project-a/add-feature`
- **AND** change `add-feature` exists in project-a workspace
- **THEN** displays tasks only from that change

#### Scenario: Tasks JSON output in multi-workspace
- **WHEN** user runs `plx get tasks --json`
- **AND** multiple workspaces exist
- **THEN** the output includes `workspacePath` and `projectName` for each task
