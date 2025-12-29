---
name: Pew Pew Plx: Parse Feedback
description: Parse feedback markers and generate review tasks.
category: Pew Pew Plx
tags: [plx, review, workflow]
---
<!-- PLX:START -->
**Guardrails**
- Scan only tracked files.
- Generate one task per marker.
- Require parent linkage.

**Steps**
1. Run `plx parse feedback <name> --change-id <id>`.
2. Review generated tasks.
3. Address feedback.
4. Archive when complete.
<!-- PLX:END -->
