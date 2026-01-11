# cli-get-task Specification

## Purpose

The `get task` command retrieves and displays task content from PLX changes with prioritization and completion features.
## Requirements
### Requirement: Get Task Command

The CLI SHALL provide a `get task` subcommand that displays the next uncompleted task from the highest-priority change or review.

#### Scenario: Basic invocation shows next task with change context

- **WHEN** user runs `plx get task`
- **AND** active changes or reviews exist with open tasks
- **THEN** the system selects the item with highest completion percentage
- **AND** displays proposal.md/review.md content
- **AND** displays design.md content if exists
- **AND** displays the next uncompleted task content
- **AND** if the task was 'to-do', it is transitioned to 'in-progress'

#### Scenario: No active changes or reviews

- **WHEN** user runs `plx get task`
- **AND** no active changes or reviews exist
- **THEN** the system displays "No active changes found"

#### Scenario: All tasks complete

- **WHEN** user runs `plx get task`
- **AND** all tasks in all changes and reviews have status `done`
- **THEN** the system displays "All tasks complete"

### Requirement: Task Completion Flag

The CLI SHALL support a `--did-complete-previous` flag that completes the in-progress task with full checkbox marking and shows only the next task.

#### Scenario: Complete previous and advance to next

- **WHEN** user runs `plx get task --did-complete-previous`
- **AND** a task has status `in-progress`
- **THEN** all unchecked items in `## Implementation Checklist` are marked as `[x]`
- **AND** checkboxes in `## Constraints` section are NOT modified
- **AND** checkboxes in `## Acceptance Criteria` section are NOT modified
- **AND** the in-progress task status is updated to `done`
- **AND** the next to-do task status is updated to `in-progress`
- **AND** only the next task content is displayed (no change documents)
- **AND** output shows completed task name and list of marked checkbox items

#### Scenario: Flag used with no in-progress task

- **WHEN** user runs `plx get task --did-complete-previous`
- **AND** no task has status `in-progress`
- **THEN** the system displays a warning "No in-progress task found"
- **AND** the next to-do task status is updated to `in-progress`
- **AND** only that task content is displayed

#### Scenario: JSON output includes completed task info

- **WHEN** user runs `plx get task --did-complete-previous --json`
- **AND** a task was completed
- **THEN** the JSON output includes `completedTask` object with `name` and `completedItems` array

### Requirement: JSON Output

The CLI SHALL support a `--json` flag for machine-readable output.

#### Scenario: JSON output structure

- **WHEN** user runs `plx get task --json`
- **THEN** the output is valid JSON containing:
  - `changeId`: selected change directory name
  - `task`: object with filename, filepath, sequence, name, status
  - `taskContent`: full task markdown content
  - `changeDocuments`: optional object with proposal and design content
  - `completedTask`: optional object with name and completedItems when `--did-complete-previous` used
  - `warning`: optional warning message

### Requirement: Task ID Retrieval

The CLI SHALL support an `--id` flag on `get task` to retrieve a specific task by filename without extension, searching both changes and reviews.

#### Scenario: Retrieve task by ID

- **WHEN** user runs `plx get task --id 001-implement`
- **AND** task file `001-implement.md` exists in any active change or review
- **THEN** the system displays the task content
- **AND** does not display change documents (proposal.md, design.md)

#### Scenario: Retrieve task by full ID from review

- **WHEN** user runs `plx get task --id my-review/001-fix`
- **AND** task file `001-fix.md` exists in review `my-review`
- **THEN** the system displays the task content

#### Scenario: Task ID not found

- **WHEN** user runs `plx get task --id nonexistent`
- **AND** no task file matches the ID in any change or review
- **THEN** the system displays error "Task 'nonexistent' not found"
- **AND** exits with non-zero status

#### Scenario: Task ID with JSON output

- **WHEN** user runs `plx get task --id 001-implement --json`
- **THEN** the JSON output includes task metadata and content
- **AND** does not include changeDocuments field

### Requirement: Content Filtering

The CLI SHALL support `--constraints` and `--acceptance-criteria` flags to filter task content to specific sections.

#### Scenario: Filter to constraints only

- **WHEN** user runs `plx get task --constraints`
- **THEN** only the `## Constraints` section is displayed with its header and content

