---
name: Undo Task
description: Revert a task to to-do.
category: OpenSplx
tags: [splx, task, workflow]
---
<!-- PLX:START -->
**Steps**
1. Parse `$ARGUMENTS` to extract task-id.
2. If no task-id provided, ask user for task-id or run `splx get tasks` to list options.
3. Run `splx undo task --id <task-id>` to revert the task to to-do.
4. Confirm undo to user.
<!-- PLX:END -->
