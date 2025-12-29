---
status: done
---

# Task: Integrate Migration into Init Command

## End Goal

`plx init` automatically migrates OpenSpec projects before initializing.

## Currently

`plx init` checks for `workspace/` directory to determine extend mode. Does not recognize `openspec/` as existing project.

## Should

Call migration at the start of init flow. After migration, `openspec/` becomes `workspace/` and triggers extend mode.

## Constraints

- [ ] Migration must run before directory existence check
- [ ] Must transition to extend mode after migration
- [ ] Must not change behavior for fresh or PLX projects

## Acceptance Criteria

- [ ] Running `plx init` on OpenSpec project migrates then enters extend mode
- [ ] Running `plx init` on fresh project works unchanged
- [ ] Running `plx init` on PLX project works unchanged
- [ ] Migration messages appear before init messages

## Implementation Checklist

- [x] Import `migrateOpenSpecProject` in `src/core/init.ts`
- [x] Call migration at start of init flow
- [x] Log migration results using chalk
- [x] Ensure extend mode detection happens after migration

## Notes

After migration, the project should be treated as already initialized.
