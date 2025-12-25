## MODIFIED Requirements

### Requirement: Task Completion Check

The command SHALL verify task completion status before archiving by aggregating across all task files in the `tasks/` directory.

#### Scenario: Incomplete tasks found

- **WHEN** incomplete tasks are found across any task files in `tasks/` directory (marked with `- [ ]`)
- **THEN** display all incomplete tasks to the user grouped by task file
- **AND** prompt for confirmation to continue
- **AND** default to "No" for safety

#### Scenario: All tasks complete

- **WHEN** all tasks across all task files in `tasks/` directory are complete OR no `tasks/` directory exists
- **THEN** proceed with archiving without prompting

#### Scenario: Auto-migration before check

- **WHEN** a change has legacy `tasks.md` without `tasks/` directory
- **THEN** trigger auto-migration to `tasks/001-tasks.md` before checking completion
- **AND** display migration info message

### Requirement: Archive Process

The archive operation SHALL follow a structured process to safely move changes to the archive, including the entire `tasks/` directory.

#### Scenario: Performing archive

- **WHEN** archiving a change
- **THEN** execute these steps:
  1. Create archive/ directory if it doesn't exist
  2. Generate target name as `YYYY-MM-DD-[change-name]` using current date
  3. Check if target directory already exists
  4. Update main specs from the change's future state specs (see Spec Update Process below)
  5. Move the entire change directory to the archive location, including the `tasks/` directory with all task files

#### Scenario: Archive already exists

- **WHEN** target archive already exists
- **THEN** fail with error message
- **AND** do not overwrite existing archive

#### Scenario: Successful archive

- **WHEN** move succeeds
- **THEN** display success message with archived name and list of updated specs
- **AND** confirm that all task files in `tasks/` directory were preserved in archive
