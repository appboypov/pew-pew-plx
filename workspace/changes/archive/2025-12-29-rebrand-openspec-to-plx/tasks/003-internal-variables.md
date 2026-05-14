---
status: done
---

# Task: Rename internal variables and update imports

## End Goal

All internal variable names and imports use PLX/workspace terminology consistently.

## Currently

- Variables named `openspecPath`, `openspecDir`, `openspecDirName`, `_openspecPath`
- Imports reference `OPENSPEC_DIR_NAME`, `OPENSPEC_MARKERS`
- Parameter names include `openspecDir`, `openspecPath`

## Should

- Variables renamed to `workspacePath`, `workspaceDir`, `workspaceDirName`, `_workspacePath`
- Imports reference `PLX_DIR_NAME`, `PLX_MARKERS`
- Parameter names use `workspaceDir`, `workspacePath`

## Constraints

- [x] All variable renames must be consistent across the codebase
- [x] TypeScript compilation must pass after changes
- [x] No references to "openspec" in variable names remain (except in comments for historical context)

## Acceptance Criteria

- [x] No variable names contain "openspec" (case-insensitive)
- [x] All imports updated to use PLX constants
- [x] TypeScript compilation passes

## Implementation Checklist

- [x] 3.1 Update `src/core/init.ts`: rename `openspecPath` -> `workspacePath`, `_openspecPath` -> `_workspacePath`, `openspecDir` -> `workspaceDir`
- [x] 3.2 Update `src/core/update.ts`: rename `openspecDir` -> `workspaceDir`, update imports
- [x] 3.3 Update `src/core/archive.ts`: rename variables and update imports
- [x] 3.4 Update `src/core/list.ts`: rename `openspecDir` -> `workspaceDir` and path references
- [x] 3.5 Update `src/core/view.ts`: rename `openspecDir` -> `workspaceDir`
- [x] 3.6 Update `src/core/configurators/agents.ts`: update imports and parameter names
- [x] 3.7 Update `src/core/configurators/claude.ts`: update imports
- [x] 3.8 Update `src/core/configurators/base.ts`: update parameter names if needed
- [x] 3.9 Update `src/utils/file-system.ts`: update any OpenSpec references
- [x] 3.10 Search for remaining `openspec` variable names and update

## Notes

Use search-replace carefully to avoid breaking strings that should remain (like URLs or historical references).
