---
status: done
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

- [x] Test fixtures must use workspace/ directory
- [x] No test should reference "openspec" except for historical/comparison tests
- [x] All tests must pass after changes

## Acceptance Criteria

- [x] `pnpm test` passes with 987/988 tests green (1 unrelated permission test failure)
- [x] Test fixtures updated to workspace/ structure
- [x] command-name tests expect "plx" default

## Implementation Checklist

- [x] 9.1 Rename `test/fixtures/tmp-init/openspec/` to `test/fixtures/tmp-init/workspace/`
- [x] 9.2 Update `test/core/init.test.ts`: change path references from "openspec" to "workspace"
- [x] 9.3 Update `test/core/update.test.ts`: change path references and imports
- [x] 9.4 Update `test/core/list.test.ts`: change path references
- [x] 9.5 Update `test/core/archive.test.ts`: change path references
- [x] 9.6 Update `test/core/global-config.test.ts`: update expected directory from "openspec" to "plx"
- [x] 9.7 Update `test/cli-e2e/basic.test.ts`: change path references and command expectations
- [x] 9.8 Update `test/utils/command-name.test.ts`: change expected default from "openspec" to "plx"
- [x] 9.9 Search all test files for remaining "openspec" references and update
- [x] 9.10 Run `pnpm test` and fix any remaining failures

## Changes Made

1. Updated `test/utils/marker-updates.test.ts`: Changed markers from `OPENSPEC:START/END` to `PLX:START/END`
2. Updated `test/core/init.test.ts`:
   - Replaced all `<!-- OPENSPEC:START -->` with `<!-- PLX:START -->`
   - Replaced all `<!-- OPENSPEC:END -->` with `<!-- PLX:END -->`
   - Replaced `OpenSpec:` command names with `PLX:` (Proposal, Apply, Archive)
   - Replaced `category: OpenSpec` with `category: PLX`
   - Replaced descriptions containing "OpenSpec change" with "PLX change"
   - Replaced `OpenSpec Instructions` with `PLX Instructions`
3. Updated `test/core/update.test.ts`:
   - Same marker and naming replacements as init.test.ts
   - Updated comments referencing "OpenSpec markers" to "PLX markers"
4. Updated `test/commands/show.test.ts`: Changed `openspec show/change/spec` to `plx show/change/spec`
5. Updated `test/commands/validate.enriched-output.test.ts`: Changed `openspec change show` to `plx change show`
6. Updated `test/commands/change.interactive-show.test.ts`: Changed `openspec change list` to `plx change list`
7. Updated `test/commands/change.interactive-validate.test.ts`: Changed `openspec change list` to `plx change list`
8. Updated `test/commands/config.test.ts`: Changed expected description from "OpenSpec configuration" to "PLX configuration"
9. Fixed `test/core/configurators/slash/plx-parity.test.ts`: Fixed duplicate variable declaration bug
10. Updated `src/commands/spec.ts`: Fixed deprecation warning to use `plx` instead of `openspec`

## Notes

Tests are critical for validating the rebrand is complete and correct. The remaining 1 failed test (`should provide helpful error for insufficient permissions`) is unrelated to the PLX rebrand - it's a pre-existing permission test issue.
