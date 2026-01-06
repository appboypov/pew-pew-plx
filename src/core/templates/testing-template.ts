export const testingTemplate = (): string => `# Testing Configuration

## Purpose
This file configures testing workflow for the project.
Run \`/plx:refine-testing\` to populate project-specific test scope.

## Test Config
\`\`\`yaml
test_types: [unit, integration]
coverage_threshold: 80%
runner: vitest
patterns: ["**/*.test.ts", "**/*.spec.ts"]
\`\`\`

## Test Scope

### Unit Tests
<!-- Location and patterns for isolated function/method tests -->

### Integration Tests
<!-- Location and patterns for component interaction tests -->

### E2E Tests
<!-- Location and patterns for end-to-end user journey tests -->

### Test Utilities
<!-- Shared helpers, fixtures, factories, mocks -->

### Test Data
<!-- Sample data, fixtures, seed files -->

### Mocking Patterns
<!-- How external dependencies are mocked; mock locations -->

### Coverage Reporting
<!-- Coverage tool, report locations, exclusion patterns -->

### CI Integration
<!-- How tests run in CI; test commands; parallelization -->

## Test Checklist
- [ ] All tests pass locally
- [ ] Coverage meets threshold
- [ ] No skipped tests in CI
- [ ] New code has corresponding tests
- [ ] Mocks are up to date
- [ ] E2E tests verified
`;
