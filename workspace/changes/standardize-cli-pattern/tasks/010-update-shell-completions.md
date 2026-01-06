---
status: done
skill-level: junior
---

# Task: Update Shell Completions

## End Goal

Shell completions are updated to include all new subcommands and flags from the CLI standardization.

## Currently

- Shell completions exist for current command structure
- New subcommands (`get changes`, `get specs`, etc.) not included
- New flags (`--parent-type`, etc.) not included
- Deprecated commands still in completions without indication

## Should

- All new subcommands appear in completions
- All new flags appear in completions
- Dynamic completions for entity IDs work with new commands
- `--parent-type` shows valid values: change, review, spec
- Completion registry reflects full new command structure

## Constraints

- [ ] Must update `src/core/completions/command-registry.ts`
- [ ] Must support dynamic ID completions for all entity types
- [ ] Must not remove completions for deprecated commands

## Acceptance Criteria

- [ ] `plx get <TAB>` shows: task, tasks, change, changes, spec, specs, review, reviews
- [ ] `plx get changes <TAB>` shows available flags
- [ ] `plx get tasks --parent-type <TAB>` shows: change, review, spec
- [ ] `plx validate <TAB>` shows: change, changes, spec, specs
- [ ] `plx archive <TAB>` shows: change, review
- [ ] `plx review <TAB>` shows: change, spec, task, list, show
- [ ] Dynamic ID completions work for `plx get change --id <TAB>`
- [ ] Dynamic ID completions work for `plx archive change --id <TAB>`

## Implementation Checklist

- [x] 10.1 Add `changes`, `specs`, `reviews` to get command completions
- [x] 10.2 Add `review` singular to get command completions
- [x] 10.3 Add `change`, `changes`, `spec`, `specs` to validate command completions
- [x] 10.4 Add `change`, `review` to archive command completions
- [x] 10.5 Add `change`, `spec`, `task` to review command completions
- [x] 10.6 Add `--parent-type` option with value completions
- [x] 10.7 Add `--parent-id` option completions
- [x] 10.8 Update dynamic completion handler for new commands
- [x] 10.9 Test completions in zsh shell
- [x] 10.10 Verify all new commands have appropriate completions

## Notes

Shell completions are critical for CLI usability. Ensure all new subcommands have appropriate completions including dynamic ID suggestions where applicable.
