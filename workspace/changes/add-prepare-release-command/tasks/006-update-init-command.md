---
status: done
---

# Update Init Command

## End Goal

`plx init` creates RELEASE.md at the project root during initialization.

## Currently

- Init creates ARCHITECTURE.md at project root
- Init creates REVIEW.md at project root
- No RELEASE.md creation exists

## Should

- Add RELEASE.md creation after REVIEW.md section (after line 790)
- Use pattern: `if (!skipExisting || !(await FileSystemUtils.fileExists(releasePath)))`
- Get template via `TemplateManager.getReleaseTemplate()`

## Constraints

- Must follow existing pattern for REVIEW.md creation
- Must respect `skipExisting` parameter
- Must not overwrite existing RELEASE.md when `skipExisting` is true

## Acceptance Criteria

- [x] RELEASE.md created during `plx init`
- [x] RELEASE.md not overwritten when `skipExisting` is true and file exists
- [x] TypeScript compiles without errors

## Implementation Checklist

- [x] Add RELEASE.md path constant: `const releasePath = path.join(projectPath, 'RELEASE.md');`
- [x] Add conditional write block after REVIEW.md section
- [x] Use `TemplateManager.getReleaseTemplate()` for content
- [x] Verify TypeScript compilation

## Notes

Location: `src/core/init.ts` (after line 790, after REVIEW.md creation)
