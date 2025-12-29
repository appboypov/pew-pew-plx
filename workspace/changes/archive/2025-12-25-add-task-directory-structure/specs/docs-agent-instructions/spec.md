## ADDED Requirements

### Requirement: Task Directory Structure
`workspace/AGENTS.md` SHALL document that tasks are stored in a `tasks/` directory as individual numbered markdown files instead of a single `tasks.md` file.

#### Scenario: Documenting task directory structure
- **WHEN** an agent reads the task creation instructions
- **THEN** find documentation that tasks are stored in `tasks/` directory
- **AND** find that each task file is named with a three-digit prefix (e.g., `001-<task-name>.md`)
- **AND** find that files are processed in sequence order based on the numeric prefix
- **AND** find guidance that minimum 3 task files are recommended: implementation, review, testing

#### Scenario: Documenting auto-migration behavior
- **WHEN** an agent encounters a legacy change with `tasks.md`
- **THEN** find documentation that CLI auto-migrates `tasks.md` to `tasks/001-tasks.md`
- **AND** understand that migration happens transparently on first CLI access

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

#### Scenario: Task file naming convention
- **WHEN** an agent names task files
- **THEN** find guidance to use format `NNN-<kebab-case-name>.md`
- **AND** find that NNN is a three-digit zero-padded sequence number
- **AND** find examples using `NNN-<descriptive-name>.md` pattern
