---
status: done
skill-level: medior
parent-type: change
parent-id: update-archive-task-handling
---
# Task: Update Archive Task Discovery

## End Goal

The archive command finds tasks linked to a parent entity by querying centralized task storage (`workspace/tasks/`) using frontmatter filters instead of looking in nested `tasks/` directories.

## Currently

The archive command:
- Looks for tasks in `workspace/changes/<name>/tasks/` or `workspace/reviews/<name>/tasks/`
- Moves the entire change/review directory to archive (including nested tasks)
- Does not use frontmatter-based task filtering

## Should

The archive command:
- Queries `workspace/tasks/` for tasks with matching `parent-type` and `parent-id` frontmatter
- Uses existing task file parsing utilities to read frontmatter
- Returns a list of task file paths linked to the entity being archived

## Constraints

- [ ] Do not modify task file structure or frontmatter schema
- [ ] Use existing frontmatter parsing utilities from `src/utils/task-file-parser.ts`
- [ ] Support both change and review parent types
- [ ] Handle case where no matching tasks exist

## Acceptance Criteria

- [ ] Archive command discovers tasks by frontmatter `parent-id` and `parent-type`
- [ ] Empty result returned when no tasks match (not an error)
- [ ] Task discovery works for both changes and reviews

## Implementation Checklist

- [x] 1.1 Add function to find tasks by parent in task discovery utilities
- [x] 1.2 Update archive command to call new task discovery function
- [x] 1.3 Parse frontmatter to filter by parent-type and parent-id
- [x] 1.4 Return array of task file paths matching the archived entity

## Notes

Assumes centralized task storage (Proposal 4) is implemented. Task filenames follow format `NNN-<parent-id>-<name>.md` for parented tasks.
