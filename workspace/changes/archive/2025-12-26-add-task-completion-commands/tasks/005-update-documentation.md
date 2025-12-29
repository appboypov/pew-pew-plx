---
status: done
---

# Task: Update AI agent documentation

## End Goal

Document new CLI commands in AGENTS.md and slash command files.

## Currently

AGENTS.md documents `get task` commands but has no `complete` or `undo` commands.

## Should

- Add `complete task`, `complete change`, `undo task`, `undo change` to AGENTS.md CLI Commands section
- Create slash command files for AI agent guidance
- Update `get-task.md` to reflect auto-transition behavior

## Constraints

- [ ] Follow existing documentation patterns in AGENTS.md
- [ ] Follow slash command format from existing `.claude/commands/plx/` files

## Acceptance Criteria

- [ ] AGENTS.md lists all new commands with descriptions
- [ ] Slash command files provide AI agent guidance for new commands
- [ ] `get-task.md` documents auto-transition behavior

## Implementation Checklist

- [x] 5.1 Update `workspace/AGENTS.md` CLI Commands section with complete/undo commands
- [x] 5.2 Create `.claude/commands/plx/complete-task.md` slash command
- [x] 5.3 Create `.claude/commands/plx/undo-task.md` slash command
- [x] 5.4 Update `.claude/commands/plx/get-task.md` with auto-transition info

## Notes

Keep documentation concise and focused on AI agent usage patterns.
