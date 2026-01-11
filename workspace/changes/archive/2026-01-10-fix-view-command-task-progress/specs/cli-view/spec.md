## MODIFIED Requirements

### Requirement: Active Changes Display

The dashboard SHALL show active changes with visual progress indicators using centralized task storage.

#### Scenario: Active changes ordered by completion percentage

- **WHEN** multiple active changes are displayed with progress information
- **THEN** list them sorted by completion percentage ascending so 0% items appear first
- **AND** treat missing progress values as 0% for ordering
- **AND** break ties by change identifier in ascending alphabetical order to keep output deterministic

#### Scenario: Task progress from centralized storage

- **WHEN** calculating change progress
- **THEN** system reads tasks from `workspace/tasks/` directory
- **AND** filters tasks by `parent-id` matching the change ID
- **AND** calculates progress from Implementation Checklist checkboxes in matched tasks

#### Scenario: Change requires proposal.md

- **WHEN** scanning for changes to display
- **THEN** system only includes directories that contain `proposal.md`
- **AND** excludes directories with only `request.md` or other files

### Requirement: Completed Changes Display

The dashboard SHALL list completed changes in a separate section based on centralized task progress.

#### Scenario: Completed changes listing

- **WHEN** there are completed changes (all linked tasks done or no linked tasks)
- **THEN** system shows them with checkmark indicators in a dedicated section

#### Scenario: Mixed completion states

- **WHEN** some changes are complete and others active
- **THEN** system separates them into appropriate sections based on task progress from centralized storage
