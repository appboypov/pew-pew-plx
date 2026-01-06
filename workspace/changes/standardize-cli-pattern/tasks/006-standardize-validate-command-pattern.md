---
status: done
skill-level: medior
---

# Task: Standardize Validate Command Pattern

## End Goal

The `plx validate` command uses entity subcommands with `--id` flag for consistent pattern.

## Currently

- `plx validate <item>` validates with auto-detection
- `plx validate --all` validates everything
- `plx validate --changes` validates all changes
- `plx validate --specs` validates all specs
- `plx validate --type change <item>` disambiguates type

## Should

- `plx validate change --id <id>` validates specific change
- `plx validate changes` validates all changes
- `plx validate spec --id <id>` validates specific spec
- `plx validate specs` validates all specs
- `plx validate --all` continues to work (validates everything)
- Legacy `plx validate <item>` continues with deprecation warning
- Legacy `plx validate --changes` continues with deprecation warning
- Legacy `plx validate --specs` continues with deprecation warning

## Constraints

- [ ] Must maintain backward compatibility with deprecated flags
- [ ] Must not change validation logic, only command interface
- [ ] Entity subcommands must be consistent with get command pattern

## Acceptance Criteria

- [ ] `plx validate change --id <id>` validates specific change
- [ ] `plx validate changes` validates all changes with same output as `--changes`
- [ ] `plx validate spec --id <id>` validates specific spec
- [ ] `plx validate specs` validates all specs with same output as `--specs`
- [ ] `plx validate <item>` warns and works (deprecated)
- [ ] `plx validate --changes` warns and works (deprecated)
- [ ] `plx validate --specs` warns and works (deprecated)
- [ ] `--strict` flag works with new subcommands
- [ ] JSON output unchanged for new commands

## Implementation Checklist

- [x] 6.1 Add `change` subcommand to validate command with `--id` option
- [x] 6.2 Add `changes` subcommand to validate command (plural)
- [x] 6.3 Add `spec` subcommand to validate command with `--id` option
- [x] 6.4 Add `specs` subcommand to validate command (plural)
- [x] 6.5 Add deprecation warning to legacy positional argument
- [x] 6.6 Add deprecation warning to `--changes` flag
- [x] 6.7 Add deprecation warning to `--specs` flag
- [x] 6.8 Update shell completions with new subcommands
- [x] 6.9 Add unit tests for new subcommands
- [x] 6.10 Verify parity between new and legacy commands

## Notes

The validation logic remains unchanged; this task only standardizes the command interface. The `plx validate --all` command should remain as-is since it's not entity-specific.
