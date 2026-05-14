# cli-view Specification

## Purpose

The `splx view` command provides a comprehensive dashboard view of the OpenSplx project state, displaying specifications, changes, and progress metrics in a unified, visually appealing format to help developers quickly understand project status.
## Requirements
### Requirement: Dashboard Display

The system SHALL provide a `view` command that displays a dashboard overview of specs and changes.

#### Scenario: Basic dashboard display

- **WHEN** user runs `splx view`
- **THEN** system displays a formatted dashboard with sections for summary, active changes, completed changes, and specifications

#### Scenario: No workspace directory

- **WHEN** user runs `splx view` in a directory without OpenSplx
- **THEN** system displays error message "No workspace directory found"

### Requirement: Summary Section

The dashboard SHALL display a summary section with key project metrics.

#### Scenario: Complete summary display

- **WHEN** dashboard is rendered with specs and changes
- **THEN** system shows total number of specifications and requirements
- **AND** shows number of active changes in progress
- **AND** shows number of completed changes
- **AND** shows overall task progress percentage

#### Scenario: Empty project summary

- **WHEN** no specs or changes exist
- **THEN** summary shows zero counts for all metrics

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

### Requirement: Specifications Display

The dashboard SHALL display specifications sorted by requirement count.

#### Scenario: Specs listing with counts

- **WHEN** specifications exist in the project
- **THEN** system shows specs sorted by requirement count (descending) with count labels

#### Scenario: Specs with parsing errors

- **WHEN** a spec file cannot be parsed
- **THEN** system includes it with 0 requirement count

### Requirement: Visual Formatting

The dashboard SHALL use consistent visual formatting with colors and symbols.

#### Scenario: Color coding

- **WHEN** dashboard elements are displayed
- **THEN** system uses cyan for specification items
- **AND** yellow for active changes
- **AND** green for completed items
- **AND** dim gray for supplementary text

#### Scenario: Progress bar rendering

- **WHEN** displaying progress bars
- **THEN** system uses filled blocks (█) for completed portions and light blocks (░) for remaining

### Requirement: Error Handling

The view command SHALL handle errors gracefully.

#### Scenario: File system errors

- **WHEN** file system operations fail
- **THEN** system continues with available data and omits inaccessible items

#### Scenario: Invalid data structures

- **WHEN** specs or changes have invalid format
- **THEN** system skips invalid items and continues rendering

