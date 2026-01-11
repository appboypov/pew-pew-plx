---
status: done
skill-level: medior
parent-type: change
parent-id: add-task-skill-level
---
# Task: Update Get Command Output

## End Goal

The `plx get task` and `plx get tasks` commands display skill level in both human-readable and JSON output.

## Currently

Task output shows only id, filename, filepath, sequence, and status. Skill level is not displayed.

## Should

- `plx get task` shows skill level in task header when present
- `plx get task --json` includes `skillLevel` field in task object
- `plx get tasks` shows skill level column in table output
- `plx get tasks --json` includes `skillLevel` field in each task

## Constraints

- [ ] Skill level only shown when present in task frontmatter
- [ ] Missing skill level does not break output or cause errors
- [ ] JSON field name is `skillLevel` (camelCase)

## Acceptance Criteria

- [ ] Text output shows skill level badge after status
- [ ] JSON output includes skillLevel field when present
- [ ] Tasks table includes skill level column
- [ ] Backward compatible with tasks missing skill level

## Implementation Checklist

- [x] Import `parseSkillLevel` in `src/commands/get.ts`
- [x] Update `JsonOutput.task` interface to include optional `skillLevel`
- [x] Update `task()` method to parse and include skill level
- [x] Update `taskById()` method to parse and include skill level
- [x] Update text output format to show skill level in header
- [x] Update `printTaskTable()` to include skill level column
- [x] Update `printOpenTaskTable()` to include skill level column
- [x] Update JSON output structure for both task and tasks commands

## Notes

Use color coding: junior=cyan, medior=yellow, senior=magenta for visual distinction.
