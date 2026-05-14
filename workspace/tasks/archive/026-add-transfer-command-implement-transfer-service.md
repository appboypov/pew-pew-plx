---
status: done
skill-level: senior
parent-type: change
parent-id: add-transfer-command
---

# Task: Implement Transfer Service

## End Goal

A TransferService class that handles core transfer logic including plan building, conflict detection, task renumbering, and execution.

## Currently

No transfer functionality exists. Users must manually copy files between workspaces.

## Should

- TransferService class with methods for building transfer plans
- Support for all entity types: change, spec, task, review, request
- Cascade logic: change→tasks, spec→changes→tasks, review→tasks
- Conflict detection for entity IDs and task filenames
- Task sequence renumbering logic
- Parent-id update in task frontmatter when renaming entities

## Constraints

- [ ] Must follow existing service patterns in `src/services/`
- [ ] Must use existing workspace-discovery utilities
- [ ] Must handle file system errors gracefully
- [ ] Must not modify files during dry-run

## Acceptance Criteria

- [ ] TransferService builds accurate transfer plans
- [ ] Cascade logic correctly identifies linked entities
- [ ] Conflict detection finds all collisions
- [ ] Task renumbering assigns correct sequences
- [ ] Parent-id updates work with --target-name

## Implementation Checklist

- [x] 1.1 Create `src/services/transfer-service.ts`
- [x] 1.2 Define TransferPlan, TransferItem, TaskRenumber, ConflictInfo interfaces
- [x] 1.3 Implement `buildTransferPlan()` method
- [x] 1.4 Implement `findLinkedTasks()` for cascade discovery
- [x] 1.5 Implement `findRelatedChanges()` for spec cascade
- [x] 1.6 Implement `detectConflicts()` method
- [x] 1.7 Implement `calculateTaskRenumbering()` method
- [x] 1.8 Implement `executeTransfer()` method with copy-then-delete
- [x] 1.9 Implement `updateTaskFrontmatter()` for parent-id updates

## Notes

- Copy files before deleting source to prevent data loss on failure
- Use existing task-file-parser.ts for parsing task filenames
- Leverage item-discovery.ts for finding entities
