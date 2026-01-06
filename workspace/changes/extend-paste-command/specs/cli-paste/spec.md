## ADDED Requirements

### Requirement: Paste Task Command

The CLI SHALL provide a `paste task` subcommand that creates a task from clipboard content.

#### Scenario: Create standalone task from clipboard

- **WHEN** user runs `plx paste task`
- **AND** clipboard contains text content
- **THEN** the system creates a task file in `workspace/tasks/` with next available sequence number
- **AND** clipboard content populates the `## End Goal` section
- **AND** task frontmatter includes `status: to-do`
- **AND** displays success message with file path and character count

#### Scenario: Create parented task from clipboard

- **WHEN** user runs `plx paste task --parent-id <id>`
- **AND** clipboard contains text content
- **AND** parent entity exists (change, review, or spec)
- **THEN** the system creates a task file in `workspace/tasks/`
- **AND** filename format is `NNN-<parent-id>-<name>.md`
- **AND** task frontmatter includes `parent-type` and `parent-id` fields
- **AND** displays success message with file path

#### Scenario: Parent not found error

- **WHEN** user runs `plx paste task --parent-id <id>`
- **AND** no entity exists with that ID
- **THEN** the system displays error "Parent entity not found: <id>"
- **AND** exits with non-zero status

#### Scenario: Task sequence number generation

- **WHEN** creating a new task
- **THEN** the system finds the highest existing sequence number for the parent (or standalone)
- **AND** assigns next available number (001, 002, etc.)

### Requirement: Paste Change Command

The CLI SHALL provide a `paste change` subcommand that creates a change proposal from clipboard content.

#### Scenario: Create change from clipboard

- **WHEN** user runs `plx paste change`
- **AND** clipboard contains text content
- **THEN** the system creates a change directory in `workspace/changes/`
- **AND** creates `proposal.md` with clipboard content in `## Why` section
- **AND** creates empty `tasks/` and `specs/` directories
- **AND** displays success message with directory path

#### Scenario: Change name derivation

- **WHEN** creating a change from clipboard
- **THEN** the system derives change name from first line of clipboard content
- **AND** converts to kebab-case (lowercase, spaces to hyphens, special chars removed)
- **AND** prefixes with `add-`, `update-`, `fix-`, or `refactor-` based on content analysis
- **OR** uses `draft-` prefix if no action verb detected

#### Scenario: Duplicate change name handling

- **WHEN** creating a change
- **AND** derived name already exists in `workspace/changes/`
- **THEN** the system appends numeric suffix (-2, -3, etc.)

### Requirement: Paste Spec Command

The CLI SHALL provide a `paste spec` subcommand that creates a spec from clipboard content.

#### Scenario: Create spec from clipboard

- **WHEN** user runs `plx paste spec`
- **AND** clipboard contains text content
- **THEN** the system creates a spec directory in `workspace/specs/`
- **AND** creates `spec.md` with clipboard content as first requirement description
- **AND** displays success message with directory path

#### Scenario: Spec name derivation

- **WHEN** creating a spec from clipboard
- **THEN** the system derives spec name from first line of clipboard content
- **AND** converts to kebab-case

#### Scenario: Duplicate spec name handling

- **WHEN** creating a spec
- **AND** derived name already exists in `workspace/specs/`
- **THEN** the system displays error "Spec already exists: <name>"
- **AND** exits with non-zero status

### Requirement: JSON Output for All Paste Subcommands

The CLI SHALL support a `--json` flag for machine-readable output on all paste subcommands.

#### Scenario: JSON success output for paste task

- **WHEN** user runs `plx paste task --json`
- **AND** operation succeeds
- **THEN** the output is valid JSON containing:
  - `path`: relative path to created task file
  - `characters`: number of characters in clipboard content
  - `entityType`: "task"
  - `success`: true
  - `parentId`: parent ID if provided (optional)

#### Scenario: JSON success output for paste change

- **WHEN** user runs `plx paste change --json`
- **AND** operation succeeds
- **THEN** the output is valid JSON containing:
  - `path`: relative path to change directory
  - `characters`: number of characters in clipboard content
  - `entityType`: "change"
  - `success`: true
  - `changeName`: derived change name

#### Scenario: JSON success output for paste spec

- **WHEN** user runs `plx paste spec --json`
- **AND** operation succeeds
- **THEN** the output is valid JSON containing:
  - `path`: relative path to spec directory
  - `characters`: number of characters in clipboard content
  - `entityType`: "spec"
  - `success`: true
  - `specName`: derived spec name

#### Scenario: JSON error output

- **WHEN** user runs any paste subcommand with `--json`
- **AND** an error occurs
- **THEN** the output is valid JSON containing:
  - `error`: error message string
- **AND** process.exitCode is set to 1

### Requirement: Shared Template System

The CLI SHALL use the same entity templates as the `plx create` command.

#### Scenario: Task template consistency

- **WHEN** creating a task via `plx paste task`
- **THEN** the task file uses the same template structure as `plx create task`
- **AND** includes standard sections: End Goal, Currently, Should, Constraints, Acceptance Criteria, Implementation Checklist, Notes

#### Scenario: Change template consistency

- **WHEN** creating a change via `plx paste change`
- **THEN** the proposal.md uses the same template structure as `plx create change`
- **AND** includes standard sections: Why, What Changes, Impact

#### Scenario: Spec template consistency

- **WHEN** creating a spec via `plx paste spec`
- **THEN** the spec.md uses the same template structure as `plx create spec`
- **AND** includes standard sections: Requirements with at least one Scenario placeholder
