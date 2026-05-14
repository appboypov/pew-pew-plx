---
status: to-do
---

# Task: Update item-discovery.ts with multi-workspace variants

## End Goal
The `src/utils/item-discovery.ts` module has new multi-workspace variants of all discovery functions that aggregate across multiple workspaces.

## Currently
Functions like `getActiveChangeIds`, `getSpecIds`, `getActiveReviewIds` only look at a single workspace path.

## Should
Add new types and functions:
- `ChangeIdWithWorkspace`, `SpecIdWithWorkspace`, `ReviewIdWithWorkspace` interfaces
- `getActiveChangeIdsMulti(workspaces)` function
- `getSpecIdsMulti(workspaces)` function
- `getActiveReviewIdsMulti(workspaces)` function
- `getArchivedChangeIdsMulti(workspaces)` function
- `getArchivedReviewIdsMulti(workspaces)` function

## Constraints
- [ ] Preserve existing single-workspace functions (backward compatibility)
- [ ] Multi functions accept `DiscoveredWorkspace[]` from workspace-discovery
- [ ] Return types include workspace context (path, projectName, displayId)
- [ ] displayId format: `{projectName}/{id}` in multi-workspace, `{id}` in single

## Acceptance Criteria
- [ ] Existing functions continue to work unchanged
- [ ] Multi-workspace functions aggregate from all provided workspaces
- [ ] displayId correctly formatted based on isMultiWorkspace
- [ ] Same item name in different workspaces returns distinct entries

## Implementation Checklist
- [ ] 2.1 Import `DiscoveredWorkspace` from workspace-discovery
- [ ] 2.2 Define `ChangeIdWithWorkspace` interface
- [ ] 2.3 Define `SpecIdWithWorkspace` interface
- [ ] 2.4 Define `ReviewIdWithWorkspace` interface
- [ ] 2.5 Implement `getActiveChangeIdsMulti(workspaces)` function
- [ ] 2.6 Implement `getSpecIdsMulti(workspaces)` function
- [ ] 2.7 Implement `getActiveReviewIdsMulti(workspaces)` function
- [ ] 2.8 Implement `getArchivedChangeIdsMulti(workspaces)` function
- [ ] 2.9 Implement `getArchivedReviewIdsMulti(workspaces)` function
- [ ] 2.10 Export all new types and functions

## Notes
Depends on task 001.
