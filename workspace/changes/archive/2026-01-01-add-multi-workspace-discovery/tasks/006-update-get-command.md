---
status: to-do
---

# Task: Update get command for multi-workspace

## End Goal
The `plx get` command in `src/commands/get.ts` handles multi-workspace discovery, prefixed IDs, and the --workspace filter.

## Currently
Command uses hardcoded `{cwd}/workspace/changes/` path. Task and change IDs don't support workspace prefixes.

## Should
Update command to:
- Discover workspaces and pass to ItemRetrievalService
- Apply --workspace filter if provided
- Handle `projectName/taskId` and `projectName/changeId` prefixed IDs
- Prioritize tasks across all filtered workspaces
- Include workspace context in JSON output

## Constraints
- [ ] Single workspace behavior unchanged
- [ ] Prefixed IDs resolved to specific workspace
- [ ] Unprefixed IDs in multi-workspace search all workspaces
- [ ] JSON output includes workspacePath and projectName fields

## Acceptance Criteria
- [ ] `plx get task` prioritizes across all workspaces
- [ ] `plx get task --id project-a/001-impl` resolves from project-a
- [ ] `plx get task --workspace project-a` only considers project-a
- [ ] `plx get change --id project-a/add-feature` resolves from project-a
- [ ] JSON output includes workspace context

## Implementation Checklist
- [ ] 6.1 Import workspace discovery utilities
- [ ] 6.2 Import workspace filter helper
- [ ] 6.3 Discover workspaces at start of task/change methods
- [ ] 6.4 Apply workspace filter to discovered workspaces
- [ ] 6.5 Pass workspaces to ItemRetrievalService constructor
- [ ] 6.6 Update task prioritization to work across workspaces
- [ ] 6.7 Update JSON output to include workspace context
- [ ] 6.8 Update display output to show workspace prefix when multi

## Notes
Depends on tasks 001, 002, 003, and 004.
