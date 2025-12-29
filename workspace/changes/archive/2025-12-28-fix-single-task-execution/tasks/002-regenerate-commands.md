---
status: done
---

# Task: Regenerate slash commands

## End Goal

Generated slash command files reflect the updated template instructions with explicit stop-and-wait behavior.

## Currently

`.claude/commands/plx/get-task.md` contains instructions that imply automatic continuation to the next task.

## Should

`.claude/commands/plx/get-task.md` contains explicit "Stop and await user confirmation" instruction.

## Constraints

- [ ] Regeneration must use `plx update` command
- [ ] Generated content must be within PLX markers

## Acceptance Criteria

- [ ] `.claude/commands/plx/get-task.md` contains "Stop and await user confirmation" step
- [ ] No reference to "get next task" or automatic continuation remains

## Implementation Checklist

- [x] 2.1 Run `npx plx update` to regenerate slash command files
- [x] 2.2 Verify `.claude/commands/plx/get-task.md` contains updated instructions

## Notes

The `plx update` command regenerates content within `<!-- PLX:START -->` and `<!-- PLX:END -->` markers.
