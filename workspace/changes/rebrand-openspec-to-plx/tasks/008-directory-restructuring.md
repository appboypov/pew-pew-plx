---
status: done
---

# Task: Restructure directories from openspec/ to workspace/

## End Goal

The main project directory is `workspace/` instead of `openspec/`. All content is properly migrated and updated.

## Currently

- `openspec/` directory contains specs/, changes/, AGENTS.md
- `workspace/` directory contains logs/ and specs/ (separate working documents)
- `openspec/specs/openspec-conventions/` exists

## Should

- `workspace/` directory contains specs/, changes/, AGENTS.md (merged from openspec/)
- Old `openspec/` directory no longer exists
- `workspace/specs/plx-conventions/` exists (renamed from openspec-conventions)

## Constraints

- [x] All content from openspec/ must be preserved in workspace/
- [x] Archive files must be updated with PLX terminology
- [x] openspec-conventions must be renamed to plx-conventions

## Acceptance Criteria

- [x] `workspace/` contains all specs and changes
- [x] `workspace/AGENTS.md` uses PLX terminology
- [x] `workspace/specs/plx-conventions/` exists
- [x] No `openspec/` directory remains

## Implementation Checklist

- [x] 8.1 Rename `openspec/` directory to `workspace/` (preserving all content)
- [x] 8.2 Merge any content from old `workspace/` that should be preserved (if any specs need merging)
- [x] 8.3 Update `workspace/AGENTS.md`: replace all "OpenSpec" with "PLX", `openspec` with `workspace`, `openspec` commands with `plx`
- [x] 8.4 Rename `workspace/specs/openspec-conventions/` to `workspace/specs/plx-conventions/`
- [x] 8.5 Update `workspace/specs/plx-conventions/spec.md`: replace OpenSpec terminology with PLX
- [x] 8.6 Update all files in `workspace/changes/archive/*`: replace OpenSpec terminology with PLX (full rebrand)
- [x] 8.7 Delete any remnants of old `workspace/` logs or temporary files
- [x] 8.8 Verify directory structure is correct

## Notes

This task involves file system operations. Be careful to preserve git history where possible. The archive files need full rebrand per the constraints.
