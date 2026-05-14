## ADDED Requirements

### Requirement: Template System Documentation

`workspace/AGENTS.md` SHALL document the template system for typed tasks.

#### Scenario: Documenting template location

- **WHEN** an agent reads task creation instructions
- **THEN** find documentation that templates are stored in `workspace/templates/`
- **AND** find that templates use `type:` frontmatter to declare their type
- **AND** find that user templates override built-in defaults

#### Scenario: Documenting available template types

- **WHEN** an agent reads template documentation
- **THEN** find list of 13 built-in template types with descriptions:
  - `story`, `bug`, `business-logic`, `components`, `research`, `discovery`, `chore`, `refactor`, `infrastructure`, `documentation`, `release`, `implementation`
- **AND** find title format guidelines with emojis for each type

#### Scenario: Documenting dynamic template creation

- **WHEN** an agent needs to create a task with no matching template
- **THEN** find guidance to propose a new template matching existing style
- **AND** find that creating `workspace/templates/<type>.md` with `type:` frontmatter makes it immediately available

### Requirement: Task Dependency Documentation

`workspace/AGENTS.md` SHALL document the `blocked-by` dependency system.

#### Scenario: Documenting blocked-by syntax

- **WHEN** an agent reads dependency documentation
- **THEN** find that `blocked-by:` is an optional array field in task frontmatter
- **AND** find syntax for same-change references: `blocked-by: [001-task-name]`
- **AND** find syntax for cross-change references: `blocked-by: [other-change/001-task]`

#### Scenario: Documenting advisory nature

- **WHEN** an agent reads dependency documentation
- **THEN** find that dependencies are advisory only
- **AND** find that blocked tasks can still be retrieved and worked on
- **AND** find that `splx get task` shows dependency warnings but doesn't block

### Requirement: Task Ordering Guidelines

`workspace/AGENTS.md` SHALL document recommended task ordering for feature work.

#### Scenario: Documenting components-first ordering

- **WHEN** an agent reads task ordering documentation
- **THEN** find recommended order: `components` → `business-logic` → `implementation`
- **AND** find rationale: testable, isolated pieces before integration
- **AND** find instruction to use `blocked-by` to express ordering

#### Scenario: Documenting title formats

- **WHEN** an agent creates tasks
- **THEN** find title format guidelines with emoji prefixes
- **AND** find examples for each task type
- **AND** find that formats help with consistency and quick identification

### Requirement: Template Reading Workflow

`workspace/AGENTS.md` SHALL instruct agents to read all templates upfront when planning.

#### Scenario: Template reading instructions

- **WHEN** an agent starts planning tasks for a proposal
- **THEN** find instruction to read all templates from `workspace/templates/`
- **AND** find instruction to also consider built-in template types
- **AND** find that templates guide task structure, not scaffolding with placeholders

## MODIFIED Requirements

### Requirement: Task File Template

`workspace/AGENTS.md` SHALL provide a complete template for task files with all required sections.

#### Scenario: Providing task file template

- **WHEN** an agent creates task files
- **THEN** find a template with these sections:
  - Frontmatter with `status`, `skill-level`, `parent-type`, `parent-id`, `type` (optional), `blocked-by` (optional)
  - `# Task: <title>` - Descriptive title with emoji based on type
  - `## End Goal` - What this task accomplishes
  - `## Currently` - Current state before this task
  - `## Should` - Expected state after this task
  - `## Constraints` - Checkbox items using `- [ ]` syntax
  - `## Acceptance Criteria` - Checkbox items using `- [ ]` syntax
  - `## Implementation Checklist` - Checkbox items using `- [ ]` syntax
  - `## Notes` - Additional context if needed

#### Scenario: Task frontmatter includes type and blocked-by

- **WHEN** an agent reads the task file template
- **THEN** find that `type:` is optional and references a template type
- **AND** find that `blocked-by:` is optional and lists blocking task IDs
- **AND** find examples of both fields in use
