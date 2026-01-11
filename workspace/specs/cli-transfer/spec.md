# cli-transfer Specification

## Purpose
TBD - created by archiving change add-transfer-command. Update Purpose after archive.
## Requirements
### Requirement: Transfer Change Command

The CLI SHALL provide a `plx transfer change` command that moves a change directory and its linked tasks from source to target workspace.

#### Scenario: Transfer change with linked tasks
- **GIVEN** a change `add-feature` exists in source workspace with 3 linked tasks
- **WHEN** user runs `plx transfer change --id add-feature --target /path/to/target`
- **THEN** the change directory is moved to target workspace
- **AND** all tasks with `parent-id: add-feature` are moved to target `workspace/tasks/`
- **AND** task sequence numbers are reassigned to continue from target's highest
- **AND** source change directory and linked tasks are deleted

#### Scenario: Transfer change with target-name
- **GIVEN** a change `add-feature` exists in source workspace
- **WHEN** user runs `plx transfer change --id add-feature --target /path/to/target --target-name new-feature`
- **THEN** the change is created as `new-feature` in target workspace
- **AND** linked task frontmatter `parent-id` is updated to `new-feature`
- **AND** task filenames are updated to include `new-feature` as parent-id

#### Scenario: Transfer change conflict
- **GIVEN** a change `add-feature` exists in both source and target workspaces
- **WHEN** user runs `plx transfer change --id add-feature --target /path/to/target`
- **THEN** the transfer aborts with an error
- **AND** the error message instructs user to use `--target-name` or manually rename

### Requirement: Transfer Spec Command

The CLI SHALL provide a `plx transfer spec` command that moves a spec directory along with related changes and their linked tasks.

#### Scenario: Transfer spec with related changes
- **GIVEN** a spec `user-auth` exists in source workspace
- **AND** changes `add-login` and `add-logout` have delta specs for `user-auth`
- **WHEN** user runs `plx transfer spec --id user-auth --target /path/to/target`
- **THEN** the spec directory is moved to target workspace
- **AND** changes `add-login` and `add-logout` are moved to target workspace
- **AND** all linked tasks for those changes are moved and renumbered

#### Scenario: Transfer spec without related changes
- **GIVEN** a spec `config` exists in source workspace with no related changes
- **WHEN** user runs `plx transfer spec --id config --target /path/to/target`
- **THEN** only the spec directory is moved to target workspace

### Requirement: Transfer Task Command

The CLI SHALL provide a `plx transfer task` command that moves a single task file from source to target workspace.

#### Scenario: Transfer standalone task
- **GIVEN** a task `003-implement-cache.md` exists without parent linkage
- **WHEN** user runs `plx transfer task --id 003-implement-cache --target /path/to/target`
- **THEN** the task is moved to target `workspace/tasks/`
- **AND** the sequence number is reassigned to target's next available number
- **AND** the source task file is deleted

#### Scenario: Transfer linked task
- **GIVEN** a task `002-add-feature-implement.md` exists with `parent-id: add-feature`
- **WHEN** user runs `plx transfer task --id 002-add-feature-implement --target /path/to/target`
- **THEN** the task is moved to target workspace
- **AND** the sequence number is reassigned
- **AND** the `parent-id` frontmatter is preserved

#### Scenario: Transfer task with target-name
- **GIVEN** a task `002-add-feature-implement.md` exists
- **WHEN** user runs `plx transfer task --id 002-add-feature-implement --target /path/to/target --target-name new-task-name`
- **THEN** the task is renamed to `NNN-new-task-name.md` in target
- **AND** the sequence number NNN continues from target's highest

### Requirement: Transfer Review Command

The CLI SHALL provide a `plx transfer review` command that moves a review directory and its linked tasks.

#### Scenario: Transfer review with linked tasks
- **GIVEN** a review `code-review-1` exists with 2 linked tasks
- **WHEN** user runs `plx transfer review --id code-review-1 --target /path/to/target`
- **THEN** the review directory is moved to target workspace
- **AND** all tasks with `parent-type: review` and `parent-id: code-review-1` are moved
- **AND** task sequence numbers are reassigned

### Requirement: Transfer Request Command

The CLI SHALL provide a `plx transfer request` command that moves a request.md file from a change directory.

#### Scenario: Transfer request
- **GIVEN** a change `add-feature` exists with a `request.md` file
- **WHEN** user runs `plx transfer request --id add-feature --target /path/to/target`
- **THEN** the request.md file is moved to target change directory
- **AND** if target change doesn't exist, it is created with minimal structure

### Requirement: Workspace Auto-Initialization

The CLI SHALL automatically initialize a PLX workspace in the target directory when no workspace exists.

#### Scenario: Auto-initialize workspace
- **GIVEN** target directory has no `workspace/` directory
- **WHEN** user runs a transfer command with `--target /path/to/target`
- **THEN** the CLI prompts to initialize a workspace
- **AND** uses source workspace's tool configuration as defaults
- **AND** proceeds with transfer after successful initialization

#### Scenario: Auto-initialize with yes flag
- **GIVEN** target directory has no workspace
- **WHEN** user runs `plx transfer change --id X --target /path/to/target --yes`
- **THEN** the workspace is initialized without prompting
- **AND** uses source workspace's tool configuration

### Requirement: Dry Run Support

The CLI SHALL support a `--dry-run` flag that previews transfer operations without making changes.

#### Scenario: Dry run transfer
- **GIVEN** a change `add-feature` with 3 linked tasks
- **WHEN** user runs `plx transfer change --id add-feature --target /path/to/target --dry-run`
- **THEN** the CLI outputs a preview of what would be transferred
- **AND** shows task renumbering plan
- **AND** shows if workspace initialization is needed
- **AND** no files are modified

#### Scenario: Dry run with conflicts
- **GIVEN** a conflict exists in target workspace
- **WHEN** user runs `plx transfer change --id X --target /path/to/target --dry-run`
- **THEN** the CLI reports the conflicts that would block transfer
- **AND** no files are modified

### Requirement: Interactive Workspace Selection

The CLI SHALL support interactive workspace selection when source or target paths are omitted.

#### Scenario: Interactive target selection
- **GIVEN** multiple workspaces exist in the project
- **WHEN** user runs `plx transfer change --id add-feature` without `--target`
- **THEN** the CLI presents a list of available workspaces
- **AND** user can select the target workspace interactively

#### Scenario: Non-interactive mode
- **GIVEN** `--target` is not specified
- **WHEN** user runs `plx transfer change --id X --no-interactive`
- **THEN** the CLI aborts with an error requesting `--target` path

### Requirement: Task Sequence Renumbering

The CLI SHALL reassign task sequence numbers when transferring tasks to avoid collisions.

#### Scenario: Renumber transferred tasks
- **GIVEN** target workspace has tasks up to sequence 005
- **AND** source has 3 tasks to transfer
- **WHEN** transfer executes
- **THEN** transferred tasks are numbered 006, 007, 008
- **AND** task filenames are updated accordingly
- **AND** task frontmatter is updated if parent-id changed

### Requirement: JSON Output

The CLI SHALL support `--json` flag for machine-readable output.

#### Scenario: JSON output for transfer
- **GIVEN** a successful transfer operation
- **WHEN** user runs with `--json` flag
- **THEN** output includes: entityType, entityId, sourcePath, targetPath, filesTransferred, tasksRenumbered

#### Scenario: JSON output for dry-run
- **GIVEN** a dry-run operation
- **WHEN** user runs with `--json --dry-run`
- **THEN** output includes: plan object with all transfer details, conflicts array, requiresInit boolean

