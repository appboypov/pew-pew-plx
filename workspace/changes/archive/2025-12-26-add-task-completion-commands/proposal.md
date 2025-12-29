---
tracked-issues:
  - tracker: linear
    id: PLX-19
    url: https://linear.app/de-app-specialist/issue/PLX-19/user-is-able-to-complete-and-undo-tasks-and-changes-via-cli-commands
---

# Change: Add task completion and undo CLI commands

## Why

Users need CLI commands to explicitly mark tasks and changes as complete or revert them. Currently, task completion only happens via `--did-complete-previous` flag on `get task`, which couples retrieval with completion. Separate commands provide clearer intent and enable bulk operations on changes.

## What Changes

- Add `plx complete task --id <task-id>` command to mark a task as done
- Add `plx complete change --id <change-id>` command to complete all tasks in a change
- Add `plx undo task --id <task-id>` command to revert a task to to-do
- Add `plx undo change --id <change-id>` command to revert all tasks in a change
- Modify `plx get task` to auto-transition to-do tasks to in-progress when retrieved
- Update AI agent documentation with new commands

## Impact

- Affected specs: `cli-get-task` (modified), `cli-complete` (new), `cli-undo` (new)
- Affected code: `src/commands/complete.ts` (new), `src/commands/undo.ts` (new), `src/utils/task-status.ts`, `src/cli/index.ts`, `src/commands/get.ts`
- Affected docs: `workspace/AGENTS.md`, `.claude/commands/plx/`
