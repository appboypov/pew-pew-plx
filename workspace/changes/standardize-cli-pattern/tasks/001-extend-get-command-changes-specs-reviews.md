---
status: done
skill-level: senior
---

# Task: Extend Get Command with Changes, Specs, Reviews

## End Goal

The `plx get` command supports `changes`, `specs`, and `reviews` subcommands for listing entities, plus singular `change`, `spec`, and `review` subcommands for specific item retrieval.

## Currently

- `plx get task` exists for task retrieval
- `plx get change --id <id>` exists for change retrieval
- `plx get spec --id <id>` exists for spec retrieval
- `plx get tasks` exists for listing tasks
- No `plx get changes`, `plx get specs`, `plx get reviews` commands
- No `plx get review --id <id>` command

## Should

- `plx get changes` lists all active changes (mirrors `plx list` behavior)
- `plx get specs` lists all specs (mirrors `plx list --specs` behavior)
- `plx get reviews` lists all reviews (mirrors `plx list --reviews` behavior)
- `plx get review --id <id>` retrieves specific review details
- All commands support `--json` flag for machine-readable output
- All plural commands support `--workspace` filter for multi-workspace

## Constraints

- [ ] Must not break existing `plx get task`, `plx get change`, `plx get spec` commands
- [ ] Must not import logic from list command; extract shared code to service layer
- [ ] Must support existing output formatting from list command
- [ ] Must include tracked issue display for changes (existing behavior)

## Acceptance Criteria

- [ ] `plx get changes` shows same output as `plx list`
- [ ] `plx get changes --json` outputs valid JSON array
- [ ] `plx get specs` shows same output as `plx list --specs`
- [ ] `plx get specs --json` outputs valid JSON array
- [ ] `plx get reviews` shows same output as `plx list --reviews`
- [ ] `plx get reviews --json` outputs valid JSON array
- [ ] `plx get review --id <id>` shows review details
- [ ] Shell completions include new subcommands
- [ ] All commands respect `--workspace` filter

## Implementation Checklist

- [x] 1.1 Add `changes` subcommand to `get` command in `src/commands/get.ts`
- [x] 1.2 Add `specs` subcommand to `get` command
- [x] 1.3 Add `reviews` subcommand to `get` command
- [x] 1.4 Add `review` singular subcommand with `--id` flag
- [x] 1.5 Extract shared listing logic from `src/core/list.ts` to a service
- [x] 1.6 Update shell completion registry with new subcommands
- [x] 1.7 Add unit tests for new subcommands
- [x] 1.8 Add integration tests for JSON output

## Notes

This task establishes the foundation for deprecating `plx list`. The implementation should reuse existing list logic via a shared service rather than duplicating code.