#### Scenario: Filter to acceptance criteria only

- **WHEN** user runs `plx get task --acceptance-criteria`
- **THEN** only the `## Acceptance Criteria` section is displayed with its header and content

#### Scenario: Combine filter flags

- **WHEN** user runs `plx get task --constraints --acceptance-criteria`
- **THEN** both sections are displayed in original document order
- **AND** no other sections are displayed

#### Scenario: Filter with task ID

- **WHEN** user runs `plx get task --id 001-impl --constraints`
- **THEN** only the Constraints section from task 001-impl is displayed

#### Scenario: Section not found

- **WHEN** user runs `plx get task --constraints`
- **AND** the task does not have a Constraints section
- **THEN** the system displays empty output or a message indicating section not found

### Requirement: Get Change Command

The CLI SHALL provide a `get change` subcommand to retrieve a specific change proposal by ID, with filtering options from the show command.

#### Scenario: Retrieve change by ID

- **WHEN** user runs `plx get change --id add-feature`
- **AND** change directory `add-feature` exists
- **THEN** the system displays proposal.md content
- **AND** displays design.md content if exists
- **AND** displays list of tasks with status

#### Scenario: Change not found

- **WHEN** user runs `plx get change --id nonexistent`
- **AND** no change directory matches the ID
- **THEN** the system displays error "Change 'nonexistent' not found"

#### Scenario: Change with content filters

- **WHEN** user runs `plx get change --id add-feature --constraints`
- **THEN** displays Constraints sections from all tasks aggregated with task identifiers

#### Scenario: Change JSON output

- **WHEN** user runs `plx get change --id add-feature --json`
- **THEN** the output is valid JSON with proposal, design, and tasks

#### Scenario: Change with deltas only

- **WHEN** user runs `plx get change --id add-feature --deltas-only`
- **THEN** displays only the deltas in JSON format
- **AND** excludes proposal why/what sections

### Requirement: Get Spec Command

The CLI SHALL provide a `get spec` subcommand to retrieve a specific specification by ID, with filtering options from the show command.

#### Scenario: Retrieve spec by ID

- **WHEN** user runs `plx get spec --id user-auth`
- **AND** spec directory `user-auth` exists
- **THEN** the system displays spec.md content
- **AND** displays design.md content if exists

#### Scenario: Spec not found

- **WHEN** user runs `plx get spec --id nonexistent`
- **AND** no spec directory matches the ID
- **THEN** the system displays error "Spec 'nonexistent' not found"

#### Scenario: Spec JSON output

- **WHEN** user runs `plx get spec --id user-auth --json`
- **THEN** the output is valid JSON with spec content

#### Scenario: Spec requirements only

- **WHEN** user runs `plx get spec --id user-auth --requirements`
- **THEN** displays only requirement names and SHALL statements
- **AND** excludes scenario content

#### Scenario: Spec without scenarios

- **WHEN** user runs `plx get spec --id user-auth --no-scenarios`
- **THEN** displays spec content excluding scenario blocks

#### Scenario: Specific requirement

- **WHEN** user runs `plx get spec --id user-auth -r 1`
- **THEN** displays only the requirement at index 1

### Requirement: Get Tasks Command

The CLI SHALL provide a `get tasks` subcommand to list tasks with filtering options.

#### Scenario: List all open tasks

- **WHEN** user runs `plx get tasks`
- **THEN** displays a summary table of all open tasks across all changes and reviews
- **AND** table includes columns: ID, Name, Status, Parent, ParentType

#### Scenario: List tasks for specific parent

- **WHEN** user runs `plx get tasks --parent-id add-feature`
- **AND** parent `add-feature` exists (unambiguously)
- **THEN** displays tasks only from that parent

#### Scenario: Tasks JSON output

- **WHEN** user runs `plx get tasks --json`
- **THEN** the output is valid JSON array of task summaries
- **AND** each task includes parentType field

### Requirement: Shell Completion Support

The CLI SHALL include `get` command in shell completion registry.

#### Scenario: Get command completions

- **WHEN** user types `plx get <TAB>`
- **THEN** completions include: task, change, spec, tasks

#### Scenario: Get task flag completions

- **WHEN** user types `plx get task --<TAB>`
- **THEN** completions include: id, constraints, acceptance-criteria, json, did-complete-previous

