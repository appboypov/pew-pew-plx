---
status: done
skill-level: junior
---

# Task: Add JSON output support to all paste subcommands

## End Goal

All paste subcommands (`task`, `change`, `spec`) support `--json` flag for machine-readable output.

## Currently

Only `plx paste request` supports `--json` output. The new subcommands need the same capability.

## Should

- All paste subcommands accept `--json` flag
- JSON success output includes: `path`, `characters`, `entityType`, `success`
- Entity-specific fields: `parentId` (task), `changeName` (change), `specName` (spec)
- JSON error output includes: `error` string and process.exitCode = 1

## Constraints

- [ ] JSON output format consistent with existing `plx paste request --json`
- [ ] Use `console.log(JSON.stringify(..., null, 2))` for formatted output
- [ ] Set `process.exitCode = 1` on error (not `process.exit(1)`) for proper JSON output

## Acceptance Criteria

- [ ] `plx paste task --json` outputs valid JSON with path and entityType
- [ ] `plx paste change --json` outputs valid JSON with changeName
- [ ] `plx paste spec --json` outputs valid JSON with specName
- [ ] Error cases output JSON with error field
- [ ] Exit code is 1 on error, 0 on success

## Implementation Checklist

- [x] 4.1 Add `--json` option to paste task subcommand registration
- [x] 4.2 Add `--json` option to paste change subcommand registration
- [x] 4.3 Add `--json` option to paste spec subcommand registration
- [x] 4.4 Update task method to return JSON on success/error
- [x] 4.5 Update change method to return JSON on success/error
- [x] 4.6 Update spec method to return JSON on success/error
- [x] 4.7 Ensure consistent JSON structure across all subcommands

## Notes

Follow the existing pattern in `request` method where JSON mode wraps the entire operation in a try/catch and outputs JSON for both success and error cases.
