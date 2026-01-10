---
status: done
skill-level: medior
parent-type: change
parent-id: add-transfer-command
---

# Task: Add Tests for Transfer Command

## End Goal

Comprehensive test coverage for TransferService and TransferCommand.

## Currently

No tests exist for transfer functionality.

## Should

- Unit tests for TransferService methods
- Integration tests for CLI command
- Tests for cascade logic
- Tests for conflict detection
- Tests for task renumbering
- Tests for dry-run mode

## Constraints

- [ ] Must follow existing test patterns in `test/`
- [ ] Must use Vitest
- [ ] Must use test-utils.ts helpers

## Acceptance Criteria

- [ ] TransferService has unit test coverage
- [ ] CLI subcommands have integration tests
- [ ] Cascade transfers are tested
- [ ] Conflict scenarios are tested
- [ ] Task renumbering is tested
- [ ] Dry-run output is tested

## Implementation Checklist

- [x] 4.1 Create `test/services/transfer-service.test.ts`
- [x] 4.2 Test `buildTransferPlan()` for each entity type
- [x] 4.3 Test `findLinkedTasks()` cascade logic
- [x] 4.4 Test `findRelatedChanges()` for spec cascade
- [x] 4.5 Test `detectConflicts()` scenarios
- [x] 4.6 Test `calculateTaskRenumbering()` sequence assignment
- [x] 4.7 Test `executeTransfer()` file operations
- [x] 4.8 Create `test/commands/transfer.test.ts`
- [x] 4.9 Test CLI argument parsing
- [x] 4.10 Test dry-run and JSON output

## Notes

- Use createValidPlxWorkspace from test-utils.ts
- Mock file system operations for unit tests
- Use temp directories for integration tests
