## ADDED Requirements

### Requirement: OpenSpec Migration on Init

The init command SHALL automatically migrate legacy OpenSpec project structures to PLX format before proceeding with initialization.

#### Scenario: Migrating before init

- **WHEN** `plx init` is run
- **AND** an `openspec/` directory exists
- **AND** no `workspace/` directory exists
- **THEN** rename `openspec/` to `workspace/`
- **AND** log "Renamed openspec/ → workspace/"
- **AND** treat the project as already initialized (extend mode)

#### Scenario: Migrating markers during init

- **WHEN** `plx init` is run
- **AND** files contain `<!-- OPENSPEC:START -->` or `<!-- OPENSPEC:END -->` markers
- **THEN** replace all occurrences with `<!-- PLX:START -->` and `<!-- PLX:END -->`
- **AND** log count of files updated

#### Scenario: Both directories exist on init

- **WHEN** `plx init` is run
- **AND** both `openspec/` and `workspace/` directories exist
- **THEN** skip directory migration
- **AND** log warning about both directories existing
- **AND** continue with normal init flow using `workspace/`
