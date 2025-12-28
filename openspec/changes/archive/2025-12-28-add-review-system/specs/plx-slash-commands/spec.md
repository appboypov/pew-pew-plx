# plx-slash-commands Specification

## ADDED Requirements

### Requirement: Review Command

The system SHALL provide a `plx/review` slash command that guides AI agents through reviewing implementations against specifications.

#### Scenario: Generating review command for Claude Code

- **WHEN** Claude Code is selected during initialization
- **THEN** create `.claude/commands/plx/review.md`
- **AND** include frontmatter with name "PLX: Review", description, category "PLX", and relevant tags
- **AND** wrap the command body in OpenSpec markers
- **AND** include guardrails for: asking what to review, using CLI to retrieve criteria, outputting language-aware feedback markers
- **AND** include steps for: asking review target, searching if ambiguous, retrieving constraints/acceptance criteria/requirements, reviewing implementation, inserting feedback markers, summarizing findings

### Requirement: Refine Architecture Command

The system SHALL provide a `plx/refine-architecture` slash command that combines init and update architecture functionality.

#### Scenario: Generating refine-architecture command for Claude Code

- **WHEN** Claude Code is selected during initialization
- **THEN** create `.claude/commands/plx/refine-architecture.md`
- **AND** include frontmatter with name "PLX: Refine Architecture", description, category "PLX", and relevant tags
- **AND** wrap the command body in OpenSpec markers
- **AND** include guardrails for: practical documentation, preserving user content
- **AND** include steps for: checking ARCHITECTURE.md existence, creating if not exists (init flow), updating if exists (update flow)

### Requirement: Refine Review Command

The system SHALL provide a `plx/refine-review` slash command that creates or updates REVIEW.md template.

#### Scenario: Generating refine-review command for Claude Code

- **WHEN** Claude Code is selected during initialization
- **THEN** create `.claude/commands/plx/refine-review.md`
- **AND** include frontmatter with name "PLX: Refine Review", description, category "PLX", and relevant tags
- **AND** wrap the command body in OpenSpec markers
- **AND** include guardrails for: using REVIEW.md template structure, preserving existing guidelines
- **AND** include steps for: checking REVIEW.md existence, creating if not exists, updating if exists

### Requirement: Parse Feedback Command

The system SHALL provide a `plx/parse-feedback` slash command that instructs to run the CLI parse feedback command.

#### Scenario: Generating parse-feedback command for Claude Code

- **WHEN** Claude Code is selected during initialization
- **THEN** create `.claude/commands/plx/parse-feedback.md`
- **AND** include frontmatter with name "PLX: Parse Feedback", description, category "PLX", and relevant tags
- **AND** wrap the command body in OpenSpec markers
- **AND** include guardrails for: scanning tracked files, generating one task per marker
- **AND** include steps for: running `plx parse feedback <name>`, reviewing generated tasks, addressing feedback, archiving when complete

### Requirement: REVIEW.md Template

The system SHALL create a REVIEW.md template at the project root during initialization.

#### Scenario: Creating REVIEW.md during init

- **WHEN** `plx init` is executed
- **THEN** check if REVIEW.md exists at project root
- **AND** if not exists, create REVIEW.md with meta-template content
- **AND** include sections: Purpose, Review Types, Feedback Format, Review Checklist

#### Scenario: Creating REVIEW.md during update

- **WHEN** `plx update` is executed
- **THEN** check if REVIEW.md exists at project root
- **AND** if not exists, create REVIEW.md with meta-template content
- **AND** do not overwrite existing REVIEW.md

#### Scenario: REVIEW.md template content

- **WHEN** generating REVIEW.md template
- **THEN** include meta-instructions for customizing review guidelines
- **AND** explain feedback marker format with examples
- **AND** include placeholder review checklist

### Requirement: PLX Command Registry Updates

The system SHALL register new PLX commands in the PlxSlashCommandRegistry.

#### Scenario: Registering new commands

- **WHEN** the PLX slash command system is initialized
- **THEN** include 'review', 'refine-architecture', 'refine-review', 'parse-feedback' in `ALL_PLX_COMMANDS`
- **AND** provide template bodies for each new command
- **AND** map each command to its file path in configurators
