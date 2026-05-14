## Context
Task progress is currently derived from checkbox counts, excluding Constraints and Acceptance Criteria. Change-linked tasks are stored centrally in `workspace/tasks/`, even though change folders already include a `tasks/` directory.

## Goals / Non-Goals
Goals:
- File-level completion based on any unchecked markdown checkbox in a task file.
- Change-linked tasks stored under `workspace/changes/<id>/tasks/`.
- `workspace/tasks/` reserved for review and standalone tasks.
- Backward compatibility for legacy change tasks still in `workspace/tasks/`.

Non-Goals:
- Redesigning task templates or frontmatter schema.
- Changing review task storage rules beyond keeping centralized tasks.

## Decisions
- Completion rule: a task is complete only when the task file has zero unchecked markdown checkboxes anywhere in the file.
- Progress aggregation counts each task file as 1 complete or 1 incomplete task.
- Storage routing:
  - `parent-type: change` -> `workspace/changes/<change-id>/tasks/` with filename `NNN-<task-name>.md`
  - `parent-type: review` or standalone -> `workspace/tasks/` with filename `NNN-<parent-id>-<task-name>.md` for parented tasks
- `complete` and `undo` commands mark all markdown checkboxes so tasks can reach the new completion criteria.
- Retrieval scans change-local tasks first, then legacy centralized tasks for change parents.

## Risks / Trade-offs
- Tasks with unchecked Constraints/Acceptance checkboxes will now be considered incomplete until checked.
- Legacy change tasks in `workspace/tasks/` may conflict with change-local task filenames; retrieval order must be deterministic.

## Migration Plan
- Update CLI logic to handle both locations during the transition.
- Update `splx migrate tasks` to re-home change-linked tasks from `workspace/tasks/` into change-local `tasks/` directories.
- Preserve review and standalone tasks in `workspace/tasks/`.
