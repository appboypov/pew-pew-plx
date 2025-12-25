---
name: PLX: Act Next
description: Select and display the next prioritized task to work on.
category: PLX
tags: [plx, task, workflow]
---
<!-- OPENSPEC:START -->
**Guardrails**
- Complete tasks sequentially, marking each done before starting the next.
- Only transition task status when explicitly using --did-complete-previous flag.
- Preserve existing task file content when updating status.

**Steps**
1. Run `openspec act next` to get the highest-priority task.
2. Execute the task following its Implementation Checklist.
3. Mark checklist items complete as you finish them.
4. When done, run `openspec act next --did-complete-previous` to transition and get next task.
<!-- OPENSPEC:END -->
