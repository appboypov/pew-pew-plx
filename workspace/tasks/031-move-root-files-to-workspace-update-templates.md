---
status: to-do
skill-level: medior
parent-type: change
parent-id: move-root-files-to-workspace
---

# Task: Update slash command template references

## End Goal
All slash command templates reference `@workspace/ARCHITECTURE.md`, `@workspace/REVIEW.md`, `@workspace/RELEASE.md`, `@workspace/TESTING.md`, `@workspace/PROGRESS.md` instead of root paths.

## Currently
`src/core/templates/slash-command-templates.ts` contains:
- `@ARCHITECTURE.md` (line 40)
- `@REVIEW.md` (lines 136, 213, 249, 269, 1015, 1047)
- `@TESTING.md` (lines 328, 365, 389, 879, 890, 1066, 1097)
- `@RELEASE.md` (lines 451, 507, 539, 597, 599, 619)
- Various references in slash command bodies

## Should
All references updated to:
- `@workspace/ARCHITECTURE.md`
- `@workspace/REVIEW.md`
- `@workspace/RELEASE.md`
- `@workspace/TESTING.md`
- `@workspace/PROGRESS.md`

## Constraints
- [ ] Update all occurrences consistently
- [ ] Preserve the `@` prefix for AI tool file references
- [ ] Do not change any logic, only string values

## Acceptance Criteria
- [ ] All `@ARCHITECTURE.md` → `@workspace/ARCHITECTURE.md`
- [ ] All `@REVIEW.md` → `@workspace/REVIEW.md`
- [ ] All `@RELEASE.md` → `@workspace/RELEASE.md`
- [ ] All `@TESTING.md` → `@workspace/TESTING.md`
- [ ] All `@PROGRESS.md` → `@workspace/PROGRESS.md`

## Implementation Checklist
- [ ] 6.1 Update `planningContext` variable (ARCHITECTURE.md reference)
- [ ] 6.2 Update `reviewSteps` variable (REVIEW.md references)
- [ ] 6.3 Update `refineReviewSteps` variable (REVIEW.md references)
- [ ] 6.4 Update `testSteps` variable (TESTING.md references)
- [ ] 6.5 Update `refineTestingSteps` variable (TESTING.md references)
- [ ] 6.6 Update `prepareReleaseSteps` variable (RELEASE.md references)
- [ ] 6.7 Update `refineReleaseSteps` variable (RELEASE.md references)
- [ ] 6.8 Update `copyReviewRequestSteps` variable (REVIEW.md references)
- [ ] 6.9 Update `copyTestRequestSteps` variable (TESTING.md references)
- [ ] 6.10 Update `prepareCompactSteps` variable (PROGRESS.md references)
- [ ] 6.11 Search for any missed references

## Notes
Use search/replace carefully to catch all occurrences.
