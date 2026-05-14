---
status: done
parent-type: change
parent-id: add-parent-linkage-to-feedback-markers
---
# Task: Update slash command templates

## End Goal
Update AI instructions to use new marker format with parent linkage.

## Currently
- `reviewGuardrails` mentions "spec-impacting feedback"
- `reviewSteps` instructs to run `splx parse feedback <name> --change-id <id>`
- `.claude/commands/splx/review.md` documents old format

## Should
- `reviewGuardrails` instructs to include parent linkage in markers
- `reviewSteps` mentions parent linkage format
- `.claude/commands/splx/review.md` documents new format with examples

## Constraints
- [x] Instructions must be concise but clear
- [x] Examples must cover all three parent types

## Acceptance Criteria
- [x] `reviewGuardrails` updated to mention parent linkage
- [x] `reviewSteps` updated with new marker format
- [x] `parseFeedbackSteps` updated to reflect optional CLI flags
- [x] `.claude/commands/splx/review.md` documents new marker format

## Implementation Checklist
- [x] Update `reviewGuardrails` in `splx-slash-command-templates.ts`
- [x] Update `reviewSteps` in `splx-slash-command-templates.ts`
- [x] Update `parseFeedbackSteps` in `splx-slash-command-templates.ts`
- [x] Update `.claude/commands/splx/review.md`

## Notes
Files:
- `src/core/templates/splx-slash-command-templates.ts`
- `.claude/commands/splx/review.md`
