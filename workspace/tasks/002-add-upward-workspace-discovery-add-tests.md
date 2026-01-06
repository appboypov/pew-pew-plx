---
status: to-do
parent-type: change
parent-id: add-upward-workspace-discovery
---
# Task: Add tests for upward workspace discovery

## End Goal

Comprehensive test coverage for the new upward scanning functionality.

## Currently

- Tests exist for downward multi-workspace discovery in `test/utils/workspace-discovery.test.ts`
- No tests for upward scanning

## Should

- Unit tests for `isValidPlxWorkspace()` function
- Unit tests for `findProjectRoot()` function
- Integration tests for `getFilteredWorkspaces()` with upward scanning
- Edge case coverage for all boundary conditions

## Constraints

- [ ] Must use existing test patterns and fixtures structure
- [ ] Must create temporary directory structures for testing
- [ ] Must clean up test artifacts after each test

## Acceptance Criteria

- [ ] Tests pass for valid PLX workspace detection
- [ ] Tests pass for invalid workspace detection (missing AGENTS.md, missing signature)
- [ ] Tests pass for upward traversal stopping at workspace
- [ ] Tests pass for upward traversal stopping at `.git` ceiling
- [ ] Tests pass for CWD already being valid workspace
- [ ] Tests pass for filesystem root reached without finding workspace

## Implementation Checklist

- [ ] 2.1 Add test file `test/utils/workspace-discovery-upward.test.ts`
- [ ] 2.2 Add tests for `isValidPlxWorkspace()` with valid workspace
- [ ] 2.3 Add tests for `isValidPlxWorkspace()` with missing `workspace/` directory
- [ ] 2.4 Add tests for `isValidPlxWorkspace()` with `workspace/` but no `AGENTS.md`
- [ ] 2.5 Add tests for `isValidPlxWorkspace()` with `AGENTS.md` but no PLX signature
- [ ] 2.6 Add tests for `findProjectRoot()` finding workspace in parent
- [ ] 2.7 Add tests for `findProjectRoot()` stopping at `.git` boundary
- [ ] 2.8 Add tests for `findProjectRoot()` with CWD as valid workspace
- [ ] 2.9 Add integration test for `getFilteredWorkspaces()` from subdirectory

## Notes

Use `vitest` patterns consistent with existing test files. Create temporary directories using `fs.mkdtemp` for isolation.
