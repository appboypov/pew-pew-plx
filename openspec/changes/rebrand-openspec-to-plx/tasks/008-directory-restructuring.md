---
status: to-do
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

- [ ] All content from openspec/ must be preserved in workspace/
- [ ] Archive files must be updated with PLX terminology
- [ ] openspec-conventions must be renamed to plx-conventions

## Acceptance Criteria

- [ ] `workspace/` contains all specs and changes
- [ ] `workspace/AGENTS.md` uses PLX terminology
- [ ] `workspace/specs/plx-conventions/` exists
- [ ] No `openspec/` directory remains

## Implementation Checklist

- [ ] 8.1 Rename `openspec/` directory to `workspace/` (preserving all content)
- [ ] 8.2 Merge any content from old `workspace/` that should be preserved (if any specs need merging)
- [ ] 8.3 Update `workspace/AGENTS.md`: replace all "OpenSpec" with "PLX", `openspec` with `workspace`, `openspec` commands with `plx`
- [ ] 8.4 Rename `workspace/specs/openspec-conventions/` to `workspace/specs/plx-conventions/`
- [ ] 8.5 Update `workspace/specs/plx-conventions/spec.md`: replace OpenSpec terminology with PLX
- [ ] 8.6 Update all files in `workspace/changes/archive/*`: replace OpenSpec terminology with PLX (full rebrand)
- [ ] 8.7 Delete any remnants of old `workspace/` logs or temporary files
- [ ] 8.8 Verify directory structure is correct

## Notes

This task involves file system operations. Be careful to preserve git history where possible. The archive files need full rebrand per the constraints.
