# Task: Test behavior

## End Goal

Validate all spec scenarios work correctly through automated and manual testing.

## Currently

Unit tests and integration tests are written in tasks 001-003.

## Should

All tests pass and behavior matches spec requirements.

## Constraints

- [ ] Must run all tests via `npm test`
- [ ] Must verify each spec scenario manually or via integration test

## Acceptance Criteria

- [ ] All unit tests pass
- [ ] Integration tests cover main user journeys
- [ ] Manual smoke test of CLI confirms expected output

## Implementation Checklist

- [ ] 5.1 Run `npm test` and verify all tests pass
- [ ] 5.2 Manual test: run `openspec next-task` with active changes
- [ ] 5.3 Manual test: run `openspec next-task --did-complete-previous`
- [ ] 5.4 Manual test: run `openspec next-task --json`
- [ ] 5.5 Manual test: verify behavior with no active changes
- [ ] 5.6 Update any failing tests or fix implementation bugs

## Notes

Focus on the spec scenarios. Each scenario should be verifiable through either automated tests or manual verification.
