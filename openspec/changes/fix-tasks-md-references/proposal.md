---
tracked-issues:
  - tracker: linear
    id: PLX-12
    url: https://linear.app/de-app-specialist/issue/PLX-12
  - tracker: github
    id: "18"
    url: https://github.com/appboypov/OpenSplx/issues/18
---

# Change: Complete task directory migration in framework instructions

## Why

The task directory migration (PLX-9, commits `0aa4dad` and `01d1a60`) was incomplete. The design.md specified 4 updates to AGENTS.md, but only partial updates were made:

1. ✗ Still has 9+ `tasks.md` references instead of `tasks/` directory
2. ✗ "Document minimum 3 files" guideline was NEVER ADDED
3. ✗ "Task File Template section" was NEVER ADDED
4. ✗ "Numbering convention (001-, 002-)" documentation missing

AI agents still create `tasks.md` files and don't know about the 3-task minimum because the instructions never told them.

## What Changes

- Update all remaining `tasks.md` references to `tasks/` directory
- Add minimum 3 files guideline (implementation tasks, review task, test task)
- Add Task File Template section documenting:
  - End Goal, Currently, Should, Constraints, Acceptance Criteria, Implementation Checklist, Notes
  - Sequential numbering convention (001-, 002-, etc.)
- Update in all 3 files:
  - `openspec/AGENTS.md`
  - `src/core/templates/agents-template.ts`
  - `src/core/templates/slash-command-templates.ts`

## Impact

- Affected specs: `docs-agent-instructions`
- Affected code:
  - `openspec/AGENTS.md`
  - `src/core/templates/agents-template.ts`
  - `src/core/templates/slash-command-templates.ts`
- No breaking changes - completes incomplete migration
