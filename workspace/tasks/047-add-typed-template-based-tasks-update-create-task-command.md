---
status: done
skill-level: junior
parent-type: change
parent-id: add-typed-template-based-tasks
type: implementation
blocked-by: [044-add-typed-template-based-tasks-update-task-frontmatter-parsing]
---

# Task: 🔧 Update create task command with type and blocked-by parameters

## End Goal

`splx create task` command supports `--type` and `--blocked-by` parameters for setting task metadata.

## Currently

- `splx create task "Title" --parent-id <id> --parent-type <type>`
- No way to specify task type
- No way to specify blocked-by dependencies

## Should

- New `--type <type>` parameter to set task type
- New `--blocked-by <ids>` parameter to set dependencies (comma-separated)
- Parameters written to task frontmatter
- Validation that type exists (if provided)

## Constraints

- [ ] Both parameters are optional
- [ ] Type validated against available templates if provided
- [ ] Blocked-by accepts comma-separated list: `--blocked-by 043-task,044-task`
- [ ] Error if type doesn't match any template

## Acceptance Criteria

- [ ] `splx create task "Title" --type implementation` creates task with type
- [ ] `splx create task "Title" --blocked-by 043-task,044-task` creates task with blockers
- [ ] Invalid type produces clear error with available types
- [ ] Both parameters work together

## Implementation Checklist

- [x] Add `--type` option to create task command in `src/commands/create.ts`
- [x] Add `--blocked-by` option accepting comma-separated IDs
- [x] Update task creation to include new frontmatter fields
- [x] Add type validation using template discovery
- [x] Update help text with new parameters
- [x] Add tests for new parameters

## Notes

Usage examples:
```bash
splx create task "Auth service" --parent-id my-change --parent-type change --type business-logic
splx create task "Wire components" --type implementation --blocked-by 043-components,044-services
```
