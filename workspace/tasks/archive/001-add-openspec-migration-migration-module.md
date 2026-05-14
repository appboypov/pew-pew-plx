---
status: done
parent-type: change
parent-id: add-openspec-migration
---
# Task: Create OpenSpec Migration Module

## End Goal

A new migration module that handles all OpenSpec to PLX migrations.

## Currently

No migration support exists. Users with legacy OpenSpec projects cannot use PLX CLI without manual migration.

## Should

Create `src/utils/openspec-migration.ts` with functions to:
- Detect OpenSpec project structures
- Rename `openspec/` to `workspace/`
- Replace OPENSPEC markers with PLX markers in files
- Migrate global config directory

## Constraints

- [ ] Must not overwrite existing `workspace/` directory
- [ ] Must handle permission errors gracefully
- [ ] Must be silent when no OpenSpec artifacts found
- [ ] Must log clear messages when migration occurs

## Acceptance Criteria

- [ ] `migrateOpenSpecProject(path)` function exists and works
- [ ] `migrateGlobalConfig()` function exists and works
- [ ] Directory rename handles edge cases
- [ ] Marker replacement works for all text files
- [ ] Returns structured result with migration details

## Implementation Checklist

- [x] Create `src/utils/openspec-migration.ts`
- [x] Add `OPENSPEC_MARKERS` constant
- [x] Implement `detectOpenSpecProject(path)` function
- [x] Implement `migrateDirectoryStructure(path)` function
- [x] Implement `migrateMarkersInFile(filePath)` function
- [x] Implement `migrateAllMarkers(projectPath)` function
- [x] Implement `migrateGlobalConfig()` function
- [x] Implement main `migrateOpenSpecProject(path)` orchestrator
- [x] Add `MigrationResult` type definition
- [x] Export all public functions

## Notes

File extensions to scan for markers: `.md`, `.ts`, `.js`, `.json`, `.yaml`, `.yml`, `.toml`
