---
status: done
---

# Task: Implement REVIEW.md Template

## End Goal

A REVIEW.md template that is created at project root during `plx init` and `plx update` (if not exists), containing meta-instructions for writing project-specific review guidelines.

## Currently

No REVIEW.md template exists. Only ARCHITECTURE.md is created during init.

## Should

1. Create `/src/core/templates/review-template.ts` with `reviewTemplate()` function
2. Export via `/src/core/templates/index.ts` as `TemplateManager.getReviewTemplate()`
3. Modify `/src/core/init.ts` to create REVIEW.md at project root if not exists
4. Modify `/src/core/update.ts` to create REVIEW.md at project root if not exists

## Constraints

- Must not overwrite existing REVIEW.md
- Must be created at project root (same level as ARCHITECTURE.md)
- Template must explain feedback marker format
- Template must be customizable by users

## Acceptance Criteria

- [ ] REVIEW.md created during `plx init` if not exists
- [ ] REVIEW.md created during `plx update` if not exists
- [ ] Existing REVIEW.md is not overwritten
- [ ] Template contains Purpose section
- [ ] Template contains Review Types section
- [ ] Template contains Feedback Format section with examples
- [ ] Template contains Review Checklist section

## Implementation Checklist

- [x] Create `/src/core/templates/review-template.ts`
- [x] Export reviewTemplate() function
- [x] Update `/src/core/templates/index.ts` to include getReviewTemplate()
- [x] Modify `/src/core/init.ts` to create REVIEW.md
- [x] Modify `/src/core/update.ts` to create REVIEW.md if missing
- [x] Test init creates REVIEW.md
- [x] Test update creates REVIEW.md if missing
- [x] Test existing REVIEW.md is preserved

## Notes

Template content from design.md:
```markdown
# Review Guidelines

## Purpose
This file defines how code reviews should be conducted in this project.

## Review Types
- Implementation Review
- Architecture Review
- Security Review

## Feedback Format
`#FEEDBACK #TODO | {feedback}`
`#FEEDBACK #TODO | {feedback} (spec:<spec-id>)`

## Review Checklist
- [ ] Code follows project conventions
- [ ] Tests cover new functionality
- [ ] Documentation updated
```
