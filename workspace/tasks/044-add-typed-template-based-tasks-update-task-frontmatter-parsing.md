---
status: done
skill-level: medior
parent-type: change
parent-id: add-typed-template-based-tasks
type: implementation
blocked-by: [043-add-typed-template-based-tasks-implement-template-discovery]
---

# Task: ⚙️ Update task frontmatter parsing for type and blocked-by

## End Goal

Task frontmatter parsing supports new optional `type` and `blocked-by` fields, with proper type definitions and extraction logic.

## Currently

- Task frontmatter parsing handles: status, skill-level, parent-type, parent-id
- No support for type or blocked-by fields
- Existing parsing in `src/utils/task-*.ts` files

## Should

- Task frontmatter schema extended with:
  - `type?: string` - Optional task type referencing a template
  - `blocked-by?: string[]` - Optional array of blocking task IDs
- Parsing extracts these fields from task files
- Type definitions updated in relevant interfaces

## Constraints

- [ ] Both fields are optional - existing tasks remain valid
- [ ] `blocked-by` accepts array format: `blocked-by: [001-task, other-change/002-task]`
- [ ] Maintain backward compatibility with existing frontmatter
- [ ] Cross-change dependencies use format: `change-id/task-id`

## Acceptance Criteria

- [ ] Task files with `type:` field are parsed correctly
- [ ] Task files with `blocked-by:` field are parsed correctly
- [ ] Task files without these fields remain valid (undefined values)
- [ ] Cross-change dependency format is supported

## Implementation Checklist

- [x] Update task frontmatter Zod schema in `src/core/schemas/`
- [x] Update task interfaces to include `type` and `blockedBy` fields
- [x] Update task parsing logic in `src/utils/task-file-parser.ts`
- [x] Update any task-related type definitions
- [x] Add unit tests for new frontmatter fields

## Notes

The `blocked-by` field uses array syntax in YAML:
```yaml
blocked-by:
  - 043-implement-template-discovery
  - other-change/001-setup
```
Or inline: `blocked-by: [043-task, 044-task]`
