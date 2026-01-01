---
description: Review implementations against specs, changes, or tasks.
auto_execution_mode: 3
---
<!-- PLX:START -->
**Guardrails**
- Use CLI to retrieve review context.
- Output feedback as language-aware markers.
- Include parent linkage in markers when reviewing a task, change, or spec.

**Steps**
1. Run `plx review --change-id <id>` (or --spec-id, --task-id).
2. Read the output: @REVIEW.md guidelines + parent documents.
3. Review implementation against constraints/acceptance criteria.
4. Insert feedback markers with format: `#FEEDBACK #TODO | {type}:{id} | {feedback}`
   - Examples: `task:001`, `change:my-feature`, `spec:auth-spec`
   - Parent linkage is optional but recommended.
5. Summarize findings.
6. Instruct to run `plx parse feedback <name>` (optionally with --change-id, --spec-id, or --task-id for unassigned markers).
<!-- PLX:END -->
