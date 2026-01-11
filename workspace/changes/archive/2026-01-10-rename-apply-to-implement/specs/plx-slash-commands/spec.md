# plx-slash-commands Specification Delta

## MODIFIED Requirements

### Requirement: Implement Command (formerly Apply Command)

The system SHALL provide a `plx/implement` slash command that instructs AI agents to implement approved changes using the PLX get task workflow.

#### Scenario: Generating implement command for Claude Code

- **WHEN** Claude Code is selected during initialization
- **THEN** create `.claude/commands/plx/implement.md`
- **AND** include frontmatter with name "Pew Pew Plx: Implement", description "Implement an approved PLX change and keep tasks in sync.", category "Pew Pew Plx", and relevant tags
- **AND** wrap the command body in PLX markers
- **AND** include guardrails focusing on straightforward implementations and tight scoping
- **AND** include steps for: running `plx get task` to retrieve next prioritized task, working through Implementation Checklist, marking items complete, running implement again for next task

#### Scenario: Implement command uses PLX get task workflow

- **WHEN** an AI agent runs the implement command
- **THEN** the command SHALL instruct agents to run `plx get task` to retrieve the next prioritized task
- **AND** support task ID argument via `plx get task --id <task-id>` when user specifies a specific task
- **AND** NOT instruct agents to manually scan the tasks/ directory

## RENAMED Requirements

### Requirement: Apply Command → Implement Command

- **FROM**: Requirement: Apply Command
- **TO**: Requirement: Implement Command (formerly Apply Command)
- **REASON**: Better reflects the command's purpose and aligns with developer mental models
