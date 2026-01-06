---
status: done
skill-level: medior
---

# Task: Standardize Parse Feedback Command Pattern

## End Goal

The `plx parse feedback` command uses `--parent-id` and `--parent-type` flags instead of entity-specific flags.

## Currently

- `plx parse feedback "name" --change-id <id>` links review to change
- `plx parse feedback "name" --spec-id <id>` links review to spec
- `plx parse feedback "name" --task-id <id>` links review to task
- Entity-specific flags are used

## Should

- `plx parse feedback "name" --parent-id <id> --parent-type change` links to change
- `plx parse feedback "name" --parent-id <id> --parent-type spec` links to spec
- `plx parse feedback "name" --parent-id <id> --parent-type task` links to task
- `--parent-type` is optional when ID is unambiguous
- Legacy `--change-id`, `--spec-id`, `--task-id` flags deprecated
- Legacy flags continue to work with deprecation warnings

## Constraints

- [ ] Must maintain backward compatibility with legacy flags
- [ ] Must not change parse feedback logic, only flag interface
- [ ] `--parent-type` must be required when ID is ambiguous across types

## Acceptance Criteria

- [ ] `plx parse feedback "name" --parent-id <id> --parent-type change` works
- [ ] `plx parse feedback "name" --parent-id <id> --parent-type spec` works
- [ ] `plx parse feedback "name" --parent-id <id> --parent-type task` works
- [ ] `plx parse feedback "name" --parent-id <id>` auto-detects unambiguous type
- [ ] `plx parse feedback "name" --parent-id <id>` errors on ambiguous type
- [ ] `plx parse feedback "name" --change-id <id>` warns and works (deprecated)
- [ ] `plx parse feedback "name" --spec-id <id>` warns and works (deprecated)
- [ ] `plx parse feedback "name" --task-id <id>` warns and works (deprecated)
- [ ] Generated review.md has correct `target-type` and `target-id` frontmatter
- [ ] Shell completions include new flags

## Implementation Checklist

- [x] 9.1 Add `--parent-id` flag to parse feedback command
- [x] 9.2 Add `--parent-type` flag with valid values: change, spec, task
- [x] 9.3 Implement type auto-detection when `--parent-type` omitted
- [x] 9.4 Implement ambiguity error with suggestion to add `--parent-type`
- [x] 9.5 Add deprecation warning to `--change-id` flag
- [x] 9.6 Add deprecation warning to `--spec-id` flag
- [x] 9.7 Add deprecation warning to `--task-id` flag
- [x] 9.8 Update shell completions with new flags
- [x] 9.9 Add unit tests for new flags
- [x] 9.10 Add unit tests for ambiguity detection
- [x] 9.11 Verify parity with legacy flags

## Notes

The parse feedback command creates a review entity linked to a parent. The new `--parent-id`/`--parent-type` flags align with the pattern used in `plx get tasks --parent-id`.
