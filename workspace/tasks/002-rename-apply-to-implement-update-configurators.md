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

- Preserve tool-specific path patterns (some use `/splx/`, some use `-splx-`, some use `.toml`)
- Maintain consistent naming per tool conventions

## Acceptance Criteria

- [x] All 24+ configurators updated
- [x] File paths use `implement` instead of `apply`
- [x] Frontmatter references updated where applicable

## Implementation Checklist

- [x] Update `src/core/configurators/slash/amazon-q.ts` - PATHS.apply → PATHS.implement, path: `.amazonq/prompts/splx-apply.md` → `.amazonq/prompts/splx-implement.md`
- [x] Update `src/core/configurators/slash/antigravity.ts` - PATHS.apply → PATHS.implement, path: `.agent/workflows/splx-apply.md` → `.agent/workflows/splx-implement.md`
- [x] Update `src/core/configurators/slash/auggie.ts` - PATHS.apply → PATHS.implement, path: `.augment/commands/splx-apply.md` → `.augment/commands/splx-implement.md`
- [x] Update `src/core/configurators/slash/claude.ts` - PATHS.apply → PATHS.implement, path: `.claude/commands/splx/apply.md` → `.claude/commands/splx/implement.md`, frontmatter name/tags
- [x] Update `src/core/configurators/slash/cline.ts` - PATHS.apply → PATHS.implement, path: `.clinerules/workflows/splx-apply.md` → `.clinerules/workflows/splx-implement.md`
- [x] Update `src/core/configurators/slash/codebuddy.ts` - PATHS.apply → PATHS.implement, path: `.codebuddy/commands/splx/apply.md` → `.codebuddy/commands/splx/implement.md`, frontmatter
- [x] Update `src/core/configurators/slash/codex.ts` - PATHS.apply → PATHS.implement, path: `.codex/prompts/splx-apply.md` → `.codex/prompts/splx-implement.md`
- [x] Update `src/core/configurators/slash/costrict.ts` - PATHS.apply → PATHS.implement, path: `.cospec/splx/commands/splx-apply.md` → `.cospec/splx/commands/splx-implement.md`
- [x] Update `src/core/configurators/slash/crush.ts` - PATHS.apply → PATHS.implement, path: `.crush/commands/splx/apply.md` → `.crush/commands/splx/implement.md`, frontmatter
- [x] Update `src/core/configurators/slash/cursor.ts` - PATHS.apply → PATHS.implement, path: `.cursor/commands/splx-apply.md` → `.cursor/commands/splx-implement.md`, frontmatter id
- [x] Update `src/core/configurators/slash/factory.ts` - PATHS.apply → PATHS.implement, path: `.factory/commands/splx-apply.md` → `.factory/commands/splx-implement.md`
- [x] Update `src/core/configurators/slash/gemini.ts` - PATHS.apply → PATHS.implement, path: `.gemini/commands/splx/apply.toml` → `.gemini/commands/splx/implement.toml`
- [x] Update `src/core/configurators/slash/github-copilot.ts` - PATHS.apply → PATHS.implement, path: `.github/prompts/splx-apply.prompt.md` → `.github/prompts/splx-implement.prompt.md`
- [x] Update `src/core/configurators/slash/iflow.ts` - PATHS.apply → PATHS.implement, path: `.iflow/commands/splx-apply.md` → `.iflow/commands/splx-implement.md`, frontmatter id
- [x] Update `src/core/configurators/slash/kilocode.ts` - PATHS.apply → PATHS.implement, path: `.kilocode/workflows/splx-apply.md` → `.kilocode/workflows/splx-implement.md`
- [x] Update `src/core/configurators/slash/opencode.ts` - PATHS.apply → PATHS.implement, path: `.opencode/command/splx-apply.md` → `.opencode/command/splx-implement.md`
- [x] Update `src/core/configurators/slash/qoder.ts` - PATHS.apply → PATHS.implement, path: `.qoder/commands/splx/apply.md` → `.qoder/commands/splx/implement.md`, frontmatter
- [x] Update `src/core/configurators/slash/qwen.ts` - PATHS.apply → PATHS.implement, path: `.qwen/commands/splx-apply.toml` → `.qwen/commands/splx-implement.toml`
- [x] Update `src/core/configurators/slash/roocode.ts` - PATHS.apply → PATHS.implement, path: `.roo/commands/splx-apply.md` → `.roo/commands/splx-implement.md`
- [x] Update `src/core/configurators/slash/windsurf.ts` - PATHS.apply → PATHS.implement, path: `.windsurf/workflows/splx-apply.md` → `.windsurf/workflows/splx-implement.md`

## Notes

Some configurators have inline frontmatter with name, id, and tags fields that also need updating.
