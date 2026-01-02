---
status: to-do
---

# Task: Implement upward workspace scanning

## End Goal

PLX commands work when executed from any subdirectory within a project by scanning upward to find the project root.

## Currently

- `discoverWorkspaces()` only scans downward from CWD
- Running `plx get task` from `/project/src/components/` fails with "No PLX workspace found"
- Agents working in subdirectories cannot use PLX commands

## Should

- New `findProjectRoot()` function scans upward from CWD
- Detects valid PLX workspace by checking `workspace/AGENTS.md` contains `<!-- PLX:START -->`
- Stops at first valid workspace found (workspace takes priority)
- Falls back to `.git` as ceiling if no workspace found
- Returns CWD immediately if it already contains valid workspace
- Integrates with existing `getFilteredWorkspaces()` to use found root as scan base

## Constraints

- [ ] Must reuse `PLX_MARKERS.start` constant from `src/core/config.ts`
- [ ] Must not break existing behavior when running from project root
- [ ] Must handle filesystem errors gracefully (permission denied, missing directories)
- [ ] Must work on all platforms (Windows, macOS, Linux path handling)

## Acceptance Criteria

- [ ] `plx list` works from any subdirectory within a PLX project
- [ ] `plx get task` works from any subdirectory within a PLX project
- [ ] Running from non-PLX directory still returns appropriate error
- [ ] Running from project root works identically to current behavior
- [ ] Upward scan stops at `.git` if no workspace found before it

## Implementation Checklist

- [ ] 1.1 Add `isValidPlxWorkspace(dir: string)` function to check for `workspace/AGENTS.md` with PLX signature
- [ ] 1.2 Add `findProjectRoot(startDir: string)` function that scans upward
- [ ] 1.3 Implement upward traversal logic with workspace priority and `.git` fallback ceiling
- [ ] 1.4 Modify `getFilteredWorkspaces()` to call `findProjectRoot()` first
- [ ] 1.5 Update `discoverWorkspaces()` call to use found root instead of `process.cwd()`
- [ ] 1.6 Handle edge case: CWD is already valid PLX workspace (skip upward scan)

## Notes

The detection criteria uses `PLX_MARKERS.start` (`<!-- PLX:START -->`) presence in `workspace/AGENTS.md` to distinguish valid PLX workspaces from generic `workspace/` folders.
