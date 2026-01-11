---
status: done
skill-level: junior
parent-type: change
parent-id: update-monorepo-command-behavior
---

# Task: Verify all slash command changes

## End Goal

All modified slash commands are verified to be syntactically correct, consistent, and follow the established patterns.

## Currently

Slash commands have been modified with new guardrails and monorepo awareness instructions.

## Should

All commands should be verified for:
- Correct markdown structure
- Consistent guardrail formatting
- No syntax errors
- Proper PLX markers

## Constraints

- [ ] No functional testing required - syntax and structure only
- [ ] Do not modify command content unless errors found

## Acceptance Criteria

- [ ] All 10 modified commands have valid markdown structure
- [ ] Monorepo awareness sections are consistently formatted
- [ ] PLX markers are properly placed
- [ ] No duplicate or conflicting instructions

## Implementation Checklist

- [x] 3.1 Review prepare-release.md for consistency
- [x] 3.2 Review plan-proposal.md for consistency
- [x] 3.3 Review plan-request.md for consistency
- [x] 3.4 Review review.md for consistency
- [x] 3.5 Review parse-feedback.md for consistency
- [x] 3.6 Review refine-architecture.md for consistency
- [x] 3.7 Review refine-release.md for consistency
- [x] 3.8 Review refine-review.md for consistency
- [x] 3.9 Review refine-testing.md for consistency
- [x] 3.10 Run `plx update` to regenerate and verify no conflicts

## Notes

This is a review task to catch any inconsistencies before testing.
