---
status: done
---

# Regenerate Slash Commands

## End Goal

All generated implement slash command files reflect the updated template.

## Currently

Generated command files in `.claude/commands/plx/implement.md`, `.cursor/commands/plx-implement.md`, etc. contain the old single-task instructions.

## Should

Running `plx update` regenerates all implement command files with the new change-focused workflow.

## Constraints

- [ ] Use `plx update` to regenerate (not manual editing)
- [ ] Verify at least Claude and Cursor command files are updated

## Acceptance Criteria

- [ ] `.claude/commands/plx/implement.md` contains new workflow
- [ ] `.cursor/commands/plx-implement.md` contains new workflow
- [ ] Generated content matches template in source

## Implementation Checklist

- [x] Run `pnpm build` to compile changes
- [x] Run `plx update` to regenerate command files
- [x] Verify `.claude/commands/plx/implement.md` content
- [x] Verify `.cursor/commands/plx-implement.md` content

## Notes

The `plx update` command uses the compiled templates from `dist/` so the build step is required first.
