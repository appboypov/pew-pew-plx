---
status: done
skill-level: medior
parent-type: change
parent-id: add-upgrade-command
---

# Task: Add tests for plx upgrade command

## End Goal

Comprehensive test coverage for the upgrade command logic.

## Currently

No tests exist for the upgrade command (new feature).

## Should

Unit tests covering version comparison, package manager detection, and error handling.

## Constraints

- [ ] Must mock network calls to npm registry
- [ ] Must mock package manager execution
- [ ] Must follow existing test patterns in `test/core/`

## Acceptance Criteria

- [ ] Version comparison tests pass
- [ ] Package manager detection tests pass
- [ ] Error handling tests pass
- [ ] All tests run successfully with `pnpm test`

## Implementation Checklist

- [x] 2.1 Create `test/core/upgrade.test.ts`
- [x] 2.2 Add tests for version comparison logic (newer, same, older)
- [x] 2.3 Add tests for package manager detection
- [x] 2.4 Add tests for `--check` flag behavior
- [x] 2.5 Add tests for network error handling
- [x] 2.6 Add tests for package manager execution errors

## Notes

- Use vitest mocking for fetch and child_process
- Follow patterns from existing tests like `test/core/update.test.ts`
