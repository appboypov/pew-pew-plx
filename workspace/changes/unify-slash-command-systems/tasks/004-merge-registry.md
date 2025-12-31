---
status: done
---

# Task: Merge Registry

## End Goal
A single `SlashCommandRegistry` that manages all tool configurators.

## Currently
- `registry.ts` instantiates 23 regular configurators
- `plx-registry.ts` instantiates 23 PLX configurators
- Two separate registries called independently

## Should
- `registry.ts` has single registry with all configurators
- `plx-registry.ts` is deleted

## Constraints
- [ ] Keep static initialization pattern
- [ ] Keep `get(toolId)` and `getAll()` interface

## Acceptance Criteria
- [ ] Single `SlashCommandRegistry` class
- [ ] `plx-registry.ts` is deleted
- [ ] Registry exports work correctly

## Implementation Checklist
- [x] 4.1 Verify `registry.ts` imports updated configurators
- [x] 4.2 Delete `plx-registry.ts`
- [x] 4.3 Update any imports that referenced `plx-registry.ts`

## Notes
The registry should not need much change since configurators do the heavy lifting.
