## MODIFIED Requirements
### Requirement: Create Task Command
The command SHALL create standalone or parented task files with proper frontmatter, content structure, and location rules based on parent type.

#### Scenario: Creating standalone task
- **WHEN** `splx create task "Fix typo in README"` is executed
- **THEN** create task file in `workspace/tasks/`
- **AND** use filename format `NNN-<slugified-title>.md`
- **AND** include frontmatter with `status: to-do`
- **AND** populate `# Task: <title>` header and template sections

#### Scenario: Creating parented task with unambiguous parent
- **WHEN** `splx create task "Implement feature" --parent-id add-feature` is executed
- **AND** only one entity with ID `add-feature` exists across changes, reviews, and specs
- **THEN** create task file linked to that parent
- **AND** include frontmatter with `status: to-do`, `parent-type`, and `parent-id`
- **AND** store change-linked tasks in `workspace/changes/add-feature/tasks/` with filename `NNN-<slugified-title>.md`
- **AND** store non-change tasks in `workspace/tasks/` with filename `NNN-<parent-id>-<slugified-title>.md`

#### Scenario: Creating parented task with explicit parent type
- **WHEN** `splx create task "Review logic" --parent-id my-review --parent-type review` is executed
- **THEN** create task file linked to review `my-review`
- **AND** include frontmatter with `status: to-do`, `parent-type: review`, `parent-id: my-review`
- **AND** store the task in `workspace/tasks/` with filename `NNN-my-review-review-logic.md`

#### Scenario: Handling ambiguous parent ID
- **WHEN** `splx create task "Task" --parent-id shared-name` is executed
- **AND** multiple entities with ID `shared-name` exist across different types
- **THEN** exit with error code 1
- **AND** display error message listing conflicting types
- **AND** suggest using `--parent-type` flag to disambiguate

#### Scenario: Handling non-existent parent
- **WHEN** `splx create task "Task" --parent-id non-existent` is executed
- **AND** no entity with ID `non-existent` exists
- **THEN** exit with error code 1
- **AND** display error message indicating parent not found
