## ADDED Requirements

### Requirement: Compact Context Preservation Command

The system SHALL provide a `plx/compact` slash command that instructs AI agents to preserve session state for continuation across context-limited chat sessions.

#### Scenario: Generating compact command for Claude Code

- **WHEN** Claude Code is selected during initialization
- **THEN** create `.claude/commands/plx/compact.md`
- **AND** include frontmatter with name "PLX: Compact", description "Preserve session progress to PROGRESS.md for context handoff", category "PLX", and relevant tags
- **AND** wrap the command body in OpenSpec markers
- **AND** include guardrails for saving files, creating PROGRESS.md in project root, including sufficient detail for continuation, updating .gitignore, and handling existing PROGRESS.md files

#### Scenario: Command steps instruct agent to create PROGRESS.md

- **WHEN** an AI agent executes the compact command
- **THEN** the command SHALL instruct the agent to save all modified files
- **AND** instruct the agent to create or update `PROGRESS.md` in the project root
- **AND** instruct the agent to include sections for: Current Task, Status, Completed Steps, Remaining Steps, Key Decisions Made, Files Modified, Files Created, Open Questions/Blockers, Context for Next Agent, Related Resources
- **AND** instruct the agent to add `PROGRESS.md` to `.gitignore` if not already present
- **AND** instruct the agent to confirm completion to the user

#### Scenario: Compact command registered in all tool configurators

- **WHEN** OpenSpec is initialized for any supported tool
- **THEN** the compact command SHALL be generated alongside init-architecture, update-architecture, and get-task
- **AND** follow the same file path and frontmatter conventions as other PLX commands for that tool
