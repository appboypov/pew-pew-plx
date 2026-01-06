---
status: done
skill-level: medior
---

# Task: Add unit tests for paste command extensions

## End Goal

Comprehensive test coverage for all new paste subcommands: `task`, `change`, `spec`.

## Currently

Tests exist for `plx paste request` in `test/commands/paste.test.ts`. New subcommands need similar coverage.

## Should

- Test `plx paste task` creates task with correct structure
- Test `plx paste task --parent-id` creates parented task with frontmatter
- Test `plx paste change` creates change directory structure
- Test `plx paste spec` creates spec directory with spec.md
- Test JSON output format for all subcommands
- Test error cases: empty clipboard, invalid parent, duplicate spec

## Constraints

- [ ] Use existing test patterns from `test/commands/paste.test.ts`
- [ ] Mock clipboard using existing test utilities
- [ ] Create temporary workspace directories for tests
- [ ] Clean up test artifacts after each test

## Acceptance Criteria

- [ ] All scenarios from spec have corresponding tests
- [ ] Tests pass with `pnpm test`
- [ ] Test coverage includes success and error paths
- [ ] JSON output tests verify structure and values

## Implementation Checklist

- [x] 6.1 Add test suite for `paste task` subcommand
- [x] 6.2 Add test cases for parented task creation
- [x] 6.3 Add test suite for `paste change` subcommand
- [x] 6.4 Add test cases for change name derivation
- [x] 6.5 Add test suite for `paste spec` subcommand
- [x] 6.6 Add test cases for duplicate spec rejection
- [x] 6.7 Add test cases for JSON output format
- [x] 6.8 Add test cases for empty clipboard error handling

## Notes

Follow existing test patterns. Use `createValidPlxWorkspace` helper if available, or create minimal workspace structure for tests.
