# Proposal: Refactor Implement Command Scope

## Summary

Modify the `/splx:implement` slash command to focus on implementing an entire change (all tasks sequentially) by default, rather than a single task. Only focus on a single task when a specific task ID is provided as an argument.

## Context

The current implement command:
1. Gets a single task via `splx get task`
2. Works through that task's Implementation Checklist
3. Instructs the user to "run implement again in a new conversation for the next task"

This workflow requires manual invocation for each task, fragmenting the implementation process across multiple sessions.

## Proposed Behavior

1. **Default (no argument)**: Implement all tasks in the highest-priority change sequentially, then stop
2. **With task ID argument**: Focus only on that specific task (current single-task behavior)

## Changes

### Template Update

Modify `implementSteps` in `src/core/templates/slash-command-templates.ts`:

**Current:**
```markdown
**Steps**
1. Get the next task using `splx get task`
2. Work through that task's Implementation Checklist
3. Mark items complete in task file
4. Reference `splx list` or `splx show` for context
5. Run implement again in a new conversation for the next task
```

**Proposed:**
```markdown
**Steps**
1. Determine scope:
   - If task ID in ARGUMENTS: use `splx get task --id <task-id>` to get that specific task
   - Otherwise: use `splx get tasks` to retrieve all tasks for the highest-priority change
2. For each task (or single task if task ID was provided):
   a. Work through the task's Implementation Checklist
   b. Mark checklist items complete in task file
   c. Mark task done with `splx complete task --id <task-id>`
3. If implementing specific task ID: stop after completing that task
4. Reference `splx list` or `splx show` for additional context
```

## Scope

- **In scope**: Template text update in `slash-command-templates.ts`
- **Out of scope**: CLI command changes, new flags, behavior changes to `splx get task`

## Affected Files

- `src/core/templates/slash-command-templates.ts` (source template)
- Generated files updated via `splx update`:
  - `.claude/commands/splx/implement.md`
  - `.cursor/commands/splx-implement.md`
  - Other tool-specific command files
