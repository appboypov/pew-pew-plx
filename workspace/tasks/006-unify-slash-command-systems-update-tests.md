---
status: done
parent-type: change
parent-id: unify-slash-command-systems
---
# Task: Update Tests

## End Goal
All tests pass with the unified slash command system.

## Currently
- `plx-parity.test.ts` tests PLX/regular parity (no longer needed)
- `parity.test.ts` tests regular configurator consistency
- `init.test.ts` and `update.test.ts` expect specific file counts
- Various tests reference PLX types

## Should
- `plx-parity.test.ts` is deleted
- `parity.test.ts` updated for 13 commands
- File count expectations updated for 13 commands per tool
- No references to PLX types

## Constraints
- [ ] Update expected command count from 3 to 13
- [ ] Update expected file counts in init/update tests
- [ ] Remove any PLX type imports

## Acceptance Criteria
- [ ] `npm test` passes
- [ ] `plx-parity.test.ts` is deleted
- [ ] All parity tests check 13 commands

## Implementation Checklist
- [x] 6.1 Delete `test/core/configurators/slash/plx-parity.test.ts`
- [x] 6.2 Update `test/core/configurators/slash/parity.test.ts` for 13 commands
- [x] 6.3 Update `test/core/init.test.ts` expected file counts
- [x] 6.4 Update `test/core/update.test.ts` expected file counts
- [x] 6.5 Search for and update any other PLX type references
- [x] 6.6 Run `npm test` and fix any failures

## Notes
Search for `PlxSlashCommand` and `plx-` to find all references.
