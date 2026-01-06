---
name: /plx-refine-architecture
id: plx-refine-architecture
category: Pew Pew Plx
description: Create or update ARCHITECTURE.md.
---
<!-- PLX:START -->
**Guardrails**
- Reference @ARCHITECTURE.md template structure.
- Focus on practical documentation.
- Preserve user content.

**Monorepo Awareness**
- Derive target package from the user's request context (mentioned package name, file paths, or current focus).
- If target package is unclear in a monorepo, clarify with user before proceeding.
- Create artifacts in the relevant package's workspace folder (e.g., `packages/foo/workspace/`), not the monorepo root.
- For root-level changes (not package-specific), use the root workspace.
- If multiple packages are affected, process each package separately.
- Follow each package's AGENTS.md instructions if present.

**Steps**
1. Check if @ARCHITECTURE.md exists.
2. If not: create from template.
3. If exists: read and update.
<!-- PLX:END -->
