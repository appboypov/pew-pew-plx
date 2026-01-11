---
status: to-do
skill-level: junior
parent-type: change
parent-id: move-root-files-to-workspace
---

# Task: Update transfer service for workspace paths

## End Goal
`plx transfer` creates template files in target `workspace/` instead of project root.

## Currently
`src/services/transfer-service.ts` `generateTemplateFiles()` method creates files at:
- `path.join(projectPath, 'ARCHITECTURE.md')`
- `path.join(projectPath, 'REVIEW.md')`
- `path.join(projectPath, 'RELEASE.md')`
- `path.join(projectPath, 'TESTING.md')`

## Should
`src/services/transfer-service.ts` `generateTemplateFiles()` creates files at:
- `path.join(workspacePath, 'ARCHITECTURE.md')`
- `path.join(workspacePath, 'REVIEW.md')`
- `path.join(workspacePath, 'RELEASE.md')`
- `path.join(workspacePath, 'TESTING.md')`

## Constraints
- [ ] Only modify path calculations
- [ ] Keep file-exists checks working correctly

## Acceptance Criteria
- [ ] Transfer to new workspace creates template files in workspace directory
- [ ] No files created at project root during transfer

## Implementation Checklist
- [ ] 5.1 Update `generateTemplateFiles()` to use `workspacePath` for all four files
- [ ] 5.2 Update any related tests

## Notes
The method signature already has both `projectPath` and `workspacePath` parameters.
