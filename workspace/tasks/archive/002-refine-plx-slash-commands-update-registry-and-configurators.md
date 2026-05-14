---
status: done
parent-type: change
parent-id: refine-splx-slash-commands
---
# Update Registry and Configurators

## End Goal
The command registry and all 19 tool configurators are updated to reflect the new command set.

## Currently
- `ALL_PLX_COMMANDS` includes `init-architecture` and `update-architecture`
- No `refine-release` in any configurator
- 19 tool configurators have entries for deprecated commands

## Should
- `ALL_PLX_COMMANDS` excludes deprecated commands, includes `refine-release`
- All 19 tool configurators updated consistently

## Constraints
- [x] Maintain consistency across all configurators
- [x] Follow existing naming patterns for each tool
- [x] TypeScript must compile without errors

## Acceptance Criteria
- [x] `ALL_PLX_COMMANDS` has 8 entries
- [x] All 20 configurators have matching `FILE_PATHS` entries
- [x] All 20 configurators have matching `FRONTMATTER`/`DESCRIPTIONS` entries
- [x] `npx tsc --noEmit` passes

## Implementation Checklist
- [x] Update `splx-base.ts`: Remove `init-architecture`, `update-architecture` from `ALL_PLX_COMMANDS`
- [x] Update `splx-base.ts`: Add `refine-release` to `ALL_PLX_COMMANDS`
- [x] Update `splx-claude.ts`: Remove deprecated, add `refine-release` to FILE_PATHS and FRONTMATTER
- [x] Update `splx-cursor.ts`: Remove deprecated, add `refine-release` to FILE_PATHS and FRONTMATTER
- [x] Update `splx-factory.ts`: Remove deprecated, add `refine-release` to FILE_PATHS and FRONTMATTER
- [x] Update `splx-codebuddy.ts`: Remove deprecated, add `refine-release` to FILE_PATHS and FRONTMATTER
- [x] Update `splx-qoder.ts`: Remove deprecated, add `refine-release` to FILE_PATHS and FRONTMATTER
- [x] Update `splx-windsurf.ts`: Remove deprecated, add `refine-release` to FILE_PATHS and DESCRIPTIONS
- [x] Update `splx-kilocode.ts`: Remove deprecated, add `refine-release` to FILE_PATHS
- [x] Update `splx-opencode.ts`: Remove deprecated, add `refine-release` to FILE_PATHS and FRONTMATTER
- [x] Update `splx-codex.ts`: Remove deprecated, add `refine-release` to FILE_PATHS and FRONTMATTER
- [x] Update `splx-github-copilot.ts`: Remove deprecated, add `refine-release` to FILE_PATHS and FRONTMATTER
- [x] Update `splx-amazon-q.ts`: Remove deprecated, add `refine-release` to FILE_PATHS and FRONTMATTER
- [x] Update `splx-auggie.ts`: Remove deprecated, add `refine-release` to FILE_PATHS and FRONTMATTER
- [x] Update `splx-cline.ts`: Remove deprecated, add `refine-release` to FILE_PATHS and FRONTMATTER
- [x] Update `splx-crush.ts`: Remove deprecated, add `refine-release` to FILE_PATHS and FRONTMATTER
- [x] Update `splx-costrict.ts`: Remove deprecated, add `refine-release` to FILE_PATHS and FRONTMATTER
- [x] Update `splx-qwen.ts`: Remove deprecated, add `refine-release` to FILE_PATHS and DESCRIPTIONS
- [x] Update `splx-roocode.ts`: Remove deprecated, add `refine-release` to FILE_PATHS and FRONTMATTER
- [x] Update `splx-antigravity.ts`: Remove deprecated, add `refine-release` to FILE_PATHS and DESCRIPTIONS
- [x] Update `splx-iflow.ts`: Remove deprecated, add `refine-release` to FILE_PATHS and FRONTMATTER
- [x] Update `splx-gemini.ts`: Remove deprecated, add `refine-release` to FILE_PATHS and DESCRIPTIONS
- [x] Run `npx tsc --noEmit` to verify

## Notes
- Files in: `src/core/configurators/slash/`
- Total: 20 files (1 base + 19 tools)
- Some tools use `DESCRIPTIONS` instead of `FRONTMATTER` (windsurf, qwen)
- KiloCode has no frontmatter
