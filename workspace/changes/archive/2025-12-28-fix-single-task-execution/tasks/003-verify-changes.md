---
status: done
---

# Task: Verify changes

## End Goal

All changes are complete, consistent, and ready for deployment.

## Currently

Template changes and regeneration have been applied but not verified for consistency.

## Should

All generated files match the updated template content and pass validation.

## Constraints

- [ ] Must verify all affected files are updated
- [ ] Must ensure no conflicting instructions remain

## Acceptance Criteria

- [ ] `workspace/AGENTS.md` contains updated Stage 2 instructions
- [ ] `.claude/commands/plx/get-task.md` contains updated steps
- [ ] No references to "Repeat" or "continue until all tasks are done" remain in agent-facing instructions
- [ ] Instructions in AGENTS.md and get-task.md are consistent

## Implementation Checklist

- [x] 3.1 Read `workspace/AGENTS.md` and verify Stage 2 contains stop-and-wait instruction
- [x] 3.2 Read `.claude/commands/plx/get-task.md` and verify steps include stop-and-wait
- [x] 3.3 Search for any remaining "Repeat" or continuation instructions in generated files

## Notes

This task ensures consistency between the two primary agent instruction sources.
