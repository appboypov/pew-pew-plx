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
- Require parent linkage.

**Steps**
1. Run `plx parse feedback <name> --change-id <id>`.
2. Review generated tasks.
3. Address feedback.
4. Archive when complete.
<!-- PLX:END -->
