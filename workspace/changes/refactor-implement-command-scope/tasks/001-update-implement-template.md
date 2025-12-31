---
status: done
---

# Update Implement Template

## End Goal

The implement slash command template instructs agents to work through all tasks in a change sequentially, rather than a single task.

## Currently

The `implementSteps` constant in `src/core/templates/slash-command-templates.ts` instructs agents to:
1. Get a single task
2. Complete it
3. Tell the user to run implement again for the next task

## Should

The template instructs agents to:
1. Check if a specific task ID was provided (single-task mode) or not (change mode)
2. In change mode: loop through all tasks in the change until complete
3. In single-task mode: complete only that task and stop
4. Use `plx complete task --id <task-id>` to mark tasks done
5. Detect when switching to a different change (stop condition)

## Constraints

- [ ] Template change only - no CLI modifications
- [ ] Preserve existing guardrails and references sections
- [ ] Maintain compatibility with task ID argument for single-task mode
- [ ] Use existing CLI commands (`plx get task`, `plx complete task`)

## Acceptance Criteria

- [ ] Default behavior loops through all tasks in highest-priority change
- [ ] With task ID argument, only that task is implemented
- [ ] Each task is marked complete with `plx complete task --id <task-id>`
- [ ] Implementation stops when change is complete or different change is encountered

## Implementation Checklist

- [x] Read current `implementSteps` in `src/core/templates/slash-command-templates.ts`
- [x] Update `implementSteps` with change-focused workflow
- [x] Verify template compiles without TypeScript errors

## Notes

The loop detection relies on comparing change IDs from consecutive `plx get task` calls. When the change ID differs, the current change is complete.
