---
name: Pew Pew Plx: Get Task
description: Select and display the next prioritized task to work on.
category: Pew Pew Plx
tags: [plx, task, workflow]
---
<!-- PLX:START -->
**Guardrails**
- Complete tasks sequentially, marking each done before starting the next.
- Tasks auto-transition from to-do to in-progress when retrieved.
- Preserve existing task file content when updating status.

**Steps**
1. Run `plx get task` to get the highest-priority task (auto-transitions to in-progress).
2. Execute the task following its Implementation Checklist.
3. When all checklist items are complete, run `plx complete task --id <task-id>` to mark the task as done.
4. **Stop and await user confirmation** before proceeding to the next task.
<!-- PLX:END -->
