---
status: done
---

# Task: Verify all acceptance criteria with tests

## End Goal

All PLX-15 acceptance criteria are verified with tests and manual verification.

## Currently

N/A - verification task.

## Should

- All tests pass
- All acceptance criteria from PLX-15 are met
- Both `plx` and `plx` CLI names work

## Constraints

- [x] Do not proceed if tests fail
- [x] Fix any issues found during verification

## Acceptance Criteria

- [x] User can fetch a specific task by providing its filename without extension
- [x] User can fetch a specific change or spec by ID
- [x] User can filter task output to show only constraints section
- [x] User can filter task output to show only acceptance criteria section
- [x] User can combine filter flags to show multiple sections
- [x] User can view all tasks for a specific change
- [x] User can view all open tasks in the project
- [x] All new commands appear in generated AGENTS.md files
- [x] Help text and shell completions reflect the new flags and commands

## Implementation Checklist

- [x] 5.1 Run `pnpm build` and verify no TypeScript errors
- [x] 5.2 Run `pnpm test` and verify all tests pass
- [x] 5.3 Run `pnpm lint` and fix any lint errors
- [x] 5.4 Manual test: `plx get task --id <id>`
- [x] 5.5 Manual test: `plx get task --constraints`
- [x] 5.6 Manual test: `plx get task --constraints --acceptance-criteria`
- [x] 5.7 Manual test: `plx get change --id <id>`
- [x] 5.8 Manual test: `plx get spec --id <id>`
- [x] 5.9 Manual test: `plx get tasks`
- [x] 5.10 Manual test: `plx get tasks --id <change-id>`
- [x] 5.11 Verify shell completions work
- [x] 5.12 Verify AGENTS.md includes new commands

## Notes

Test with both `plx` and `plx` CLI names to ensure alias works.
