---
tracked-issues:
  - tracker: linear
    id: PLX-9
    url: https://linear.app/de-app-specialist/issue/PLX-9
  - tracker: github
    id: "13"
    url: https://github.com/appboypov/OpenSplx/issues/13
---

## Why

Tasks for OpenSpec changes are stored in a single `tasks.md` file. This creates problems when tasks are large or numerous, as the entire file must be loaded into AI conversation context, potentially exceeding token limits (100k-120k tokens) and making it difficult to work on individual tasks in isolation. Each task should be independently actionable and completable in a single conversation.

## What Changes

- Store tasks as separate markdown files in `tasks/` directory instead of single `tasks.md`
- Each task file scoped to be completable within 100k-120k token context
- Task files follow structured template (End Goal, Currently, Should, Constraints, Acceptance Criteria, Implementation Checklist, Notes)
- Task files named with sequence prefix: `NNN-<name>.md` (e.g., `001-implement.md`)
- CLI auto-migrates legacy `tasks.md` to `tasks/001-tasks.md` on first access
- Minimum 3 task files per change: implementation, review, testing
- Each task file represents one atomic commit
- CLI commands aggregate progress across all task files

## Impact

- Affected specs: `openspec-conventions`, `docs-agent-instructions`, `cli-list`, `cli-archive`
- Affected code:
  - `src/utils/task-progress.ts` (extend for directory support)
  - `src/utils/task-migration.ts` (new)
  - `src/utils/task-file-parser.ts` (new)
  - `src/core/list.ts`
  - `src/core/archive.ts`
  - `src/commands/change.ts`
  - `src/commands/show.ts`
  - `openspec/AGENTS.md`
