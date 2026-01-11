# Change: Update Archive Task Handling for Centralized Storage

## Why

With centralized task storage (`workspace/tasks/`), the archive command must move tasks linked to a parent entity to `workspace/tasks/archive/` when that parent is archived. The current archive behavior moves the entire change directory (including nested `tasks/`) to the archive, but with centralized storage, tasks are no longer nested inside changes.

## What Changes

- When archiving a change or review, locate all tasks in `workspace/tasks/` with matching `parent-type` and `parent-id` frontmatter
- Move those tasks to `workspace/tasks/archive/`
- Preserve original filenames (which include parent-id prefix)
- Maintain frontmatter association in archived tasks

## Impact

- Affected specs: cli-archive
- Affected code: `src/core/archive.ts`, task discovery utilities
- Dependencies: Assumes centralized task storage (Proposal 4) and CLI standardization (Proposal 1) are complete
