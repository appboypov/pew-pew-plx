---
status: to-do
---

# Task: Add comprehensive test coverage

## End Goal
Full test coverage for multi-workspace discovery and all updated functionality.

## Currently
No tests for multi-workspace functionality (doesn't exist yet).

## Should
Create/update test files:
- **workspace-discovery.test.ts** (NEW): Tests for discoverWorkspaces, filterWorkspaces, helpers
- **item-discovery.test.ts** (UPDATE): Tests for multi-workspace variants
- **item-retrieval.test.ts** (UPDATE): Tests for workspace context handling
- **list.test.ts** (UPDATE): Tests for multi-workspace aggregation
- **get.test.ts** (UPDATE): Tests for prefixed ID resolution
- **validate.test.ts** (UPDATE): Tests for multi-workspace validation

## Constraints
- [ ] Use Vitest for all tests
- [ ] Create temp directory structures for realistic testing
- [ ] Cover edge cases: empty, single, multiple, deep nesting, skip directories

## Acceptance Criteria
- [ ] All new utility functions have unit tests
- [ ] Multi-workspace variants have integration tests
- [ ] Edge cases covered: empty, single workspace, deep nesting
- [ ] Skip directories verified not to be traversed
- [ ] Backward compatibility tests pass

## Implementation Checklist
- [ ] 9.1 Create test/utils/workspace-discovery.test.ts
- [ ] 9.2 Add tests for discoverWorkspaces with various structures
- [ ] 9.3 Add tests for isMultiWorkspace helper
- [ ] 9.4 Add tests for getWorkspacePrefix helper
- [ ] 9.5 Add tests for filterWorkspaces helper
- [ ] 9.6 Update test/utils/item-discovery.test.ts for multi variants
- [ ] 9.7 Add/update tests for ItemRetrievalService
- [ ] 9.8 Add tests for list command multi-workspace behavior
- [ ] 9.9 Add tests for get command multi-workspace behavior
- [ ] 9.10 Add tests for validate command multi-workspace behavior

## Notes
Tests should be written as implementation progresses, but this task ensures comprehensive coverage.
