## ADDED Requirements

### Requirement: Task Type Display

The CLI SHALL display task type information when retrieving tasks.

#### Scenario: Display type badge in task output

- **WHEN** user runs `splx get task`
- **AND** the task has a `type:` field in frontmatter
- **THEN** display the type with its emoji prefix before the task title
- **AND** include type in JSON output as `type` field

#### Scenario: Display type in task list

- **WHEN** user runs `splx get tasks`
- **AND** tasks have `type:` fields
- **THEN** show Type column with emoji + type name
- **AND** include type in JSON output for each task

#### Scenario: Missing type indicator

- **WHEN** user runs `splx get task`
- **AND** the task does not have a `type:` field
- **THEN** display type as "unknown" in output
- **AND** include `type: null` in JSON output

### Requirement: Blocked-By Display

The CLI SHALL display dependency information when retrieving tasks.

#### Scenario: Display blocked-by in task output

- **WHEN** user runs `splx get task`
- **AND** the task has a `blocked-by:` field in frontmatter
- **THEN** display "Blocked by:" section with list of blocking task IDs
- **AND** for each blocking task, show its status (done/in-progress/to-do)
- **AND** include `blockedBy` array in JSON output

#### Scenario: Cross-change dependency display

- **WHEN** user runs `splx get task`
- **AND** the task has `blocked-by: [other-change/001-task]`
- **THEN** display the full path including change ID
- **AND** resolve status from the referenced change's task

#### Scenario: Unresolved dependency warning

- **WHEN** user runs `splx get task`
- **AND** the task references a blocking task that doesn't exist
- **THEN** display warning "Blocking task 'X' not found"
- **AND** include warning in JSON output

### Requirement: Dependency-Aware Task Selection

The CLI SHALL consider dependencies when selecting the next task, showing advisory warnings but not blocking.

#### Scenario: Advisory dependency warning

- **WHEN** user runs `splx get task`
- **AND** the next prioritized task has incomplete blocking tasks
- **THEN** display info message listing incomplete blockers
- **AND** still return and display the task (advisory, not blocking)
- **AND** include `hasIncompleteBlockers: true` in JSON output

#### Scenario: All blockers complete

- **WHEN** user runs `splx get task`
- **AND** the next prioritized task has all blocking tasks with status `done`
- **THEN** proceed normally without dependency warnings
- **AND** include `hasIncompleteBlockers: false` in JSON output
