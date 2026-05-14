---
status: done
---

# Task: Update Existing Slash Command Files

## End Goal

Existing slash command files in this project use "OpenSplx" display names.

## Currently

Files in `.cursor/commands/` and `.claude/commands/splx/` have content referencing "PLX".

## Should

Update display names within the command content to "OpenSplx".

## Constraints

- [ ] Filenames stay as `splx-*.md`
- [ ] Directory structure unchanged
- [ ] Markers within files stay as `<!-- PLX:START -->`

## Acceptance Criteria

- [ ] All `.cursor/commands/splx-*.md` files updated
- [ ] All `.claude/commands/splx/*.md` files updated
- [ ] Display names show "OpenSplx"

## Implementation Checklist

- [x] Update `.cursor/commands/splx-get-task.md`
- [x] Update `.cursor/commands/splx-init-architecture.md`
- [x] Update `.cursor/commands/splx-proposal.md`
- [x] Update `.cursor/commands/splx-refine-architecture.md`
- [x] Update `.cursor/commands/splx-update-architecture.md`
- [x] Update `.claude/commands/splx/get-task.md`
- [x] Update `.claude/commands/splx/init-architecture.md`
- [x] Update `.claude/commands/splx/parse-feedback.md`
- [x] Update `.claude/commands/splx/proposal.md`
- [x] Update `.claude/commands/splx/refine-architecture.md`
- [x] Update `.claude/commands/splx/refine-review.md`
- [x] Update `.claude/commands/splx/review.md`
- [x] Update `.claude/commands/splx/update-architecture.md`

## Notes

These are the dogfooding slash command files for this project.
