## MODIFIED Requirements

### Requirement: Task Directory Structure

`workspace/AGENTS.md` SHALL document that tasks are stored in a centralized `workspace/tasks/` directory with optional parent linkage.

#### Scenario: Documenting centralized task structure

- **WHEN** an agent reads the task creation instructions
- **THEN** find documentation that tasks are stored in `workspace/tasks/` directory
- **AND** find that parented task files are named `NNN-<parent-id>-<name>.md`
- **AND** find that standalone task files are named `NNN-<name>.md`
- **AND** find that files are processed in sequence order based on the numeric prefix
- **AND** find guidance on frontmatter schema including parent-type and parent-id fields

#### Scenario: Documenting task frontmatter

- **WHEN** an agent creates a task file
- **THEN** find documentation that frontmatter includes:
  - `status: to-do|in-progress|done`
  - `skill-level: junior|medior|senior` (optional)
  - `parent-type: change|review|spec` (required for parented tasks)
  - `parent-id: <entity-id>` (required for parented tasks)
- **AND** find that parent-type and parent-id must be present together or both absent

#### Scenario: Documenting supported parent types

- **WHEN** an agent needs to link a task to a parent entity
- **THEN** find documentation of supported parent types: change, review, spec
- **AND** find examples showing frontmatter for each parent type

### Requirement: Task File Template

`workspace/AGENTS.md` SHALL provide a complete template for task files with all required sections.

#### Scenario: Providing task file template

- **WHEN** an agent creates task files
- **THEN** find a template with these sections:
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

#### Scenario: Task file naming convention for parented tasks

- **WHEN** an agent names parented task files
- **THEN** find guidance to use format `NNN-<parent-id>-<name>.md`
- **AND** find that NNN is a three-digit zero-padded sequence number per parent
- **AND** find examples like `001-add-feature-x-implement.md`

#### Scenario: Task file naming convention for standalone tasks

- **WHEN** an agent names standalone task files
- **THEN** find guidance to use format `NNN-<name>.md`
- **AND** find that NNN is a three-digit zero-padded sequence number
- **AND** find examples like `001-fix-typo.md`

## REMOVED Requirements

### Requirement: Auto-Migration Behavior

**Reason**: Migration from legacy `tasks.md` to centralized storage is handled by separate `add-migrate-command` proposal.

**Migration**: Users run `plx migrate tasks` to convert legacy structures.
