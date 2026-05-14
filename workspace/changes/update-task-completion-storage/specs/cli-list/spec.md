## MODIFIED Requirements
### Requirement: Task Counting
The command SHALL accurately count task completion status by treating each task file as one task; a task file is complete only when it contains no unchecked markdown checkboxes.

#### Scenario: Counting tasks in tasks directory
- **WHEN** parsing a change's task files
- **THEN** scan the `tasks/` directory for files matching `NNN-*.md` pattern
- **AND** treat each file as exactly one task
- **AND** mark the task complete only when the file contains zero unchecked markdown checkboxes (`- [ ]`) anywhere in the file
- **AND** compute aggregate totals by counting completed vs incomplete task files
