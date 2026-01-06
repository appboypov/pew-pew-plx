---
status: done
parent-type: change
parent-id: add-prepare-release-command
---
# Update PLX Base Configurator

## End Goal

The `ALL_PLX_COMMANDS` array includes `'prepare-release'`.

## Currently

- `ALL_PLX_COMMANDS` has 8 command IDs
- No prepare-release entry exists

## Should

- Add `'prepare-release'` to `ALL_PLX_COMMANDS` array

## Constraints

- Must maintain array order convention (alphabetical by category or addition order)
- Must not break existing command generation

## Acceptance Criteria

- [x] `'prepare-release'` added to `ALL_PLX_COMMANDS` array
- [x] Array length is now 9
- [x] TypeScript compiles without errors (after Task 005)

## Implementation Checklist

- [x] Add `'prepare-release'` to `ALL_PLX_COMMANDS` array
- [x] Verify TypeScript compilation (after Task 005)

## Notes

Location: `src/core/configurators/slash/plx-base.ts`
