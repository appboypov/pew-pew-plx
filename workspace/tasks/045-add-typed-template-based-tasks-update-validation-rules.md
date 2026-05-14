---
status: done
skill-level: medior
parent-type: change
parent-id: add-typed-template-based-tasks
type: implementation
blocked-by: [043-add-typed-template-based-tasks-implement-template-discovery, 044-add-typed-template-based-tasks-update-task-frontmatter-parsing]
---

# Task: ⚙️ Update validation rules for task type checking

## End Goal

Validation system checks that task `type` field (if present) matches an available template, and warns when type is missing.

## Currently

- Validation does not check task type field
- No integration with template discovery
- No warnings for missing type metadata

## Should

- Validation rule: if `type` is specified, it must match an available template (built-in or user)
- Validation warning: if `type` is missing, emit advisory warning (not error)
- `--strict` mode treats missing type as warning (not error)
- Error message lists available types when type doesn't match

## Constraints

- [ ] Missing type = warning only, not validation error
- [ ] Unknown type (doesn't match template) = validation error
- [ ] Error messages are actionable (list available types)
- [ ] Validation uses template discovery service

## Acceptance Criteria

- [ ] Tasks without type pass validation with warning
- [ ] Tasks with valid type pass validation
- [ ] Tasks with unknown type fail validation with helpful error
- [ ] Error message lists available template types
- [ ] `--strict` mode shows type warnings

## Implementation Checklist

- [x] Import template discovery service into validator
- [x] Add validation rule for type field in `src/core/validation/`
- [x] Implement type-exists check against available templates
- [x] Add warning for missing type field
- [x] Update validation error messages to list available types
- [x] Add unit tests for type validation

## Notes

Validation flow:
1. If `type` is undefined → emit warning "Task has no type specified"
2. If `type` is defined → check against `getAvailableTypes()`
3. If type not found → error "Unknown task type 'foo'. Available types: story, bug, ..."
