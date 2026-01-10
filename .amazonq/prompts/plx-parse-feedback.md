---
description: Parse feedback markers and generate review tasks.
---

<arguments>$ARGUMENTS</arguments>

<arguments>$ARGUMENTS</arguments>
<!-- PLX:START -->
**Guardrails**
- Scan only tracked files.
- Generate one task per marker.
- Markers with parent linkage are grouped automatically.

**Monorepo Awareness**
- Derive target package from the user's request context (mentioned package name, file paths, or current focus).
- If target package is unclear in a monorepo, clarify with user before proceeding.
- Create artifacts in the relevant package's workspace folder (e.g., `packages/foo/workspace/`), not the monorepo root.
- For root-level changes (not package-specific), use the root workspace.
- If multiple packages are affected, process each package separately.
- Follow each package's AGENTS.md instructions if present.

**Steps**
1. Run `plx parse feedback <name> --parent-id <id> --parent-type change|spec|task` (or omit flags if markers include parent linkage: `{type}:{id} |`).
2. Review generated tasks.
3. Address feedback.
4. Archive when complete.
<!-- PLX:END -->
