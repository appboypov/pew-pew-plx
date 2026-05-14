## MODIFIED Requirements
### Requirement: Active Changes Display
The dashboard SHALL show active changes with visual progress indicators using change-local task storage.

#### Scenario: Task progress from change task storage
- **WHEN** calculating change progress
- **THEN** system reads task files from `workspace/changes/<change-id>/tasks/`
- **AND** treats each task file as one task
- **AND** considers a task complete only when the file contains no unchecked markdown checkboxes

### Requirement: Completed Changes Display
The dashboard SHALL list completed changes in a separate section based on change-local task progress.

#### Scenario: Completed changes listing
- **WHEN** there are completed changes (all linked tasks complete or no task files)
- **THEN** system determines completion using change-local task files and file-level completion rules
