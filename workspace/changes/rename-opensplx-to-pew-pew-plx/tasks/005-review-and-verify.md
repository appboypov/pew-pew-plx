---
status: to-do
---

# Task: Review and Verify

## End Goal

All rename changes are verified working end-to-end across codebase, npm, and GitHub.

## Currently

Individual tasks have been completed but full integration verification is pending.

## Should

- All grep checks pass (no opensplx references)
- Build and tests pass
- npm package works under new name
- GitHub repository accessible at new URL
- Documentation links resolve correctly

## Constraints

- Must be final task after all others complete
- Verification should be thorough and documented

## Acceptance Criteria

- [ ] `grep -ri "opensplx" . --include="*.md" --include="*.json" --include="*.mjs" --include="*.yml"` returns empty
- [ ] `pnpm run build && pnpm test` succeeds
- [ ] `npm view @appboypov/pew-pew-plx` shows correct info
- [ ] `npm view @appboypov/opensplx` shows deprecated status
- [ ] README badge URLs render correctly
- [ ] GitHub repository responds at new URL

## Implementation Checklist

- [ ] Run codebase grep verification
- [ ] Run build
- [ ] Run test suite
- [ ] Check npm registry for new package
- [ ] Check npm registry for old package deprecation
- [ ] Visit GitHub repository at new URL
- [ ] Verify redirect from old URL
- [ ] Check README badges render on GitHub
- [ ] Document any issues found
- [ ] Create follow-up issues if needed

## Notes

This task serves as the final quality gate before considering the rename complete.
