---
name: Pew Pew Plx: Complete Task
description: Mark a task as done.
category: Pew Pew Plx
tags: [plx, task, workflow]
---
<!-- PLX:START -->
**Steps**
1. Parse `$ARGUMENTS` to extract task-id.
2. If no task-id provided, ask user for task-id or run `plx get tasks` to list options.
3. Run `plx complete task --id <task-id>` to mark the task as done.
4. Confirm completion to user.
<!-- PLX:END -->
