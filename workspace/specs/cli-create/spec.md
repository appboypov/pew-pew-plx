# cli-create Specification

## Purpose
TBD - created by archiving change add-create-command. Update Purpose after archive.
## Requirements
### Requirement: Create Task Command

The command SHALL create standalone or parented task files with proper frontmatter and content structure.

#### Scenario: Creating standalone task

- **WHEN** `plx create task "Fix typo in README"` is executed
- **THEN** create task file at appropriate location
- **AND** use filename format `NNN-<slugified-title>.md`
- **AND** include frontmatter with `status: to-do`
- **AND** populate `# Task: <title>` header and template sections

#### Scenario: Creating parented task with unambiguous parent

- **WHEN** `plx create task "Implement feature" --parent-id add-feature` is executed
- **AND** only one entity with ID `add-feature` exists across changes, reviews, and specs
- **THEN** create task file linked to that parent
- **AND** include frontmatter with `status: to-do`, `parent-type`, and `parent-id`
- **AND** use filename format `NNN-<parent-id>-<slugified-title>.md`

#### Scenario: Creating parented task with explicit parent type

- **WHEN** `plx create task "Review logic" --parent-id my-spec --parent-type spec` is executed
- **THEN** create task file linked to spec `my-spec`
- **AND** include frontmatter with `status: to-do`, `parent-type: spec`, `parent-id: my-spec`

#### Scenario: Handling ambiguous parent ID

- **WHEN** `plx create task "Task" --parent-id shared-name` is executed
- **AND** multiple entities with ID `shared-name` exist across different types
- **THEN** exit with error code 1
- **AND** display error message listing conflicting types
- **AND** suggest using `--parent-type` flag to disambiguate

#### Scenario: Handling non-existent parent

- **WHEN** `plx create task "Task" --parent-id non-existent` is executed
- **AND** no entity with ID `non-existent` exists
- **THEN** exit with error code 1
- **AND** display error message indicating parent not found

### Requirement: Create Change Command

The command SHALL scaffold a complete change proposal directory structure.

#### Scenario: Creating change proposal

- **WHEN** `plx create change "Add user authentication"` is executed
- **THEN** create directory `workspace/changes/<slugified-name>/`
- **AND** create `proposal.md` with template content including title from argument
- **AND** create empty `tasks/` directory
- **AND** create empty `specs/` directory
- **AND** display success message with created paths

#### Scenario: Handling duplicate change name

- **WHEN** `plx create change "Existing Change"` is executed
- **AND** `workspace/changes/existing-change/` already exists
- **THEN** exit with error code 1
- **AND** display error message indicating change already exists

### Requirement: Create Spec Command

The command SHALL scaffold a spec directory with template spec file.

#### Scenario: Creating spec

- **WHEN** `plx create spec "User Authentication"` is executed
- **THEN** create directory `workspace/specs/<slugified-name>/`
- **AND** create `spec.md` with template content including title from argument
- **AND** display success message with created path

#### Scenario: Handling duplicate spec name

- **WHEN** `plx create spec "Existing Spec"` is executed
- **AND** `workspace/specs/existing-spec/` already exists
- **THEN** exit with error code 1
- **AND** display error message indicating spec already exists

### Requirement: Create Request Command

The command SHALL create a request file as a pre-proposal artifact.

#### Scenario: Creating request

- **WHEN** `plx create request "Add dark mode support"` is executed
- **THEN** create directory `workspace/changes/<slugified-name>/`
- **AND** create `request.md` with template content including description from argument
- **AND** template includes sections: Source Input, Current Understanding, Identified Ambiguities, Decisions, Final Intent
- **AND** display success message with created path

#### Scenario: Handling duplicate request name

- **WHEN** `plx create request "Existing Request"` is executed
- **AND** `workspace/changes/existing-request/` already exists
- **THEN** exit with error code 1
- **AND** display error message indicating change directory already exists

### Requirement: Task Template Structure

The task template SHALL include all standard task sections.

#### Scenario: Task template content

- **WHEN** a task is created via `plx create task`
- **THEN** the generated file SHALL include:
  - YAML frontmatter with `status: to-do`
  - `# Task: <title>` header
  - `## End Goal` section (empty)
  - `## Currently` section (empty)
  - `## Should` section (empty)
  - `## Constraints` section with checkbox placeholders
  - `## Acceptance Criteria` section with checkbox placeholders
  - `## Implementation Checklist` section with checkbox placeholders
  - `## Notes` section (empty)

### Requirement: Change Template Structure

The change proposal template SHALL include standard proposal sections.

#### Scenario: Change proposal template content

- **WHEN** a change is created via `plx create change`
- **THEN** the generated `proposal.md` SHALL include:
  - `# Change: <name>` header
  - `## Why` section (empty)
  - `## What Changes` section with placeholder bullets
  - `## Impact` section with placeholders for affected specs and code

### Requirement: Spec Template Structure

The spec template SHALL include standard specification sections.

#### Scenario: Spec template content

- **WHEN** a spec is created via `plx create spec`
- **THEN** the generated `spec.md` SHALL include:
  - `# <name> Specification` header
  - `## Purpose` section (empty)
  - `## Requirements` section (empty)
  - `## Why` section (empty)

### Requirement: Request Template Structure

The request template SHALL include sections aligned with `plx/plan-request` output.

#### Scenario: Request template content

- **WHEN** a request is created via `plx create request`
- **THEN** the generated `request.md` SHALL include:
  - `# Request: <description>` header
  - `## Source Input` section (empty)
  - `## Current Understanding` section (empty)
  - `## Identified Ambiguities` section (empty)
  - `## Decisions` section (empty)
  - `## Final Intent` section (empty)

### Requirement: Name Slugification

The command SHALL convert entity names to valid kebab-case directory/file names.

#### Scenario: Slugifying entity names

- **WHEN** an entity name contains spaces, special characters, or mixed case
- **THEN** convert to lowercase kebab-case
- **AND** remove special characters except hyphens
- **AND** collapse multiple hyphens into single hyphen
- **AND** trim leading/trailing hyphens

### Requirement: Output Formatting

The command SHALL provide clear feedback on created entities.

#### Scenario: Success output

- **WHEN** entity creation succeeds
- **THEN** display success message with entity type and location
- **AND** suggest next steps appropriate to entity type

#### Scenario: JSON output

- **WHEN** `--json` flag is provided
- **THEN** output JSON with `success`, `entityType`, `path`, and `name` fields

### Requirement: Help Text

The command SHALL provide descriptive help text for all subcommands and options.

#### Scenario: Displaying help for create command

- **WHEN** `plx create --help` is executed
- **THEN** display usage synopsis with all subcommands
- **AND** describe each subcommand's purpose

#### Scenario: Displaying help for create task subcommand

- **WHEN** `plx create task --help` is executed
- **THEN** display usage synopsis with positional and optional arguments
- **AND** describe `--parent-id` and `--parent-type` options
- **AND** list valid parent types (change, review, spec)

