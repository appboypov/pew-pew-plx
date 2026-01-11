---
status: done
skill-level: junior
parent-type: change
parent-id: add-create-command
---
# Task: Create entity templates for task, change, spec, and request

## End Goal

Template files exist in `src/core/templates/` that generate scaffolding content for each entity type, exported via `TemplateManager`.

## Currently

Templates exist for agents, architecture, review, release, testing, and slash commands. No templates exist for task, change, spec, or request entities.

## Should

- `src/core/templates/task-template.ts` exports function generating task file content
- `src/core/templates/change-template.ts` exports function generating proposal.md content
- `src/core/templates/spec-template.ts` exports function generating spec.md content
- `src/core/templates/request-template.ts` exports function generating request.md content
- `src/core/templates/index.ts` exports template functions via `TemplateManager`

## Constraints

- [ ] Follow existing template patterns (`architecture-template.ts`, `review-template.ts`)
- [ ] Templates return string content, not file objects
- [ ] Accept context parameters for dynamic content (title, name, description)
- [ ] Include all required sections as defined in spec

## Acceptance Criteria

- [ ] Task template includes all standard sections (End Goal, Currently, Should, Constraints, Acceptance Criteria, Implementation Checklist, Notes)
- [ ] Task template frontmatter defaults to `status: to-do`
- [ ] Change template includes Why, What Changes, Impact sections
- [ ] Spec template includes Purpose, Requirements, Why sections
- [ ] Request template includes all plan-request sections (Source Input, Current Understanding, Identified Ambiguities, Decisions, Final Intent)
- [ ] All templates exported via TemplateManager

## Implementation Checklist

- [x] 1.1 Create `src/core/templates/task-template.ts` with `taskTemplate(title: string)` function
- [x] 1.2 Create `src/core/templates/change-template.ts` with `changeTemplate(name: string)` function
- [x] 1.3 Create `src/core/templates/spec-template.ts` with `specTemplate(name: string)` function
- [x] 1.4 Create `src/core/templates/request-template.ts` with `requestTemplate(description: string)` function
- [x] 1.5 Update `src/core/templates/index.ts` to import and export via TemplateManager
- [x] 1.6 Add `getTaskTemplate`, `getChangeTemplate`, `getSpecTemplate`, `getRequestTemplate` static methods

## Notes

- Reference existing templates for code style and patterns
- Templates should generate placeholder content that guides users to fill in details
