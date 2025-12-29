# Update Command Specification

## Purpose

As a developer using PLX, I want to update the PLX instructions in my project when new versions are released, so that I can benefit from improvements to AI agent instructions.
## Requirements
### Requirement: Update Behavior
The update command SHALL update PLX instruction files to the latest templates in a team-friendly manner.

#### Scenario: Running update command
- **WHEN** a user runs `plx update`
- **THEN** replace `workspace/AGENTS.md` with the latest template
- **AND** if a root-level stub (`AGENTS.md`/`CLAUDE.md`) exists, refresh it so it points to `@/workspace/AGENTS.md`

### Requirement: Prerequisites

The command SHALL require an existing PLX structure before allowing updates.

#### Scenario: Checking prerequisites

- **GIVEN** the command requires an existing `workspace` directory (created by `plx init`)
- **WHEN** the `workspace` directory does not exist
- **THEN** display error: "No PLX directory found. Run 'plx init' first."
- **AND** exit with code 1

### Requirement: File Handling
The update command SHALL handle file updates in a predictable and safe manner.

#### Scenario: Updating files
- **WHEN** updating files
- **THEN** completely replace `workspace/AGENTS.md` with the latest template
- **AND** if a root-level stub exists, update the managed block content so it keeps directing teammates to `@/workspace/AGENTS.md`

### Requirement: Tool-Agnostic Updates
The update command SHALL refresh PLX-managed files in a predictable manner while respecting each team's chosen tooling.

#### Scenario: Updating files
- **WHEN** updating files
- **THEN** completely replace `workspace/AGENTS.md` with the latest template
- **AND** create or refresh the root-level `AGENTS.md` stub using the managed marker block, even if the file was previously absent
- **AND** update only the PLX-managed sections inside existing AI tool files, leaving user-authored content untouched
- **AND** avoid creating new native-tool configuration files (slash commands, CLAUDE.md, etc.) unless they already exist

### Requirement: Core Files Always Updated
The update command SHALL always update the core PLX files and display an ASCII-safe success message.

#### Scenario: Successful update
- **WHEN** the update completes successfully
- **THEN** replace `workspace/AGENTS.md` with the latest template
- **AND** if a root-level stub exists, refresh it so it still directs contributors to `@/workspace/AGENTS.md`

### Requirement: Slash Command Updates
The update command SHALL refresh existing slash command files for configured tools without creating new ones, and ensure the OpenCode archive command accepts change ID arguments.

#### Scenario: Updating slash commands for Antigravity
- **WHEN** `.agent/workflows/` contains `plx-proposal.md`, `plx-apply.md`, and `plx-archive.md`
- **THEN** refresh the PLX-managed portion of each file so the workflow copy matches other tools while preserving the existing single-field `description` frontmatter
- **AND** skip creating any missing workflow files during update, mirroring the behavior for Windsurf and other IDEs

### Requirement: PLX Command Updates
The update command SHALL generate PLX architecture commands for tools that have existing regular slash commands.

#### Scenario: Generating PLX commands when regular slash commands exist
- **WHEN** a tool has existing regular slash commands (e.g., `.claude/commands/plx/proposal.md`)
- **AND** the user runs `plx update`
- **THEN** generate all PLX commands for that tool (e.g., `.claude/commands/plx/init-architecture.md`, `.claude/commands/plx/update-architecture.md`)
- **AND** include them in the updated slash commands output

#### Scenario: PLX commands not generated when no regular slash commands exist
- **WHEN** a tool has no existing regular slash commands
- **AND** the user runs `plx update`
- **THEN** do not generate PLX commands for that tool

### Requirement: Archive Command Argument Support
The archive slash command template SHALL support optional change ID arguments for tools that support `$ARGUMENTS` placeholder.

#### Scenario: Archive command with change ID argument
- **WHEN** a user invokes `/plx:archive <change-id>` with a change ID
- **THEN** the template SHALL instruct the AI to validate the provided change ID against `plx list`
- **AND** use the provided change ID for archiving if valid
- **AND** fail fast if the provided change ID doesn't match an archivable change

#### Scenario: Archive command without argument (backward compatibility)
- **WHEN** a user invokes `/plx:archive` without providing a change ID
- **THEN** the template SHALL instruct the AI to identify the change ID from context or by running `plx list`
- **AND** proceed with the existing behavior (maintaining backward compatibility)

#### Scenario: OpenCode archive template generation
- **WHEN** generating the OpenCode archive slash command file
- **THEN** include the `$ARGUMENTS` placeholder in the frontmatter
- **AND** wrap it in a clear structure like `<ChangeId>\n  $ARGUMENTS\n</ChangeId>` to indicate the expected argument
- **AND** include validation steps in the template body to check if the change ID is valid

## Edge Cases

### Requirement: Error Handling

The command SHALL handle edge cases gracefully.

#### Scenario: File permission errors

- **WHEN** file write fails
- **THEN** let the error bubble up naturally with file path

#### Scenario: Missing AI tool files

- **WHEN** an AI tool configuration file doesn't exist
- **THEN** skip updating that file
- **AND** do not create it

#### Scenario: Custom directory names

- **WHEN** considering custom directory names
- **THEN** not supported in this change
- **AND** the default directory name `workspace` SHALL be used

## Success Criteria

Users SHALL be able to:
- Update PLX instructions with a single command
- Get the latest AI agent instructions
- See clear confirmation of the update

The update process SHALL be:
- Simple and fast (no version checking)
- Predictable (same result every time)
- Self-contained (no network required)
