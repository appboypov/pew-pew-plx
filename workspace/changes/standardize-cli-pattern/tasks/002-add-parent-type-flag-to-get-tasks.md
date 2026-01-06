---
status: done
skill-level: medior
---

# Task: Add Parent Type Flag to Get Tasks

## End Goal

The `plx get tasks` command supports `--parent-type <type>` flag for filtering tasks by parent entity type.

## Currently

- `plx get tasks` lists all open tasks
- `plx get tasks --id <change-id>` lists tasks for a specific change
- No way to filter tasks by parent type (change vs review vs spec)

## Should

- `plx get tasks --parent-type change` lists tasks from changes only
- `plx get tasks --parent-type review` lists tasks from reviews only
- `plx get tasks --parent-type spec` lists tasks from specs only
- When `--parent-id` is provided without `--parent-type`, search all types
- If `--parent-id` matches multiple parent types, error with suggestion
- `--parent-type` without `--parent-id` filters to tasks of that parent type

## Constraints

- [ ] Must not change behavior when no flags provided
- [ ] Error messages must suggest adding `--parent-type` when ambiguous
- [ ] Valid parent types: `change`, `review`, `spec`

## Acceptance Criteria

- [ ] `plx get tasks --parent-type change` shows only tasks from changes
- [ ] `plx get tasks --parent-type review` shows only tasks from reviews
- [ ] `plx get tasks --parent-id <id>` searches all parent types
- [ ] `plx get tasks --parent-id <id>` errors if ID matches multiple parent types
- [ ] `plx get tasks --parent-id <id> --parent-type change` filters to specific parent
- [ ] Invalid `--parent-type` value shows error with valid options
- [ ] JSON output includes `parentType` field for each task

## Implementation Checklist

- [x] 2.1 Add `--parent-type` option to `get tasks` command
- [x] 2.2 Implement parent type filtering in `ItemRetrievalService`
- [x] 2.3 Add ambiguity detection when `--parent-id` matches multiple types
- [x] 2.4 Update JSON output schema to include `parentType`
- [x] 2.5 Update shell completions with `--parent-type` option and valid values
- [x] 2.6 Add unit tests for parent type filtering
- [x] 2.7 Add unit tests for ambiguity detection

## Notes

The current `--id` flag on `plx get tasks` should be renamed to `--parent-id` for consistency (with `--id` as deprecated alias).
