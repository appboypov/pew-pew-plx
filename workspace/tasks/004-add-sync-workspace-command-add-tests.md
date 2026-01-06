---
status: done
parent-type: change
parent-id: add-sync-workspace-command
---
# Task: Add tests for new slash commands

## End Goal

Test coverage exists for the new slash command templates.

## Currently

Tests exist for the slash command template system but do not cover the new commands.

## Should

Tests verify:
- `sync-workspace` template body is defined and non-empty
- `complete-task` template body is defined and non-empty
- `undo-task` template body is defined and non-empty
- `ALL_COMMANDS` array includes the new commands

## Constraints

- [ ] Follow existing test patterns in the codebase
- [ ] Test only the template definitions, not CLI behavior

## Acceptance Criteria

- [ ] Tests verify `getSlashCommandBody('sync-workspace')` returns content
- [ ] Tests verify `getSlashCommandBody('complete-task')` returns content
- [ ] Tests verify `getSlashCommandBody('undo-task')` returns content
- [ ] All new tests pass

## Implementation Checklist

- [x] 4.1 Add test for `sync-workspace` template in appropriate test file
- [x] 4.2 Add test for `complete-task` template
- [x] 4.3 Add test for `undo-task` template
- [x] 4.4 Run tests and verify all pass

## Notes

Tests should be minimal - just verify the templates are defined and return non-empty content.
