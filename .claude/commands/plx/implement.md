---
name: Pew Pew Plx: Implement
description: Implement an approved Pew Pew Plx change and keep tasks in sync.
category: Pew Pew Plx
tags: [plx, implement]
---
<!-- PLX:START -->
**Guardrails**
- Favor straightforward, minimal implementations first and add complexity only when it is requested or clearly required.
- Keep changes tightly scoped to the requested outcome.
- Refer to `workspace/AGENTS.md` (located inside the `workspace/` directory—run `ls workspace` or `plx update` if you don't see it) if you need additional Pew Pew Plx conventions or clarifications.
- When clarification is needed, use your available question tool (if one exists) instead of asking in chat. If no question tool is available, ask in chat.

**Steps**
Track these steps as TODOs and complete them one by one.
1. Get the next task using `plx get task`:
   - Run `plx get task` to retrieve the next prioritized task (includes proposal and design context)
   - If user specified a task ID in ARGUMENTS, use `plx get task --id <task-id>` instead
2. Work through that task's Implementation Checklist, keeping edits minimal.
3. Mark items complete (`[x]`) in that task file only.
4. Reference `plx list` or `plx show <item>` when additional context is required.
5. Run implement again in a new conversation for the next task.

**Reference**
- Use `plx show <id> --json --deltas-only` if you need additional context from the proposal while implementing.
<!-- PLX:END -->
