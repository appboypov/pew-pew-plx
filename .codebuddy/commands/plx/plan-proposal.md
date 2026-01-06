---
name: Pew Pew Plx: Plan Proposal
description: Scaffold a new Pew Pew Plx change and validate strictly. Consumes request.md when present.
category: Pew Pew Plx
tags: [plx, change]
---
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
- Do not write any code during the proposal stage. Only create design documents (proposal.md, task files in workspace/tasks/, design.md, and spec deltas). Implementation happens in the implement stage after approval.

**Steps**
0. Check for existing `workspace/changes/<change-id>/request.md`:
   - If found: consume it as the source of truth for user intent and skip interactive clarification.
   - If not found: proceed with gathering intent through conversation or your question tool.
1. Review `ARCHITECTURE.md`, run `plx get changes` and `plx get specs`, and inspect related code or docs (e.g., via `rg`/`ls`) to ground the proposal in current behaviour; note any gaps that require clarification.
2. Choose a unique verb-led `change-id` and scaffold `proposal.md`, task files in `workspace/tasks/`, and `design.md` (when needed) under `workspace/changes/<id>/`.
3. Map the change into concrete capabilities or requirements, breaking multi-scope efforts into distinct spec deltas with clear relationships and sequencing.
4. Capture architectural reasoning in `design.md` when the solution spans multiple systems, introduces new patterns, or demands trade-off discussion before committing to specs.
5. Draft spec deltas in `changes/<id>/specs/<capability>/spec.md` (one folder per capability) using `## ADDED|MODIFIED|REMOVED Requirements` with at least one `#### Scenario:` per requirement and cross-reference related capabilities when relevant.
6. Create task files in `workspace/tasks/` with numbered files (minimum 3: implementation, review, test). Use format `NNN-<parent-id>-<kebab-case-name>.md` for parented tasks (e.g., `001-add-feature-implement.md`) or `NNN-<kebab-case-name>.md` for standalone tasks. Each file includes frontmatter: status: to-do, skill-level: junior|medior|senior, parent-type: change|review|spec (for parented tasks), parent-id: <id> (for parented tasks). Include sections: End Goal, Currently, Should, Constraints, Acceptance Criteria, Implementation Checklist, Notes. Assign skill-level based on complexity: junior for straightforward changes, medior for feature implementation, senior for architectural work.
7. Validate with `plx validate change --id <id> --strict` and resolve every issue before sharing the proposal.

**Reference**
- Use `plx get change --id <id> --json --deltas-only` or `plx get spec --id <spec>` to inspect details when validation fails.
- Search existing requirements with `rg -n "Requirement:|Scenario:" workspace/specs` before writing new ones.
- Explore the codebase with `rg <keyword>`, `ls`, or direct file reads so proposals align with current implementation realities.
<!-- PLX:END -->
