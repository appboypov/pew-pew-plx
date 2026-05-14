---
status: done
---

# Task: Update slash commands

## End Goal

All slash commands use PLX terminology. OpenSpec-named commands are removed or consolidated into PLX commands.

## Currently

- `.claude/commands/openspec/` directory exists with proposal.md, apply.md, archive.md
- `.claude/commands/splx/` directory exists with get-task.md, complete-task.md, undo-task.md
- Commands reference `openspec` commands and `openspec/AGENTS.md`
- `.claude/commands/commit.md` references OpenSpec changes directory

## Should

- `.claude/commands/openspec/` directory deleted
- `.claude/commands/splx/` contains all commands (proposal.md, apply.md, archive.md, get-task.md, complete-task.md, undo-task.md)
- All commands reference `splx` commands and `workspace/AGENTS.md`
- `.claude/commands/commit.md` references PLX/workspace changes directory

## Constraints

- [x] Delete .claude/commands/openspec/ directory entirely
- [x] All slash commands must use PLX terminology
- [x] All slash commands must use `<!-- PLX:START -->` markers

## Acceptance Criteria

- [x] No `.claude/commands/openspec/` directory exists
- [x] All commands in `.claude/commands/splx/` use PLX terminology
- [x] Commands reference `splx` CLI and `workspace/` directory

## Implementation Checklist

- [x] 6.1 Delete `.claude/commands/openspec/` directory entirely
- [x] 6.2 Create `.claude/commands/splx/proposal.md` with PLX content (replace openspec references)
- [x] 6.3 Create `.claude/commands/splx/apply.md` with PLX content (replace openspec references)
- [x] 6.4 Create `.claude/commands/splx/archive.md` with PLX content (replace openspec references)
- [x] 6.5 Update `.claude/commands/splx/get-task.md`: replace `openspec` commands with `splx`
- [x] 6.6 Update `.claude/commands/splx/complete-task.md`: replace `openspec` commands with `splx`
- [x] 6.7 Update `.claude/commands/splx/undo-task.md`: replace `openspec` commands with `splx`
- [x] 6.8 Update `.claude/commands/commit.md`: replace `openspec/changes/` with `workspace/changes/`
- [x] 6.9 Update markers to use `<!-- PLX:START -->` and `<!-- PLX:END -->`

## Notes

The proposal.md, apply.md, archive.md content should be adapted from the openspec versions but with all references updated to PLX.
