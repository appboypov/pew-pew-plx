---
status: to-do
---

# Task: Validate and test

## End Goal

All builds pass, linting is clean, tests pass, and manual testing confirms functionality.

## Currently

Implementation complete but not validated.

## Should

- `pnpm run build` completes without errors
- `pnpm run lint` completes without warnings
- `pnpm run test` passes all tests
- Manual test of `plx paste request` works

## Constraints

- [ ] Fix any TypeScript errors before proceeding
- [ ] Fix any linting issues
- [ ] All existing tests must continue to pass

## Acceptance Criteria

- [ ] Build succeeds
- [ ] Lint passes
- [ ] All tests pass
- [ ] Manual test confirms `plx paste request` works

## Implementation Checklist

- [ ] Run `pnpm run build` and fix any errors
- [ ] Run `pnpm run lint` and fix any issues
- [ ] Run `pnpm run test` and verify all tests pass
- [ ] Manually test `plx paste request` on macOS
- [ ] Verify `workspace/drafts/request.md` is created
- [ ] Test `--json` flag output
- [ ] Validate change with `plx validate add-paste-request-command --strict`

## Notes

Manual testing should include both success and error cases (empty clipboard, existing file overwrite).
