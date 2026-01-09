---
status: done
skill-level: junior
parent-type: change
parent-id: simplify-command-names
---

# Task: Test simplified command names

## End Goal
Verify all command files have correct simplified names.

## Currently
Task 023 updated the source configurators.

## Should
Regenerated command files reflect the new naming convention.

## Constraints
- [ ] Must verify multiple tool configurations
- [ ] Must run existing test suite

## Acceptance Criteria
- [ ] Generated .claude commands have simplified names
- [ ] Generated .codebuddy commands have simplified names
- [ ] All tests pass

## Implementation Checklist
- [x] 2.1 Verify `.claude/commands/plx/refine-architecture.md` has `name: Refine Architecture`
- [x] 2.2 Verify `.claude/commands/plx/get-task.md` has `name: Get Task`
- [x] 2.3 Verify `.claude/commands/plx/plan-proposal.md` has `name: Plan Proposal`
- [x] 2.4 Grep for `Pew Pew Plx:` in .claude/commands - should find zero matches in name fields
- [x] 2.5 Run `pnpm test` and verify all tests pass

## Notes
Focus on Claude commands as primary verification target since that's what the user noticed.
