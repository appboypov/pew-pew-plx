---
status: done
parent-type: change
parent-id: refine-plx-slash-commands
---
# Implement Template Changes

## End Goal
The `plx-slash-command-templates.ts` file contains updated type definitions, template bodies, and @ file references.

## Currently
- `PlxSlashCommandId` includes `init-architecture` and `update-architecture`
- No `refine-release` command exists
- Commands reference files without `@` notation

## Should
- `PlxSlashCommandId` excludes `init-architecture` and `update-architecture`
- `refine-release` command with guardrails and steps
- Commands use `@` notation for file references

## Constraints
- [x] Follow existing refine-* pattern for refine-release
- [x] Preserve all other existing commands unchanged
- [x] TypeScript must compile without errors

## Acceptance Criteria
- [x] `PlxSlashCommandId` type has 8 values (removed 2, added 1)
- [x] `baseGuardrails`, `initArchitectureSteps`, `updateArchitectureSteps` constants removed
- [x] `refineReleaseGuardrails` and `refineReleaseSteps` constants added
- [x] `plxSlashCommandBodies` record updated with correct entries
- [x] `review` command body contains `@REVIEW.md`
- [x] `refine-review` command body contains `@REVIEW.md`
- [x] `refine-architecture` command body contains `@ARCHITECTURE.md`
- [x] `prepare-release` command body contains `@README.md`, `@CHANGELOG.md`, `@ARCHITECTURE.md`

## Implementation Checklist
- [x] Remove `init-architecture` and `update-architecture` from `PlxSlashCommandId` type
- [x] Remove `baseGuardrails` constant
- [x] Remove `initArchitectureSteps` constant
- [x] Remove `updateArchitectureSteps` constant
- [x] Add `refineReleaseGuardrails` constant
- [x] Add `refineReleaseSteps` constant
- [x] Add `refine-release` to `plxSlashCommandBodies`
- [x] Remove `init-architecture` and `update-architecture` from `plxSlashCommandBodies`
- [x] Update `reviewSteps` to include `@REVIEW.md`
- [x] Update `refineReviewGuardrails` to include `@REVIEW.md`
- [x] Update `refineReviewSteps` to include `@REVIEW.md`
- [x] Update `refineArchitectureGuardrails` to include `@ARCHITECTURE.md`
- [x] Update `refineArchitectureSteps` to include `@ARCHITECTURE.md`
- [x] Update `prepareReleaseGuardrails` to include `@README.md`, `@CHANGELOG.md`, `@ARCHITECTURE.md`
- [x] Update `prepareReleaseSteps` to include `@README.md`, `@CHANGELOG.md`, `@ARCHITECTURE.md`

## Notes
- File: `src/core/templates/plx-slash-command-templates.ts`
