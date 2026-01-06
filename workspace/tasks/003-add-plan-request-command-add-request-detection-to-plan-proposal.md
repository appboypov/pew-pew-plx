---
status: done
parent-type: change
parent-id: add-plan-request-command
---
# Task: Add request.md detection to plan-proposal

## End Goal
The `plx/plan-proposal` command auto-detects and consumes `request.md` when present in the change folder.

## Currently
The proposal command starts fresh without checking for prior intent clarification.

## Should
- Plan-proposal checks for existing `workspace/changes/{change-id}/request.md`
- If found, uses Final Intent section as primary input
- Incorporates Decisions section into proposal context
- Works normally when request.md is absent

## Constraints
- [ ] Backward compatible - works without request.md
- [ ] Does not require changes to CLI code (command file only)
- [ ] Uses existing proposal steps after consuming request.md

## Acceptance Criteria
- [ ] Step 0 added to plan-proposal.md checking for request.md
- [ ] Instructions clear on using Final Intent and Decisions sections
- [ ] Existing functionality preserved

## Implementation Checklist
- [x] 3.1 Add Step 0 to plan-proposal.md: "Check for existing request context"
- [x] 3.2 Include instruction to check ARGUMENTS for change-id
- [x] 3.3 Include instruction to read `workspace/changes/<id>/request.md` if exists
- [x] 3.4 Include instruction to use Final Intent as primary input
- [x] 3.5 Include instruction to incorporate Decisions section
- [x] 3.6 Add reference note about running `plx/plan-request` first

## Notes
- The plan-proposal command file is at `.claude/commands/plx/plan-proposal.md` after the rename
- Step 0 should be inserted before the existing Step 1
