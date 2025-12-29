---
status: done
---

# Update Slash Command Template

## End Goal

The `slash-command-templates.ts` file uses `implement` instead of `apply` with updated workflow steps that use `plx get task`.

## Currently

The template defines `SlashCommandId` with `'apply'` and `applySteps` that instructs agents to manually scan the `tasks/` directory.

## Should

- `SlashCommandId` type includes `'implement'` instead of `'apply'`
- `implementSteps` replaces `applySteps` with steps using `plx get task` workflow
- `slashCommandBodies` record uses `implement` key instead of `apply`
- `getSlashCommandBody` function returns body for `'implement'`

## Constraints

- Preserve the base guardrails content
- Keep the references section intact
- Step numbering remains sequential

## Acceptance Criteria

- [ ] `SlashCommandId` type changed from `'apply'` to `'implement'`
- [ ] Template body uses `plx get task` command
- [ ] Template body supports `--id <task-id>` flag for specific task
- [ ] Template body does not reference manual task file scanning
- [ ] Template body says "Run implement again" not "Run apply again"

## Implementation Checklist

- [x] Update `SlashCommandId` type in `src/core/templates/slash-command-templates.ts`
- [x] Rename `applySteps` to `implementSteps` with new content
- [x] Rename `applyReferences` to `implementReferences`
- [x] Update `slashCommandBodies` record key from `apply` to `implement`
- [x] Update `src/core/templates/index.ts` to export `'implement'` type

## Notes

The new `implementSteps` content:

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
