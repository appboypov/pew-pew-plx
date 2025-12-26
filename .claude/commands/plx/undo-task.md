---
name: PLX: Undo Task
description: Revert a task to to-do status and uncheck Implementation Checklist items.
category: PLX
tags: [plx, task, undo, workflow]
---
<!-- OPENSPEC:START -->
**Usage**
```bash
openspec undo task --id <task-id>      # Revert specific task
openspec undo change --id <change-id>  # Revert all tasks in a change
```

**Behavior**
- Sets task status to 'to-do'
- Unchecks all checked Implementation Checklist items
- Leaves Constraints and Acceptance Criteria unchanged
- Already to-do tasks show a warning and exit 0

**Options**
- `--json` - Output in JSON format with uncheckedItems array
<!-- OPENSPEC:END -->
