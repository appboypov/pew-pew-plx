---
status: done
parent-type: change
parent-id: refactor-implement-command-scope
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
2. In change mode: use `plx get tasks` to retrieve all tasks for the highest-priority change, then work through each sequentially
3. In single-task mode: use `plx get task --id <task-id>` to get only that task and stop after completing it
4. Use `plx complete task --id <task-id>` to mark tasks done

## Constraints

- [ ] Template change only - no CLI modifications
- [ ] Preserve existing guardrails and references sections
- [ ] Maintain compatibility with task ID argument for single-task mode
- [ ] Use existing CLI commands (`plx get tasks`, `plx get task --id`, `plx complete task`)

## Acceptance Criteria

- [ ] Default behavior retrieves all tasks via `plx get tasks` and loops through them
- [ ] With task ID argument, only that task is implemented
- [ ] Each task is marked complete with `plx complete task --id <task-id>`
- [ ] Implementation stops when all tasks in the change are complete

## Implementation Checklist

- [x] Read current `implementSteps` in `src/core/templates/slash-command-templates.ts`
- [x] Update `implementSteps` with change-focused workflow
- [x] Verify template compiles without TypeScript errors

## Notes

The `plx get tasks` command retrieves all tasks for the highest-priority change at once, eliminating the need for repeated task retrieval calls.
