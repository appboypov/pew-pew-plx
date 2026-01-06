---
name: /plx-sync-workspace
id: plx-sync-workspace
category: Pew Pew Plx
description: Scan workspace state and suggest maintenance actions.
---
<!-- PLX:START -->
**Context**
@ARCHITECTURE.md
@workspace/AGENTS.md

**Guardrails**
- Spawn sub-agents for complex assessments when context is heavy (multiple changes, many tasks).
- Present actionable suggestions using question tool (multi-select if available) or numbered list.
- Wait for user selection before executing any actions.
- Validate workspace state with `plx validate all --strict` before and after actions.
- Execute only the actions explicitly selected by the user.

**Steps**
1. Determine scope from `$ARGUMENTS`:
   - If change-id provided: focus on that change only.
   - If task-id provided: focus on that task's parent change.
   - If no arguments: scan entire workspace.
2. Scan workspace state:
   - Run `plx get changes` to see all active changes.
   - Run `plx get tasks` to see all open tasks.
   - Run `plx validate all --strict` to identify validation issues.
3. Assess and categorize issues:
   - Ready to archive: changes with all tasks completed.
   - Stale changes: changes with no recent activity.
   - Failing validation: items with validation errors or warnings.
   - Missing artifacts: incomplete proposals, specs, or tasks.
   - Orphaned items: specs without changes, tasks without parents.
4. Present actionable suggestions:
   - Use question tool with multi-select if available.
   - Otherwise, present numbered list and ask user to select by number.
   - Group suggestions by category (archive, create, update, validate, delete).
5. Wait for user selection—do not proceed without explicit confirmation.
6. Execute selected actions sequentially:
   - Archive: `plx archive change --id <id> --yes`
   - Create tasks: scaffold task files in `workspace/tasks/` with format `NNN-<parent-id>-<name>.md` and frontmatter including parent-type and parent-id
   - Update proposals: edit `proposal.md` or `design.md`
   - Validate: `plx validate change --id <id> --strict`
7. Report summary:
   - List all actions taken with outcomes.
   - Show current workspace state with `plx get changes`.
   - Highlight any remaining issues.

**Reference**
- Use `plx get changes` to see all active changes.
- Use `plx get tasks` to see all open tasks across changes.
- Use `plx get tasks --parent-id <change-id> --parent-type change` to see tasks for a specific change.
- Use `plx validate all --strict` for comprehensive validation.
- Use `plx archive change --id <id> --yes` to archive without prompts.
- Use `plx get change --id <id>` to inspect change details.
- Use `plx get spec --id <id>` to inspect spec details.
<!-- PLX:END -->
