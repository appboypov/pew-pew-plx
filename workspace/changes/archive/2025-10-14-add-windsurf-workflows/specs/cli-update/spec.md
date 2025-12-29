## MODIFIED Requirements
### Requirement: Slash Command Updates
The update command SHALL refresh existing slash command files for configured tools without creating new ones.

#### Scenario: Updating slash commands for Claude Code
- **WHEN** `.claude/commands/workspace/` contains `proposal.md`, `apply.md`, and `archive.md`
- **THEN** refresh each file using shared templates
- **AND** ensure templates include instructions for the relevant workflow stage

#### Scenario: Updating slash commands for Cursor
- **WHEN** `.cursor/commands/` contains `plx-proposal.md`, `plx-apply.md`, and `plx-archive.md`
- **THEN** refresh each file using shared templates
- **AND** ensure templates include instructions for the relevant workflow stage

#### Scenario: Updating slash commands for OpenCode
- **WHEN** `.opencode/command/` contains `plx-proposal.md`, `plx-apply.md`, and `plx-archive.md`
- **THEN** refresh each file using shared templates
- **AND** ensure templates include instructions for the relevant workflow stage

#### Scenario: Updating slash commands for Windsurf
- **WHEN** `.windsurf/workflows/` contains `plx-proposal.md`, `plx-apply.md`, and `plx-archive.md`
- **THEN** refresh each file using shared templates wrapped in PLX markers
- **AND** ensure templates include instructions for the relevant workflow stage

#### Scenario: Missing slash command file
- **WHEN** a tool lacks a slash command file
- **THEN** do not create a new file during update
