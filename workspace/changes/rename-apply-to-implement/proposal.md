# Rename Apply Command to Implement and Integrate PLX Get Task Workflow

## Summary

Rename the `apply` slash command to `implement` and update its workflow to use `plx get task` CLI command instead of manual task file scanning.

## Motivation

The current `apply` command instructs AI agents to manually scan the `tasks/` directory to find the next incomplete task. This duplicates the prioritization logic already implemented in the `plx get task` CLI command. By integrating with the CLI workflow, agents benefit from:

- Consistent prioritization logic (completion percentage, then creation date)
- Automatic status transitions (to-do → in-progress)
- Auto-completion detection
- Content filtering options (--constraints, --acceptance-criteria)

The rename from "apply" to "implement" better reflects the command's purpose and aligns with developer mental models.

## Scope

### In Scope

- Rename `SlashCommandId` type: `'apply'` → `'implement'`
- Update command template body to use `plx get task` workflow
- Rename file paths in all 24+ tool configurators
- Update all related tests
- Update plx-slash-commands spec

### Out of Scope

- Changes to the `plx get task` CLI command itself
- Changes to PLX slash commands (get-task, complete-task, etc.)
- Adding new CLI commands

## Design

### Template Changes

**Current `applySteps`**:
```typescript
const applySteps = `**Steps**
Track these steps as TODOs and complete them one by one.
1. Read \`changes/<id>/proposal.md\` and \`design.md\` (if present) to understand scope.
2. Find the next incomplete task in \`tasks/\` directory:
   - Scan task files in sequence order (001-*, 002-*, etc.)
   - Read completed task files for context
   - Stop at the first task with incomplete checkboxes in its Implementation Checklist
   - Do NOT read tasks beyond the next incomplete one
   - If user specified a task file in ARGUMENTS, use that instead
3. Work through that task's Implementation Checklist, keeping edits minimal.
4. Mark items complete (\`[x]\`) in that task file only.
5. Reference \`plx list\` or \`plx show <item>\` when additional context is required.
6. Run apply again in a new conversation for the next task.`;
```

**New `implementSteps`**:
```typescript
const implementSteps = `**Steps**
Track these steps as TODOs and complete them one by one.
1. Get the next task using \`plx get task\`:
   - Run \`plx get task\` to retrieve the next prioritized task (includes proposal and design context)
   - If user specified a task ID in ARGUMENTS, use \`plx get task --id <task-id>\` instead
2. Work through that task's Implementation Checklist, keeping edits minimal.
3. Mark items complete (\`[x]\`) in that task file only.
4. Reference \`plx list\` or \`plx show <item>\` when additional context is required.
5. Run implement again in a new conversation for the next task.`;
```

### File Path Changes

All tool configurators update their `apply` path to `implement`:

| Tool | Old Path | New Path |
|------|----------|----------|
| Claude Code | `.claude/commands/plx/apply.md` | `.claude/commands/plx/implement.md` |
| Cursor | `.cursor/commands/plx-apply.md` | `.cursor/commands/plx-implement.md` |
| Windsurf | `.windsurf/workflows/plx-apply.md` | `.windsurf/workflows/plx-implement.md` |
| ... | ... | ... |

### Test Changes

Update all tests in `test/core/init.test.ts` that reference:
- File paths containing `apply`
- Content assertions like `'name: Pew Pew Plx: Apply'`
- Variable names like `applyPath`, `applyContent`
