---
status: to-do
---

# Task: Rename command from act next to get task

## End Goal

The CLI command `openspec act next` is renamed to `openspec get task` with all internal references updated.

## Currently

- Command registered as `act` parent with `next` subcommand in `src/cli/index.ts`
- Implementation in `src/commands/act.ts` with class `ActCommand` and method `next()`
- Interface `NextOptions` defines command options

## Should

- Command registered as `get` parent with `task` subcommand
- Implementation in `src/commands/get.ts` with class `GetCommand` and method `task()`
- Interface renamed to `TaskOptions`
- `get` parent command description: "Retrieve project artifacts"
- `task` subcommand integrates new `completeTaskFully()` function

## Constraints

- [ ] Maintain all existing functionality (prioritization, JSON output, status transitions)
- [ ] Integrate checkbox completion from task 001

## Acceptance Criteria

- [ ] `openspec get task` returns the next prioritized task
- [ ] `openspec get task --did-complete-previous` completes checkboxes and advances
- [ ] `openspec get task --json` outputs valid JSON with `completedTask` field when applicable
- [ ] Text output shows completed task name and checkbox items

## Implementation Checklist

- [ ] 2.1 Rename `src/commands/act.ts` to `src/commands/get.ts`
- [ ] 2.2 Rename class `ActCommand` to `GetCommand`
- [ ] 2.3 Rename method `next()` to `task()`
- [ ] 2.4 Rename interface `NextOptions` to `TaskOptions`
- [ ] 2.5 Update import in `src/cli/index.ts` from `act.js` to `get.js`
- [ ] 2.6 Replace `act` parent command with `get` in `src/cli/index.ts`
- [ ] 2.7 Replace `next` subcommand with `task` in `src/cli/index.ts`
- [ ] 2.8 Update `JsonOutput` interface to include `completedTask` field
- [ ] 2.9 Integrate `completeTaskFully()` in place of `setTaskStatus(..., 'done')`
- [ ] 2.10 Add text output for completed task info (name + checkbox items)
- [ ] 2.11 Add JSON output for completed task info

## Notes

Import path change: `import { GetCommand } from '../commands/get.js'`
