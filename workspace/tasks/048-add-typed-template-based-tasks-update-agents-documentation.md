---
status: done
skill-level: junior
parent-type: change
parent-id: add-typed-template-based-tasks
type: documentation
blocked-by: [043-add-typed-template-based-tasks-implement-template-discovery]
---

# Task: 📄 Update AGENTS.md with template system documentation

## End Goal

`workspace/AGENTS.md` documents the template system, task types, blocked-by syntax, and recommended task ordering.

## Currently

- AGENTS.md has generic task file format
- No mention of task types or templates
- No dependency/ordering guidance

## Should

- Document template location: `workspace/templates/`
- List 12 built-in template types with descriptions
- Document `type:` and `blocked-by:` frontmatter fields
- Explain recommended ordering: components → business-logic → implementation
- Show title format guidelines with emojis
- Document dynamic template creation workflow

## Constraints

- [ ] Keep documentation concise and actionable
- [ ] Include practical examples
- [ ] Update existing task file template section
- [ ] Match existing AGENTS.md style and structure

## Acceptance Criteria

- [ ] Template location and discovery documented
- [ ] All 12 built-in types listed with descriptions
- [ ] blocked-by syntax documented with examples
- [ ] Recommended task ordering explained
- [ ] Title formats with emojis documented
- [ ] Task file template updated with new fields

## Implementation Checklist

- [x] Add "Task Templates" section to AGENTS.md
- [x] Document workspace/templates/ location
- [x] List built-in types with descriptions and title formats
- [x] Add "Task Dependencies" section explaining blocked-by
- [x] Add "Recommended Task Ordering" section
- [x] Update task file template example with type and blocked-by
- [x] Document dynamic template creation workflow

## Notes

The documentation updates are in the template manager output that generates AGENTS.md content. Update `src/core/templates/template-manager.ts` to include this guidance.
