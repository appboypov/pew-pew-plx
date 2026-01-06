---
status: done
skill-level: medior
---

# Task: Add tests for migrate command

## End Goal

Comprehensive test coverage for the `plx migrate tasks` command covering all scenarios: successful migration, dry-run, error handling, multi-workspace, and edge cases.

## Currently

- No tests exist for the migrate command (command does not exist yet)
- Test patterns established in `test/commands/` directory
- Test utilities available in `test/test-utils.ts` and `test/helpers/`

## Should

- Unit tests for migration logic (filename transformation, frontmatter injection)
- Integration tests for full command execution
- Tests covering:
  - Basic migration from changes/*/tasks/
  - Basic migration from reviews/*/tasks/
  - Mixed migration (both changes and reviews)
  - Dry-run mode
  - JSON output format
  - File collision handling
  - Empty workspace (no tasks to migrate)
  - Multi-workspace scenarios
  - Error conditions (permission issues, invalid files)

## Constraints

- [ ] Tests must follow existing patterns in `test/commands/` directory
- [ ] Must use Vitest framework
- [ ] Must use test utilities from `test/test-utils.ts`
- [ ] Tests must not leave artifacts in the actual workspace
- [ ] Tests must be deterministic and not depend on external state

## Acceptance Criteria

- [ ] All migration scenarios have test coverage
- [ ] Tests pass with `pnpm test`
- [ ] Tests verify filename transformation correctness
- [ ] Tests verify frontmatter injection correctness
- [ ] Tests verify file cleanup after migration
- [ ] Tests verify dry-run produces no side effects
- [ ] Tests verify JSON output structure
- [ ] Tests verify multi-workspace isolation
- [ ] Tests verify error handling behavior

## Implementation Checklist

- [ ] 2.1 Create `test/commands/migrate.test.ts` file
- [ ] 2.2 Add test fixtures for nested task structures
- [ ] 2.3 Write tests for filename transformation utility
- [ ] 2.4 Write tests for frontmatter injection utility
- [ ] 2.5 Write integration test for basic migration from changes
- [ ] 2.6 Write integration test for basic migration from reviews
- [ ] 2.7 Write integration test for mixed migration
- [ ] 2.8 Write test for dry-run mode
- [ ] 2.9 Write test for JSON output
- [ ] 2.10 Write test for file collision handling
- [ ] 2.11 Write test for empty workspace scenario
- [ ] 2.12 Write test for multi-workspace scenarios
- [ ] 2.13 Write tests for error conditions
- [ ] 2.14 Run full test suite and verify all pass

## Notes

- Use `createValidPlxWorkspace` from test-utils to set up test workspaces
- Clean up test directories in afterEach hooks
- Consider edge cases: special characters in names, very long names, non-standard frontmatter
