---
status: done
parent-type: change
parent-id: add-orchestrate-command
---
# Task: Implement Orchestrate Command

## End Goal

A new `plx/orchestrate` slash command that guides AI agents through sub-agent orchestration for completing multi-task work.

## Currently

No dedicated orchestration command exists. Users add inline instructions for sub-agent orchestration.

## Should

- Add `'orchestrate'` to `PlxSlashCommandId` type
- Add guardrails and steps constants for orchestrate command
- Add entry to `plxSlashCommandBodies` record
- Update Claude configurator with path and frontmatter
- Update Cursor configurator with path and frontmatter

## Constraints

- Follow existing command pattern in `plx-slash-command-templates.ts`
- Use consistent naming conventions (camelCase for constants)
- Include TracelessChanges principles in guardrails
- Command must work for any workflow type (implementation, review, or other)

## Acceptance Criteria

- [ ] `PlxSlashCommandId` type includes `'orchestrate'`
- [ ] `orchestrateGuardrails` constant defined with sub-agent and TracelessChanges guidance
- [ ] `orchestrateSteps` constant defined with 7-step workflow
- [ ] `plxSlashCommandBodies` record includes orchestrate entry
- [ ] TypeScript compilation succeeds
- [ ] Build succeeds without errors

## Implementation Checklist

- [x] Add `'orchestrate'` to `PlxSlashCommandId` type in `src/core/templates/plx-slash-command-templates.ts`
- [x] Add `orchestrateGuardrails` constant
- [x] Add `orchestrateSteps` constant
- [x] Add entry to `plxSlashCommandBodies` record

## Notes

The guardrails should emphasize:
1. One sub-agent per task (sequential, not parallel)
2. Review before accepting
3. TracelessChanges enforcement
4. Scope adherence verification
5. Convention alignment verification
