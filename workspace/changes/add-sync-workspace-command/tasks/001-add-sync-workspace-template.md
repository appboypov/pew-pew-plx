---
status: done
---

# Task: Add sync-workspace slash command template

## End Goal

The `sync-workspace` slash command template exists in the template system and generates properly when `plx init` or `plx update` runs.

## Currently

No `sync-workspace` command exists. The slash command system has 13 commands defined in `SlashCommandId` type.

## Should

The slash command system includes `sync-workspace` with:
- Template body defining guardrails and steps for workspace maintenance
- Entry in `SlashCommandId` type union
- Entry in `ALL_COMMANDS` array
- Frontmatter configuration for Claude Code

## Constraints

- [ ] Follow existing slash command template patterns
- [ ] Use `planningContext` for @ARCHITECTURE.md and @workspace/AGENTS.md references
- [ ] Support `$ARGUMENTS` for optional change-id or task-id targeting

## Acceptance Criteria

- [ ] `SlashCommandId` type includes `'sync-workspace'`
- [ ] `ALL_COMMANDS` array includes `'sync-workspace'`
- [ ] Template body contains guardrails for sub-agent usage and action selection
- [ ] Template body contains steps for scan, assess, suggest, select, execute, report workflow
- [ ] Running `plx update` generates `.claude/commands/plx/sync-workspace.md`

## Implementation Checklist

- [x] 1.1 Add `'sync-workspace'` to `SlashCommandId` type in `src/core/templates/slash-command-templates.ts`
- [x] 1.2 Create `syncWorkspaceGuardrails` constant with context and guidelines
- [x] 1.3 Create `syncWorkspaceSteps` constant with workflow steps
- [x] 1.4 Create `syncWorkspaceReference` constant with CLI command references
- [x] 1.5 Add `'sync-workspace'` entry to `slashCommandBodies` record
- [x] 1.6 Add `'sync-workspace'` to `ALL_COMMANDS` array in `src/core/configurators/slash/base.ts`

## Notes

The command template instructs the AI agent to:
1. Parse optional `$ARGUMENTS` for targeted scope
2. Scan workspace state using `plx list`, `plx get tasks`
3. Use sub-agents for complex assessments when context is heavy
4. Suggest maintenance actions (archive, create tasks, update proposals, validate)
5. Present suggestions via question tool (multi-select) or numbered list
6. Execute selected actions
7. Report detailed summary
