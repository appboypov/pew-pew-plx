---
status: done
skill-level: junior
parent-type: change
parent-id: add-migrate-command
---
# Task: Update shell completions for migrate command

## End Goal

Shell tab completion support for the new `splx migrate tasks` command.

## Currently

- Shell completion system exists in `src/core/completions/`
- Command registry in `src/core/completions/command-registry.ts` defines available commands
- No migrate command registered in completions

## Should

- `migrate` command added to completion registry
- `tasks` subcommand completable under `migrate`
- Flags (`--dry-run`, `--json`) completable

## Constraints

- [ ] Must follow existing completion patterns in `src/core/completions/command-registry.ts`
- [ ] Must work with Zsh completion system

## Acceptance Criteria

- [ ] `splx migrate <TAB>` shows `tasks` as completion
- [ ] `splx migrate tasks --<TAB>` shows available flags
- [ ] Completions work after `splx completion install`

## Implementation Checklist

- [x] 3.1 Add `migrate` command to `src/core/completions/command-registry.ts`
- [x] 3.2 Define `tasks` subcommand with available flags
- [x] 3.3 Verify completions generate correctly
- [x] 3.4 Test completions in Zsh shell

## Notes

- Reference existing command entries in command-registry.ts for pattern
- No dynamic completions needed (no entity IDs to complete)
