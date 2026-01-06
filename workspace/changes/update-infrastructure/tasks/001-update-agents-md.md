---
status: done
skill-level: medior
---

# Task: Update workspace/AGENTS.md with New CLI Patterns

## End Goal

The `workspace/AGENTS.md` file reflects the new standardized CLI patterns (`plx {verb} {entity} --id/--parent-id`) and centralized task storage structure.

## Currently

AGENTS.md documents:
- `plx list`, `plx list --specs` for listing
- `plx show` for displaying items
- Nested task storage in `changes/<name>/tasks/`
- Entity-specific flags like `--change-id`, `--spec-id`, `--task-id`
- Current CLI command table with old patterns

## Should

AGENTS.md documents:
- `plx get changes`, `plx get specs`, `plx get reviews` for listing
- `plx get change --id <id>`, `plx get spec --id <id>` for display (no `plx show`)
- Centralized task storage in `workspace/tasks/`
- Standardized `--id` and `--parent-id`/`--parent-type` flags
- Updated CLI command table with new patterns
- Updated directory structure showing `workspace/tasks/` and `workspace/tasks/archive/`
- Task filename format: `NNN-<parent-id>-<name>.md` for parented, `NNN-<name>.md` for standalone
- Frontmatter fields: `parent-type`, `parent-id`

## Constraints

- [ ] Preserve all content outside PLX markers
- [ ] Maintain the same document structure and flow
- [ ] Keep all existing non-CLI guidance intact
- [ ] Do not introduce new features beyond documentation updates

## Acceptance Criteria

- [ ] CLI Commands section uses new patterns exclusively
- [ ] Command Flags section reflects `--id`, `--parent-id`, `--parent-type`
- [ ] Directory Structure section shows centralized task storage
- [ ] Task File Template section shows new frontmatter fields
- [ ] No references to deprecated commands (`plx list`, `plx show`, `plx change`, `plx spec`)
- [ ] `plx validate update-infrastructure --strict` passes for this file

## Implementation Checklist

- [ ] 1.1 Update TL;DR Quick Checklist section
- [ ] 1.2 Update Stage 2: Implementing Changes workflow steps
- [ ] 1.3 Update CLI Commands section with new verb/entity patterns
- [ ] 1.4 Update Command Flags section
- [ ] 1.5 Update Directory Structure section with centralized tasks
- [ ] 1.6 Update Task Directory Structure requirement with new location
- [ ] 1.7 Update Task File Template with parent-type/parent-id frontmatter
- [ ] 1.8 Update Happy Path Script with new commands
- [ ] 1.9 Update Multi-Capability Example directory tree
- [ ] 1.10 Update Quick Reference section CLI Essentials
- [ ] 1.11 Update Search Guidance section with new list commands
- [ ] 1.12 Update all inline examples using old commands

## Notes

This is the primary agent instruction file and must be updated before other documentation. Changes here propagate to the managed content block used by `plx update`.
