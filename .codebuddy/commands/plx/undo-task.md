---
name: Pew Pew Plx: Undo Task
description: Revert a task to to-do.
category: Pew Pew Plx
tags: [plx, task, workflow]
---
<!-- PLX:START -->
**Steps**
1. Parse `$ARGUMENTS` to extract task-id.
2. If no task-id provided, ask user for task-id or run `plx get tasks` to list options.
3. Run `plx undo task --id <task-id>` to revert the task to to-do.
4. Confirm undo to user.
<!-- PLX:END -->
