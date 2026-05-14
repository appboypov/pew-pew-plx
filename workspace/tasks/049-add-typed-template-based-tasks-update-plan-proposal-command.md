---
status: done
skill-level: medior
parent-type: change
parent-id: add-typed-template-based-tasks
type: implementation
blocked-by: [043-add-typed-template-based-tasks-implement-template-discovery, 048-add-typed-template-based-tasks-update-agents-documentation]
---

# Task: ⚙️ Update plan-proposal slash command to read templates

## End Goal

The `/splx:plan-proposal` command instructs agents to read all templates from `workspace/templates/` upfront before creating tasks.

## Currently

- Plan-proposal creates tasks without template awareness
- No guidance on task types or ordering
- No instruction to read templates

## Should

- Command body includes instruction to read all templates
- Guidance on selecting appropriate type for each task
- Instruction on using blocked-by for dependencies
- Reminder of recommended ordering: components → business-logic → implementation

## Constraints

- [ ] Templates are reference docs - no scaffolding/placeholder substitution
- [ ] Agent reads templates to understand types, not to copy structure
- [ ] Keep command body concise - link to AGENTS.md for details
- [ ] Existing plan-proposal behavior unchanged except for template guidance

## Acceptance Criteria

- [ ] Plan-proposal instructs agent to read workspace/templates/
- [ ] Guidance on selecting task type included
- [ ] Blocked-by dependency instruction included
- [ ] Recommended ordering referenced

## Implementation Checklist

- [x] Update plan-proposal template in `src/core/templates/slash-commands/`
- [x] Add step: "Read all templates from workspace/templates/"
- [x] Add step: "Select appropriate type for each task"
- [x] Add step: "Use blocked-by to express dependencies"
- [x] Reference AGENTS.md for detailed template documentation
- [x] Regenerate slash command files with `splx update`

## Notes

The slash command body should be updated in the template configurator that generates `.claude/commands/splx/plan-proposal.md`.
