---
status: done
skill-level: medior
---

# Task: Standardize Review Command Pattern

## End Goal

The `plx review` command uses entity subcommands with `--id` flag for reviewing entities.

## Currently

- `plx review --change-id <id>` reviews a change
- `plx review --spec-id <id>` reviews a spec
- `plx review --task-id <id>` reviews a task
- Entity-specific flags are required

## Should

- `plx review change --id <id>` reviews a change
- `plx review spec --id <id>` reviews a spec
- `plx review task --id <id>` reviews a task
- Legacy `--change-id`, `--spec-id`, `--task-id` flags deprecated
- Legacy flags continue to work with deprecation warnings
- All commands output same review context as before

## Constraints

- [ ] Must maintain backward compatibility with legacy flags
- [ ] Must not change review logic, only command interface
- [ ] Entity subcommands must match pattern used in get/validate/archive

## Acceptance Criteria

- [ ] `plx review change --id <id>` produces same output as `--change-id <id>`
- [ ] `plx review spec --id <id>` produces same output as `--spec-id <id>`
- [ ] `plx review task --id <id>` produces same output as `--task-id <id>`
- [ ] `plx review --change-id <id>` warns and works (deprecated)
- [ ] `plx review --spec-id <id>` warns and works (deprecated)
- [ ] `plx review --task-id <id>` warns and works (deprecated)
- [ ] Shell completions include new subcommands
- [ ] JSON output unchanged

## Implementation Checklist

- [x] 8.1 Add `change` subcommand to review command with `--id` option
- [x] 8.2 Add `spec` subcommand to review command with `--id` option
- [x] 8.3 Add `task` subcommand to review command with `--id` option
- [x] 8.4 Add deprecation warning to `--change-id` flag
- [x] 8.5 Add deprecation warning to `--spec-id` flag
- [x] 8.6 Add deprecation warning to `--task-id` flag
- [x] 8.7 Update shell completions with new subcommands
- [x] 8.8 Add unit tests for new subcommands
- [x] 8.9 Verify output parity with legacy flags

## Notes

The review command has additional subcommands (`list`, `show`) from the cli-review spec. Those should continue to work unchanged. This task only adds entity-based review initiation commands.
