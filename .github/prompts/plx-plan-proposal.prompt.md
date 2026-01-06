---
description: Scaffold a new PLX change and validate strictly. Consumes request.md when present.
---

$ARGUMENTS
<!-- PLX:START -->
**Context**
@ARCHITECTURE.md
@workspace/AGENTS.md

**Guardrails**
- Favor straightforward, minimal implementations first and add complexity only when it is requested or clearly required.
- Keep changes tightly scoped to the requested outcome.
- Refer to `workspace/AGENTS.md` (located inside the `workspace/` directory—run `ls workspace` or `plx update` if you don't see it) if you need additional Pew Pew Plx conventions or clarifications.
- When clarification is needed, use your available question tool (if one exists) instead of asking in chat. If no question tool is available, ask in chat.
- Identify any vague or ambiguous details and gather the necessary clarifications before editing files.
- Do not write any code during the proposal stage. Only create design documents (proposal.md, tasks/ directory, design.md, and spec deltas). Implementation happens in the implement stage after approval.

**Steps**
0. Check for existing `workspace/changes/<change-id>/request.md`:
   - If found: consume it as the source of truth for user intent and skip interactive clarification.
   - If not found: proceed with gathering intent through conversation or your question tool.
1. Review `ARCHITECTURE.md`, run `plx list` and `plx list --specs`, and inspect related code or docs (e.g., via `rg`/`ls`) to ground the proposal in current behaviour; note any gaps that require clarification.
2. Choose a unique verb-led `change-id` and scaffold `proposal.md`, `tasks/` directory, and `design.md` (when needed) under `workspace/changes/<id>/`.
3. Map the change into concrete capabilities or requirements, breaking multi-scope efforts into distinct spec deltas with clear relationships and sequencing.
4. Capture architectural reasoning in `design.md` when the solution spans multiple systems, introduces new patterns, or demands trade-off discussion before committing to specs.
5. Draft spec deltas in `changes/<id>/specs/<capability>/spec.md` (one folder per capability) using `## ADDED|MODIFIED|REMOVED Requirements` with at least one `#### Scenario:` per requirement and cross-reference related capabilities when relevant.
6. Create `tasks/` directory with numbered task files (minimum 3: implementation, review, test). Each file uses format `NNN-<name>.md` with frontmatter (status: to-do, skill-level: junior|medior|senior) and sections: End Goal, Currently, Should, Constraints, Acceptance Criteria, Implementation Checklist, Notes. Assign skill-level based on complexity: junior for straightforward changes, medior for feature implementation, senior for architectural work.
7. Validate with `plx validate <id> --strict` and resolve every issue before sharing the proposal.

**Reference**
- Use `plx show <id> --json --deltas-only` or `plx show <spec> --type spec` to inspect details when validation fails.
- Search existing requirements with `rg -n "Requirement:|Scenario:" workspace/specs` before writing new ones.
- Explore the codebase with `rg <keyword>`, `ls`, or direct file reads so proposals align with current implementation realities.
<!-- PLX:END -->
