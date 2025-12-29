---
name: /plx-review
id: plx-review
category: PLX
description: Review implementations against specs, changes, or tasks.
---
<!-- PLX:START -->
**Guardrails**
- Use CLI to retrieve review context.
- Output feedback as language-aware markers.
- For spec-impacting feedback, include spec reference.

**Steps**
1. Run `plx review --change-id <id>` (or --spec-id, --task-id).
2. Read the output: REVIEW.md guidelines + parent documents.
3. Review implementation against constraints/acceptance criteria.
4. Insert feedback markers in relevant code.
5. Summarize findings.
6. Instruct to run `plx parse feedback <name> --change-id <id>`.
<!-- PLX:END -->
