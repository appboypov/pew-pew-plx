# plx-slash-commands Delta

## ADDED Requirements

### Requirement: Plan Request Command

The system SHALL provide a `plx/plan-request` slash command that clarifies user intent through iterative yes/no questions before proposal creation.

#### Scenario: Generating plan-request command for Claude Code

- **WHEN** Claude Code is selected during initialization
- **THEN** create `.claude/commands/plx/plan-request.md`
- **AND** include frontmatter with name "Pew Pew Plx: Plan Request", description "Clarify user intent through iterative questions to create request.md", category "Pew Pew Plx", and relevant tags
- **AND** wrap the command body in PLX markers

#### Scenario: Plan-request uses Activity XML template pattern

- **WHEN** the `plx/plan-request` command is executed
- **THEN** use the Activity XML template pattern with Intent Analyst role
- **AND** include AskActUpdateRepeat behavioral instruction for iterative questioning
- **AND** use SimpleQuestions format with yes/no options plus "Not sure" and "Skip" alternatives

#### Scenario: Plan-request creates request.md early

- **WHEN** the `plx/plan-request` command determines a change-id
- **THEN** create `workspace/changes/{change-id}/` directory
- **AND** create `request.md` with sections: Source Input, Current Understanding, Identified Ambiguities, Decisions, Final Intent
- **AND** update request.md after each clarification question

#### Scenario: Plan-request ends on user confirmation

- **WHEN** all ambiguities are resolved
- **THEN** present final clarified intent to user
- **AND** ask user to confirm intent is 100% captured
- **AND** if confirmed, populate Final Intent section and instruct to run `plx/plan-proposal`

### Requirement: Plan Proposal Command

The system SHALL provide a `plx/plan-proposal` slash command that scaffolds change proposals and auto-detects existing `request.md` files.

#### Scenario: Generating plan-proposal command for Claude Code

- **WHEN** Claude Code is selected during initialization
- **THEN** create `.claude/commands/plx/plan-proposal.md`
- **AND** include frontmatter with name "Pew Pew Plx: Plan Proposal", description "Scaffold a new Pew Pew Plx change and validate strictly. Consumes request.md when present.", category "Pew Pew Plx", and relevant tags
- **AND** wrap the command body in PLX markers

#### Scenario: Plan-proposal detects and consumes request.md

- **WHEN** the `plx/plan-proposal` command is executed with a change-id argument
- **AND** `workspace/changes/{change-id}/request.md` exists
- **THEN** use the Final Intent section as primary input for the proposal
- **AND** incorporate Decisions section into proposal context

#### Scenario: Plan-proposal scaffolds proposal structure

- **WHEN** the `plx/plan-proposal` command is executed
- **THEN** scaffold `proposal.md`, `tasks/` directory, and `design.md` (when needed)
- **AND** map change into concrete capabilities with spec deltas
- **AND** validate with `plx validate <id> --strict`

## RENAMED Requirements

### Requirement: Proposal Command → Plan Proposal Command

**Previous ID**: Proposal slash command (implicit in core slash commands)

**New ID**: Plan Proposal Command (explicit in plx-slash-commands)

**Reason**: Rename from `proposal` to `plan-proposal` for consistent `plan-*` workflow naming.

**Migration**: Update all references from `proposal` to `plan-proposal` in:
- `SlashCommandId` type
- `slashCommandBodies` record
- All tool configurators (FILE_PATHS, FRONTMATTER)
- Test files

## MODIFIED Requirements

### Requirement: PLX Command Registry Updates

The system SHALL register new PLX commands in the PlxSlashCommandRegistry.

#### Scenario: Registering new commands

- **WHEN** the PLX slash command system is initialized
- **THEN** include 'review', 'refine-architecture', 'refine-review', 'parse-feedback', 'plan-request', 'plan-proposal' in `ALL_PLX_COMMANDS`
- **AND** provide template bodies for each new command
- **AND** map each command to its file path in configurators
