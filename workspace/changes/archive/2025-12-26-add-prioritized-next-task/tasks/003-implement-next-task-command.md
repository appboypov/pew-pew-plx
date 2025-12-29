# Task: Implement act next CLI command

## End Goal

Create the `plx get task` command that displays the next task from the highest-priority change.

## Currently

No `act` command exists. The CLI has `list`, `show`, `validate`, and `archive` commands but no task-focused navigation.

## Should

New `src/commands/act.ts` command provides:
- `act` parent command with `next` subcommand
- `--did-complete-previous` flag for status transitions
- `--json` flag for machine-readable output
- Displays change documents + next task (or task only with flag)
- Handles edge cases (no changes, all tasks complete)

## Constraints

- [ ] Must follow existing CLI patterns from `src/cli/index.ts`
- [ ] Must use chalk for colored output
- [ ] Must use ora for error messages
- [ ] File writes must be atomic (read, modify, write)

## Acceptance Criteria

- [ ] `plx get task` shows proposal + design + next task
- [ ] `plx act next` works as alias
- [ ] `--did-complete-previous` completes in-progress and advances
- [ ] `--did-complete-previous` with no in-progress shows warning
- [ ] `--json` outputs valid JSON structure
- [ ] "No active changes found" when empty
- [ ] "All tasks complete" when all done

## Implementation Checklist

- [x] 3.1 Create `src/commands/act.ts` with ActCommand class
- [x] 3.2 Implement `next(options)` method with main logic
- [x] 3.3 Implement change document reading (proposal.md, design.md)
- [x] 3.4 Implement `--did-complete-previous` status transition logic
- [x] 3.5 Implement `--json` output formatter
- [x] 3.6 Register `act` command with `next` subcommand in `src/cli/index.ts`
- [x] 3.7 Add integration tests in `test/commands/act.test.ts`

## Notes

Use `promises as fs` pattern consistent with existing codebase. Read files with utf-8 encoding.
