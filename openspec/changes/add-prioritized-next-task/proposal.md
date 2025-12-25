# Change: Add prioritized act next command with status tracking

---
tracked-issues:
  - tracker: linear
    id: PLX-10
    url: https://linear.app/appboypov/issue/PLX-10
  - tracker: github
    id: "14"
    url: https://github.com/appboypov/OpenSplx/issues/14
---

## Why

Developers need an automated way to identify the next task to work on across multiple active changes. Manual task selection is error-prone and breaks workflow continuity. The system should prioritize changes closest to completion and manage task status transitions automatically.

## What Changes

- Add `openspec act next` CLI command (parent `act` command with `next` subcommand)
- Introduce task status field in task file frontmatter (`to-do`, `in-progress`, `done`)
- Implement completion-based change prioritization (highest % first, oldest as tiebreaker)
- Support `--did-complete-previous` flag for automatic status transitions
- Add `--json` flag for machine-readable output
- Create new capability spec: `cli-act-next`
- Add PLX slash command: `plx/act-next`

## Impact

- Affected specs: `cli-act-next` (new)
- Affected code:
  - `src/commands/act.ts` (new)
  - `src/cli/index.ts` (register command)
  - `src/utils/task-status.ts` (new)
  - `src/utils/change-prioritization.ts` (new)
  - `src/utils/task-progress.ts` (extend)
  - `.claude/commands/plx/act-next.md` (new)
