---
status: done
---

# Task: Fix List Command Path Resolution

## End Goal

The `plx list` command works correctly when invoked from any directory, resolving relative paths to absolute paths before checking directory existence.

## Currently

`ListCommand.execute()` receives `'.'` from the CLI at `src/cli/index.ts:113` but does not call `path.resolve()`. The `fs.access('./workspace/changes')` check resolves relative to `process.cwd()`, causing "No PLX changes directory found" errors when the directory exists.

## Should

`ListCommand.execute()` resolves `targetPath` to an absolute path at the start of the method, ensuring all subsequent path operations work correctly regardless of the caller's working directory.

## Constraints

- [x] No breaking changes to existing behavior
- [x] Match the pattern used by `UpdateCommand` and `InitCommand` which already use `path.resolve()`

## Acceptance Criteria

- [x] `plx list` works when workspace/changes exists
- [x] `plx list --specs` works when workspace/specs exists
- [x] `plx list --reviews` works when workspace/reviews exists
- [x] All existing tests continue to pass

## Implementation Checklist

- [x] 1.1 Add `const resolvedPath = path.resolve(targetPath);` at start of `execute()` method in `src/core/list.ts`
- [x] 1.2 Replace `targetPath` with `resolvedPath` in `path.join(targetPath, 'workspace', 'changes')` (line ~29)
- [x] 1.3 Replace `targetPath` with `resolvedPath` in `path.join(targetPath, 'workspace', 'specs')` (line ~104)
- [x] 1.4 Replace `targetPath` with `resolvedPath` in `getActiveReviewIds(targetPath)` (line ~145)
- [x] 1.5 Replace `targetPath` with `resolvedPath` in `path.join(targetPath, 'workspace', 'reviews')` (line ~151)
- [x] 1.6 Run existing tests to verify no regressions

## Notes

The bug was not caught in tests because tests pass absolute paths (via `tempDir`), not relative paths like `'.'`.
