---
status: done
---

# Test Workflow

## End Goal

The implement command workflow functions correctly for both change-focused and single-task modes.

## Currently

No verification that the updated template produces correct agent behavior.

## Should

Manual verification confirms:
1. Default mode processes all tasks in a change
2. Task ID mode processes only the specified task
3. Tasks are properly marked complete
4. Workflow stops at change boundary

## Constraints

- [ ] Test with an actual change containing multiple tasks
- [ ] Verify both default and task ID argument modes

## Acceptance Criteria

- [ ] Reading implement command shows new workflow steps
- [ ] Workflow instructions are clear and unambiguous
- [ ] Task completion step includes `plx complete task` command
- [ ] Stop conditions are clearly defined

## Implementation Checklist

- [x] Read regenerated `.claude/commands/plx/implement.md`
- [x] Verify step 1 handles both modes (task ID vs default)
- [x] Verify step 4 includes `plx complete task --id <task-id>`
- [x] Verify step 5 and 6 define stop conditions
- [x] Run `plx validate --all` to ensure no validation issues

## Notes

This is a review task - no code changes, just verification that the template update produces correct output.
