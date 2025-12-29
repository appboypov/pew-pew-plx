---
tracked-issues:
  - tracker: linear
    id: PLX-26
    url: https://linear.app/de-app-specialist/issue/PLX-26
---

# Change: Fix single task execution

## Why

When running `plx get task`, agents execute multiple tasks instead of stopping after completing one task. The current template instructions tell agents to "Repeat - Continue until all tasks are done" and imply automatic continuation to the next task, which violates user expectations of single-task-per-request behavior.

## What Changes

- Update `plx-slash-command-templates.ts` to add explicit "Stop and await user confirmation" step
- Update `agents-template.ts` Stage 2 workflow to replace "Repeat" instruction with stop-and-wait behavior
- Regenerate slash command files via `plx update`

## Impact

- Affected specs: `docs-agent-instructions`, `plx-slash-commands`
- Affected code: `src/core/templates/plx-slash-command-templates.ts`, `src/core/templates/agents-template.ts`
