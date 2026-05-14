---
status: done
parent-type: change
parent-id: refactor-implement-command-scope
---
# Test Workflow

## End Goal

The implement command workflow functions correctly for both change-focused and single-task modes.

## Currently

No verification that the updated template produces correct agent behavior.

## Should

Manual verification confirms:
1. Default mode uses `splx get tasks` to retrieve all tasks for a change
2. Task ID mode uses `splx get task --id` for the specified task only
3. Tasks are properly marked complete with `splx complete task --id`
4. Workflow stops after all tasks in the change are complete

## Constraints

- [ ] Test with an actual change containing multiple tasks
- [ ] Verify both default and task ID argument modes

## Acceptance Criteria

- [ ] Reading implement command shows new workflow steps
- [ ] Workflow instructions are clear and unambiguous
- [ ] Task completion step includes `splx complete task` command
- [ ] Stop conditions are clearly defined

## Implementation Checklist

- [x] Read regenerated `.claude/commands/splx/implement.md`
- [x] Verify step 1 uses `splx get tasks` for default mode and `splx get task --id` for task ID mode
- [x] Verify step 2 includes task completion with `splx complete task --id <task-id>`
- [x] Verify step 3 defines stop condition for single task mode
- [x] Run `splx validate --all` to ensure no validation issues

## Notes

This is a review task - no code changes, just verification that the template update produces correct output.
