---
status: done
skill-level: medior
---

# Task: Standardize Archive Command Pattern

## End Goal

The `plx archive` command uses entity subcommands with `--id` flag for consistent pattern.

## Currently

- `plx archive <id>` archives with auto-detection (change or review)
- `plx archive <id> --type review` explicitly archives a review
- Interactive selection when no ID provided

## Should

- `plx archive change --id <id>` archives specific change
- `plx archive review --id <id>` archives specific review
- Legacy `plx archive <id>` continues with deprecation warning
- Legacy `plx archive <id> --type <type>` continues with deprecation warning
- Interactive selection prompts for entity type, then ID
- All existing options work: `--yes`, `--skip-specs`, `--no-validate`

## Constraints

- [ ] Must maintain backward compatibility with legacy syntax
- [ ] Must not change archive logic, only command interface
- [ ] Entity type must be explicit in new syntax (no auto-detection)

## Acceptance Criteria

- [ ] `plx archive change --id <id>` archives change with same behavior
- [ ] `plx archive review --id <id>` archives review with same behavior
- [ ] `plx archive change --id <id> --yes` skips confirmation
- [ ] `plx archive change --id <id> --skip-specs` skips spec updates
- [ ] `plx archive <id>` warns and works (deprecated)
- [ ] `plx archive <id> --type review` warns and works (deprecated)
- [ ] Interactive mode asks for entity type first
- [ ] Shell completions include new subcommands

## Implementation Checklist

- [x] 7.1 Add `change` subcommand to archive command with `--id` option
- [x] 7.2 Add `review` subcommand to archive command with `--id` option
- [x] 7.3 Pass through `--yes`, `--skip-specs`, `--no-validate` to subcommands
- [x] 7.4 Add deprecation warning to legacy positional argument
- [x] 7.5 Add deprecation warning to `--type` flag
- [x] 7.6 Update interactive mode to prompt for entity type
- [x] 7.7 Update shell completions with new subcommands
- [x] 7.8 Add unit tests for new subcommands
- [x] 7.9 Verify parity with legacy commands

## Notes

The archive logic remains unchanged; this task only standardizes the command interface. The explicit entity type in the new syntax removes the need for ambiguity handling that exists in the legacy `--type` approach.
