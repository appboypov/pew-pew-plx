## ADDED Requirements

### Requirement: Task Type Validation

The validator SHALL check that task `type:` values match existing templates.

#### Scenario: Valid type with matching template

- **WHEN** validating a task with `type: story`
- **AND** a template with `type: story` exists (built-in or user)
- **THEN** validation passes for the type field
- **AND** no type-related warnings or errors

#### Scenario: Invalid type with no matching template

- **WHEN** validating a task with `type: nonexistent`
- **AND** no template with `type: nonexistent` exists
- **THEN** emit warning "Template not found for type 'nonexistent'"
- **AND** suggest creating a template in `workspace/templates/`
- **AND** validation passes (warning, not error)

#### Scenario: Missing type field

- **WHEN** validating a task without a `type:` field
- **THEN** emit info-level message "Task has no type specified"
- **AND** validation passes (backward compatible)

#### Scenario: Strict mode type validation

- **WHEN** validating with `--strict` flag
- **AND** task has no `type:` field or type doesn't match a template
- **THEN** treat as warning (not error) for backward compatibility
- **AND** include in validation summary

### Requirement: Blocked-By Validation

The validator SHALL check that `blocked-by:` references are valid.

#### Scenario: Valid blocked-by reference

- **WHEN** validating a task with `blocked-by: [001-setup]`
- **AND** task `001-setup.md` exists in the same change or centralized storage
- **THEN** validation passes for the blocked-by field

#### Scenario: Cross-change blocked-by reference

- **WHEN** validating a task with `blocked-by: [other-change/001-setup]`
- **AND** task `001-setup.md` exists in change `other-change`
- **THEN** validation passes for the blocked-by field

#### Scenario: Invalid blocked-by reference

- **WHEN** validating a task with `blocked-by: [nonexistent-task]`
- **AND** no task with that ID exists
- **THEN** emit warning "Blocking task 'nonexistent-task' not found"
- **AND** validation passes (warning, not error)

#### Scenario: Circular dependency detection

- **WHEN** validating tasks where task A is blocked by task B
- **AND** task B is blocked by task A
- **THEN** emit warning "Circular dependency detected: A ↔ B"
- **AND** validation passes (warning, not error)

### Requirement: Template Discovery for Validation

The validator SHALL discover available templates to validate type references.

#### Scenario: Discovering templates during validation

- **WHEN** validation runs for a change or task
- **THEN** scan `workspace/templates/` for user templates
- **AND** merge with built-in template types
- **AND** use combined list for type validation
