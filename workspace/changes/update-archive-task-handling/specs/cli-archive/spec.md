## MODIFIED Requirements

### Requirement: Archive Process

The archive operation SHALL follow a structured process to safely move changes to the archive, including moving linked tasks from the centralized task storage to the task archive.

#### Scenario: Performing archive with centralized task storage

- **WHEN** archiving a change or review
- **THEN** execute these steps:
  1. Create archive/ directory if it doesn't exist
  2. Generate target name as `YYYY-MM-DD-[change-name]` using current date
  3. Check if target directory already exists
  4. Update main specs from the change's future state specs (see Spec Update Process)
  5. Find all tasks in `workspace/tasks/` with frontmatter `parent-id` matching the entity id and `parent-type` matching the entity type
  6. Create `workspace/tasks/archive/` directory if it doesn't exist
  7. Move matched tasks to `workspace/tasks/archive/`, preserving original filenames
  8. Move the entity directory (change or review) to the archive location

#### Scenario: Archive already exists

- **WHEN** target archive already exists
- **THEN** fail with error message
- **AND** do not overwrite existing archive

#### Scenario: Successful archive with tasks

- **WHEN** archive succeeds and linked tasks were found
- **THEN** display success message with archived name
- **AND** list number of tasks moved to `workspace/tasks/archive/`
- **AND** list of updated specs (if any)

#### Scenario: Successful archive without tasks

- **WHEN** archive succeeds and no linked tasks were found in `workspace/tasks/`
- **THEN** display success message with archived name
- **AND** do not display task-related messaging

### Requirement: Task Completion Check

The command SHALL verify task completion status before archiving by finding linked tasks in centralized task storage.

#### Scenario: Incomplete tasks found in centralized storage

- **WHEN** incomplete tasks are found in `workspace/tasks/` with matching `parent-id` and `parent-type` frontmatter (status is not `done`)
- **THEN** display all incomplete tasks to the user grouped by task file
- **AND** prompt for confirmation to continue
- **AND** default to "No" for safety

#### Scenario: All tasks complete in centralized storage

- **WHEN** all tasks in `workspace/tasks/` with matching `parent-id` and `parent-type` have status: done OR no matching tasks exist
- **THEN** proceed with archiving without prompting

### Requirement: Task Archive Location

Tasks linked to archived parents SHALL be moved to a centralized archive location rather than being discarded or left orphaned.

#### Scenario: Moving tasks to archive

- **WHEN** archiving a change or review with linked tasks
- **THEN** move tasks from `workspace/tasks/` to `workspace/tasks/archive/`
- **AND** preserve original filename (includes parent-id prefix)
- **AND** preserve all frontmatter fields including `parent-type` and `parent-id`

#### Scenario: Task archive directory creation

- **WHEN** `workspace/tasks/archive/` does not exist and tasks need to be archived
- **THEN** create the directory before moving tasks

#### Scenario: Duplicate task filename in archive

- **WHEN** a task with the same filename already exists in `workspace/tasks/archive/`
- **THEN** append a numeric suffix to the filename (e.g., `001-add-feature-impl-2.md`)
- **AND** preserve original task content

## REMOVED Requirements

### Requirement: Auto-migration before check

**Reason**: Legacy `tasks.md` migration is no longer relevant with centralized task storage. Migration handled by separate `plx migrate tasks` command.

**Migration**: Projects must run `plx migrate tasks` before using archive with centralized storage.
