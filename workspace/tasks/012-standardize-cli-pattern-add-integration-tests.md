---
status: done
skill-level: medior
parent-type: change
parent-id: standardize-cli-pattern
---
# Task: Add Integration Tests

## End Goal

Integration tests cover all new command patterns and verify deprecation behavior.

## Currently

- Unit tests exist for individual components
- E2E tests exist in `test/cli-e2e/`
- No tests for new command patterns

## Should

- Integration tests for `plx get changes`, `plx get specs`, `plx get reviews`
- Integration tests for `plx validate change --id`, `plx validate changes`
- Integration tests for `plx archive change --id`, `plx archive review --id`
- Integration tests for `plx review change --id`, `plx review spec --id`
- Integration tests for `plx parse feedback` with new flags
- Tests verify deprecation warnings are emitted to stderr
- Tests verify parity between new and deprecated commands

## Constraints

- [ ] Must use existing test infrastructure in `test/` directory
- [ ] Must not duplicate unit test coverage unnecessarily
- [ ] Must test both success and error paths

## Acceptance Criteria

- [ ] Test for `plx get changes` output format
- [ ] Test for `plx get specs` output format
- [ ] Test for `plx get reviews` output format
- [ ] Test for `plx validate change --id` behavior
- [ ] Test for `plx validate changes` behavior
- [ ] Test for `plx archive change --id` behavior
- [ ] Test for `plx review change --id` behavior
- [ ] Test for deprecation warnings on stderr
- [ ] Test for `--no-deprecation-warnings` flag
- [ ] Test for `--parent-type` ambiguity error
- [ ] All tests pass in CI

## Implementation Checklist

- [x] 12.1 Add integration tests for `get changes/specs/reviews` in `test/commands/get.test.ts`
- [x] 12.2 Add integration tests for `validate change/changes/spec/specs`
- [x] 12.3 Add integration tests for `archive change/review`
- [x] 12.4 Add integration tests for `review change/spec/task`
- [x] 12.5 Add integration tests for `parse feedback` with new flags
- [x] 12.6 Add tests verifying deprecation warning output
- [x] 12.7 Add tests for `--no-deprecation-warnings` flag
- [x] 12.8 Add tests for parent type ambiguity detection
- [x] 12.9 Run full test suite and ensure all pass
- [x] 12.10 Verify test coverage for critical paths

## Notes

Integration tests should focus on command-level behavior rather than internal implementation. Use test fixtures from `test/fixtures/` where appropriate.
