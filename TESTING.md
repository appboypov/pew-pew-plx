# Testing Configuration

## Purpose
This file configures testing workflow for the project.
Run `/plx:refine-testing` to populate project-specific test scope.

## Test Config
```yaml
test_types: [unit, integration]
coverage_threshold: 80%
runner: vitest
patterns: ["**/*.test.ts", "**/*.spec.ts"]
```

## Test Scope

### Unit Tests
- `test/commands/*.ts` — 15 command test files
- `test/core/*.ts` — core functionality tests
- `test/utils/*.ts` — utility function tests
- Pattern: `*.test.ts`

### Integration Tests
- `test/core/update.test.ts` — file generation integration
- `test/core/archive.test.ts` — archive workflow integration
- Pattern: tests that touch file system

### E2E Tests
- `test/cli-e2e/basic.test.ts` — CLI end-to-end tests
- Uses actual CLI binary execution

### Test Utilities
- `test/helpers/` — shared test helpers
- `createChange()`, `createSpec()` fixtures
- `createValidPlxWorkspace()` for workspace setup

### Test Data
- Inline fixtures in test files
- Mock workspace structures created per-test

### Mocking Patterns
- `vi.mock()` for module mocking
- `vi.spyOn()` for function spying
- File system mocks via temp directories

### Coverage Reporting
- Vitest built-in coverage
- Threshold: 80%
- Exclusions: `dist/`, `node_modules/`

### CI Integration
- GitHub Actions workflow
- Command: `pnpm test`
- Runs on PR and push to main

## Test Checklist
- [ ] All tests pass locally
- [ ] Coverage meets threshold
- [ ] No skipped tests in CI
- [ ] New code has corresponding tests
- [ ] Mocks are up to date
- [ ] E2E tests verified
