---
name: Pew Pew Plx: Prepare Compact
description: Preserve session progress in PROGRESS.md for context continuity.
category: Pew Pew Plx
tags: [plx, context, session]
---
<!-- PLX:START -->
**Guardrails**
- Save ALL modified files before creating PROGRESS.md.
- Create PROGRESS.md in the project root directory.
- Include enough detail that a new agent can continue without user re-explanation.
- Add PROGRESS.md to .gitignore if not already present.
- Update existing PROGRESS.md if one already exists (don't create duplicates).

**Steps**
1. Save all files you have modified during this session.
2. Create or update `PROGRESS.md` in the project root with these sections: Current Task, Status, Completed Steps, Remaining Steps, Key Decisions Made, Files Modified, Files Created, Open Questions/Blockers, Context for Next Agent, Related Resources.
3. Check if `.gitignore` contains `PROGRESS.md`; if not present, add it on a new line.
4. Confirm to user that progress has been saved and they can start a new session.
<!-- PLX:END -->
