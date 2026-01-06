---
status: done
skill-level: medior
---

# Task: Implement Task Archive Move

## End Goal

When a parent entity is archived, all linked tasks are moved from `workspace/tasks/` to `workspace/tasks/archive/` with filenames and frontmatter preserved.

## Currently

The archive command moves the entire change/review directory (including nested `tasks/`) to `workspace/changes/archive/` or `workspace/reviews/archive/`. Tasks are co-located with their parent.

## Should

The archive command:
- Creates `workspace/tasks/archive/` if it does not exist
- Moves each linked task from `workspace/tasks/` to `workspace/tasks/archive/`
- Preserves original filename (which includes parent-id prefix)
- Preserves all frontmatter fields
- Handles duplicate filenames by appending numeric suffix

## Constraints

- [ ] Do not delete tasks without moving them
- [ ] Do not modify task content or frontmatter during move
- [ ] Handle filesystem errors gracefully (permissions, disk space)
- [ ] Create archive directory atomically before first move

## Acceptance Criteria

- [ ] Tasks moved to `workspace/tasks/archive/` when parent archived
- [ ] Original filenames preserved (e.g., `001-add-feature-impl.md`)
- [ ] All frontmatter fields retained in archived tasks
- [ ] Duplicate filenames handled with numeric suffix
- [ ] Archive directory created if missing

## Implementation Checklist

- [ ] 2.1 Add function to create `workspace/tasks/archive/` directory
- [ ] 2.2 Implement file move logic preserving filename
- [ ] 2.3 Add duplicate filename detection and suffix logic
- [ ] 2.4 Integrate task archive move into archive command flow
- [ ] 2.5 Add error handling for filesystem operations

## Notes

Duplicate handling example: if `001-add-feature-impl.md` exists in archive, new file becomes `001-add-feature-impl-2.md`. Increment suffix until unique.
