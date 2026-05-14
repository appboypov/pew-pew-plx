---
name: Prepare Compact
description: Preserve session progress for context continuity.
category: OpenSplx
tags: [splx, context, session]
---
<!-- PLX:START -->
**Guardrails**
- Save ALL modified files before preparing session summary.
- Include enough detail that a new agent can continue without user re-explanation.
- Document current state, decisions, and context clearly.

**Steps**
1. Save all files you have modified during this session.
2. Prepare a session summary with these sections: Current Task, Status, Completed Steps, Remaining Steps, Key Decisions Made, Files Modified, Files Created, Open Questions/Blockers, Context for Next Agent, Related Resources.
3. Output the summary to chat or save to a temporary location for handoff.
4. Confirm to user that progress has been saved and they can start a new session.
<!-- PLX:END -->
