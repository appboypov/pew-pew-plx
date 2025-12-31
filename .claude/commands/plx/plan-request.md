---
name: Pew Pew Plx: Plan Request
description: Clarify user intent through iterative yes/no questions before proposal creation.
category: Pew Pew Plx
tags: [plx, change, planning]
---
<!-- PLX:START -->
**Context**
@ARCHITECTURE.md
@workspace/AGENTS.md

**Guardrails**
- Use iterative yes/no questions to clarify intent before proposal creation.
- Create request.md early and update it incrementally after each question.
- Do not write code during this stage—output is intent clarification only.
- Use your question tool to present questions (if available).
- End only when user confirms 100% intent capture.

**Steps**
1. Parse `$ARGUMENTS` to extract the source input (request, wish, idea, etc.).
2. Choose a unique verb-led `change-id` and create `workspace/changes/<id>/request.md`.
3. Populate request.md with sections: Source Input, Current Understanding, Identified Ambiguities, Decisions, Final Intent.
4. Begin AskActUpdateRepeat loop:
   - ASK: Present one high-value yes/no question using the question tool.
   - ACT: Research or validate if needed.
   - UPDATE: Record decision in request.md Decisions section.
   - REPEAT: Continue until no ambiguities remain.
5. When user confirms intent is 100% captured, populate Final Intent section.
6. Direct user to run `plx/plan-proposal <change-id>` to create the formal proposal.

**Reference**
- Run `plx/plan-proposal <change-id>` after this command to scaffold the proposal.
- The plan-proposal command auto-detects and consumes request.md when present.
<!-- PLX:END -->
