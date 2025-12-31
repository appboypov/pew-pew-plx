## MODIFIED Requirements

### Requirement: PLX Slash Command Infrastructure

The system SHALL provide a unified slash command infrastructure with all commands managed through a single registry.

#### Scenario: Single command registry manages all commands

- **WHEN** the slash command system is initialized
- **THEN** provide a single `SlashCommandRegistry` with all 13 commands
- **AND** support the same tool configurator pattern for all commands
- **AND** use the PLX marker pattern (`<!-- PLX:START -->` / `<!-- PLX:END -->`) for managed content

#### Scenario: Unified command type includes all commands

- **WHEN** defining the `SlashCommandId` type
- **THEN** include: `archive`, `get-task`, `implement`, `orchestrate`, `parse-feedback`, `plan-proposal`, `plan-request`, `prepare-compact`, `prepare-release`, `refine-architecture`, `refine-release`, `refine-review`, `review`
- **AND** provide command bodies for all 13 commands in a single `slashCommandBodies` record

### Requirement: PLX Command Registry Updates

The system SHALL register all commands in the unified SlashCommandRegistry.

#### Scenario: Registering all commands

- **WHEN** the slash command system is initialized
- **THEN** include all 13 commands in `ALL_COMMANDS` array
- **AND** provide template bodies for each command
- **AND** map each command to its file path in tool configurators

## REMOVED Requirements

### Requirement: Separate PLX Registry

**Reason**: The dual registry architecture is being unified into a single system. The `PlxSlashCommandRegistry` and `PlxSlashCommandId` types are no longer needed.
**Migration**: All commands are now managed through the unified `SlashCommandRegistry` and `SlashCommandId`.
