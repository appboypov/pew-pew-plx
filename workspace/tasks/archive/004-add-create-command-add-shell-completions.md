---
status: done
skill-level: junior
parent-type: change
parent-id: add-create-command
---
# Task: Add shell completions for create command

## End Goal

Shell completion system includes `plx create` command with subcommand and argument completions.

## Currently

Shell completions exist for existing commands. No completions for `create` command.

## Should

- `plx create <TAB>` shows: task, change, spec, request
- `plx create task --<TAB>` shows: --parent-id, --parent-type, --json
- `plx create task --parent-type <TAB>` shows: change, review, spec
- `plx create task --parent-id <TAB>` shows dynamic list of valid parent IDs

## Constraints

- [ ] Follow existing completion patterns in `src/core/completions/`
- [ ] Register new command in command registry
- [ ] Support zsh completion (primary shell)

## Acceptance Criteria

- [ ] Subcommand completion works for create command
- [ ] Option completion works for all subcommands
- [ ] Parent-type completion shows valid values
- [ ] Parent-id completion shows dynamic values (if feasible)

## Implementation Checklist

- [x] 4.1 Update `src/core/completions/command-registry.ts` with create command definition
- [x] 4.2 Add subcommand completions (task, change, spec, request)
- [x] 4.3 Add option completions for each subcommand
- [x] 4.4 Add parent-type value completions
- [x] 4.5 Test completion generation

## Notes

- Dynamic completions for parent-id may require `__complete` command support
- Review existing completion system for patterns and capabilities
