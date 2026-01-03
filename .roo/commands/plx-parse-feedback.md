# PLX: Parse Feedback

Parse feedback markers and generate review tasks.
<!-- PLX:START -->
**Guardrails**
- Scan only tracked files.
- Generate one task per marker.
- Markers with parent linkage are grouped automatically.

**Steps**
1. Run `plx parse feedback <name>` (CLI flags --change-id, --spec-id, --task-id are optional fallbacks for unassigned markers).
2. Review generated tasks.
3. Address feedback.
4. Archive when complete.
<!-- PLX:END -->
