---
status: done
skill-level: medior
---

# Task: Integrate shared templates from create command

## End Goal

The paste command uses the same entity templates as the `plx create` command to ensure consistent file structures.

## Currently

The `plx paste request` command writes raw clipboard content without templating. The new subcommands need structured templates.

## Should

- Import entity templates from `TemplateManager` (or new template location)
- Task template includes: frontmatter, End Goal, Currently, Should, Constraints, Acceptance Criteria, Implementation Checklist, Notes
- Change template includes: proposal.md with Why, What Changes, Impact sections
- Spec template includes: spec.md with Requirements section and Scenario placeholder
- Templates accept content parameter to inject clipboard content into appropriate section

## Constraints

- [ ] Templates MUST match output of `plx create` command (when available)
- [ ] If `add-create-command` is not complete, create minimal templates that can be updated later
- [ ] Templates exported from a shared location in `src/core/templates/`
- [ ] Follow existing template patterns (string interpolation, not complex templating)

## Acceptance Criteria

- [ ] Task template produces valid task file with all required sections
- [ ] Change template produces valid proposal.md with scaffolded sections
- [ ] Spec template produces valid spec.md with requirement placeholder
- [ ] Clipboard content correctly inserted into designated section
- [ ] Templates match `plx create` output structure

## Implementation Checklist

- [x] 5.1 Create `entity-templates.ts` in `src/core/templates/` (or extend existing)
- [x] 5.2 Implement `getTaskTemplate(options)` function
- [x] 5.3 Implement `getChangeProposalTemplate(options)` function
- [x] 5.4 Implement `getSpecTemplate(options)` function
- [x] 5.5 Export templates from `src/core/templates/index.ts`
- [x] 5.6 Update paste subcommands to use shared templates
- [x] 5.7 Add template options interface for content injection

## Notes

The template system should be designed for reuse by both `plx create` and `plx paste` commands. Template functions accept an options object with content to inject.
