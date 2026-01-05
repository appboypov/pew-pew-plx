---
status: done
---

# Task: Add plx/test command

## End Goal

plx/test command runs testing workflow, accepting --change-id, --task-id, --spec-id arguments like review command.

## Currently

No test command exists. Testing is manual or tool-specific.

## Should

- plx/test command reads TESTING.md config
- Accepts arguments: --change-id, --task-id, --spec-id (same pattern as review)
- Guides agent through running tests for specified scope
- Outputs test results and coverage

## Constraints

- [ ] Follow same argument pattern as review command
- [ ] Reference TESTING.md for test configuration
- [ ] Work without arguments (run all tests)

## Acceptance Criteria

- [ ] 'test' command registered in slash-command-templates.ts
- [ ] Command accepts --change-id, --task-id, --spec-id arguments
- [ ] Command reads TESTING.md for configuration
- [ ] All tool configurator slash commands generated

## Implementation Checklist

- [x] 4.1 Add 'test' to SlashCommandId type
- [x] 4.2 Create testGuardrails in slash-command-templates.ts
- [x] 4.3 Create testSteps with argument parsing and TESTING.md reading
- [x] 4.4 Add 'test' to slashCommandBodies
- [x] 4.5 Run `plx update` to regenerate all tool configurator files
- [x] 4.6 Verify test command appears in .claude/commands/plx/test.md

## Notes

The test command follows the review command pattern but focuses on running and validating tests rather than reviewing code.
