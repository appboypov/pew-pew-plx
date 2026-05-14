## MODIFIED Requirements
### Requirement: Paste Task Command
The CLI SHALL provide a `paste task` subcommand that creates a task from clipboard content with location rules based on parent type.

#### Scenario: Create standalone task from clipboard
- **WHEN** user runs `splx paste task`
- **AND** clipboard contains text content
- **THEN** the system creates a task file in `workspace/tasks/` with next available sequence number
- **AND** clipboard content populates the `## End Goal` section
- **AND** task frontmatter includes `status: to-do`
- **AND** displays success message with file path and character count

#### Scenario: Create parented task from clipboard
- **WHEN** user runs `splx paste task --parent-id <id>`
- **AND** clipboard contains text content
- **AND** parent entity exists (change, review, or spec)
- **THEN** the system creates a task file linked to that parent
- **AND** if the parent is a change, store the task in `workspace/changes/<id>/tasks/` with filename `NNN-<name>.md`
- **AND** if the parent is not a change, store the task in `workspace/tasks/` with filename `NNN-<parent-id>-<name>.md`
- **AND** task frontmatter includes `parent-type` and `parent-id` fields
- **AND** displays success message with file path

#### Scenario: Parent not found error
- **WHEN** user runs `splx paste task --parent-id <id>`
- **AND** no entity exists with that ID
- **THEN** the system displays error "Parent entity not found: <id>"
- **AND** exits with non-zero status

#### Scenario: Task sequence number generation
- **WHEN** creating a new task
- **THEN** the system finds the highest existing sequence number for the parent
- **AND** assigns the next available number (001, 002, etc.) within the target location
