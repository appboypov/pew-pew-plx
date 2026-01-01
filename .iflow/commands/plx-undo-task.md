---
name: /plx-undo-task
id: plx-undo-task
category: Pew Pew Plx
description: Revert a task to to-do.
---
<!-- PLX:START -->
**Steps**
1. Parse `$ARGUMENTS` to extract task-id.
2. If no task-id provided, ask user for task-id or run `plx get tasks` to list options.
3. Run `plx undo task --id <task-id>` to revert the task to to-do.
4. Confirm undo to user.
<!-- PLX:END -->
