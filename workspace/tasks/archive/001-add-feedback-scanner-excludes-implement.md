---
status: done
skill-level: medior
parent-type: change
parent-id: add-feedback-scanner-excludes
---

# Task: Implement default excludes in FeedbackScannerService

## End Goal
The feedback scanner excludes test files, documentation, and AI tool templates by default, preventing false positives when parsing feedback markers.

## Currently
`FeedbackScannerService` only excludes `node_modules`, `dist`, `build`, `.git` and respects `.gitignore`. It scans all files with scannable extensions, including test files and templates that contain example markers.

## Should
The scanner excludes common false-positive sources by default while allowing customization via constructor options.

## Constraints
- [ ] Do not break existing behavior for projects that need to scan excluded directories
- [ ] Maintain backward compatibility - existing callers work without changes
- [ ] Patterns must work with the `ignore` library

## Acceptance Criteria
- [ ] Test files (test/, *.test.ts) are excluded by default
- [ ] AI tool directories (.claude/, .cursor/, etc.) are excluded by default
- [ ] Documentation files (README.md, REVIEW.md, etc.) are excluded by default
- [ ] Archive directories are excluded by default
- [ ] Custom excludes can be added via constructor options
- [ ] Default excludes can be disabled via constructor options

## Implementation Checklist
- [x] 1.1 Add `FEEDBACK_SCANNER_EXCLUDES` constant with default patterns
- [x] 1.2 Add constructor options interface for additional/disable excludes
- [x] 1.3 Update `initIgnore()` to apply feedback-specific excludes
- [x] 1.4 Update constructor to accept options parameter
- [x] 1.5 Add unit tests for default exclude behavior
- [x] 1.6 Add unit tests for custom exclude patterns
- [x] 1.7 Add unit tests for disabling default excludes

## Notes
Default excludes list:
- test/, tests/, __tests__/, *.test.ts, *.test.js, *.spec.ts, *.spec.js
- .claude/, .cursor/, .agent/, .qoder/, .codebuddy/, .kilocode/, .roo/, .crush/, .amazonq/, .factory/, .windsurf/, .cospec/, .iflow/, .gemini/, .clinerules/, .opencode/, .augment/, .qwen/, .github/prompts/
- README.md, REVIEW.md, ARCHITECTURE.md, CHANGELOG.md, docs/
- workspace/changes/archive/, workspace/specs/*/archive/
