## MODIFIED Requirements
### Requirement: Migrate Tasks Subcommand
The CLI SHALL provide a `migrate tasks` subcommand that moves task files to their canonical storage locations based on parent type.

#### Scenario: Rehoming centralized change tasks
- **WHEN** user runs `splx migrate tasks`
- **AND** tasks exist in `workspace/tasks/` with `parent-type: change`
- **THEN** each task file is moved to `workspace/changes/<parent-id>/tasks/`
- **AND** filename is transformed to `NNN-<task-name>.md`
- **AND** original file is removed
- **AND** empty source directories are cleaned up

#### Scenario: Basic task migration from reviews
- **WHEN** user runs `splx migrate tasks`
- **AND** tasks exist in `workspace/reviews/<name>/tasks/`
- **THEN** each task file is moved to `workspace/tasks/`
- **AND** filename is transformed to `NNN-<parent-id>-<task-name>.md`
- **AND** frontmatter `parent-type: review` is added
- **AND** frontmatter `parent-id: <name>` is added
- **AND** original file is removed
- **AND** empty source directories are cleaned up

#### Scenario: No tasks to migrate
- **WHEN** user runs `splx migrate tasks`
- **AND** no tasks exist in non-canonical locations
- **THEN** the system displays "No tasks found to migrate"
- **AND** exits with success status

#### Scenario: Target directory creation
- **WHEN** user runs `splx migrate tasks`
- **AND** required target directories do not exist
- **THEN** create `workspace/tasks/` and any needed `workspace/changes/<id>/tasks/` directories before migration
