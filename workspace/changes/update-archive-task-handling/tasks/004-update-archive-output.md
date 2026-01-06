---
status: done
skill-level: junior
---

# Task: Update Archive Output

## End Goal

The archive command displays clear feedback about task archiving, including the number of tasks moved to the archive location.

## Currently

The archive command displays:
- Success message with archived name
- List of updated specs
- Confirmation that task files in `tasks/` directory were preserved in archive

## Should

The archive command displays:
- Success message with archived name
- Number of tasks moved to `workspace/tasks/archive/` (when tasks exist)
- List of updated specs (when specs exist)
- No task-related messaging when no linked tasks found

## Constraints

- [ ] Use existing output styling patterns (ora, chalk)
- [ ] Do not display task count when zero tasks archived
- [ ] Maintain existing spec output format
- [ ] Keep output concise and readable

## Acceptance Criteria

- [ ] Success message includes count of archived tasks when applicable
- [ ] No task messaging when no linked tasks found
- [ ] Spec updates still displayed as before
- [ ] Output format consistent with other PLX commands

## Implementation Checklist

- [ ] 4.1 Update success message to include task archive count
- [ ] 4.2 Conditionally display task count (only when > 0)
- [ ] 4.3 Update output format for moved tasks
- [ ] 4.4 Test output with zero, one, and multiple tasks

## Notes

Example output:
```
Archived 'add-feature' (3 tasks moved to archive)
  Updated specs:
    + cli-feature
    ~ cli-existing
```
