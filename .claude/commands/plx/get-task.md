---
name: PLX: Get Task
description: Select and display the next prioritized task to work on.
category: PLX
tags: [plx, task, workflow]
---
<!-- OPENSPEC:START -->
**Guardrails**
- Complete tasks sequentially, marking each done before starting the next.
- Tasks auto-transition from to-do to in-progress when retrieved.
- Preserve existing task file content when updating status.

**Steps**
1. Run `openspec get task` to get the highest-priority task (auto-transitions to in-progress).
2. Execute the task following its Implementation Checklist.
3. Mark checklist items complete as you finish them.
4. When done, either:
   - Run `openspec complete task --id <task-id>` to mark done explicitly, OR
   - Run `openspec get task` to auto-complete (if all items checked) and get next task.
<!-- OPENSPEC:END -->
