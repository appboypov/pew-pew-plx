---
name: /plx-orchestrate
id: plx-orchestrate
category: Pew Pew Plx
description: Orchestrate sub-agents to complete work collaboratively.
---
<!-- PLX:START -->
**Context**
@ARCHITECTURE.md
@workspace/AGENTS.md

**Guardrails**
- Spawn exactly one sub-agent per task—never parallelize task execution.
- Review each sub-agent's work before accepting it.
- Maintain ongoing conversations with sub-agents; don't just spawn and forget.
- Act as a senior team member guiding talented colleagues.
- Enforce TracelessChanges:
  - No comments referencing removed code.
  - No "we don't do X" statements about removed features.
  - No clarifications about previous states or deprecated behavior.
- Verify scope adherence: confirm no unnecessary additions.
- Verify project convention alignment before accepting work.
- Select sub-agent model based on task skill-level:
  - junior → haiku (simple tasks)
  - medior → sonnet (moderate complexity)
  - senior → opus (architectural/complex tasks)
  - For non-Claude models, determine equivalent or use default.

**Steps**
1. Understand the work scope:
   - For changes: run `plx get tasks` to see all tasks.
   - For reviews: identify review aspects (architecture, scope, testing, etc.).
   - For other work: enumerate the discrete units of work.
2. For each unit of work:
   a. Get detailed context (`plx get task --id <id>` or equivalent).
   b. Spawn a sub-agent with clear, scoped instructions; select model based on task skill-level (junior→haiku, medior→sonnet, senior→opus).
   c. Wait for sub-agent to complete work.
3. Review sub-agent output:
   - Scope adherence: no unrequested features or changes.
   - Convention alignment: follows project patterns and standards.
   - TracelessChanges: no artifacts of prior implementation.
   - Quality: meets acceptance criteria.
4. If issues found:
   - Provide specific, actionable feedback to sub-agent.
   - Request revision with clear guidance.
   - Repeat review until satisfactory.
5. If approved:
   - For tasks: mark complete with `plx complete task --id <id>`.
   - For reviews: consolidate feedback.
   - Proceed to next unit of work.
6. Continue until all work is complete.
7. Final validation: run `plx validate` if applicable.

**Reference**
- Use `plx get change --id <change-id>` for proposal context.
- Use `plx get changes` to see all changes and progress.
- Use `plx review` for review context.
- Use `plx parse feedback` to convert review feedback to tasks.
<!-- PLX:END -->
