---
status: done
skill-level: junior
parent-type: change
parent-id: update-archive-task-handling
---
# Task: Update Task Completion Check

## End Goal

The archive command checks task completion status by querying centralized task storage instead of looking in nested `tasks/` directories.

## Currently

The archive command:
- Reads task files from `workspace/changes/<name>/tasks/` or `workspace/reviews/<name>/tasks/`
- Checks for incomplete checkboxes (`- [ ]`) in task files
- Auto-migrates legacy `tasks.md` to `tasks/001-tasks.md`

## Should

The archive command:
- Uses the task discovery function (from task 001) to find linked tasks
- Reads frontmatter `status` field to determine completion
- Tasks with status `done` are complete; all others are incomplete
- Removes legacy auto-migration logic (handled by separate migrate command)

## Constraints

- [ ] Use `status` frontmatter field as source of truth for completion
- [ ] Do not check checkbox state for completion determination
- [ ] Remove auto-migration logic (migration is separate concern)
- [ ] Maintain existing user prompts for incomplete tasks

## Acceptance Criteria

- [ ] Completion check uses frontmatter `status: done` as indicator
- [ ] Incomplete tasks prompt shown with list of incomplete task filenames
- [ ] No auto-migration triggered during archive
- [ ] Default to "No" on incomplete task prompt

## Implementation Checklist

- [x] 3.1 Update completion check to use task discovery results
- [x] 3.2 Check frontmatter `status` field for each discovered task
- [x] 3.3 Remove legacy `tasks.md` auto-migration code
- [x] 3.4 Update incomplete tasks display to show filenames from centralized storage

## Notes

This simplifies completion checking by using structured frontmatter status instead of parsing checkbox syntax.