#### Scenario: Dynamic ID completions

- **WHEN** user types `plx get change --id <TAB>`
- **THEN** completions include available change IDs

### Requirement: Automatic Task Completion

The CLI SHALL automatically detect when an in-progress task is fully complete and advance to the next task without requiring the `--did-complete-previous` flag.

#### Scenario: Auto-complete in-progress task with all checklist items done

- **WHEN** user runs `plx get task`
- **AND** the current in-progress task has all Implementation Checklist items checked
- **AND** the task has at least one checklist item
- **THEN** the system updates the in-progress task status to `done`
- **AND** the system finds the next to-do task
- **AND** the system updates the next task status to `in-progress`
- **AND** the system displays only the next task content (no change documents)
- **AND** the system shows a message indicating auto-completion occurred

#### Scenario: No auto-completion for partially complete task

- **WHEN** user runs `plx get task`
- **AND** the current in-progress task has unchecked Implementation Checklist items
- **THEN** the system displays the in-progress task normally with change documents
- **AND** the task status remains `in-progress`

#### Scenario: No auto-completion for task with zero checklist items

- **WHEN** user runs `plx get task`
- **AND** the current in-progress task has no Implementation Checklist items
- **THEN** the system displays the in-progress task normally with change documents
- **AND** the task status remains `in-progress`

#### Scenario: Auto-completion when no more tasks remain

- **WHEN** user runs `plx get task`
- **AND** the current in-progress task has all Implementation Checklist items checked
- **AND** no other to-do tasks exist in the change
- **THEN** the system updates the task status to `done`
- **AND** the system displays "All tasks complete"

#### Scenario: JSON output includes auto-completed task info

- **WHEN** user runs `plx get task --json`
- **AND** a task was auto-completed
- **THEN** the JSON output includes `autoCompletedTask` object with `name` string

### Requirement: Auto-Transition to In-Progress

The CLI SHALL automatically transition to-do tasks to in-progress when retrieved.

#### Scenario: Auto-transition on prioritized retrieval

- **WHEN** user runs `plx get task`
- **AND** the next task has status 'to-do'
- **THEN** the task status is automatically set to 'in-progress'
- **THEN** the output indicates the transition occurred

#### Scenario: Auto-transition on ID-based retrieval

- **WHEN** user runs `plx get task --id <task-id>`
- **AND** the task has status 'to-do'
- **THEN** the task status is automatically set to 'in-progress'
- **THEN** the output indicates the transition occurred

#### Scenario: No transition for in-progress task

- **WHEN** user runs `plx get task --id <task-id>`
- **AND** the task has status 'in-progress'
- **THEN** the task status remains 'in-progress'
- **THEN** no transition message is displayed

#### Scenario: No transition for done task

- **WHEN** user runs `plx get task --id <task-id>`
- **AND** the task has status 'done'
- **THEN** the task status remains 'done'
- **THEN** no transition message is displayed

#### Scenario: JSON output includes transition flag

- **WHEN** user runs `plx get task --json`
- **AND** a to-do task was transitioned to in-progress
- **THEN** the JSON output includes `transitionedToInProgress: true`

### Requirement: Task Skill Level Display

The CLI SHALL display task skill level in output when the field is present in task frontmatter.

#### Scenario: Skill level shown in text output

- **WHEN** user runs `plx get task`
- **AND** the task has a `skill-level` field in frontmatter
- **THEN** the skill level (junior/medior/senior) SHALL be displayed in the task header

#### Scenario: Skill level shown in JSON output

- **WHEN** user runs `plx get task --json`
- **AND** the task has a `skill-level` field in frontmatter
- **THEN** the JSON output SHALL include a `skillLevel` field with the value

#### Scenario: Skill level in tasks list

- **WHEN** user runs `plx get tasks`
- **AND** tasks have `skill-level` fields in frontmatter
- **THEN** the skill level SHALL be displayed in the table alongside status

#### Scenario: Missing skill level handled gracefully

- **WHEN** user runs `plx get task`
- **AND** the task does not have a `skill-level` field
- **THEN** the output SHALL not include skill level information
- **AND** no error SHALL occur

### Requirement: Get Changes Command

The CLI SHALL provide a `get changes` subcommand to list all active changes.

