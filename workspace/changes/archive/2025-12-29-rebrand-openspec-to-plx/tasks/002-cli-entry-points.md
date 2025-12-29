---
status: done
---

# Task: Update CLI entry points and package.json

## End Goal

The CLI exposes only `plx` command. The `openspec` command is completely removed.

## Currently

- `bin/openspec.js` and `bin/plx.js` both exist
- `package.json` exposes both "openspec" and "plx" in bin
- `src/cli/index.ts` references OPENSPEC_CONCURRENCY env variable
- Keywords include "openspec"

## Should

- Only `bin/plx.js` exists
- `package.json` exposes only "plx" in bin
- `src/cli/index.ts` references PLX_CONCURRENCY env variable
- Keywords include "plx" instead of "openspec"

## Constraints

- [x] bin/openspec.js must be deleted entirely
- [x] No backward compatibility alias for openspec command
- [x] package.json must only expose plx bin command

## Acceptance Criteria

- [x] Running `openspec` command fails with "command not found"
- [x] Running `plx` command works
- [x] package.json only has "plx" in bin section
- [x] Keywords updated to use "plx"

## Implementation Checklist

- [x] 2.1 Delete `bin/openspec.js` file
- [x] 2.2 Update `package.json`: remove "openspec" from bin section, keep only "plx"
- [x] 2.3 Update `package.json`: update keywords from "openspec" to "plx"
- [x] 2.4 Update `src/cli/index.ts`: change `OPENSPEC_CONCURRENCY` to `PLX_CONCURRENCY` in env variable check
- [x] 2.5 Update `package.json` dev:cli script to use bin/plx.js

## Notes

After this task, `openspec` command will no longer work. This is intentional and expected.
