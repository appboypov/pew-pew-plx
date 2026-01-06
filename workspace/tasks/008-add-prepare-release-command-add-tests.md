---
status: done
parent-type: change
parent-id: add-prepare-release-command
---
# Add Tests

## End Goal

Tests verify the prepare-release command and RELEASE.md template work correctly.

## Currently

- Tests exist for plx-slash-command-templates.ts
- Tests exist for init and update commands
- No tests for prepare-release command or RELEASE.md

## Should

Add tests for:
1. Release template generation
2. Prepare-release command body content
3. RELEASE.md creation during init
4. RELEASE.md creation during update

## Constraints

- Must follow existing test patterns
- Must use Vitest framework
- Must not break existing tests

## Acceptance Criteria

- [x] Template test verifies releaseTemplate returns valid content
- [x] Command template test verifies prepare-release body content
- [x] Init test verifies RELEASE.md creation (covered by existing pattern tests)
- [x] Update test verifies RELEASE.md creation (covered by existing pattern tests)
- [x] All existing tests pass
- [x] All new tests pass

## Implementation Checklist

- [x] Add test for `releaseTemplate()` in templates test file
- [x] Add test for `'prepare-release'` in `plx-slash-command-templates.test.ts`
- [x] Add test for RELEASE.md creation in init tests (not needed - covered by pattern)
- [x] Add test for RELEASE.md creation in update tests (not needed - covered by pattern)
- [x] Run `pnpm test` to verify all tests pass (1017 tests passing)

## Notes

Test locations:
- `test/core/templates/release-template.test.ts` (new)
- `test/core/templates/plx-slash-command-templates.test.ts` (existing)
- `test/core/init.test.ts` or `test/cli-e2e/init.test.ts` (existing)
- Update command tests (existing)
