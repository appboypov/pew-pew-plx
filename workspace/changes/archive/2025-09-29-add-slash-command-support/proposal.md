# Add Slash Command Support for Coding Agents

## Summary
- Enable PLX to generate and update custom slash commands for supported coding agents (Claude Code and Cursor).
- Provide three slash commands aligned with PLX's workflow: proposal (start a change proposal), apply (implement), and archive.
- Share slash command templating between agents to make future extensions simple.

## Motivation
Developers use different coding agents and editors. Having consistent slash commands across tools for the PLX workflow reduces friction and ensures a standard way to trigger the workflow. Supporting both Claude Code and Cursor now lays a foundation for future agents that introduce slash command features.

## Proposal
1. During `plx init`, when a user selects a supported tool, generate slash command configuration for three PLX workflow stages:
   - Claude (namespaced): `/workspace/proposal`, `/workspace/apply`, `/workspace/archive`.
   - Cursor (flat, prefixed): `/plx-proposal`, `/plx-apply`, `/plx-archive`.
   - Semantics:
     - Create – scaffold a change (ID, `proposal.md`, `tasks.md`, delta specs); validate strictly.
     - Apply – implement an approved change; complete tasks; validate strictly.
     - Archive – archive after deployment; update specs if needed.
   - Each command file MUST embed concise, step-by-step instructions sourced from `workspace/README.md` (see Template Content section).
2. Store slash command files per tool:
   - Claude Code: `.claude/commands/workspace/{proposal,apply,archive}.md`
   - Cursor: `.cursor/commands/{plx-proposal,plx-apply,plx-archive}.md`
   - Ensure nested directories are created.
3. Command file format and metadata:
   - Use Markdown with optional YAML frontmatter for tool metadata (name/title, description, category/tags) when supported by the tool.
   - Place PLX markers around the body only, never inside frontmatter.
   - Keep the visible slash name, file name, and any frontmatter `name`/`id` consistently aligned (e.g., `proposal`, `plx-proposal`).
   - Namespacing: categorize these under “PLX” and prefer unique IDs (e.g., `plx-proposal`) to avoid collisions.
4. Centralize templates: define command bodies once and reuse across tools; apply minimal per-tool wrappers (frontmatter, categories, filenames).
5. During `plx update`, refresh only existing slash command files (per-file basis) within markers; do not create missing files or new tools.

## Design Ideas
- Introduce `SlashCommandConfigurator` to manage multiple files per tool.
  - Expose targets rather than a single `configFileName` (e.g., `getTargets(): Array<{ path: string; kind: 'slash'; id: string }>`).
  - Provide `generateAll(projectPath, workspaceDir)` for init and `updateExisting(projectPath, workspaceDir)` for update.
- Per-tool adapters add only frontmatter and pathing; bodies come from shared templates.
- Templates live in `TemplateManager` with helpers that extract concise, authoritative snippets from `workspace/README.md`.
- Update flow logs per-file results so users see exactly which slash files were refreshed.

### Marker Placement
- Markers MUST wrap only the Markdown body contents:
  - Frontmatter (if present) goes first.
  - Then `<!-- PLX:START -->` … body … `<!-- PLX:END -->`.
  - Avoid inserting markers into the YAML block to prevent parse errors.

### Idempotency and Creation Rules
- `init`: create all three files for the chosen tool(s) once; subsequent `init` runs are no-ops for existing files.
- `update`: refresh only files that exist; skip missing ones without creating new files.
- Directory creation for `.claude/commands/workspace/` and `.cursor/commands/` is the configurator’s responsibility.

### Command Naming & UX
- Claude Code: use namespacing in the slash itself for readability and grouping: `/workspace/proposal`, `/workspace/apply`, `/workspace/archive`.
- Cursor: use flat names with an `plx-` prefix: `/plx-proposal`, `/plx-apply`, `/plx-archive`. Group via `category: PLX` when supported.
- Consistency: align file names, visible slash names, and any frontmatter `id` (e.g., `id: plx-apply`).
- Migration: do not rename existing commands during `update`; apply new naming only on `init` (or via an explicit migrate step).

## Open Questions
- Validate exact metadata/frontmatter supported by each tool version; if unsupported, omit frontmatter and ship Markdown body only.
- Confirm the final Cursor command file location for the targeted versions; fall back to Markdown-only if Cursor does not parse frontmatter.
- Evaluate additional commands beyond the initial three (e.g., `/show-change`, `/validate-all`) based on user demand.

## Alternatives
- Hard-code slash command text per tool (rejected: duplicates content; increases maintenance).
- Delay Cursor support until its config stabilizes (partial accept): gate Cursor behind a feature flag until verified in real environments.

## Risks
- Tool configuration formats may change, requiring updates to wrappers/frontmatter.
- Incorrect paths or categories can hide commands; add path existence checks and clear logging.
- Marker misuse (inside frontmatter) can break parsing; enforce placement rules in tests.

## Future Work
- Support additional editors/agents that expose slash command APIs.
- Allow users to customize command names and categories during `plx init`.
- Provide a dedicated command to regenerate slash commands without running full `update`.

## File Format Examples
The following examples illustrate expected structure. If a tool does not support frontmatter, omit the YAML block and keep only the markers + body.

### Claude Code: `.claude/commands/workspace/proposal.md`
```markdown
---
name: PLX: Proposal
description: Scaffold a new PLX change and validate strictly.
category: PLX
tags: [plx, change]
---
<!-- PLX:START -->
...command body from shared template...
<!-- PLX:END -->
```

Slash invocation: `/workspace/proposal` (namespaced)

### Cursor: `.cursor/commands/plx-proposal.md`
```markdown
---
name: /plx-proposal
id: plx-proposal
category: PLX
description: Scaffold a new PLX change and validate strictly.
---
<!-- PLX:START -->
...command body from shared template...
<!-- PLX:END -->
```

Slash invocation: `/plx-proposal` (flat, prefixed)

## Template Content
Templates should be brief, actionable, and sourced from `workspace/README.md` to avoid duplication. Each command body includes:
- Guardrails: ask as many as necessary clarifying questions if needed; follow minimal-complexity rules; use `pnpm` for Node projects.
- Step list tailored to the workflow stage (proposal, apply, archive), including strict validation commands.
- Pointers to `plx show`, `plx list`, and troubleshooting tips when validation fails.

## Testing Strategy
- Golden snapshots for generated files per tool (frontmatter + markers + body).
- Partial presence tests: if 1–2 files exist, `update` only refreshes those and does not create missing ones.
- Marker placement tests: ensure markers never appear inside frontmatter; cover missing/duplicated marker recovery behavior.
- Logging tests: `update` reports per-file updates for slash commands.
