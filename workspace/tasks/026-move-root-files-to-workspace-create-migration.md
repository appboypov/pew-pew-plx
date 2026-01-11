---
status: in-progress
skill-level: medior
parent-type: change
parent-id: move-root-files-to-workspace
---

# Task: Create root files migration utility

## End Goal
A migration utility that moves ARCHITECTURE.md, REVIEW.md, RELEASE.md, TESTING.md, and PROGRESS.md from project root to workspace directory.

## Currently
No migration utility exists for these files.

## Should
`src/utils/root-files-migration.ts` provides:
- `detectRootFiles(projectPath)` - Returns list of root files that need migration
- `migrateRootFiles(projectPath, workspacePath)` - Moves files with conflict handling
- `RootFilesMigrationResult` interface with migrated count and errors

## Constraints
- [ ] Follow the pattern established in `openspec-migration.ts`
- [ ] Handle file conflicts: workspace version takes precedence
- [ ] Delete root file after successful move (or conflict resolution)
- [ ] Return structured result with migrated file count and any errors
- [ ] Export PUBLIC_TEMPLATE_FILES constant for the file list

## Acceptance Criteria
- [ ] Migration moves files from root to workspace when workspace version doesn't exist
- [ ] Migration keeps workspace version and deletes root version when both exist
- [ ] Migration does nothing when file exists only in workspace
- [ ] Migration returns accurate count of migrated files
- [ ] Migration handles filesystem errors gracefully

## Implementation Checklist
- [ ] 1.1 Create `src/utils/root-files-migration.ts` with interfaces and constants
- [ ] 1.2 Implement `detectRootFiles()` to check for files in project root
- [ ] 1.3 Implement `migrateRootFiles()` with move and conflict logic
- [ ] 1.4 Export PUBLIC_TEMPLATE_FILES constant
- [ ] 1.5 Add unit tests in `test/utils/root-files-migration.test.ts`

## Notes
Files to migrate: ARCHITECTURE.md, REVIEW.md, RELEASE.md, TESTING.md, PROGRESS.md
