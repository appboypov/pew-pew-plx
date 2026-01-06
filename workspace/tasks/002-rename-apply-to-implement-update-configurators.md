---
status: done
parent-type: change
parent-id: rename-apply-to-implement
---
# Update Tool Configurators

## End Goal

All tool configurators in `src/core/configurators/slash/` use `implement` file paths instead of `apply`.

## Currently

Each tool configurator defines a `PATHS` object with `apply: '<path>'` entries pointing to tool-specific file locations.

## Should

- All `PATHS.apply` entries renamed to `PATHS.implement`
- All file paths changed from `*apply*` to `*implement*`
- Frontmatter in configurators updated (name, id, tags)

## Constraints

- Preserve tool-specific path patterns (some use `/plx/`, some use `-plx-`, some use `.toml`)
- Maintain consistent naming per tool conventions

## Acceptance Criteria

- [x] All 24+ configurators updated
- [x] File paths use `implement` instead of `apply`
- [x] Frontmatter references updated where applicable

## Implementation Checklist

- [x] Update `src/core/configurators/slash/amazon-q.ts` - PATHS.apply → PATHS.implement, path: `.amazonq/prompts/plx-apply.md` → `.amazonq/prompts/plx-implement.md`
- [x] Update `src/core/configurators/slash/antigravity.ts` - PATHS.apply → PATHS.implement, path: `.agent/workflows/plx-apply.md` → `.agent/workflows/plx-implement.md`
- [x] Update `src/core/configurators/slash/auggie.ts` - PATHS.apply → PATHS.implement, path: `.augment/commands/plx-apply.md` → `.augment/commands/plx-implement.md`
- [x] Update `src/core/configurators/slash/claude.ts` - PATHS.apply → PATHS.implement, path: `.claude/commands/plx/apply.md` → `.claude/commands/plx/implement.md`, frontmatter name/tags
- [x] Update `src/core/configurators/slash/cline.ts` - PATHS.apply → PATHS.implement, path: `.clinerules/workflows/plx-apply.md` → `.clinerules/workflows/plx-implement.md`
- [x] Update `src/core/configurators/slash/codebuddy.ts` - PATHS.apply → PATHS.implement, path: `.codebuddy/commands/plx/apply.md` → `.codebuddy/commands/plx/implement.md`, frontmatter
- [x] Update `src/core/configurators/slash/codex.ts` - PATHS.apply → PATHS.implement, path: `.codex/prompts/plx-apply.md` → `.codex/prompts/plx-implement.md`
- [x] Update `src/core/configurators/slash/costrict.ts` - PATHS.apply → PATHS.implement, path: `.cospec/plx/commands/plx-apply.md` → `.cospec/plx/commands/plx-implement.md`
- [x] Update `src/core/configurators/slash/crush.ts` - PATHS.apply → PATHS.implement, path: `.crush/commands/plx/apply.md` → `.crush/commands/plx/implement.md`, frontmatter
- [x] Update `src/core/configurators/slash/cursor.ts` - PATHS.apply → PATHS.implement, path: `.cursor/commands/plx-apply.md` → `.cursor/commands/plx-implement.md`, frontmatter id
- [x] Update `src/core/configurators/slash/factory.ts` - PATHS.apply → PATHS.implement, path: `.factory/commands/plx-apply.md` → `.factory/commands/plx-implement.md`
- [x] Update `src/core/configurators/slash/gemini.ts` - PATHS.apply → PATHS.implement, path: `.gemini/commands/plx/apply.toml` → `.gemini/commands/plx/implement.toml`
- [x] Update `src/core/configurators/slash/github-copilot.ts` - PATHS.apply → PATHS.implement, path: `.github/prompts/plx-apply.prompt.md` → `.github/prompts/plx-implement.prompt.md`
- [x] Update `src/core/configurators/slash/iflow.ts` - PATHS.apply → PATHS.implement, path: `.iflow/commands/plx-apply.md` → `.iflow/commands/plx-implement.md`, frontmatter id
- [x] Update `src/core/configurators/slash/kilocode.ts` - PATHS.apply → PATHS.implement, path: `.kilocode/workflows/plx-apply.md` → `.kilocode/workflows/plx-implement.md`
- [x] Update `src/core/configurators/slash/opencode.ts` - PATHS.apply → PATHS.implement, path: `.opencode/command/plx-apply.md` → `.opencode/command/plx-implement.md`
- [x] Update `src/core/configurators/slash/qoder.ts` - PATHS.apply → PATHS.implement, path: `.qoder/commands/plx/apply.md` → `.qoder/commands/plx/implement.md`, frontmatter
- [x] Update `src/core/configurators/slash/qwen.ts` - PATHS.apply → PATHS.implement, path: `.qwen/commands/plx-apply.toml` → `.qwen/commands/plx-implement.toml`
- [x] Update `src/core/configurators/slash/roocode.ts` - PATHS.apply → PATHS.implement, path: `.roo/commands/plx-apply.md` → `.roo/commands/plx-implement.md`
- [x] Update `src/core/configurators/slash/windsurf.ts` - PATHS.apply → PATHS.implement, path: `.windsurf/workflows/plx-apply.md` → `.windsurf/workflows/plx-implement.md`

## Notes

Some configurators have inline frontmatter with name, id, and tags fields that also need updating.
