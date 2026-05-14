## MODIFIED Requirements
### Requirement: Task Completion Check
The command SHALL verify task completion status before archiving by treating each task file as one task and marking it complete only when no unchecked markdown checkboxes remain.

#### Scenario: Incomplete tasks found
- **WHEN** a task file contains one or more unchecked markdown checkboxes (`- [ ]`)
- **THEN** display all incomplete tasks to the user grouped by task file
- **AND** prompt for confirmation to continue
- **AND** default to "No" for safety

#### Scenario: All tasks complete
- **WHEN** all task files in `tasks/` contain zero unchecked markdown checkboxes OR no `tasks/` directory exists
- **THEN** proceed with archiving without prompting

#### Scenario: Auto-migration before check
- **WHEN** a change has legacy `tasks.md` without `tasks/` directory
- **THEN** trigger auto-migration to `tasks/001-tasks.md` before checking completion
- **AND** display migration info message
