# Change: Update task completion and storage rules

## Why
Task progress currently treats each checkbox as its own task and centralizes change-linked tasks in `workspace/tasks/`. This makes progress noisy and breaks the intended per-task-file workflow.

## What Changes
- Treat each task file as a single task; a task is complete only when there are no unchecked markdown checkboxes anywhere in the file.
- Update progress calculations and auto-completion to use file-level completion.
- Store change-linked tasks under `workspace/changes/<change-id>/tasks/`; keep `workspace/tasks/` for non-change tasks (review or standalone).
- Keep compatibility for legacy change tasks in `workspace/tasks/` while migration paths are updated.

## Impact
- Affected specs: cli-archive, cli-complete, cli-create, cli-get-task, cli-list, cli-migrate, cli-paste, cli-transfer, cli-undo, cli-view, docs-agent-instructions, splx-slash-commands
- Affected code: task-progress, centralized task discovery, item retrieval, create/paste/get/complete/undo, transfer, migrate, view/list
