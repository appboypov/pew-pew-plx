# Change: Add default excludes to feedback scanner

## Why

The `plx parse feedback` command scans the entire codebase for `#FEEDBACK #TODO` markers but picks up false positives from test files, documentation, and AI tool templates. These files contain example markers in string literals, documentation sections, and template code that should not be treated as actual feedback.

When running `plx parse feedback`, the scanner found 142 markers across 42 files instead of the 7 actual markers, creating noise in the review system.

## What Changes

- Add `FEEDBACK_SCANNER_EXCLUDES` constant with default patterns for common false-positive sources
- Update `FeedbackScannerService.initIgnore()` to apply feedback-specific excludes
- Add `--exclude` CLI option to add custom exclude patterns
- Add `--no-default-excludes` CLI flag to disable default exclusions

## Impact

- Affected specs: `cli-parse-feedback`
- Affected code:
  - `src/services/feedback-scanner.ts` - Add exclude patterns and constructor options
  - `src/commands/parse-feedback.ts` - Add CLI options
  - `test/services/feedback-scanner.test.ts` - Add tests for exclusion behavior
