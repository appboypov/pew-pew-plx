**Context**
workspace/AGENTS.md

**Guardrails**
- Favor straightforward, minimal implementations first and add complexity only when it is requested or clearly required.
- Keep changes tightly scoped to the requested outcome.
- Refer to `workspace/AGENTS.md` (located inside the `workspace/` directory—run `ls workspace` or `splx update` if you don't see it) if you need additional OpenSplx conventions or clarifications.
- When clarification is needed, use your available question tool (if one exists) instead of asking in chat. If no question tool is available, ask in chat.
- Identify any vague or ambiguous details and gather the necessary clarifications before editing files.
- Do not write any code during the proposal stage. Only create design documents (proposal.md, task files in workspace/tasks/, design.md, and spec deltas). Implementation happens in the implement stage after approval.

**Monorepo Awareness**
- Derive target package from the user's request context (mentioned package name, file paths, or current focus).
- If target package is unclear in a monorepo, clarify with user before proceeding.
- Create artifacts in the relevant package's workspace folder (e.g., `packages/foo/workspace/`), not the monorepo root.
- For root-level changes (not package-specific), use the root workspace.
- If multiple packages are affected, process each package separately.
- Follow each package's AGENTS.md instructions if present.

**Steps**
0. Check for existing `workspace/changes/<change-id>/request.md`:
   - If found: consume it as the source of truth for user intent and skip interactive clarification.
   - If not found: proceed with gathering intent through conversation or your question tool.
1. Review `workspace/ARCHITECTURE.md`, run `splx get changes` and `splx get specs`, and inspect related code or docs (e.g., via `rg`/`ls`) to ground the proposal in current behaviour; note any gaps that require clarification.
2. Read all task templates in `workspace/templates/` to understand available task types and their structures. See `workspace/AGENTS.md` for detailed template documentation.
3. Choose a unique verb-led `change-id` and scaffold `proposal.md`, task files in `workspace/tasks/`, and `design.md` (when needed) under `workspace/changes/<id>/`.
4. Map the change into concrete capabilities or requirements, breaking multi-scope efforts into distinct spec deltas with clear relationships and sequencing.
5. Capture architectural reasoning in `design.md` when the solution spans multiple systems, introduces new patterns, or demands trade-off discussion before committing to specs.
6. Draft spec deltas in `changes/<id>/specs/<capability>/spec.md` (one folder per capability) using `## ADDED|MODIFIED|REMOVED Requirements` with at least one `#### Scenario:` per requirement and cross-reference related capabilities when relevant.
7. Create task files in `workspace/tasks/` with numbered files (minimum 3: implementation, review, test). Use format `NNN-<parent-id>-<kebab-case-name>.md` for parented tasks (e.g., `001-add-feature-implement.md`) or `NNN-<kebab-case-name>.md` for standalone tasks. Each file has: (a) frontmatter with status, skill-level, parent-type, parent-id, type, blocked-by fields (in that order); (b) body content copied from `workspace/templates/<type>.md` with all `<!-- REPLACE: ... -->` placeholders filled in with task-specific content. **You MUST use the exact structure from the matching template file, keeping all emoji headers and sections.** Use `blocked-by:` to express dependencies following recommended ordering: components → business-logic → implementation. Assign skill-level: junior (straightforward), medior (feature implementation), senior (architectural).
8. Validate with `splx validate change --id <id> --strict` and resolve every issue before sharing the proposal.

**Reference**
- Use `splx get change --id <id> --json --deltas-only` or `splx get spec --id <spec>` to inspect details when validation fails.
- Search existing requirements with `rg -n "Requirement:|Scenario:" workspace/specs` before writing new ones.
- Explore the codebase with `rg <keyword>`, `ls`, or direct file reads so proposals align with current implementation realities.
