# Task: Implement next-task CLI command

## End Goal

Create the `openspec next-task` command that displays the next task from the highest-priority change.

## Currently

No `next-task` command exists. The CLI has `list`, `show`, `validate`, and `archive` commands but no task-focused navigation.

## Should

New `src/commands/next-task.ts` command provides:
- `next-task` command with `next` alias
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

- [ ] `openspec next-task` shows proposal + design + next task
- [ ] `openspec next` works as alias
- [ ] `--did-complete-previous` completes in-progress and advances
- [ ] `--did-complete-previous` with no in-progress shows warning
- [ ] `--json` outputs valid JSON structure
- [ ] "No active changes found" when empty
- [ ] "All tasks complete" when all done

## Implementation Checklist

- [ ] 3.1 Create `src/commands/next-task.ts` with NextTaskCommand class
- [ ] 3.2 Implement `execute(options)` method with main logic
- [ ] 3.3 Implement change document reading (proposal.md, design.md)
- [ ] 3.4 Implement `--did-complete-previous` status transition logic
- [ ] 3.5 Implement `--json` output formatter
- [ ] 3.6 Register command in `src/cli/index.ts`
- [ ] 3.7 Add integration tests in `test/commands/next-task.test.ts`

## Notes

Use `promises as fs` pattern consistent with existing codebase. Read files with utf-8 encoding.
