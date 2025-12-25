# Task: Update AGENTS.md for tasks directory

## End Goal

AGENTS.md accurately documents the new tasks/ directory structure and task file template so AI assistants use the correct format.

## Currently

AGENTS.md references `tasks.md` as a single file:
- Stage 2 instructions (lines 49-57) reference "Read tasks.md"
- Task creation template (lines 233-240) shows single `tasks.md` file format
- Directory structure diagram shows `tasks.md` as single file

## Should

- Stage 2 instructions reference tasks/ directory instead of tasks.md
- Task creation shows tasks/ directory structure with multiple files
- Task file template documented (End Goal, Currently, Should, Constraints, Acceptance Criteria, Implementation Checklist, Notes)
- Sequential numbering convention (001-, 002-) explained
- File structure diagram shows tasks/ instead of tasks.md
- Minimum 3 files guideline documented (implementation, review, test)
- Example task file names provided

## Constraints

- [ ] Maintain AGENTS.md readability and structure
- [ ] Keep changes focused on task-related sections only
- [ ] Preserve existing formatting conventions

## Acceptance Criteria

- [ ] Stage 2 instructions reference tasks/ directory instead of tasks.md
- [ ] Task creation shows tasks/ directory structure
- [ ] Task file template documented (End Goal, Currently, Should, Constraints, Acceptance Criteria, Implementation Checklist, Notes)
- [ ] Sequential numbering convention (001-, 002-) explained
- [ ] File structure diagram shows tasks/ instead of tasks.md
- [ ] Minimum 3 files guideline documented (implementation, review, test)

## Implementation Checklist

- [x] Update Stage 2 section (lines 49-57) to reference tasks/ directory
- [x] Update directory structure diagram (lines 160-178) to show tasks/
- [x] Replace tasks.md template (lines 233-240) with tasks/ directory structure
- [x] Add task file template with all required sections
- [x] Document numbering convention (NNN-<name>.md)
- [x] Add guideline for minimum 3 task files per change
- [x] Add example task filenames (001-implement.md, 002-review.md, 003-test.md)

## Notes

Complexity: 2

Can be done in parallel with sub-issue 3 (CLI commands).
