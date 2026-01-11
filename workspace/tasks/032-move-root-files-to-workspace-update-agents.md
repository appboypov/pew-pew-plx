---
status: to-do
skill-level: junior
parent-type: change
parent-id: move-root-files-to-workspace
---

# Task: Update agents template ARCHITECTURE.md references

## End Goal
AGENTS.md template references `workspace/ARCHITECTURE.md` instead of `ARCHITECTURE.md`.

## Currently
`src/core/templates/agents-template.ts` contains references to `ARCHITECTURE.md` without workspace prefix in documentation text (lines 48, 76, 217, 595).

## Should
Update documentation references to indicate files are in workspace directory where appropriate.

## Constraints
- [ ] Only update references where it makes sense contextually
- [ ] Keep the directory structure example accurate

## Acceptance Criteria
- [ ] Context checklist references correct location
- [ ] Directory structure shows template files in workspace

## Implementation Checklist
- [ ] 7.1 Update directory structure example in AGENTS.md template to show ARCHITECTURE.md in workspace
- [ ] 7.2 Update context checklist references if needed
- [ ] 7.3 Review any other documentation references

## Notes
The agents-template.ts generates workspace/AGENTS.md which is the main instruction file.
