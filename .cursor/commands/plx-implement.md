---
name: /plx-implement
id: plx-implement
category: Pew Pew Plx
description: Implement an approved Pew Pew Plx change and keep tasks in sync.
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
   - If user specified a task ID in ARGUMENTS, use `plx get task --id <task-id>` to get that specific task and proceed to step 2
   - Otherwise, run `plx get tasks` to retrieve all tasks for the highest-priority change
2. For each task (or the single task if task ID was provided):
   a. Work through the task's Implementation Checklist, keeping edits minimal
   b. Mark checklist items complete (`[x]`) in the task file
   c. Mark the task as done with `plx complete task --id <task-id>`
3. Stop when complete:
   - If implementing a specific task ID (from step 1), stop after completing that task
   - If implementing all tasks in a change, stop after all tasks have been completed
4. Reference `plx get changes` or `plx get change --id <item>` when additional context is required.

**Reference**
- Use `plx get change --id <id> --json --deltas-only` if you need additional context from the proposal while implementing.
<!-- PLX:END -->
