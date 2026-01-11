---
status: to-do
skill-level: medior
parent-type: change
parent-id: move-root-files-to-workspace
---

# Task: Update update command with migration and new paths

## End Goal
`plx update` runs root files migration and creates missing template files in `workspace/` instead of project root.

## Currently
`src/core/update.ts`:
- Creates REVIEW.md, RELEASE.md, TESTING.md at `resolvedProjectPath`
- No migration of existing root files

## Should
`src/core/update.ts`:
- Runs root files migration after OpenSpec migration
- Creates REVIEW.md, RELEASE.md, TESTING.md at `workspacePath`
- Logs migration results when files are migrated

## Constraints
- [ ] Run migration after OpenSpec migration, before template file creation
- [ ] Log migration results similar to OpenSpec migration format
- [ ] Silent when no files to migrate
- [ ] Template file creation uses workspace path

## Acceptance Criteria
- [ ] `plx update` migrates root files to workspace when they exist
- [ ] `plx update` creates missing template files in workspace
- [ ] Migration logs show which files were migrated
- [ ] No output when no migration is needed

## Implementation Checklist
- [ ] 3.1 Import migration function from `src/utils/root-files-migration.ts`
- [ ] 3.2 Add migration call after OpenSpec migration
- [ ] 3.3 Log migration results (e.g., "Migrated 3 root file(s) to workspace/")
- [ ] 3.4 Update REVIEW.md path to use `workspacePath`
- [ ] 3.5 Update RELEASE.md path to use `workspacePath`
- [ ] 3.6 Update TESTING.md path to use `workspacePath`
- [ ] 3.7 Add/update tests for migration behavior

## Notes
Follow the same logging pattern as OpenSpec migration.
