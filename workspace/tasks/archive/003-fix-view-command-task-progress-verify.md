---
status: done
skill-level: junior
parent-type: change
parent-id: fix-view-command-task-progress
---

# Task: Verify fix and validate consistency with splx get changes

## End Goal

Confirm `splx view` and `splx get changes` display consistent change status and progress information.

## Currently

`splx view` and `splx get changes` use different task discovery mechanisms, resulting in inconsistent output.

## Should

Both commands show the same changes with the same progress metrics, using centralized task storage as the source of truth.

## Constraints

- [ ] Do not modify `splx get changes` behavior (it is correct)
- [ ] Only verify `splx view` matches expected behavior

## Acceptance Criteria

- [ ] `splx view` active changes match `splx get changes` output
- [ ] Progress percentages match between commands
- [ ] Changes shown as completed in one command are also completed in the other
- [ ] Build and lint pass without errors

## Implementation Checklist

- [x] 3.1 Run `pnpm build` to compile changes
- [x] 3.2 Run `pnpm lint` to verify code style
- [x] 3.3 Run `pnpm test` to verify all tests pass
- [x] 3.4 Manually test `splx view` in a workspace with centralized tasks
- [x] 3.5 Compare output with `splx get changes` for consistency
- [x] 3.6 Document any remaining discrepancies (if intentional)

## Notes

Test in `supermarty` repo which has centralized task storage configured.
