---
status: done
skill-level: medior
parent-type: change
parent-id: add-task-skill-level
---
# Task: Add Validation Warning for Missing Skill Level

## End Goal

Validation in strict mode warns when tasks are missing the skill-level field.

## Currently

Validation does not check for skill-level field in task frontmatter.

## Should

- `plx validate <change-id> --strict` emits WARNING for tasks missing skill-level
- Non-strict mode does not emit this warning
- Invalid skill-level values (not junior/medior/senior) also emit WARNING

## Constraints

- [ ] Must be a WARNING, not an ERROR (validation still passes)
- [ ] Only applies in strict mode
- [ ] Warning message indicates which task is affected

## Acceptance Criteria

- [ ] Strict validation warns about missing skill-level
- [ ] Strict validation warns about invalid skill-level values
- [ ] Non-strict validation ignores skill-level entirely
- [ ] Warning message is clear and actionable

## Implementation Checklist

- [x] Add task validation method to `src/core/validation/validator.ts`
- [x] Add skill-level validation in `validateChange()` or new method
- [x] Check for valid skill-level values (junior, medior, senior)
- [x] Emit WARNING level issue for missing or invalid values
- [x] Only emit in strict mode (check `this.strictMode`)
- [x] Add validation message constant to `src/core/validation/constants.ts`

## Notes

Consider scanning tasks directory similar to how delta specs are validated.
