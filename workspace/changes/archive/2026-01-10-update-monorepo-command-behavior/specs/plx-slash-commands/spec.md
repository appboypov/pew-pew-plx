## ADDED Requirements

### Requirement: Prepare Release Version Handling

The `/plx/prepare-release` slash command SHALL enforce concrete version numbers and accurate dates in changelog entries.

#### Scenario: Never use Unreleased placeholder

- **WHEN** the prepare-release command generates a changelog entry
- **THEN** it SHALL determine the concrete next version number
- **AND** never use "Unreleased" as a version placeholder

#### Scenario: Use date command for release date

- **WHEN** the prepare-release command generates a changelog entry
- **THEN** it SHALL run the `date` command to get the accurate release date
- **AND** format the date according to changelog conventions (YYYY-MM-DD)

#### Scenario: Suggest version bumps based on changes

- **WHEN** analyzing commits for version bump type
- **THEN** suggest major bump for breaking changes or BREAKING footer
- **AND** suggest minor bump for feat commits
- **AND** suggest patch bump for fix commits
- **AND** apply AI judgment on overall scope to recommend appropriate bump

### Requirement: Monorepo Awareness for Artifact Commands

All artifact-creating PLX slash commands SHALL support monorepo project structures by operating on the correct package workspace.

#### Scenario: Derive target package from context

- **WHEN** an artifact-creating slash command is invoked in a monorepo
- **THEN** derive the target package from the user's request context
- **AND** clarify with user if the target package is unclear

#### Scenario: Create artifacts in package workspace

- **WHEN** operating on a specific package in a monorepo
- **THEN** create artifacts in that package's workspace folder
- **AND** not in the monorepo root workspace

#### Scenario: Root workspace for root changes

- **WHEN** a change affects only the monorepo root (not a specific package)
- **THEN** create artifacts in the root workspace

#### Scenario: Separate artifacts per package

- **WHEN** a change affects multiple packages
- **THEN** create separate proposals/releases per package
- **AND** each package gets its own workspace artifacts

#### Scenario: Follow package-specific instructions

- **WHEN** a package has its own AGENTS.md or workspace instructions
- **THEN** follow that package's specific instructions
- **AND** not just the root instructions

## MODIFIED Requirements

### Requirement: PLX Command Registry Updates

The system SHALL register new PLX commands in the PlxSlashCommandRegistry.

#### Scenario: Registering new commands

- **WHEN** the PLX slash command system is initialized
- **THEN** include 'review', 'refine-architecture', 'refine-review', 'parse-feedback' in `ALL_PLX_COMMANDS`
- **AND** provide template bodies for each new command
- **AND** map each command to its file path in configurators

#### Scenario: Commands include monorepo awareness

- **WHEN** generating slash command templates
- **THEN** include monorepo awareness guardrails in artifact-creating commands
- **AND** include version/date handling guardrails in prepare-release command
