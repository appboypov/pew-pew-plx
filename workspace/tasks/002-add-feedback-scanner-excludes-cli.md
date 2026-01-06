---
status: done
skill-level: junior
parent-type: change
parent-id: add-feedback-scanner-excludes
---

# Task: Add CLI options for exclude patterns

## End Goal
Users can customize exclude patterns via `--exclude` and `--no-default-excludes` CLI flags on `plx parse feedback`.

## Currently
The `parse-feedback` command has no options to control which files are scanned beyond the built-in ignore patterns.

## Should
The command accepts `--exclude <patterns>` for additional excludes and `--no-default-excludes` to disable default exclusions.

## Constraints
- [ ] Follow existing CLI option patterns in the codebase
- [ ] Use Commander.js option syntax consistently
- [ ] Pass options to FeedbackScannerService constructor

## Acceptance Criteria
- [ ] `--exclude "pattern1,pattern2"` adds custom exclude patterns
- [ ] `--no-default-excludes` disables all default feedback-specific excludes
- [ ] Options are documented in help output
- [ ] Options work with other existing flags (--json, etc.)

## Implementation Checklist
- [x] 2.1 Add `--exclude <patterns>` option to parse-feedback command
- [x] 2.2 Add `--no-default-excludes` flag to parse-feedback command
- [x] 2.3 Parse comma-separated patterns from --exclude value
- [x] 2.4 Pass options to FeedbackScannerService constructor
- [x] 2.5 Add integration tests for CLI options

## Notes
Reference existing command option patterns in `src/commands/` for consistent implementation.
