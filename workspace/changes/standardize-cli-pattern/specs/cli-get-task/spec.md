## ADDED Requirements

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

## MODIFIED Requirements

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
