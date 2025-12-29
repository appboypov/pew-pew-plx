## MODIFIED Requirements

### Requirement: Prepare Release Command

The system SHALL provide a `plx/prepare-release` slash command that orchestrates release preparation by guiding AI agents through updating changelog, readme, and architecture documentation.

#### Scenario: Generating prepare-release command for Claude Code

- **WHEN** Claude Code is selected during initialization
- **THEN** create `.claude/commands/plx/prepare-release.md`
- **AND** include frontmatter with name "Pew Pew Plx: Prepare Release", description, category "Pew Pew Plx", and relevant tags
- **AND** wrap the command body in PLX markers
- **AND** include guardrails for: reading @RELEASE.md, executing steps sequentially, allowing user confirmation/skip per step, preserving existing content
- **AND** include steps for: reading RELEASE.md, executing changelog update, executing readme update, executing architecture update, presenting summary

### Requirement: RELEASE.md Template

The system SHALL create a RELEASE.md template at the project root during initialization.

#### Scenario: Creating RELEASE.md during init

- **WHEN** `plx init` is executed
- **THEN** check if RELEASE.md exists at project root
- **AND** if not exists, create RELEASE.md with release preparation workflow content
- **AND** include sections: Purpose, Changelog Update Activity, Readme Update Activity, Architecture Update Activity, Release Checklist

#### Scenario: Creating RELEASE.md during update

- **WHEN** `plx update` is executed
- **THEN** check if RELEASE.md exists at project root
- **AND** if not exists, create RELEASE.md with release preparation workflow content
- **AND** do not overwrite existing RELEASE.md

#### Scenario: RELEASE.md changelog activity content

- **WHEN** generating RELEASE.md template
- **THEN** include changelog update workflow with:
  - Source selection options (git commits, branch diff, manual entry)
  - Commit range configuration (recent N, since date, since tag, tag range)
  - Version bump suggestion based on change analysis (major/minor/patch)
  - Format selection (keep-a-changelog, simple-list, github-release)
  - Audience targeting (technical, user-facing, marketing)
  - Emoji level configuration (none, little, medium, high)
  - Format templates for each changelog style
  - Upsert behavior (prepend to existing or create new)

#### Scenario: RELEASE.md readme activity content

- **WHEN** generating RELEASE.md template
- **THEN** include readme update workflow with:
  - Operation selection (create new, update sections, add badges, change style, refresh content)
  - Style selection (minimal, standard, comprehensive, academic/research, CLI tool, library/package)
  - Audience targeting (developers, end users, contributors, researchers, mixed)
  - Section configuration (essential, recommended, optional sections)
  - Badge configuration (build, coverage, npm, downloads, license, stars, etc.)
  - Style templates for each readme style
  - Badge URL patterns using shields.io

#### Scenario: RELEASE.md architecture activity content

- **WHEN** generating RELEASE.md template
- **THEN** include architecture update workflow with:
  - Read existing ARCHITECTURE.md instruction
  - Explore codebase for new patterns instruction
  - Update while preserving user content instruction

### Requirement: PLX Command Registry Updates for Prepare Release

The system SHALL register the prepare-release command in the PlxSlashCommandRegistry.

#### Scenario: Registering prepare-release command

- **WHEN** the PLX slash command system is initialized
- **THEN** include 'prepare-release' in `ALL_PLX_COMMANDS`
- **AND** provide template body for the command
- **AND** map the command to its file path in all configurators
