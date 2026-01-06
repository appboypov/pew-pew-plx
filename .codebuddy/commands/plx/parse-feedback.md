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
- Markers with parent linkage are grouped automatically.

**Steps**
1. Run `plx parse feedback <name> --parent-id <id> --parent-type change|spec|task` (or omit flags if markers include parent linkage: `{type}:{id} |`).
2. Review generated tasks.
3. Address feedback.
4. Archive when complete.
<!-- PLX:END -->
