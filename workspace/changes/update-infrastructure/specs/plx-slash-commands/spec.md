## MODIFIED Requirements

### Requirement: Parse Feedback Command

The system SHALL provide a `plx/parse-feedback` slash command that instructs to run the CLI parse feedback command with standardized flags.

#### Scenario: Generating parse-feedback command for Claude Code

- **WHEN** Claude Code is selected during initialization
- **THEN** create `.claude/commands/plx/parse-feedback.md`
- **AND** include frontmatter with name "Pew Pew Plx: Parse Feedback", description, category "Pew Pew Plx", and relevant tags
- **AND** wrap the command body in PLX markers
- **AND** include guardrails for: scanning tracked files, generating one task per marker
- **AND** include steps for: running `plx parse feedback <name> --parent-id <id> --parent-type <type>`, reviewing generated tasks, addressing feedback, archiving when complete
- **AND** NOT reference deprecated `--change-id`, `--spec-id`, `--task-id` flags

### Requirement: Review Command

The system SHALL provide a `plx/review` slash command that guides AI agents through reviewing implementations against specifications using standardized entity subcommand syntax.

#### Scenario: Generating review command for Claude Code

- **WHEN** Claude Code is selected during initialization
- **THEN** create `.claude/commands/plx/review.md`
- **AND** include frontmatter with name "Pew Pew Plx: Review", description, category "Pew Pew Plx", and relevant tags
- **AND** wrap the command body in PLX markers
- **AND** include guardrails for: asking what to review, using CLI to retrieve criteria, outputting language-aware feedback markers
- **AND** include steps for: asking review target, searching if ambiguous, using `plx review change --id <id>` or `plx review spec --id <id>` or `plx review task --id <id>` to retrieve criteria, reviewing implementation, inserting feedback markers, summarizing findings
- **AND** NOT reference deprecated `--change-id`, `--spec-id`, `--task-id` flags

### Requirement: Get Task Stop Behavior

The `plx/get-task` slash command SHALL instruct agents to use the standardized CLI patterns for task retrieval.

#### Scenario: Get-task command uses standardized patterns

- **WHEN** the `plx/get-task` slash command is generated
- **THEN** include reference to `plx get task` for next prioritized task
- **AND** include reference to `plx get task --id <id>` for specific task
- **AND** include reference to `plx get task --parent-id <id>` for tasks from specific parent
- **AND** include a step instructing agents to stop after task completion
- **AND** include instruction to await user confirmation before proceeding to the next task
- **AND** NOT include instruction to automatically get the next task after completion

### Requirement: PLX Command Registry Updates

The system SHALL register new PLX commands in the PlxSlashCommandRegistry with standardized CLI patterns.

#### Scenario: Registering commands with standardized patterns

- **WHEN** the PLX slash command system is initialized
- **THEN** include all PLX commands in `ALL_PLX_COMMANDS`
- **AND** provide template bodies using standardized `plx {verb} {entity} --id/--parent-id` patterns
- **AND** NOT include deprecated command patterns in any template

## ADDED Requirements

### Requirement: Archive Command Slash Command

The system SHALL provide a `plx/archive` slash command that uses standardized entity subcommand syntax.

#### Scenario: Generating archive command for Claude Code

- **WHEN** Claude Code is selected during initialization
- **THEN** create `.claude/commands/plx/archive.md`
- **AND** include frontmatter with name "Pew Pew Plx: Archive", description, category "Pew Pew Plx", and relevant tags
- **AND** wrap the command body in PLX markers
- **AND** include steps for: running `plx archive change --id <id>` or `plx archive review --id <id>`
- **AND** NOT reference deprecated positional argument syntax

### Requirement: Create Command Slash Command

The system SHALL provide a `plx/create` slash command for entity creation using standardized syntax.

#### Scenario: Generating create command for Claude Code

- **WHEN** Claude Code is selected during initialization
- **THEN** create `.claude/commands/plx/create.md`
- **AND** include frontmatter with name "Pew Pew Plx: Create", description, category "Pew Pew Plx", and relevant tags
- **AND** wrap the command body in PLX markers
- **AND** include examples for:
  - `plx create task "Title"` for standalone task
  - `plx create task "Title" --parent-id <id>` for parented task
  - `plx create change "Name"` for change proposal
  - `plx create spec "Name"` for spec
  - `plx create request "Description"` for request

### Requirement: Standardized CLI Pattern References

All slash commands SHALL use the standardized `plx {verb} {entity} --id/--parent-id` CLI pattern in their instructions.

#### Scenario: Slash commands use standardized patterns

- **WHEN** any slash command is generated
- **THEN** use `plx get changes` instead of `plx list`
- **AND** use `plx get specs` instead of `plx list --specs`
- **AND** use `plx get change --id <id>` instead of `plx show <id>`
- **AND** use `plx validate change --id <id>` instead of `plx validate <id>`
- **AND** use `plx archive change --id <id>` instead of `plx archive <id>`
- **AND** use `--parent-id` and `--parent-type` instead of entity-specific flags

### Requirement: Centralized Task Storage References

All slash commands SHALL reference the centralized `workspace/tasks/` storage location.

#### Scenario: Slash commands reference centralized storage

- **WHEN** a slash command references task locations
- **THEN** reference `workspace/tasks/` as the storage location
- **AND** reference `workspace/tasks/archive/` for archived tasks
- **AND** NOT reference nested `changes/<name>/tasks/` paths
- **AND** NOT reference nested `reviews/<name>/tasks/` paths
