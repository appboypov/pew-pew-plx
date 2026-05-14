## MODIFIED Requirements

### Requirement: Built-in Default Templates

The system SHALL ship 13 built-in templates that are automatically created during `splx init` and restored during `splx update` if missing.

#### Scenario: Built-in template creation during init

- **WHEN** `splx init` is run
- **THEN** create `workspace/templates/` directory if it doesn't exist
- **AND** create all 13 built-in template files with proper frontmatter and body structure
- **AND** each template contains `type:` frontmatter and `<!-- REPLACE: ... -->` placeholders

#### Scenario: Built-in template restoration during update

- **WHEN** `splx update` is run
- **AND** any built-in template file is missing from `workspace/templates/`
- **THEN** create the missing template file with default content
- **AND** do not overwrite existing template files (preserve user customizations)

#### Scenario: Built-in template types

- **WHEN** templates are created
- **THEN** the following built-in types are provided with full template structure:
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

- **WHEN** a user modifies `workspace/templates/story.md`
- **AND** `splx update` is run
- **THEN** the user's modified template is preserved
- **AND** the built-in template is not restored