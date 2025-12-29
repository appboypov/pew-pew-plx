---
name: Pew Pew Plx: Complete Task
description: Mark a task as done and check all Implementation Checklist items.
category: Pew Pew Plx
tags: [plx, task, complete, workflow]
---
<!-- PLX:START -->
**Usage**
```bash
plx complete task --id <task-id>      # Complete specific task
plx complete change --id <change-id>  # Complete all tasks in a change
```

**Behavior**
- Sets task status to 'done'
- Checks all unchecked Implementation Checklist items
- Leaves Constraints and Acceptance Criteria unchanged
- Already-done tasks show a warning and exit 0

**Options**
- `--json` - Output in JSON format with completedItems array
<!-- PLX:END -->
