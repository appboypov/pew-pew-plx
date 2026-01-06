---
name: /plx-parse-feedback
id: plx-parse-feedback
category: Pew Pew Plx
description: Parse feedback markers and generate review tasks.
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
