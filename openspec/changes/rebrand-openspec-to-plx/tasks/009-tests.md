---
status: to-do
---

# Task: Update tests and fixtures

## End Goal

All tests pass with the updated PLX terminology. Test fixtures use `workspace/` directory structure.

## Currently

- `test/fixtures/tmp-init/openspec/` directory structure
- Tests reference "openspec" directory paths
- `test/utils/command-name.test.ts` expects "openspec" as default
- Tests reference OPENSPEC_DIR_NAME constant

## Should

- `test/fixtures/tmp-init/workspace/` directory structure
- Tests reference "workspace" directory paths
- `test/utils/command-name.test.ts` expects "plx" as default
- Tests reference PLX_DIR_NAME constant

## Constraints

- [ ] All tests must pass after changes
- [ ] Test fixtures must use workspace/ directory
- [ ] No test should reference "openspec" except for historical/comparison tests

## Acceptance Criteria

- [ ] `pnpm test` passes with all tests green
- [ ] Test fixtures updated to workspace/ structure
- [ ] command-name tests expect "plx" default

## Implementation Checklist

- [ ] 9.1 Rename `test/fixtures/tmp-init/openspec/` to `test/fixtures/tmp-init/workspace/`
- [ ] 9.2 Update `test/core/init.test.ts`: change path references from "openspec" to "workspace"
- [ ] 9.3 Update `test/core/update.test.ts`: change path references and imports
- [ ] 9.4 Update `test/core/list.test.ts`: change path references
- [ ] 9.5 Update `test/core/archive.test.ts`: change path references
- [ ] 9.6 Update `test/core/global-config.test.ts`: update expected directory from "openspec" to "plx"
- [ ] 9.7 Update `test/cli-e2e/basic.test.ts`: change path references and command expectations
- [ ] 9.8 Update `test/utils/command-name.test.ts`: change expected default from "openspec" to "plx"
- [ ] 9.9 Search all test files for remaining "openspec" references and update
- [ ] 9.10 Run `pnpm test` and fix any remaining failures

## Notes

Tests are critical for validating the rebrand is complete and correct. Run tests frequently during implementation.
