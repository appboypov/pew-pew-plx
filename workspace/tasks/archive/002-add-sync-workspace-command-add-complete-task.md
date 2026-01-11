---
status: done
parent-type: change
parent-id: add-sync-workspace-command
---
# Task: Add complete-task and undo-task command templates

## End Goal

The `complete-task` and `undo-task` slash command templates exist in the template system, enabling quick task completion and undo via slash commands.

## Currently

`complete-task.md` and `undo-task.md` files exist in `.claude/commands/plx/` but are not part of the template system. They were manually created and are not generated/updated by `plx init` or `plx update`.

## Should

Both commands are part of the template system:
- Entries in `SlashCommandId` type union
- Entries in `ALL_COMMANDS` array
- Template bodies with appropriate guardrails and steps
- Generated/updated by `plx init` and `plx update`

## Constraints

- [ ] Follow existing slash command template patterns
- [ ] Keep templates simple - these are straightforward CLI wrappers
- [ ] Support `$ARGUMENTS` for task-id

## Acceptance Criteria

- [ ] `SlashCommandId` type includes `'complete-task'` and `'undo-task'`
- [ ] `ALL_COMMANDS` array includes `'complete-task'` and `'undo-task'`
- [ ] Template bodies contain minimal guardrails and steps
- [ ] Running `plx update` regenerates `.claude/commands/plx/complete-task.md` and `undo-task.md`

## Implementation Checklist

- [x] 2.1 Add `'complete-task'` and `'undo-task'` to `SlashCommandId` type
- [x] 2.2 Create `completeTaskSteps` constant
- [x] 2.3 Create `undoTaskSteps` constant
- [x] 2.4 Add `'complete-task'` and `'undo-task'` entries to `slashCommandBodies` record
- [x] 2.5 Add `'complete-task'` and `'undo-task'` to `ALL_COMMANDS` array

## Notes

These are thin wrappers around `plx complete task --id <id>` and `plx undo task --id <id>`. Minimal template content needed.
