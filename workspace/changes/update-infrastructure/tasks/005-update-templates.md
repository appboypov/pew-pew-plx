---
status: done
skill-level: medior
---

# Task: Update/Create Templates for All Entity Types

## End Goal

Templates exist for all entity types (task, change, spec, request) and use new CLI patterns.

## Currently

Templates in `src/core/templates/`:
- `agents-template.ts` - AGENTS.md content with old patterns
- `slash-command-templates.ts` - Slash command bodies with old patterns
- `architecture-template.ts` - ARCHITECTURE.md template
- `review-template.ts` - REVIEW.md template
- `release-template.ts` - RELEASE.md template
- `testing-template.ts` - TESTING.md template

Missing templates for:
- Task entity creation
- Change entity scaffolding
- Spec entity scaffolding
- Request entity creation

## Should

Updated templates:
- All existing templates use new CLI patterns
- New templates for `plx create` and `plx paste` commands:
  - Task template (standalone and parented variants)
  - Change template (proposal.md scaffold)
  - Spec template (spec.md scaffold)
  - Request template (request.md scaffold)

## Constraints

- [ ] Templates must match entity file format requirements
- [ ] Task template must include parent-type/parent-id frontmatter fields
- [ ] Keep existing template function signatures where possible
- [ ] Do not change TemplateManager interface

## Acceptance Criteria

- [ ] All existing templates updated with new CLI patterns
- [ ] Task template includes parent-type, parent-id, status, skill-level frontmatter
- [ ] Change template scaffolds proposal.md with standard sections
- [ ] Spec template scaffolds spec.md with Purpose and Requirements sections
- [ ] Request template scaffolds request.md with Source Input section
- [ ] Templates registered and accessible via TemplateManager

## Implementation Checklist

- [ ] 5.1 Update agents-template.ts with new CLI patterns
- [ ] 5.2 Update slash-command-templates.ts with new CLI patterns
- [ ] 5.3 Update architecture-template.ts with new directory structure
- [ ] 5.4 Update review-template.ts with new CLI patterns
- [ ] 5.5 Update release-template.ts with new CLI patterns
- [ ] 5.6 Update testing-template.ts with new CLI patterns
- [ ] 5.7 Create task-template.ts for task entity creation
- [ ] 5.8 Create change-template.ts for change proposal scaffolding
- [ ] 5.9 Create spec-template.ts for spec scaffolding
- [ ] 5.10 Create request-template.ts for request creation
- [ ] 5.11 Update index.ts to export new templates
- [ ] 5.12 Update TemplateManager with new template accessors

## Notes

Templates are used by `plx create` and `plx paste` commands. Ensure templates match the entity file formats documented in AGENTS.md.
