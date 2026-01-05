---
status: done
skill-level: medior
---

# Task: Update Slash Command Templates

## End Goal

The plx/orchestrate and plx/plan-proposal slash commands include skill-level guidance for model selection and auto-assignment.

## Currently

- plx/orchestrate does not mention model selection based on task complexity
- plx/plan-proposal does not instruct to assign skill levels to tasks

## Should

- plx/orchestrate includes model selection guidance based on skill-level
- plx/plan-proposal includes instruction to auto-assign skill levels
- Both include the Claude model mapping and non-Claude fallback guidance

## Constraints

- [ ] Model selection only applies when spawning sub-agents
- [ ] Skill level assignment is heuristic-based, not mandatory
- [ ] Keep instructions concise and actionable

## Acceptance Criteria

- [ ] Orchestrate command includes model selection step
- [ ] Plan-proposal command includes skill level assignment step
- [ ] Model mapping documented in orchestrate guardrails
- [ ] Assignment heuristics documented in plan-proposal steps

## Implementation Checklist

- [x] Update `orchestrateGuardrails` in `src/core/templates/slash-command-templates.ts`
  - Add model selection guidance for sub-agent spawning
  - Include Claude mapping: junior→haiku, medior→sonnet, senior→opus
- [x] Update `orchestrateSteps` to include model selection in step 2b
- [x] Update `proposalSteps` (step 6) to mention skill-level assignment
- [x] Add skill level assignment heuristics to plan-proposal

## Notes

The orchestrate command spawns sub-agents, so model selection guidance belongs there. Plan-proposal creates tasks, so assignment heuristics belong there.
