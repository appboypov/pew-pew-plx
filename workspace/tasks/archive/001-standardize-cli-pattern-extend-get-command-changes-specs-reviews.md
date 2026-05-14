---
status: done
skill-level: senior
parent-type: change
parent-id: standardize-cli-pattern
---
# Task: Extend Get Command with Changes, Specs, Reviews

## End Goal

The `splx get` command supports `changes`, `specs`, and `reviews` subcommands for listing entities, plus singular `change`, `spec`, and `review` subcommands for specific item retrieval.

## Currently

- `splx get task` exists for task retrieval
- `splx get change --id <id>` exists for change retrieval
- `splx get spec --id <id>` exists for spec retrieval
- `splx get tasks` exists for listing tasks
- No `splx get changes`, `splx get specs`, `splx get reviews` commands
- No `splx get review --id <id>` command

## Should

- `splx get changes` lists all active changes (mirrors `splx list` behavior)
- `splx get specs` lists all specs (mirrors `splx list --specs` behavior)
- `splx get reviews` lists all reviews (mirrors `splx list --reviews` behavior)
- `splx get review --id <id>` retrieves specific review details
- All commands support `--json` flag for machine-readable output
- All plural commands support `--workspace` filter for multi-workspace

## Constraints

- [ ] Must not break existing `splx get task`, `splx get change`, `splx get spec` commands
- [ ] Must not import logic from list command; extract shared code to service layer
- [ ] Must support existing output formatting from list command
- [ ] Must include tracked issue display for changes (existing behavior)

## Acceptance Criteria

- [ ] `splx get changes` shows same output as `splx list`
- [ ] `splx get changes --json` outputs valid JSON array
- [ ] `splx get specs` shows same output as `splx list --specs`
- [ ] `splx get specs --json` outputs valid JSON array
- [ ] `splx get reviews` shows same output as `splx list --reviews`
- [ ] `splx get reviews --json` outputs valid JSON array
- [ ] `splx get review --id <id>` shows review details
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

This task establishes the foundation for deprecating `splx list`. The implementation should reuse existing list logic via a shared service rather than duplicating code.
