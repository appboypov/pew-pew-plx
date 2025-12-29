## MODIFIED Requirements

### Requirement: Command Execution
The command SHALL scan and analyze either active changes or specs based on the selected mode.

#### Scenario: Scanning for changes (default)
- **WHEN** `plx list` is executed without flags
- **THEN** scan the `workspace/changes/` directory for change directories
- **AND** exclude the `archive/` subdirectory from results
- **AND** trigger auto-migration if legacy `tasks.md` exists without `tasks/` directory
- **AND** parse each change's `tasks/` directory to count task completion across all task files

#### Scenario: Scanning for specs
- **WHEN** `plx list --specs` is executed
- **THEN** scan the `workspace/specs/` directory for capabilities
- **AND** read each capability's `spec.md`
- **AND** parse requirements to compute requirement counts

### Requirement: Task Counting

The command SHALL accurately count task completion status by aggregating across all task files in the `tasks/` directory, ignoring checkboxes under Constraints and Acceptance Criteria sections.

#### Scenario: Counting tasks in tasks directory

- **WHEN** parsing a change's task files
- **THEN** scan the `tasks/` directory for files matching `NNN-*.md` pattern
- **AND** count tasks in each file matching these patterns:
  - Completed: Lines containing `- [x]`
  - Incomplete: Lines containing `- [ ]`
- **AND** ignore checkboxes under `## Constraints` header
- **AND** ignore checkboxes under `## Acceptance Criteria` header
- **AND** calculate aggregate total as sum of all task files' completed and incomplete counts

### Requirement: Error Handling

The command SHALL gracefully handle missing files and directories with appropriate messages.

#### Scenario: Missing tasks directory

- **WHEN** a change directory has no `tasks/` directory and no `tasks.md` file
- **THEN** display the change with "No tasks" status

#### Scenario: Empty tasks directory

- **WHEN** a change directory has an empty `tasks/` directory
- **THEN** display the change with "No tasks" status

#### Scenario: Missing changes directory

- **WHEN** `workspace/changes/` directory doesn't exist
- **THEN** display error: "No PLX changes directory found. Run 'plx init' first."
- **AND** exit with code 1
