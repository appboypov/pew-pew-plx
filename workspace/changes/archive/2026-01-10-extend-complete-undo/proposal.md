# Change: Extend complete and undo commands for all parent types

## Why

The `plx complete` and `plx undo` commands currently only support `task` and `change` entity types. With the introduction of centralized task storage where tasks can be linked to reviews and specs (in addition to changes), users need the ability to complete or undo all tasks associated with any parent type.

## What Changes

- Add `plx complete review --id <id>` command to complete all tasks linked to a review
- Add `plx complete spec --id <id>` command to complete all tasks linked to a spec
- Add `plx undo review --id <id>` command to revert all tasks linked to a review
- Add `plx undo spec --id <id>` command to revert all tasks linked to a spec
- Extend `ItemRetrievalService` with methods to retrieve reviews and get tasks for specs
- Update JSON output schema to include `reviewId` or `specId` as appropriate

## Impact

- Affected specs: `cli-complete`, `cli-undo`
- Affected code:
  - `src/commands/complete.ts` - add `review()` and `spec()` methods
  - `src/commands/undo.ts` - add `review()` and `spec()` methods
  - `src/services/item-retrieval.ts` - add `getReviewById()` and `getTasksForSpec()` methods
  - `src/cli/index.ts` - register new subcommands
