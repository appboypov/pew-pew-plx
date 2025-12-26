---
status: done
---

# Task: Modify get task to auto-transition to in-progress

## End Goal

`plx get task` automatically transitions to-do tasks to in-progress when retrieved.

## Currently

`plx get task` retrieves tasks but does not transition to-do tasks to in-progress unless `--did-complete-previous` is used.

## Should

- When retrieving a task by ID (`--id`), auto-transition from to-do to in-progress
- When retrieving via prioritization (no `--id`), auto-transition the next task to in-progress
- Include transition info in output (both JSON and human-readable)

## Constraints

- [ ] Only transition to-do → in-progress, not other status combinations
- [ ] Preserve existing auto-completion detection logic
- [ ] Include `transitionedToInProgress` flag in JSON output when transition occurs

## Acceptance Criteria

- [ ] `plx get task --id X` on a to-do task sets it to in-progress
- [ ] `plx get task` on a to-do prioritized task sets it to in-progress
- [ ] Already in-progress or done tasks are not modified
- [ ] Output indicates when a transition occurred

## Implementation Checklist

- [x] 4.1 Modify `GetCommand.taskById()` to auto-transition to-do → in-progress
- [x] 4.2 Modify `GetCommand.task()` to auto-transition prioritized to-do task
- [x] 4.3 Add `transitionedToInProgress` to JSON output
- [x] 4.4 Add transition message to human-readable output

## Notes

The prioritization flow already has auto-completion logic; add transition logic alongside it.
