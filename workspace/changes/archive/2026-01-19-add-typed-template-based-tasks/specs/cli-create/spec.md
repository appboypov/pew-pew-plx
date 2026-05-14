## MODIFIED Requirements

### Requirement: Create Task Command

The CLI SHALL provide a `create task` subcommand that creates a new task file with the specified title and optional parameters.

#### Scenario: Create task with type

- **WHEN** user runs `splx create task "Title" --type story --parent-id add-feature --parent-type change`
- **THEN** create task file in `workspace/tasks/` with next sequence number
- **AND** include `type: story` in frontmatter
- **AND** include `parent-id` and `parent-type` in frontmatter
- **AND** use template structure for type `story` if available

#### Scenario: Create task with blocked-by

- **WHEN** user runs `splx create task "Title" --blocked-by 001-setup,002-config`
- **THEN** create task file with `blocked-by: [001-setup, 002-config]` in frontmatter
- **AND** validate that referenced tasks exist (warn if not)

#### Scenario: Create task without type

- **WHEN** user runs `splx create task "Title" --parent-id add-feature --parent-type change`
- **AND** no `--type` is specified
- **THEN** create task file without `type:` field in frontmatter
- **AND** use generic task structure

#### Scenario: Interactive type selection

- **WHEN** user runs `splx create task "Title"` without `--type`
- **AND** running in interactive mode
- **THEN** prompt user to select a type from available templates
- **AND** show list of built-in and user-defined types
- **AND** allow "none" selection for untyped task
