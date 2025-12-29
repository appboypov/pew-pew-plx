---
status: done
---

# Task: Rename Codebase References

## End Goal

All "OpenSplx" and "opensplx" references in the codebase are updated to use the new naming conventions.

## Currently

14 files contain "OpenSplx" or "opensplx" references including package.json, documentation, scripts, workflows, and archived changes.

## Should

- Asset files renamed from `opensplx_pixel_*.svg` to `pew_pew_plx_pixel_*.svg`
- package.json uses `@appboypov/pew-pew-plx` as name
- All GitHub URLs point to `appboypov/pew-pew-plx`
- All display text uses "Pew Pew Plx"
- Build and tests pass
- No "opensplx" matches found via grep (excluding .git)

## Constraints

- Asset files must be renamed before updating references to them
- Archived changes are updated for consistency (per user decision)
- Legacy openspec_pixel_*.svg assets remain untouched

## Acceptance Criteria

- [ ] `grep -ri "opensplx" . --include="*.md" --include="*.json" --include="*.mjs" --include="*.yml"` returns no matches
- [ ] `pnpm run build` succeeds
- [ ] `pnpm test` passes

## Implementation Checklist

- [x] Rename `assets/opensplx_pixel_dark.svg` to `assets/pew_pew_plx_pixel_dark.svg`
- [x] Rename `assets/opensplx_pixel_light.svg` to `assets/pew_pew_plx_pixel_light.svg`
- [x] Update package.json (name, homepage, repository URL)
- [x] Update README.md (links, badges, install command, asset paths)
- [x] Update CHANGELOG.md (title, release notes)
- [x] Update ARCHITECTURE.md (title, descriptions, structure diagram)
- [x] Update scripts/pack-version-check.mjs
- [x] Update .github/workflows/release-prepare.yml
- [x] Update 8 archived change files
- [x] Run build and verify
- [x] Run tests and verify
- [x] Run grep verification

## Notes

Files to update:
- package.json
- README.md
- CHANGELOG.md
- ARCHITECTURE.md
- scripts/pack-version-check.mjs
- .github/workflows/release-prepare.yml
- workspace/changes/archive/2025-12-25-add-task-directory-structure/proposal.md
- workspace/changes/archive/2025-12-25-add-task-directory-structure/design.md
- workspace/changes/archive/2025-12-25-add-plx-architecture-commands/design.md
- workspace/changes/archive/2025-12-26-add-prioritized-next-task/proposal.md
- workspace/changes/archive/2025-12-26-fix-tasks-md-references/proposal.md
- workspace/changes/archive/2025-12-26-fix-act-next-filtering/tasks/003-verify-behavior.md
- workspace/changes/archive/2025-12-26-replace-project-md-with-architecture/proposal.md
- workspace/changes/archive/2025-12-29-rebrand-openspec-to-plx/proposal.md
