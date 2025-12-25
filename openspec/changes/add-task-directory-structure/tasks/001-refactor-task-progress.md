# Task: Refactor task progress to support tasks directory

## End Goal

Task progress can be calculated from a `tasks/` directory containing multiple numbered task files (e.g., `001-implement.md`, `002-review.md`). Progress is aggregated across all files.

## Currently

`src/utils/task-progress.ts` reads only from a single `tasks.md` file. The `getTaskProgressForChange()` function constructs a path to `tasks.md` and counts checkboxes in that file only.

## Should

- `getTaskStructureForChange()` function detects if `tasks/` directory exists
- Scans for `*.md` files matching `NNN-*.md` pattern (three-digit prefix)
- Parses sequence number and name from each filename
- Sorts files by sequence number
- Counts tasks in each file individually
- Returns `ChangeTaskStructure` with ordered files and aggregate progress
- `getTaskProgressForChange()` uses aggregate progress from all task files
- Files without valid prefix pattern are ignored
- Empty or missing `tasks/` directory returns zero progress

## Constraints

- [ ] Existing `TaskProgress` interface remains unchanged
- [ ] `countTasksFromContent()` and `formatTaskStatus()` remain unchanged
- [ ] Backward compatible: if no `tasks/` directory exists, return empty structure

## Acceptance Criteria

- [ ] Tasks directory with `NNN-*.md` files is detected and read
- [ ] Files are ordered by their numeric prefix
- [ ] Progress is aggregated across all task files
- [ ] Invalid filenames (no numeric prefix) are ignored
- [ ] Empty or missing tasks/ directory returns zero progress

## Implementation Checklist

- [x] Add `TaskFileInfo` interface to task-progress.ts
- [x] Add `ChangeTaskStructure` interface to task-progress.ts
- [x] Add `TASK_FILE_PREFIX_PATTERN` constant
- [x] Add `TASKS_DIRECTORY_NAME` constant
- [x] Create `parseTaskFilename()` function in task-file-parser.ts
- [x] Create `sortTaskFilesBySequence()` function in task-file-parser.ts
- [x] Implement `getTaskStructureForChange()` function
- [x] Modify `getTaskProgressForChange()` to use aggregate from tasks/ directory
- [x] Add unit tests for all new functions

## Notes

Complexity: 4

This is the foundation task - sub-issues 2 and 3 depend on this being complete.
