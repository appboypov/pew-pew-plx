---
status: to-do
skill-level: medior
parent-type: change
parent-id: move-root-files-to-workspace
---

# Task: Update init command to create files in workspace

## End Goal
`plx init` creates ARCHITECTURE.md, REVIEW.md, RELEASE.md, TESTING.md in `workspace/` instead of project root.

## Currently
`src/core/init.ts` creates these files at `projectPath`:
- `architecturePath = path.join(projectPath, 'ARCHITECTURE.md')`
- `reviewPath = path.join(projectPath, 'REVIEW.md')`
- `releasePath = path.join(projectPath, 'RELEASE.md')`
- `testingPath = path.join(projectPath, 'TESTING.md')`

## Should
`src/core/init.ts` creates these files at `workspacePath`:
- `architecturePath = path.join(workspacePath, 'ARCHITECTURE.md')`
- `reviewPath = path.join(workspacePath, 'REVIEW.md')`
- `releasePath = path.join(workspacePath, 'RELEASE.md')`
- `testingPath = path.join(workspacePath, 'TESTING.md')`

## Constraints
- [ ] Only modify path calculations, not file content
- [ ] Preserve skip-existing logic for extend mode
- [ ] Do not change AGENTS.md location (stays in workspace)

## Acceptance Criteria
- [ ] `plx init` creates ARCHITECTURE.md at `workspace/ARCHITECTURE.md`
- [ ] `plx init` creates REVIEW.md at `workspace/REVIEW.md`
- [ ] `plx init` creates RELEASE.md at `workspace/RELEASE.md`
- [ ] `plx init` creates TESTING.md at `workspace/TESTING.md`
- [ ] Extend mode still skips existing files

## Implementation Checklist
- [ ] 2.1 Update `writeTemplateFiles()` in `src/core/init.ts` to use `workspacePath` for all four files
- [ ] 2.2 Update existing init tests to expect files in workspace directory
- [ ] 2.3 Verify extend mode behavior still works

## Notes
The `writeTemplateFiles` function is called from both `generateFiles` and `ensureTemplateFiles`.
