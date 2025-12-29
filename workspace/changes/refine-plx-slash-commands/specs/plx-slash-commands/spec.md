# plx-slash-commands Delta

## REMOVED Requirements

### Requirement: Init Architecture Command

The system SHALL provide a `plx/init-architecture` slash command that instructs AI agents to generate comprehensive architecture documentation.

> **Reason**: Superseded by `refine-architecture` command which handles both creation and updates.

### Requirement: Update Architecture Command

The system SHALL provide a `plx/update-architecture` slash command that instructs AI agents to refresh existing architecture documentation.

> **Reason**: Superseded by `refine-architecture` command which handles both creation and updates.

## ADDED Requirements

### Requirement: Refine Release Command

The system SHALL provide a `plx/refine-release` slash command that creates or updates RELEASE.md template.

#### Scenario: Generating refine-release command for Claude Code

- **WHEN** Claude Code is selected during initialization
- **THEN** create `.claude/commands/plx/refine-release.md`
- **AND** include frontmatter with name "Pew Pew Plx: Refine Release", description "Create or update RELEASE.md", category "Pew Pew Plx", and relevant tags
- **AND** wrap the command body in PLX markers
- **AND** include guardrails for: referencing @RELEASE.md template structure, preserving existing configuration
- **AND** include steps for: checking @RELEASE.md existence, creating if not exists, updating if exists

### Requirement: File Reference Notation

Slash commands that operate on capital-lettered markdown files SHALL use `@` notation to ensure files are auto-loaded when commands are invoked.

#### Scenario: Review command references REVIEW.md

- **WHEN** the `plx/review` slash command body is generated
- **THEN** include `@REVIEW.md` notation in the command body
- **AND** reference the file in the appropriate step or guardrail

#### Scenario: Refine-review command references REVIEW.md

- **WHEN** the `plx/refine-review` slash command body is generated
- **THEN** include `@REVIEW.md` notation in guardrails and steps
- **AND** use format "Reference @REVIEW.md template structure" in guardrails
- **AND** use format "Check if @REVIEW.md exists" in steps

#### Scenario: Refine-architecture command references ARCHITECTURE.md

- **WHEN** the `plx/refine-architecture` slash command body is generated
- **THEN** include `@ARCHITECTURE.md` notation in guardrails and steps
- **AND** use format "Reference @ARCHITECTURE.md template structure" in guardrails
- **AND** use format "Check if @ARCHITECTURE.md exists" in steps

#### Scenario: Prepare-release command references multiple files

- **WHEN** the `plx/prepare-release` slash command body is generated
- **THEN** include `@RELEASE.md` notation (already present)
- **AND** include `@README.md` notation for readme update step
- **AND** include `@CHANGELOG.md` notation for changelog update step
- **AND** include `@ARCHITECTURE.md` notation for architecture update step

## MODIFIED Requirements

### Requirement: PLX Command Registry Updates

The system SHALL register PLX commands in the PlxSlashCommandRegistry.

#### Scenario: Registering commands

- **WHEN** the PLX slash command system is initialized
- **THEN** include 'get-task', 'compact', 'review', 'refine-architecture', 'refine-review', 'refine-release', 'parse-feedback', 'prepare-release' in `ALL_PLX_COMMANDS`
- **AND** NOT include 'init-architecture' or 'update-architecture'
- **AND** provide template bodies for each command
- **AND** map each command to its file path in configurators
