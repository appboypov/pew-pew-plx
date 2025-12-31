# Proposal: Refactor Implement Command Scope

## Summary

Modify the `/plx:implement` slash command to focus on implementing an entire change (all tasks sequentially) by default, rather than a single task. Only focus on a single task when a specific task ID is provided as an argument.

## Context

The current implement command:
1. Gets a single task via `plx get task`
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
1. Get the next task using `plx get task`
2. Work through that task's Implementation Checklist
3. Mark items complete in task file
4. Reference `plx list` or `plx show` for context
5. Run implement again in a new conversation for the next task
```

**Proposed:**
```markdown
**Steps**
1. Determine scope:
   - If task ID in ARGUMENTS: get specific task, skip to step 2
   - Otherwise: get next prioritized task, note its change ID
2. Work through task's Implementation Checklist
3. Mark checklist items complete in task file
4. Mark task done with `plx complete task --id <task-id>`
5. If implementing specific task ID: stop here
6. Get next task:
   - If same change: repeat from step 2
   - If different change or no tasks: stop
7. Reference `plx list` or `plx show` for additional context
```

## Scope

- **In scope**: Template text update in `slash-command-templates.ts`
- **Out of scope**: CLI command changes, new flags, behavior changes to `plx get task`

## Affected Files

- `src/core/templates/slash-command-templates.ts` (source template)
- Generated files updated via `plx update`:
  - `.claude/commands/plx/implement.md`
  - `.cursor/commands/plx-implement.md`
  - Other tool-specific command files
