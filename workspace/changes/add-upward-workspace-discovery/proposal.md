# Change: Add Upward Workspace Discovery

## Why

When AI agents execute `plx` commands from subdirectories (e.g., `/project/src/components/`), the CLI fails to find the workspace because it only scans downward from CWD. This makes PLX unusable when agents are working in nested directories, which is a common pattern.

## What Changes

- **MODIFIED** `src/utils/workspace-discovery.ts` - Add `findProjectRoot()` function that scans upward to find valid PLX workspace
- **MODIFIED** `src/utils/workspace-filter.ts` - Integrate upward scan before downward discovery in `getFilteredWorkspaces()`
- **NEW** PLX workspace validation using `PLX_MARKERS.start` signature in `workspace/AGENTS.md`

## Impact

- Affected specs: None existing (new capability)
- Affected code: `workspace-discovery.ts`, `workspace-filter.ts`
- **BREAKING**: None - existing behavior at project root unchanged
- Backward compatible: Projects at root work identically; subdirectory execution now works
