# Change: Add Task Skill Level Indicator for AI Model Selection

---
tracked-issues:
  - tracker: linear
    id: PLX-46
    url: https://linear.app/de-app-specialist/issue/PLX-46/task-includes-skill-level-indicator-for-ai-model-selection
---

## Why

All tasks are currently treated equally regardless of complexity. AI agents have no guidance on which model to use for different task types, leading to inefficient resource usage—simple tasks may use expensive models while complex tasks may use inadequate ones.

## What Changes

- Add optional `skill-level` field to task YAML frontmatter (values: junior, medior, senior)
- Display skill level in CLI task output (`plx get task`, `plx get tasks`)
- Warn in `--strict` validation mode when tasks are missing skill level
- Update task template in workspace/AGENTS.md to include skill-level
- Update plx/plan-proposal slash command to auto-assign skill levels based on complexity heuristics
- Update plx/orchestrate slash command to select sub-agent model based on skill level

## Impact

- Affected specs: cli-get-task, cli-validate, docs-agent-instructions, plx-slash-commands
- Affected code:
  - `src/utils/task-status.ts` - Add skill-level parsing
  - `src/commands/get.ts` - Display skill level in output
  - `src/core/validation/validator.ts` - Add strict mode warning
  - `src/core/templates/agents-template.ts` - Update task template
  - `src/core/templates/slash-command-templates.ts` - Update orchestrate and plan-proposal