#### Scenario: List all changes

- **WHEN** user runs `plx get changes`
- **THEN** the system scans `workspace/changes/` directory
- **AND** excludes the `archive/` subdirectory
- **AND** displays each change with name, tracked issue (if present), and task progress
- **AND** output format matches existing `plx list` behavior

#### Scenario: JSON output for changes

- **WHEN** user runs `plx get changes --json`
- **THEN** the output is valid JSON array of change objects
- **AND** each object includes: id, trackedIssues, taskProgress

#### Scenario: No active changes

- **WHEN** user runs `plx get changes`
- **AND** no active changes exist
- **THEN** the system displays "No active changes found."

### Requirement: Get Specs Command

The CLI SHALL provide a `get specs` subcommand to list all specifications.

#### Scenario: List all specs

- **WHEN** user runs `plx get specs`
- **THEN** the system scans `workspace/specs/` directory
- **AND** displays each spec with ID and requirement count
- **AND** output format matches existing `plx list --specs` behavior

#### Scenario: JSON output for specs

- **WHEN** user runs `plx get specs --json`
- **THEN** the output is valid JSON array of spec objects
- **AND** each object includes: id, requirementCount

#### Scenario: No specs found

- **WHEN** user runs `plx get specs`
- **AND** no specs exist
- **THEN** the system displays "No specs found."

### Requirement: Get Reviews Command

The CLI SHALL provide a `get reviews` subcommand to list all active reviews.

#### Scenario: List all reviews

- **WHEN** user runs `plx get reviews`
- **THEN** the system scans `workspace/reviews/` directory
- **AND** excludes the `archive/` subdirectory
- **AND** displays each review with name, target type, and task progress
- **AND** output format matches existing `plx list --reviews` behavior

#### Scenario: JSON output for reviews

- **WHEN** user runs `plx get reviews --json`
- **THEN** the output is valid JSON array of review objects
- **AND** each object includes: id, targetType, targetId, taskProgress

#### Scenario: No active reviews

- **WHEN** user runs `plx get reviews`
- **AND** no active reviews exist
- **THEN** the system displays "No active reviews found."

### Requirement: Get Review Command

The CLI SHALL provide a `get review` subcommand to retrieve a specific review by ID.

#### Scenario: Retrieve review by ID

- **WHEN** user runs `plx get review --id code-quality`
- **AND** review directory `code-quality` exists
- **THEN** the system displays review.md content
- **AND** displays list of tasks with status and spec-impact

#### Scenario: Review not found

- **WHEN** user runs `plx get review --id nonexistent`
- **AND** no review directory matches the ID
- **THEN** the system displays error "Review 'nonexistent' not found"
- **AND** exits with non-zero status

#### Scenario: Review JSON output

- **WHEN** user runs `plx get review --id code-quality --json`
- **THEN** the output is valid JSON with review details and tasks

### Requirement: Parent Type Filter for Tasks

The CLI SHALL support a `--parent-type` flag on `get tasks` to filter by parent entity type.

#### Scenario: Filter tasks by parent type

- **WHEN** user runs `plx get tasks --parent-type change`
- **THEN** only tasks from changes are displayed
- **AND** tasks from reviews and specs are excluded

#### Scenario: Filter tasks from reviews

- **WHEN** user runs `plx get tasks --parent-type review`
- **THEN** only tasks from reviews are displayed

#### Scenario: Filter tasks from specs

- **WHEN** user runs `plx get tasks --parent-type spec`
- **THEN** only tasks linked to specs are displayed

#### Scenario: Parent ID with type disambiguation

- **WHEN** user runs `plx get tasks --parent-id feature-x`
- **AND** `feature-x` exists as both a change and a review
- **THEN** the system displays error "Ambiguous parent ID 'feature-x'. Use --parent-type to specify: change, review"
- **AND** exits with non-zero status

#### Scenario: Parent ID with explicit type

- **WHEN** user runs `plx get tasks --parent-id feature-x --parent-type change`
- **THEN** tasks from the change `feature-x` are displayed
- **AND** no ambiguity error occurs

#### Scenario: Invalid parent type

- **WHEN** user runs `plx get tasks --parent-type invalid`
- **THEN** the system displays error with valid options: change, review, spec
- **AND** exits with non-zero status

