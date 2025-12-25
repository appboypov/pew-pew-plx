# Change: Fix act next filtering for actionable tasks

## Why

The `plx act next` command selects completed changes because it prioritizes by highest completion percentage. This causes the command to return changes with 100% complete checkboxes (or 0 total checkboxes) instead of changes with actual work remaining.

## What Changes

- Filter out non-actionable changes before prioritization in `getPrioritizedChange()`
- Non-actionable defined as: `total == 0` (no checkboxes) OR `completed == total` (all complete)
- Only consider changes with incomplete checkboxes (`total > 0 && completed < total`)

## Impact

- Affected specs: plx-slash-commands
- Affected code: `src/utils/change-prioritization.ts`, test files
