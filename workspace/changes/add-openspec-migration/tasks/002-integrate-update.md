---
status: done
---

# Task: Integrate Migration into Update Command

## End Goal

`plx update` automatically migrates OpenSpec projects before updating.

## Currently

`plx update` requires `workspace/` directory to exist. Fails with error if only `openspec/` exists.

## Should

Call migration at the start of `execute()` before checking for workspace directory.

## Constraints

- [ ] Migration must run before workspace directory check
- [ ] Must not change existing update behavior for PLX projects
- [ ] Must log migration results if any changes made

## Acceptance Criteria

- [ ] Running `plx update` on OpenSpec project migrates then updates
- [ ] Running `plx update` on PLX project works unchanged
- [ ] Migration messages appear before update messages

## Implementation Checklist

- [x] Import `migrateOpenSpecProject` in `src/core/update.ts`
- [x] Call migration at start of `execute()` method
- [x] Log migration results using chalk (green for success)
- [x] Ensure workspace check happens after migration

## Notes

Migration should be the first thing that happens in the update flow.
