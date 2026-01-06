---
status: done
skill-level: medior
---

# Task: Update ARCHITECTURE.md with New Structure and Patterns

## End Goal

ARCHITECTURE.md accurately documents the new directory structure, CLI command patterns, and centralized task storage.

## Currently

ARCHITECTURE.md documents:
- Nested task storage in `changes/<name>/tasks/` and `reviews/<name>/tasks/`
- Old CLI command patterns (`plx list`, `plx show`, etc.)
- Entity-specific flag patterns
- Old command flow diagrams

## Should

ARCHITECTURE.md documents:
- Centralized task storage in `workspace/tasks/` and `workspace/tasks/archive/`
- New CLI command patterns (`plx get changes`, `plx get change --id <id>`, etc.)
- Standardized `--id`, `--parent-id`, `--parent-type` patterns
- Updated command flow diagrams
- New `plx create` and `plx paste` commands
- `plx migrate tasks` command
- Updated data structures for task parent linking

## Constraints

- [ ] Maintain existing document structure and sections
- [ ] Update only sections affected by CLI changes
- [ ] Keep technology stack and dependencies sections unchanged
- [ ] Do not add sections for unimplemented features

## Acceptance Criteria

- [ ] Project Structure section shows centralized tasks folder
- [ ] CLI command tables use new patterns exclusively
- [ ] Task Management System section documents parent linking
- [ ] Data Flow sections show updated command flows
- [ ] All example commands use new patterns
- [ ] No deprecated commands referenced

## Implementation Checklist

- [ ] 6.1 Update Project Structure diagram with workspace/tasks/
- [ ] 6.2 Update Command Pattern section with new verb/entity pattern
- [ ] 6.3 Update Service Layer section (ItemRetrievalService changes)
- [ ] 6.4 Update Data Flow section command examples
- [ ] 6.5 Update Task File Structure section for centralized storage
- [ ] 6.6 Update Task Status section with parent linking
- [ ] 6.7 Update Change Prioritization section if affected
- [ ] 6.8 Update Get Command Flow diagrams
- [ ] 6.9 Update Complete and Undo Commands section
- [ ] 6.10 Update Review System section with new command patterns
- [ ] 6.11 Update Fork-Specific Features section command list
- [ ] 6.12 Add documentation for plx create command
- [ ] 6.13 Add documentation for plx paste extensions
- [ ] 6.14 Add documentation for plx migrate tasks command
- [ ] 6.15 Update all inline command examples throughout document

## Notes

ARCHITECTURE.md is the primary technical reference. Ensure all code references match the actual implementation after proposals 1-7 are complete.
