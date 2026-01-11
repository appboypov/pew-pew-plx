## ADDED Requirements

### Requirement: OpenSpec Migration

The update command SHALL automatically migrate legacy OpenSpec project structures to PLX format before proceeding with updates.

#### Scenario: Migrating openspec directory

- **WHEN** `plx update` is run
- **AND** an `openspec/` directory exists
- **AND** no `workspace/` directory exists
- **THEN** rename `openspec/` to `workspace/`
- **AND** log "Renamed openspec/ → workspace/"

#### Scenario: Migrating markers in files

- **WHEN** `plx update` is run
- **AND** files contain `<!-- OPENSPEC:START/END -->` markers
- **THEN** replace all occurrences with `<!-- PLX:START/END -->` markers
- **AND** log count of files updated

#### Scenario: Migrating global config

- **WHEN** `plx update` is run
- **AND** `~/.openspec/` directory exists
- **AND** `~/.plx/` directory does not exist
- **THEN** rename `~/.openspec/` to `~/.plx/`
- **AND** log "Migrated global config ~/.openspec/ → ~/.plx/"

#### Scenario: Both directories exist

- **WHEN** `plx update` is run
- **AND** both `openspec/` and `workspace/` directories exist
- **THEN** skip directory migration
- **AND** log warning about both directories existing
- **AND** continue with marker migration and normal update

#### Scenario: No OpenSpec artifacts

- **WHEN** `plx update` is run
- **AND** no `openspec/` directory exists
- **AND** no files contain `<!-- OPENSPEC:START/END -->` markers
- **THEN** proceed silently with normal update (no migration messages)
