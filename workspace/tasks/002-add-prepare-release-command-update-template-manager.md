---
status: done
parent-type: change
parent-id: add-prepare-release-command
---
# Update Template Manager

## End Goal

TemplateManager exports `getReleaseTemplate()` method to access the RELEASE.md template.

## Currently

- TemplateManager exports `getReviewTemplate()` for REVIEW.md
- No method exists for RELEASE.md template

## Should

- Import `releaseTemplate` from new file
- Add `static getReleaseTemplate(): string` method
- Follow the pattern of `getReviewTemplate()`

## Constraints

- Must maintain existing TemplateManager API
- Must follow existing import/export patterns

## Acceptance Criteria

- [x] `releaseTemplate` imported in `index.ts`
- [x] `getReleaseTemplate()` method added to TemplateManager
- [x] Method returns string from `releaseTemplate()`
- [x] TypeScript compiles without errors

## Implementation Checklist

- [x] Add import for `releaseTemplate` from `./release-template.js`
- [x] Add `static getReleaseTemplate(): string` method to TemplateManager class
- [x] Implement method to call `releaseTemplate()` and return result
- [x] Verify TypeScript compilation

## Notes

Location: `src/core/templates/index.ts`
