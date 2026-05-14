## MODIFIED Requirements
### Requirement: Task Directory Structure
`workspace/AGENTS.md` SHALL document that tasks are stored in change-local `tasks/` directories for change-linked tasks and in `workspace/tasks/` for non-change tasks.

#### Scenario: Documenting task directory structure
- **WHEN** an agent reads the task creation instructions
- **THEN** find documentation that change-linked tasks are stored in `workspace/changes/<change-id>/tasks/`
- **AND** find documentation that non-change tasks (review or standalone) are stored in `workspace/tasks/`
- **AND** find that each task file is named with a three-digit prefix (e.g., `001-<task-name>.md`)
- **AND** find that files are processed in sequence order based on the numeric prefix
- **AND** find guidance that minimum 3 task files are recommended: implementation, review, testing

#### Scenario: Documenting auto-migration behavior
- **WHEN** an agent encounters a legacy change with `tasks.md`
- **THEN** find documentation that CLI auto-migrates `tasks.md` to `tasks/001-tasks.md`
- **AND** understand that migration happens transparently on first CLI access

#### Scenario: Documenting task counting rules
- **WHEN** an agent reads about task progress calculation
- **THEN** find documentation that any unchecked markdown checkbox keeps the task incomplete
- **AND** find documentation that tasks are complete only when no unchecked checkboxes remain
