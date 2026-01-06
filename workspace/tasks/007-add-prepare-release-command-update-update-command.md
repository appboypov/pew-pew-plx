---
status: done
parent-type: change
parent-id: add-prepare-release-command
---
# Update Update Command

## End Goal

`plx update` creates RELEASE.md at the project root if it doesn't exist.

## Currently

- Update creates REVIEW.md if not exists
- No RELEASE.md creation exists

## Should

- Add RELEASE.md creation after REVIEW.md section (after line 55)
- Use pattern: `if (!(await FileSystemUtils.fileExists(releasePath)))`
- Get template via `TemplateManager.getReleaseTemplate()`

## Constraints

- Must follow existing pattern for REVIEW.md creation
- Must only create if file doesn't exist (no overwrite)

## Acceptance Criteria

- [x] RELEASE.md created during `plx update` if not exists
- [x] RELEASE.md not overwritten if already exists
- [x] TypeScript compiles without errors

## Implementation Checklist

- [x] Add RELEASE.md path constant: `const releasePath = path.join(resolvedProjectPath, 'RELEASE.md');`
- [x] Add conditional write block after REVIEW.md section
- [x] Use `TemplateManager.getReleaseTemplate()` for content
- [x] Verify TypeScript compilation

## Notes

Location: `src/core/update.ts` (after line 55, after REVIEW.md creation)
