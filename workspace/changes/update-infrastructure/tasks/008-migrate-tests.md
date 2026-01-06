---
status: done
skill-level: senior
---

# Task: Migrate All Existing Tests to New Structure

## End Goal

All tests pass with the new CLI command patterns and centralized task storage structure.

## Currently

Tests in `test/`:
- `commands/` - Command integration tests using old patterns
- `core/` - Core module unit tests
- `services/` - Service tests
- `utils/` - Utility function tests
- `cli-e2e/` - End-to-end CLI tests
- Tests reference `plx list`, `plx show`, nested task paths

## Should

Tests:
- Use new command patterns (`plx get changes`, `plx get change --id <id>`, etc.)
- Reference centralized `workspace/tasks/` storage
- Test new `plx create`, `plx paste` commands
- Test `plx migrate tasks` command
- Use `--parent-id`, `--parent-type` flags
- Remove tests for deprecated commands or update them

## Constraints

- [ ] Maintain test coverage levels
- [ ] Keep test structure (mirrors src/)
- [ ] Update test fixtures for new storage structure
- [ ] Do not skip failing tests without fixing

## Acceptance Criteria

- [ ] All tests pass with `pnpm test`
- [ ] No references to deprecated commands in test files
- [ ] Test fixtures use centralized task storage structure
- [ ] New commands have test coverage
- [ ] Migration command has test coverage

## Implementation Checklist

- [ ] 8.1 Update test/commands/get.test.ts for new subcommands
- [ ] 8.2 Update test/commands/validate.test.ts for entity subcommands
- [ ] 8.3 Update test/commands/complete.test.ts for new entities
- [ ] 8.4 Update test/commands/undo.test.ts for new entities
- [ ] 8.5 Update test/commands/review.test.ts for new syntax
- [ ] 8.6 Update test/commands/parse-feedback.test.ts for new flags
- [ ] 8.7 Remove or update test/commands/list.test.ts (deprecated)
- [ ] 8.8 Remove or update test/commands/show.test.ts (deprecated)
- [ ] 8.9 Update test/core/archive.test.ts for entity subcommands
- [ ] 8.10 Update test/core/list.test.ts (if still needed)
- [ ] 8.11 Update test/services/item-retrieval.test.ts for centralized tasks
- [ ] 8.12 Update test/utils/task-*.test.ts for new storage paths
- [ ] 8.13 Add test/commands/create.test.ts for new command
- [ ] 8.14 Add test/commands/paste.test.ts extensions
- [ ] 8.15 Add test/commands/migrate.test.ts for new command
- [ ] 8.16 Update test/fixtures/ with centralized task structure
- [ ] 8.17 Update test/test-utils.ts helper functions
- [ ] 8.18 Run full test suite and fix any failures

## Notes

This task depends on implementation being complete. Run tests iteratively as changes are made. Use `pnpm test:watch` during development.
