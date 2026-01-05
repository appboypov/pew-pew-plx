---
status: done
---

# Task: Add TESTING.md template and refine-testing command

## End Goal

TESTING.md config file exists with test workflow configuration. refine-testing command creates/updates it with all options.

## Currently

No TESTING.md or testing-related commands exist. Testing guidance is ad-hoc.

## Should

- TESTING.md: Config-style file (like REVIEW.md) with test types, coverage thresholds, test patterns
- refine-testing command: Contains all testing options, guides through configuration
- TESTING.md created during `plx init` and `plx update` (like REVIEW.md)

## Constraints

- [ ] Follow same pattern as REVIEW.md (minimal config, ~30-50 lines)
- [ ] Follow same command pattern as refine-review
- [ ] Integrate with init.ts and update.ts for auto-creation

## Acceptance Criteria

- [ ] TESTING.md template exists with Purpose, Test Types, Coverage, Test Patterns, Test Checklist sections
- [ ] refine-testing command registered in slash-command-templates.ts
- [ ] plx init creates TESTING.md at project root
- [ ] plx update creates TESTING.md if missing
- [ ] All tool configurator slash commands generated

## Implementation Checklist

- [x] 3.1 Add 'refine-testing' to SlashCommandId type
- [x] 3.2 Create refineTestingGuardrails and refineTestingSteps in slash-command-templates.ts
- [x] 3.3 Add 'refine-testing' to slashCommandBodies
- [x] 3.4 Update init.ts to create TESTING.md template
- [x] 3.5 Update update.ts to create TESTING.md if missing
- [x] 3.6 Create TESTING.md template content (Purpose, Test Types, Coverage, Patterns, Checklist)
- [x] 3.7 Run `plx update` to regenerate all tool configurator files

## Notes

TESTING.md template should be similar in structure to REVIEW.md (~28 lines).
