# task-templates Specification

## Purpose

Defines the template system for typed tasks, including template discovery, built-in templates, and user override behavior.

## ADDED Requirements

### Requirement: Template Directory Structure

The system SHALL support a `workspace/templates/` directory for storing task templates that AI agents use when creating tasks.

#### Scenario: Template directory discovery

- **WHEN** an AI agent or CLI needs to discover available templates
- **THEN** scan `workspace/templates/` for `.md` files with `type:` frontmatter
- **AND** merge with built-in templates (user templates override built-ins)
- **AND** return list of available template types

#### Scenario: Template file format

- **WHEN** a template file is read
- **THEN** parse YAML frontmatter for `type:` field
- **AND** use the `type` value as the template identifier
- **AND** use the template body as guidance for task structure

### Requirement: Built-in Default Templates

The system SHALL ship 13 built-in templates that are available without user configuration.

#### Scenario: Built-in template types

- **WHEN** no user templates exist in `workspace/templates/`
- **THEN** the following built-in types are available:
  - `story` - User-facing features with journeys, UI, data flow
  - `bug` - Bug fixes with TDD regression tests
  - `business-logic` - ViewModels, Services, APIs, DTOs, unit tests (no UI)
  - `components` - UI components/widgets and views
  - `research` - Package evaluation, API docs, best practices
  - `discovery` - Ideas, problem exploration, business value
  - `chore` - Maintenance, cleanup tasks
  - `refactor` - Code restructuring without behavior change
  - `infrastructure` - CI/CD, deployment, hosting, DevOps
  - `documentation` - READMEs, architecture docs, API docs
  - `release` - Version bumping, changelog, release process
  - `implementation` - Wiring components to business logic, integration

#### Scenario: User template override

- **WHEN** a user creates `workspace/templates/story.md` with `type: story`
- **AND** a built-in `story` template exists
- **THEN** the user template takes precedence
- **AND** the built-in template is not used for type `story`

### Requirement: Dynamic Template Discovery

The system SHALL dynamically discover templates so that new templates are immediately available without restart or rebuild.

#### Scenario: Adding new template type

- **WHEN** a user creates `workspace/templates/my-custom.md` with `type: my-custom`
- **THEN** the type `my-custom` becomes immediately valid for tasks
- **AND** validation accepts `type: my-custom` in task frontmatter
- **AND** AI agents see `my-custom` when reading available templates

#### Scenario: Removing template type

- **WHEN** a user deletes a template file from `workspace/templates/`
- **AND** tasks exist with that type
- **THEN** existing tasks remain valid (type field is still present)
- **AND** validation warns that template for type was not found

### Requirement: Template Title Format Guidelines

Each template type SHALL have a recommended title format with emoji prefix for consistency.

#### Scenario: Title format definitions

- **WHEN** AI agents create tasks
- **THEN** use these title formats based on type:
  - `bug`: "🐞 <Thing> fails when <condition>"
  - `story`: "✨ <Actor> is able to <capability>"
  - `refactor`: "🧱 Refactor <component> to <goal>"
  - `research`: "🔬 Investigate <unknown>"
  - `chore`: "🧹 <Verb> <thing>"
  - `components`: "🧩 <Feature> UI components"
  - `business-logic`: "⚙️ <Feature> business logic"
  - `implementation`: "🔧 Wire <feature> to business logic"
  - `documentation`: "📄 Document <thing>"
  - `release`: "🚀 Prepare release v<version>"
  - `infrastructure`: "🏗️ Set up <infrastructure>"
  - `discovery`: "💡 Explore <idea>"

### Requirement: Recommended Task Ordering

The system SHALL document recommended task ordering for feature work to ensure testable, isolated pieces before integration.

#### Scenario: Feature implementation ordering

- **WHEN** AI agents plan tasks for a new feature
- **THEN** create tasks in this order:
  1. `components` tasks - Build UI components in isolation (stateless, primitive params)
  2. `business-logic` tasks - Services, ViewModels, APIs with unit tests (no UI)
  3. `implementation` tasks - Wire components to business logic, integration
- **AND** express ordering via `blocked-by` dependencies
