---
status: done
skill-level: senior
---

# Task: Implement Task Storage Structure

## End Goal
Define the new centralized task storage location, filename parsing, and frontmatter schema.

## Currently
- Tasks are stored in `workspace/changes/<name>/tasks/` and `workspace/reviews/<name>/tasks/`
- Task filenames follow pattern `NNN-<name>.md`
- Frontmatter contains `status` and optional `skill-level`

## Should
- Tasks are stored in `workspace/tasks/`
- Task filenames follow pattern:
  - Parented: `NNN-<parent-id>-<name>.md`
  - Standalone: `NNN-<name>.md`
- Frontmatter contains:
  - `status: to-do|in-progress|done`
  - `skill-level: junior|medior|senior` (optional)
  - `parent-type: change|review|spec` (required for parented tasks)
  - `parent-id: <id>` (required for parented tasks)
- Archive location: `workspace/tasks/archive/`

## Constraints
- [ ] Filename format must support per-parent numbering (001 per parent, not global)
- [ ] Frontmatter schema must be backward-compatible (status and skill-level unchanged)
- [ ] Parent-type must be one of: change, review, spec
- [ ] Standalone tasks must work without parent fields

## Acceptance Criteria
- [ ] New task filename parser handles both parented and standalone formats
- [ ] Frontmatter schema validates parent-type and parent-id together (both or neither)
- [ ] Zod schema updated for task frontmatter validation
- [ ] Constants defined for new paths and patterns

## Implementation Checklist
- [x] 1.1 Define constants in `src/core/config.ts`:
  - TASKS_DIR_NAME = 'tasks'
  - TASKS_ARCHIVE_DIR_NAME = 'archive'
  - PARENT_TYPES = ['change', 'review', 'spec']
- [x] 1.2 Create `src/utils/task-filename-parser.ts`:
  - `parseTaskFilename(filename)` returns { sequence, parentId?, name }
  - `buildTaskFilename({ sequence, parentId?, name })` returns filename
  - `isParentedTask(filename)` returns boolean
- [x] 1.3 Update `src/core/schemas/task-schema.ts`:
  - Add `parentType` field (optional, enum)
  - Add `parentId` field (optional, string)
  - Add refinement: both present or both absent
- [x] 1.4 Update `src/services/task-id.ts`:
  - Update `parseTaskId` to handle new format
  - Update `normalizeTaskId` for new patterns
- [x] 1.5 Add unit tests for filename parsing and schema validation

## Notes
This task establishes the foundation. Subsequent tasks update discovery and retrieval logic.
