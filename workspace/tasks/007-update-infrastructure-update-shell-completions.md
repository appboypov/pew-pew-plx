---
status: done
skill-level: senior
parent-type: change
parent-id: update-infrastructure
---
# Task: Update Shell Completions for New/Changed Commands

## End Goal

Shell completions accurately reflect all new and changed CLI commands with proper subcommand and flag completion.

## Currently

Completions in `src/core/completions/`:
- `command-registry.ts` defines commands with old patterns
- `completion-provider.ts` generates completions
- `generators/zsh-generator.ts` generates zsh script
- `installers/zsh-installer.ts` handles installation

Commands registered:
- `list` with `--specs` flag
- `show` with item argument
- Entity-specific flags (`--change-id`, etc.)

## Should

Completions support:
- `get` with subcommands (task, tasks, change, changes, spec, specs, review, reviews)
- `create` with subcommands (task, change, spec, request)
- `paste` with subcommands (task, change, spec, request)
- `validate` with subcommands (change, changes, spec, specs)
- `archive` with subcommands (change, review)
- `review` with subcommands (change, spec, task)
- `complete` with subcommands (task, change, review, spec)
- `undo` with subcommands (task, change, review, spec)
- `migrate` with subcommands (tasks)
- Standardized flags: `--id`, `--parent-id`, `--parent-type`
- Removal of deprecated commands: `list`, `show`, `change`, `spec`

## Constraints

- [ ] Maintain dynamic completion for item IDs
- [ ] Keep existing zsh completion installation logic
- [ ] Support same shell detection patterns
- [ ] Do not add new shell support (only zsh currently)

## Acceptance Criteria

- [ ] All new commands have completion definitions
- [ ] Deprecated commands removed from completion
- [ ] Subcommand completion works for all verb commands
- [ ] Flag completion includes `--id`, `--parent-id`, `--parent-type`
- [ ] `plx completion generate zsh` outputs valid script
- [ ] `plx completion install zsh` successfully installs

## Implementation Checklist

- [x] 7.1 Update command-registry.ts with new command structure
- [x] 7.2 Add `get` command with all subcommands
- [x] 7.3 Add `create` command with all subcommands
- [x] 7.4 Add `paste` command with all subcommands (extends existing)
- [x] 7.5 Update `validate` command with entity subcommands
- [x] 7.6 Update `archive` command with entity subcommands
- [x] 7.7 Update `review` command with entity subcommands
- [x] 7.8 Update `complete` command with new entity subcommands
- [x] 7.9 Update `undo` command with new entity subcommands
- [x] 7.10 Add `migrate` command with `tasks` subcommand
- [x] 7.11 Add `--parent-id` and `--parent-type` flag definitions
- [x] 7.12 Remove `list`, `show`, `change`, `spec` parent commands
- [x] 7.13 Update completion-provider.ts for new structure
- [x] 7.14 Update zsh-generator.ts if generation logic changes
- [x] 7.15 Test completion script generation
- [x] 7.16 Update types.ts if new types needed

## Notes

Shell completions are critical for CLI usability. Test thoroughly with actual shell after changes.
