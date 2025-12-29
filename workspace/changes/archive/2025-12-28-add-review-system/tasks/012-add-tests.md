---
status: done
---

# Task: Add Tests

## End Goal

Comprehensive test coverage for all new functionality.

## Currently

Tests exist in /test directory mirroring src structure.

## Should

Create tests for:
1. `/test/utils/comment-markers.test.ts` - Comment marker utilities
2. `/test/core/templates/review-template.test.ts` - REVIEW.md template
3. `/test/core/schemas/review.schema.test.ts` - Review schema validation
4. `/test/utils/item-discovery.test.ts` - Add review discovery tests
5. `/test/services/feedback-scanner.test.ts` - Feedback scanning
6. `/test/commands/parse-feedback.test.ts` - Parse feedback command
7. `/test/commands/review.test.ts` - Review command

## Constraints

- Must follow existing test patterns
- Must use Vitest
- Must cover edge cases

## Acceptance Criteria

- [ ] Comment markers: all file extensions tested
- [ ] Comment markers: spec-impact parsing tested
- [ ] REVIEW.md template: content validated
- [ ] Review schema: valid and invalid inputs tested
- [ ] Review discovery: active and archived tested
- [ ] Feedback scanner: marker detection tested
- [ ] Feedback scanner: .gitignore respect tested
- [ ] Parse feedback: command execution tested
- [ ] Review command: list and show tested
- [ ] All tests pass

## Implementation Checklist

- [x] Create /test/utils/comment-markers.test.ts
- [x] Test getCommentStyle() for all extensions
- [x] Test formatFeedbackMarker()
- [x] Test parseFeedbackMarker()
- [x] Create /test/core/templates/review-template.test.ts
- [x] Create /test/core/schemas/review.schema.test.ts
- [x] Add review tests to /test/utils/item-discovery.test.ts
- [x] Create /test/services/feedback-scanner.test.ts
- [x] Create /test/commands/parse-feedback.test.ts
- [x] Create /test/commands/review.test.ts
- [x] Run all tests and verify pass

## Notes

Test command: `pnpm test`

Example test structure:
```typescript
import { describe, it, expect } from 'vitest';
import { getCommentStyle, parseFeedbackMarker } from '../../src/utils/comment-markers.js';

describe('comment-markers', () => {
  describe('getCommentStyle', () => {
    it('returns // for TypeScript files', () => {
      expect(getCommentStyle('file.ts')).toEqual({ prefix: '//' });
    });
  });
});
```
