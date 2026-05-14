## ADDED Requirements

### Requirement: Sync Workspace Command

The system SHALL provide a `splx/sync-workspace` slash command that guides AI agents through workspace maintenance.

#### Scenario: Generating sync-workspace command for Claude Code

- **WHEN** Claude Code is selected during initialization
- **THEN** create `.claude/commands/splx/sync-workspace.md`
- **AND** include frontmatter with name "OpenSplx: Sync Workspace", description, category "OpenSplx", and relevant tags
- **AND** wrap the command body in PLX markers
- **AND** include guardrails for: sub-agent usage based on complexity, action selection via question tool or numbered list
- **AND** include steps for: parsing optional target argument, scanning workspace state, assessing items, suggesting actions, presenting selections, executing selected actions, reporting summary

#### Scenario: Global workspace sync

- **WHEN** the user runs `/splx/sync-workspace` without arguments
- **THEN** the command SHALL instruct the agent to scan all open changes, open tasks, and completed-but-not-archived changes
- **AND** assess each item for maintenance needs
- **AND** suggest actions such as archive, create tasks, update proposals, validate and fix

#### Scenario: Targeted sync

- **WHEN** the user runs `/splx/sync-workspace <change-id|task-id>`
- **THEN** the command SHALL instruct the agent to focus on the specified item
- **AND** assess only that item for maintenance needs
- **AND** suggest actions specific to that item

### Requirement: Complete Task Command

The system SHALL provide a `splx/complete-task` slash command that marks a task as done.

#### Scenario: Generating complete-task command for Claude Code

- **WHEN** Claude Code is selected during initialization
- **THEN** create `.claude/commands/splx/complete-task.md`
- **AND** include frontmatter with name "OpenSplx: Complete Task", description, category "OpenSplx", and relevant tags
- **AND** wrap the command body in PLX markers
- **AND** include step to run `splx complete task --id <task-id>` using the provided argument

### Requirement: Undo Task Command

The system SHALL provide a `splx/undo-task` slash command that reverts a task to to-do status.

#### Scenario: Generating undo-task command for Claude Code

- **WHEN** Claude Code is selected during initialization
- **THEN** create `.claude/commands/splx/undo-task.md`
- **AND** include frontmatter with name "OpenSplx: Undo Task", description, category "OpenSplx", and relevant tags
- **AND** wrap the command body in PLX markers
- **AND** include step to run `splx undo task --id <task-id>` using the provided argument

## MODIFIED Requirements

### Requirement: PLX Command Registry Updates

The system SHALL register new PLX commands in the SlashCommandRegistry.

#### Scenario: Registering new commands

- **WHEN** the PLX slash command system is initialized
- **THEN** include 'review', 'refine-architecture', 'refine-review', 'parse-feedback', 'sync-workspace', 'complete-task', 'undo-task' in `ALL_COMMANDS`
- **AND** provide template bodies for each command
- **AND** map each command to its file path in configurators
