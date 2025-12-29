---
status: done
---

# Update Tests

## End Goal
Tests reflect the new command set and pass successfully.

## Currently
- Tests exist for `init-architecture` and `update-architecture`
- No test for `refine-release`
- Tests don't verify @ file references

## Should
- Tests for deprecated commands removed
- Test for `refine-release` added
- Tests verify @ file references in command bodies

## Constraints
- [x] Follow existing test patterns
- [x] All tests must pass

## Acceptance Criteria
- [x] No tests reference `init-architecture` or `update-architecture`
- [x] Test exists for `refine-release` command body
- [x] Tests verify @ notation in relevant commands
- [x] `npm test` passes

## Implementation Checklist
- [x] Remove test cases for `init-architecture`
- [x] Remove test cases for `update-architecture`
- [x] Add test case for `refine-release` (follows refine-* pattern)
- [x] Add assertions for `@REVIEW.md` in review command
- [x] Add assertions for `@REVIEW.md` in refine-review command
- [x] Add assertions for `@ARCHITECTURE.md` in refine-architecture command
- [x] Add assertions for `@README.md`, `@CHANGELOG.md`, `@ARCHITECTURE.md` in prepare-release command
- [x] Run `npm test` to verify all tests pass
- [x] Update `plx-base.test.ts` to use `get-task` instead of deprecated commands
- [x] Update `update.test.ts` PLX command generation tests to use `get-task`

## Notes
- Primary test file: `test/core/templates/plx-slash-command-templates.test.ts`
- Parity tests in `test/core/configurators/slash/plx-parity.test.ts` should pass automatically
