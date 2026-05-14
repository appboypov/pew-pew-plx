---
status: to-do
---

# Task: Create workspace-discovery.ts utility

## End Goal
A new utility module `src/utils/workspace-discovery.ts` that recursively discovers workspace directories from a root path.

## Currently
No workspace discovery exists. All code assumes a single `{cwd}/workspace/` path.

## Should
New utility file with:
- `DiscoveredWorkspace` interface with path, relativePath, projectName, isRoot fields
- `discoverWorkspaces(root)` async function that recursively scans for workspace/ directories
- `isMultiWorkspace(workspaces)` helper to check if >1 workspace
- `getWorkspacePrefix(workspace, isMulti)` helper for display formatting
- `filterWorkspaces(workspaces, filter)` helper for --workspace flag

## Constraints
- [ ] Maximum recursive depth: 5 levels
- [ ] Skip directories: node_modules, .git, dist, build, .next, __pycache__, venv, coverage, .cache
- [ ] Root workspace appears first in results, then alphabetically by projectName
- [ ] Empty projectName for root workspace

## Acceptance Criteria
- [ ] `discoverWorkspaces` finds workspace at root level
- [ ] `discoverWorkspaces` finds nested workspaces in child directories
- [ ] Skipped directories are not traversed
- [ ] Depth limit is enforced
- [ ] Results are sorted: root first, then alphabetically
- [ ] `filterWorkspaces` correctly filters by projectName

## Implementation Checklist
- [ ] 1.1 Create `src/utils/workspace-discovery.ts` file
- [ ] 1.2 Define `DiscoveredWorkspace` interface
- [ ] 1.3 Define constants: `MAX_DEPTH = 5`, `SKIP_DIRECTORIES` array
- [ ] 1.4 Implement `discoverWorkspaces(root)` with recursive scanning
- [ ] 1.5 Implement `isMultiWorkspace(workspaces)` helper
- [ ] 1.6 Implement `getWorkspacePrefix(workspace, isMulti)` helper
- [ ] 1.7 Implement `filterWorkspaces(workspaces, filter)` helper
- [ ] 1.8 Export all types and functions

## Notes
This is the foundation utility that all other changes depend on.
