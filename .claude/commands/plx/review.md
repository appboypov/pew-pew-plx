---
name: Pew Pew Plx: Review
description: Review implementations against specs, changes, or tasks.
category: Pew Pew Plx
tags: [plx, review, workflow]
---
<!-- PLX:START -->
**Guardrails**
- Use CLI to retrieve review context.
- Output feedback as language-aware markers.
- Include parent linkage in markers when reviewing a task, change, or spec.

**Steps**
1. Run `plx review change --id <id>` (or spec, task with appropriate --parent-type).
2. Read the output: @REVIEW.md guidelines + parent documents.
3. Review implementation against constraints/acceptance criteria.
4. Insert feedback markers with format: `#FEEDBACK #TODO | {type}:{id} | {feedback}`
   - Examples: `task:001`, `change:my-feature`, `spec:auth-spec`
   - Parent linkage is optional but recommended.
5. Summarize findings.
6. Instruct to run `plx parse feedback <name>` (optionally with --parent-id and --parent-type for unassigned markers).
<!-- PLX:END -->
