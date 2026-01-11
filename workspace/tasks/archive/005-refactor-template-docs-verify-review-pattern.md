---
status: done
parent-type: change
parent-id: refactor-template-docs
---
# Task: Verify REVIEW.md follows pattern

## End Goal

Confirm REVIEW.md already follows the minimal config pattern and refine-review contains option documentation.

## Currently

REVIEW.md is 28 lines (minimal config). Need to verify refine-review command contains sufficient option documentation.

## Should

- REVIEW.md remains config-style (already correct)
- refine-review command contains all review type options, feedback format examples, checklist customization guidance

## Constraints

- [ ] Do not change REVIEW.md if already correct
- [ ] Only update refine-review if missing option documentation

## Acceptance Criteria

- [ ] REVIEW.md verified as config-style (under 50 lines)
- [ ] refine-review command contains review type options (implementation, architecture, security)
- [ ] refine-review command contains feedback format documentation
- [ ] No changes needed OR changes applied to align with pattern

## Implementation Checklist

- [x] 5.1 Read REVIEW.md and verify under 50 lines with config sections
- [x] 5.2 Read refine-review command and assess option documentation completeness
- [x] 5.3 If refine-review lacks detail, update refineReviewGuardrails/Steps in slash-command-templates.ts
- [x] 5.4 Run `plx update` if changes made
- [x] 5.5 Document findings (already correct OR changes made)

## Notes

REVIEW.md was noted as "already done pretty well" - this task confirms that assessment.
