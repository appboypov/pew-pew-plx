## MODIFIED Requirements
### Requirement: Transfer Change Command
The CLI SHALL provide a `splx transfer change` command that moves a change directory and its linked tasks from source to target workspace.

#### Scenario: Transfer change with linked tasks
- **GIVEN** a change `add-feature` exists in source workspace with 3 linked tasks
- **WHEN** user runs `splx transfer change --id add-feature --target /path/to/target`
- **THEN** the change directory is moved to target workspace
- **AND** the change's `tasks/` directory is moved with it
- **AND** source change directory and linked tasks are deleted

#### Scenario: Transfer change with target-name
- **GIVEN** a change `add-feature` exists in source workspace
- **WHEN** user runs `splx transfer change --id add-feature --target /path/to/target --target-name new-feature`
- **THEN** the change is created as `new-feature` in target workspace
- **AND** task filenames inside `tasks/` remain unchanged

### Requirement: Transfer Task Command
The CLI SHALL provide a `splx transfer task` command that moves a single task file from source to target workspace.

#### Scenario: Transfer standalone task
- **GIVEN** a task `003-implement-cache.md` exists without parent linkage
- **WHEN** user runs `splx transfer task --id 003-implement-cache --target /path/to/target`
- **THEN** the task is moved to target `workspace/tasks/`
- **AND** the sequence number is reassigned to target's next available number
- **AND** the source task file is deleted

#### Scenario: Transfer linked change task
- **GIVEN** a task `002-add-feature-implement.md` exists with `parent-id: add-feature` and `parent-type: change`
- **WHEN** user runs `splx transfer task --id 002-add-feature-implement --target /path/to/target`
- **THEN** the task is moved to target `workspace/changes/add-feature/tasks/`
- **AND** the sequence number is reassigned within the change's tasks directory
- **AND** the filename uses `NNN-implement.md` format

#### Scenario: Transfer linked review task
- **GIVEN** a task `002-code-review-fix.md` exists with `parent-id: code-review` and `parent-type: review`
- **WHEN** user runs `splx transfer task --id 002-code-review-fix --target /path/to/target`
- **THEN** the task is moved to target `workspace/tasks/`
- **AND** the sequence number is reassigned
- **AND** the `parent-id` frontmatter is preserved
