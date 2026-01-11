## ADDED Requirements

### Requirement: Create Progress Command

The command SHALL generate a PROGRESS.md file with embedded task content for multi-agent handoff.

#### Scenario: Creating progress for a change

- **WHEN** `plx create progress --change-id add-feature` is executed
- **AND** the change `add-feature` exists with non-completed tasks
- **THEN** create PROGRESS.md at project root
- **AND** include a task checklist section for each non-completed task
- **AND** embed full task content within each section
- **AND** include relevant proposal context for each task
- **AND** include agent pickup instructions without PROGRESS.md references
- **AND** include `plx complete task --id <task-id>` command at end of each task block

#### Scenario: Filtering completed tasks

- **WHEN** `plx create progress --change-id add-feature` is executed
- **AND** the change has tasks with status `done`
- **THEN** exclude tasks with status `done` from PROGRESS.md
- **AND** only include tasks with status `to-do` or `in-progress`

#### Scenario: Handling change with no non-completed tasks

- **WHEN** `plx create progress --change-id add-feature` is executed
- **AND** all tasks in the change have status `done`
- **THEN** exit with error code 1
- **AND** display message indicating all tasks are complete

#### Scenario: Handling non-existent change

- **WHEN** `plx create progress --change-id non-existent` is executed
- **AND** no change with ID `non-existent` exists
- **THEN** exit with error code 1
- **AND** display error message indicating change not found

#### Scenario: JSON output

- **WHEN** `--json` flag is provided
- **THEN** output JSON with `success`, `path`, `changeId`, and `taskCount` fields
