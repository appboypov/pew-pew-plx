---
status: to-do
---

# Task: Update ItemRetrievalService for multi-workspace

## End Goal
The `ItemRetrievalService` class in `src/services/item-retrieval.ts` supports workspace context and can resolve items across multiple workspaces.

## Currently
Service only looks at single workspace path. Methods like `getTaskById`, `getChangeById` don't understand workspace prefixes.

## Should
Update service:
- Constructor accepts optional `workspaces: DiscoveredWorkspace[]` parameter
- Auto-discover workspaces if not provided
- Store `isMulti` boolean state
- `getTaskById` parses `projectName/taskId` prefix to resolve workspace
- `getChangeById` parses `projectName/changeId` prefix to resolve workspace
- `getAllOpenTasks` aggregates across all workspaces with displayId

## Constraints
- [ ] Backward compatible - single workspace behavior unchanged
- [ ] Parse prefix format: `{projectName}/{id}` where projectName may be empty for root
- [ ] When prefix not provided and multi-workspace, search all workspaces
- [ ] Return workspace context in results

## Acceptance Criteria
- [ ] Single workspace projects work identically to before
- [ ] Prefixed IDs resolve to correct workspace
- [ ] Unprefixed IDs in multi-workspace search all workspaces
- [ ] Ambiguous unprefixed IDs return error with available matches
- [ ] `getAllOpenTasks` returns tasks from all workspaces

## Implementation Checklist
- [ ] 3.1 Import workspace discovery utilities
- [ ] 3.2 Add `workspaces` and `isMulti` instance properties
- [ ] 3.3 Update constructor to accept optional workspaces parameter
- [ ] 3.4 Add workspace auto-discovery in constructor if not provided
- [ ] 3.5 Add helper method to parse prefixed IDs
- [ ] 3.6 Update `getTaskById` to handle workspace prefix resolution
- [ ] 3.7 Update `getChangeById` to handle workspace prefix resolution
- [ ] 3.8 Update `getSpecById` to handle workspace prefix resolution
- [ ] 3.9 Update `getAllOpenTasks` to aggregate across workspaces
- [ ] 3.10 Update `getTasksForChange` to handle workspace prefix

## Notes
Depends on tasks 001 and 002.
