# Task: Add missing task directory documentation

## End Goal

AGENTS.md contains the task file template section, minimum 3 files guideline, and numbering convention documentation that was specified in the design.md but never added.

## Currently

The design.md (from PLX-9 migration) specified these additions but they were never implemented:
- "Document minimum 3 files: implementation, review, test"
- "Task File Template (new section)" with End Goal, Currently, Should, etc.
- "Explain sequential numbering convention (001-, 002-, etc.)"

## Should

AI agents reading the instructions know:
1. To create minimum 3 task files (implementation tasks + review + test)
2. The exact template structure for each task file
3. The naming convention with 3-digit prefix (001-, 002-, etc.)

## Constraints

- Follow the exact template structure from design.md
- Place new sections in appropriate locations within existing document structure

## Acceptance Criteria

- [ ] Minimum 3 files guideline is documented
- [ ] Task file template with all sections is documented
- [ ] Numbering convention (001-, 002-, etc.) is explained
- [ ] Template and AGENTS.md are both updated

## Implementation Checklist

- [x] 2.1 Add task creation guidelines section with minimum 3 files requirement
- [x] 2.2 Add task file template section with: End Goal, Currently, Should, Constraints, Acceptance Criteria, Implementation Checklist, Notes
- [x] 2.3 Document that Constraints and Acceptance Criteria checkboxes are ignored in progress counting
- [x] 2.4 Document numbering convention (NNN-kebab-case-name.md)
- [x] 2.5 Update agents-template.ts with same additions
- [x] 2.6 Run `plx update` to regenerate AGENTS.md from template

## Notes

- Reference design.md lines 48-89 for exact template structure
- Reference design.md line 28 for minimum files guideline
