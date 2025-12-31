---
status: done
---

# Task: Update documentation

## End Goal
Documentation reflects the new `plan-request` and `plan-proposal` commands.

## Currently
- AGENTS.md references `/proposal` command
- agents-template.ts generates references to proposal

## Should
- AGENTS.md updated with plan-request and plan-proposal commands
- agents-template.ts generates correct references
- CLAUDE.md updated if it references proposal

## Constraints
- [ ] Keep documentation concise
- [ ] Follow existing documentation style

## Acceptance Criteria
- [ ] `workspace/AGENTS.md` references plan-request and plan-proposal
- [ ] `agents-template.ts` generates correct command references
- [ ] No stale proposal references in documentation

## Implementation Checklist
- [x] 5.1 Update `workspace/AGENTS.md` to reference `plx/plan-request`
- [x] 5.2 Update `workspace/AGENTS.md` to reference `plx/plan-proposal`
- [x] 5.3 Update `src/core/templates/agents-template.ts` command list
- [x] 5.4 Search for remaining `proposal` references in documentation: `rg proposal workspace/*.md`
- [x] 5.5 Update CLAUDE.md if needed
- [x] 5.6 Run `plx validate --all` to verify documentation consistency

## Notes
- The AGENTS.md file uses PLX markers, so content within markers may be auto-updated
