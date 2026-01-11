---
status: done
skill-level: junior
parent-type: change
parent-id: add-feedback-scanner-excludes
---

# Task: Validate behavior with real-world test

## End Goal
Confirm the fix eliminates false positives in actual usage.

## Currently
Running `plx parse feedback` picks up 142 markers from test and template files.

## Should
Running `plx parse feedback` only picks up actual feedback markers from source files.

## Constraints
- [ ] Test on actual codebase, not just unit tests
- [ ] Verify no legitimate markers are excluded

## Acceptance Criteria
- [ ] `plx parse feedback` excludes markers from test files
- [ ] `plx parse feedback` excludes markers from .claude/ and other AI tool directories
- [ ] `plx parse feedback` excludes markers from README.md, REVIEW.md, etc.
- [ ] `plx parse feedback --no-default-excludes` scans all files
- [ ] `plx parse feedback --exclude "custom/"` excludes additional paths

## Implementation Checklist
- [x] 4.1 Add feedback marker to src/core/view.ts (test file)
- [x] 4.2 Run `plx parse feedback test-excludes` and verify marker is found
- [x] 4.3 Verify markers in test/ files are NOT found
- [x] 4.4 Verify markers in .claude/ files are NOT found
- [x] 4.5 Clean up test marker from view.ts

## Notes
This is a manual validation task to confirm the implementation works as expected in real-world usage.
