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
1. Determine the scope:
   - If user specified a task ID in ARGUMENTS, use `plx get task --id <task-id>` to get that specific task and skip to step 2
   - Otherwise, run `plx get task` to retrieve the next prioritized task and note its change ID
2. Work through the task's Implementation Checklist, keeping edits minimal.
3. Mark checklist items complete (`[x]`) in the task file.
4. Mark the task as done with `plx complete task --id <task-id>`.
5. If implementing a specific task ID (from step 1), stop here.
6. Run `plx get task` to get the next task:
   - If from the same change, repeat from step 2
   - If from a different change or no tasks remain, stop
7. Reference `plx list` or `plx show <item>` when additional context is required.

**Reference**
- Use `plx show <id> --json --deltas-only` if you need additional context from the proposal while implementing.
<!-- PLX:END -->
