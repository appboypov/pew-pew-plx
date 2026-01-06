---
status: done
skill-level: junior
parent-type: change
parent-id: add-task-skill-level
---
# Task: Update AGENTS.md Template

## End Goal

The workspace/AGENTS.md template includes skill-level in the task file example and provides model mapping guidance.

## Currently

The task template in agents-template.ts shows frontmatter with only `status: to-do`. No skill-level documentation exists.

## Should

- Task template example includes `skill-level: junior|medior|senior` in frontmatter showing choices
- Documentation explains valid values (junior, medior, senior)
- Model mapping guidance: junior→haiku, medior→sonnet, senior→opus
- Skill level assignment heuristics provided

## Constraints

- [ ] Keep documentation concise and actionable
- [ ] Template shows all choices, not a pre-selected value
- [ ] Non-Claude model guidance is clear (agent determines equivalent)

## Acceptance Criteria

- [ ] Task template shows skill-level field in frontmatter
- [ ] Valid values documented with clear descriptions
- [ ] Model mapping table included
- [ ] Assignment heuristics provided for each level

## Implementation Checklist

- [x] Update task template example in `src/core/templates/agents-template.ts`
- [x] Add skill-level to frontmatter example: `skill-level: junior|medior|senior`
- [x] Add skill level section after task file template explaining:
  - Valid values and their meanings
  - Model mapping for Claude (haiku/sonnet/opus)
  - Non-Claude model guidance
  - Assignment heuristics

## Notes

Add the documentation near the task file template section for proximity.
