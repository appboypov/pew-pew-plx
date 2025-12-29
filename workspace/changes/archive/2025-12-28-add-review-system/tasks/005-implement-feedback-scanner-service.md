---
status: done
---

# Task: Implement Feedback Scanner Service

## End Goal

A service that scans the codebase for feedback markers and generates review entities with tasks.

## Currently

No feedback scanning capability exists.

## Should

Create `/src/services/feedback-scanner.ts` with:
- `FeedbackMarker` interface: { file, line, feedback, specImpact, commentStyle }
- `FeedbackScannerService` class with:
  - `scanDirectory(dir)`: Find all feedback markers (respects .gitignore)
  - `generateReview(reviewId, markers)`: Create review entity with tasks
  - `removeFeedbackMarkers(markers)`: Clean up markers from files (optional, for post-archive)

## Constraints

- Must respect .gitignore patterns
- Must exclude common non-source directories (node_modules, dist, build, .git)
- Must use comment-markers utility for parsing
- Must generate valid task files with correct frontmatter

## Acceptance Criteria

- [ ] scanDirectory() finds all feedback markers in source files
- [ ] scanDirectory() respects .gitignore
- [ ] scanDirectory() excludes node_modules, dist, build, .git
- [ ] generateReview() creates workspace/reviews/<id>/ directory
- [ ] generateReview() creates review.md with correct frontmatter
- [ ] generateReview() creates task files in tasks/ directory
- [ ] Task files have spec-impact frontmatter
- [ ] Task files include source file/line in Notes section

## Implementation Checklist

- [x] Create `/src/services/feedback-scanner.ts`
- [x] Define FeedbackMarker interface
- [x] Implement scanDirectory(dir)
- [x] Implement file walking with ignore patterns
- [x] Implement generateReview(reviewId, markers)
- [x] Generate review.md with metadata
- [x] Generate task files with proper structure
- [x] Implement removeFeedbackMarkers(markers) (optional)
- [x] Export FeedbackScannerService

## Notes

Task file structure:
```markdown
---
status: to-do
spec-impact: none | <spec-id>
---

# Task: {summary from feedback}

## Feedback
{original feedback text}

## End Goal
{derived from feedback}

...

## Notes
Generated from feedback marker at {file}:{line}
```
