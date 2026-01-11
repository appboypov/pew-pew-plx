---
status: done
skill-level: medior
parent-type: change
parent-id: add-plan-implementation-command
---

# Task: Implement Slash Command (/plx:plan-implementation)

## End Goal

The `/plx:plan-implementation` slash command exists for all supported AI tools and guides orchestrators through the multi-agent handoff workflow.

## Currently

- Slash commands exist for orchestrate, implement, get-task, review, etc.
- No dedicated command for generating handoff context and managing review loops
- Orchestrators must manually format task blocks for external agents

## Should

- New `/plx:plan-implementation` slash command in all tool configurators
- Takes change-id as argument
- Calls `plx create progress --change-id <id>` to generate PROGRESS.md
- Outputs first task block to chat for immediate copy
- Guides orchestrator through review loop workflow

## Constraints

- [ ] Must follow existing slash command template patterns
- [ ] Must be added to all tool configurators (Claude, Cursor, Copilot, etc.)
- [ ] Task blocks must not mention PROGRESS.md
- [ ] Feedback blocks must be self-contained for fresh agents

## Acceptance Criteria

- [ ] Command exists in `.claude/commands/plx/plan-implementation.md`
- [ ] Command generated for all supported AI tools during init/update
- [ ] Frontmatter includes correct name, description, category, tags
- [ ] Body wrapped in PLX markers
- [ ] Includes guardrails for: generating progress, outputting task blocks, verifying work
- [ ] Includes steps for: PROGRESS.md generation, task block output, review loop, feedback, completion
- [ ] Task block format is self-contained with full context
- [ ] Feedback block format is self-contained

## Implementation Checklist

- [x] 2.1 Add `plan-implementation` to `SlashCommandId` type in `src/core/templates/index.ts`
- [x] 2.2 Add `plan-implementation` to `ALL_COMMANDS` array in `src/core/configurators/slash/base.ts`
- [x] 2.3 Create `getPlanImplementationBody` in slash command templates
- [x] 2.4 Define task block template format
- [x] 2.5 Define feedback block template format
- [x] 2.6 Define verification checklist (scope, traceless, conventions, tests, AC)
- [x] 2.7 Add frontmatter generation for plan-implementation
- [x] 2.8 Run `plx update` to generate commands for all tools
- [x] 2.9 Verify command exists in Claude Code commands

## Notes

Reference `/plx:orchestrate` and `/plx:implement` for patterns. The key difference is this command outputs to chat for manual copy, not in-process agent spawning.
