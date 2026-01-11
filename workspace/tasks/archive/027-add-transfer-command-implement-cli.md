---
status: done
skill-level: medior
parent-type: change
parent-id: add-transfer-command
---

# Task: Implement Transfer CLI Command

## End Goal

A `plx transfer` command with subcommands for each entity type, registered in the CLI and following existing command patterns.

## Currently

No transfer command exists in the CLI.

## Should

- `plx transfer change --id <id>` subcommand
- `plx transfer spec --id <id>` subcommand
- `plx transfer task --id <id>` subcommand
- `plx transfer review --id <id>` subcommand
- `plx transfer request --id <id>` subcommand
- Options: `--source`, `--target`, `--target-name`, `--dry-run`, `--yes`, `--json`
- Interactive workspace selection when paths omitted

## Constraints

- [ ] Must follow existing command patterns in `src/commands/`
- [ ] Must register in `src/cli/index.ts`
- [ ] Must respect `--no-interactive` and `--yes` flags
- [ ] Must use TransferService for core logic

## Acceptance Criteria

- [ ] All subcommands are registered and functional
- [ ] Options are parsed correctly
- [ ] Interactive mode works when paths omitted
- [ ] Non-interactive mode fails gracefully when paths required
- [ ] JSON output matches expected schema

## Implementation Checklist

- [x] 2.1 Create `src/commands/transfer.ts`
- [x] 2.2 Implement TransferCommand class with subcommand handlers
- [x] 2.3 Implement `transferChange()` method
- [x] 2.4 Implement `transferSpec()` method
- [x] 2.5 Implement `transferTask()` method
- [x] 2.6 Implement `transferReview()` method
- [x] 2.7 Implement `transferRequest()` method
- [x] 2.8 Implement interactive workspace picker
- [x] 2.9 Register command in `src/cli/index.ts`
- [x] 2.10 Add completion data to `src/core/completions/command-registry.ts`

## Notes

- Use @inquirer/prompts for interactive selection
- Follow pattern from MigrateCommand for dry-run output
- Follow pattern from GetCommand for subcommand structure
