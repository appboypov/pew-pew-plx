## MODIFIED Requirements

### Requirement: Quick Reference Placement
The AI instructions SHALL begin with a quick-reference section that surfaces required file structures, templates, and formatting rules before any narrative guidance.

#### Scenario: Loading templates at the top
- **WHEN** `workspace/AGENTS.md` is regenerated or updated
- **THEN** the first substantive section after the title SHALL provide copy-ready headings for `proposal.md`, `tasks/` directory structure (now in `workspace/tasks/`), spec deltas, and scenario formatting
- **AND** link each template to the corresponding workflow step for deeper reading
- **AND** reference the standardized CLI pattern `plx {verb} {entity} --id/--parent-id`

### Requirement: Task Directory Structure
`workspace/AGENTS.md` SHALL document that tasks are stored in a centralized `workspace/tasks/` directory with parent linking instead of nested in change/review directories.

#### Scenario: Documenting centralized task storage
- **WHEN** an agent reads the task creation instructions
- **THEN** find documentation that tasks are stored in `workspace/tasks/` directory
- **AND** find that parented task files are named `NNN-<parent-id>-<name>.md`
- **AND** find that standalone task files are named `NNN-<name>.md`
- **AND** find that files include `parent-type` and `parent-id` frontmatter fields
- **AND** find that archived tasks are stored in `workspace/tasks/archive/`

#### Scenario: Documenting task filename format
- **WHEN** an agent names task files
- **THEN** find guidance that parented tasks use format `NNN-<parent-id>-<kebab-case-name>.md`
- **AND** find guidance that standalone tasks use format `NNN-<kebab-case-name>.md`
- **AND** find that NNN is a three-digit zero-padded sequence number
- **AND** find that parent-id in filename matches the parent-id frontmatter field

### Requirement: Task File Template
`workspace/AGENTS.md` SHALL provide a complete template for task files with all required sections including parent linking frontmatter.

#### Scenario: Providing task file template with parent linking
- **WHEN** an agent creates task files
- **THEN** find a template with frontmatter containing:
  - `status: to-do` (required)
  - `skill-level: junior|medior|senior` (optional)
  - `parent-type: change|review|spec` (optional for standalone)
  - `parent-id: <id>` (optional for standalone)
- **AND** find a template with these sections:
  - `# Task: <title>` - Descriptive title
  - `## End Goal` - What this task accomplishes
  - `## Currently` - Current state before this task
  - `## Should` - Expected state after this task
  - `## Constraints` - Checkbox items using `- [ ]` syntax
  - `## Acceptance Criteria` - Checkbox items using `- [ ]` syntax
  - `## Implementation Checklist` - Checkbox items using `- [ ]` syntax
  - `## Notes` - Additional context if needed

#### Scenario: Documenting task counting exclusions
- **WHEN** an agent reads about task progress calculation
- **THEN** find documentation that checkboxes under `## Constraints` are ignored
- **AND** find documentation that checkboxes under `## Acceptance Criteria` are ignored

### Requirement: CLI Command Documentation
`workspace/AGENTS.md` SHALL document the standardized CLI command pattern using `plx {verb} {entity}` syntax with consistent flags.

#### Scenario: Documenting standardized CLI pattern
- **WHEN** an agent reads the CLI Commands section
- **THEN** find commands following the `plx {verb} {entity}` pattern
- **AND** find `--id <id>` flag for specific entity lookup
- **AND** find `--parent-id <id>` flag for parent filtering
- **AND** find `--parent-type <type>` flag for disambiguating parent type
- **AND** NOT find deprecated commands (`plx list`, `plx show`, `plx change`, `plx spec`)

#### Scenario: Documenting get command variants
- **WHEN** an agent reads how to retrieve entities
- **THEN** find `plx get task --id <id>` for specific task
- **AND** find `plx get tasks` for listing all open tasks
- **AND** find `plx get tasks --parent-id <id>` for tasks of specific parent
- **AND** find `plx get changes` for listing all changes
- **AND** find `plx get change --id <id>` for specific change
- **AND** find same pattern for specs and reviews

#### Scenario: Documenting create command
- **WHEN** an agent reads how to create entities
- **THEN** find `plx create task "Title"` for standalone task
- **AND** find `plx create task "Title" --parent-id <id>` for parented task
- **AND** find `plx create change "Name"` for change proposal
- **AND** find `plx create spec "Name"` for spec
- **AND** find `plx create request "Description"` for request

## ADDED Requirements

### Requirement: Directory Structure with Centralized Tasks
`workspace/AGENTS.md` SHALL document the updated directory structure with centralized task storage.

#### Scenario: Documenting new directory structure
- **WHEN** an agent reads the Directory Structure section
- **THEN** find `workspace/tasks/` as the task storage location
- **AND** find `workspace/tasks/archive/` for archived tasks
- **AND** find that changes no longer contain a `tasks/` subdirectory
- **AND** find that reviews no longer contain a `tasks/` subdirectory

### Requirement: Parent Type Documentation
`workspace/AGENTS.md` SHALL document the supported parent types for tasks.

#### Scenario: Documenting parent types
- **WHEN** an agent reads about task parent linking
- **THEN** find that `parent-type` can be `change`, `review`, or `spec`
- **AND** find that `parent-id` must match the ID of an existing parent entity
- **AND** find that standalone tasks have no parent-type or parent-id

### Requirement: Migration Command Documentation
`workspace/AGENTS.md` SHALL document the `plx migrate tasks` command for existing projects.

#### Scenario: Documenting migration command
- **WHEN** an agent encounters an existing project with nested tasks
- **THEN** find documentation for `plx migrate tasks` command
- **AND** find that migration moves tasks from nested to centralized storage
- **AND** find that migration renames files to include parent-id prefix
- **AND** find that migration adds parent-type and parent-id frontmatter
