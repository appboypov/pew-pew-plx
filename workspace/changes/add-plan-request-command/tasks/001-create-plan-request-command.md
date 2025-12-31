---
status: done
---

# Task: Create plx/plan-request.md command

## End Goal
A new `plx/plan-request` slash command exists in `.claude/commands/plx/` that clarifies user intent through iterative yes/no questions.

## Currently
No `plan-request` command exists. Intent clarification happens ad-hoc during proposal creation.

## Should
- `.claude/commands/plx/plan-request.md` exists with Activity XML template structure
- Command uses Intent Analyst role with AskActUpdateRepeat loop
- Command creates `workspace/changes/{change-id}/request.md` early and updates incrementally
- Command ends when user confirms 100% intent capture

## Constraints
- [ ] Follow Activity XML template pattern from `/clarify-intent` command
- [ ] Use SimpleQuestions format with yes/no options
- [ ] Include PLX markers (`<!-- PLX:START -->` / `<!-- PLX:END -->`)
- [ ] Include standard PLX guardrails (no code, gather clarifications, refer to AGENTS.md)

## Acceptance Criteria
- [ ] Command file exists at `.claude/commands/plx/plan-request.md`
- [ ] Frontmatter includes name, description, category, and tags
- [ ] Activity XML template includes Intent Analyst role
- [ ] AskActUpdateRepeat behavioral instruction is present
- [ ] SimpleQuestions format is documented
- [ ] Workflow creates request.md with required sections

## Implementation Checklist
- [x] 1.1 Create `.claude/commands/plx/plan-request.md` file
- [x] 1.2 Add frontmatter with name "Pew Pew Plx: Plan Request"
- [x] 1.3 Add Activity XML template with Intent Analyst role
- [x] 1.4 Add EndGoal with AcceptanceCriteria and Constraints
- [x] 1.5 Add BehavioralInstructions (AskActUpdateRepeat, SimpleQuestions, BrutalHonesty, NoAmbiguity)
- [x] 1.6 Add Workflow steps (Receive, Scaffold, Analyze, Refine, Confirm, Complete)
- [x] 1.7 Wrap in PLX markers

## Notes
- Reference the existing `/clarify-intent` command for Activity XML structure
- The request.md sections should be: Source Input, Current Understanding, Identified Ambiguities, Decisions, Final Intent
