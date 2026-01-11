## ADDED Requirements

### Requirement: Refine Testing Command

The system SHALL provide a `plx/refine-testing` slash command that creates or updates TESTING.md with test configuration options.

#### Scenario: Generating refine-testing command for Claude Code

- **WHEN** Claude Code is selected during initialization
- **THEN** create `.claude/commands/plx/refine-testing.md`
- **AND** include frontmatter with name "Pew Pew Plx: Refine Testing", description, category "Pew Pew Plx", and relevant tags
- **AND** wrap the command body in PLX markers
- **AND** include guardrails for: using TESTING.md template structure, preserving existing configuration
- **AND** include steps for: checking TESTING.md existence, creating if not exists, updating if exists

### Requirement: Test Command

The system SHALL provide a `plx/test` slash command that runs testing workflow for specified scope.

#### Scenario: Generating test command for Claude Code

- **WHEN** Claude Code is selected during initialization
- **THEN** create `.claude/commands/plx/test.md`
- **AND** include frontmatter with name "Pew Pew Plx: Test", description, category "Pew Pew Plx", and relevant tags
- **AND** wrap the command body in PLX markers
- **AND** include guardrails for: reading TESTING.md configuration, running tests for specified scope
- **AND** include steps for: parsing arguments (--change-id, --task-id, --spec-id), reading TESTING.md, running tests, reporting results

#### Scenario: Test command accepts scope arguments

- **WHEN** the test command is invoked with --change-id, --task-id, or --spec-id
- **THEN** run tests only for the specified scope
- **AND** reference TESTING.md for test configuration

### Requirement: TESTING.md Template

The system SHALL create a TESTING.md template at the project root during initialization.

#### Scenario: Creating TESTING.md during init

- **WHEN** `plx init` is executed
- **THEN** check if TESTING.md exists at project root
- **AND** if not exists, create TESTING.md with config-style content
- **AND** include sections: Purpose, Test Types, Coverage, Test Patterns, Test Checklist

#### Scenario: Creating TESTING.md during update

- **WHEN** `plx update` is executed
- **THEN** check if TESTING.md exists at project root
- **AND** if not exists, create TESTING.md with config-style content
- **AND** do not overwrite existing TESTING.md

## MODIFIED Requirements

### Requirement: Refine Release Command

The system SHALL provide a `plx/refine-release` slash command that creates or updates RELEASE.md with comprehensive option documentation.

#### Scenario: Generating refine-release command for Claude Code

- **WHEN** Claude Code is selected during initialization
- **THEN** create `.claude/commands/plx/refine-release.md`
- **AND** include frontmatter with name "Pew Pew Plx: Refine Release", description, category "Pew Pew Plx", and relevant tags
- **AND** wrap the command body in PLX markers
- **AND** include guardrails for: using RELEASE.md template structure, preserving existing configuration
- **AND** include steps for: checking RELEASE.md existence, creating if not exists with defaults, updating if exists
- **AND** include embedded documentation for: changelog formats (keep-a-changelog, simple-list, github-release), readme styles (minimal, standard, comprehensive, CLI tool, library), badge patterns, audience options, emoji levels

### Requirement: PLX Command Registry Updates

The system SHALL register new PLX commands in the PlxSlashCommandRegistry.

#### Scenario: Registering new commands

- **WHEN** the PLX slash command system is initialized
- **THEN** include 'review', 'refine-architecture', 'refine-review', 'refine-testing', 'test', 'parse-feedback' in `ALL_PLX_COMMANDS`
- **AND** provide template bodies for each command
- **AND** map each command to its file path in configurators
