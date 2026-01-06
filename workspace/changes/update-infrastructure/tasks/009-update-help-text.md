---
status: done
skill-level: junior
---

# Task: Update Help Text for All Commands

## End Goal

All CLI command help text accurately describes the new command patterns and options.

## Currently

Help text in `src/cli/index.ts` and `src/commands/*.ts`:
- Describes deprecated commands (`list`, `show`, etc.)
- Uses old flag names (`--change-id`, `--spec-id`, `--task-id`)
- References nested task storage

## Should

Help text:
- Describes new commands (`get`, `create`, `paste`, `migrate`)
- Uses standardized flags (`--id`, `--parent-id`, `--parent-type`)
- References centralized task storage
- Provides accurate usage examples
- Deprecation notices for any transitional commands

## Constraints

- [ ] Keep help text concise and actionable
- [ ] Use consistent terminology across all commands
- [ ] Match documentation in AGENTS.md
- [ ] Do not add verbose explanations

## Acceptance Criteria

- [ ] `plx --help` shows new command structure
- [ ] `plx get --help` shows all subcommands
- [ ] `plx create --help` shows all subcommands
- [ ] Flag descriptions match actual behavior
- [ ] No deprecated command references in help output

## Implementation Checklist

- [ ] 9.1 Update src/cli/index.ts program description
- [ ] 9.2 Update get command help and subcommands
- [ ] 9.3 Add create command help
- [ ] 9.4 Update paste command help for new entities
- [ ] 9.5 Update validate command help for entity subcommands
- [ ] 9.6 Update archive command help for entity subcommands
- [ ] 9.7 Update review command help for entity subcommands
- [ ] 9.8 Update complete command help for new entities
- [ ] 9.9 Update undo command help for new entities
- [ ] 9.10 Add migrate command help
- [ ] 9.11 Update global options help (--parent-id, --parent-type)
- [ ] 9.12 Remove help for deprecated commands
- [ ] 9.13 Verify help output with `plx <command> --help`

## Notes

Help text is the first documentation users see. Ensure it matches behavior exactly. Run `plx --help` after changes to verify output formatting.
