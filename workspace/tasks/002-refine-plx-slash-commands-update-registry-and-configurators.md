---
status: done
parent-type: change
parent-id: refine-plx-slash-commands
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
- [x] Update `plx-base.ts`: Remove `init-architecture`, `update-architecture` from `ALL_PLX_COMMANDS`
- [x] Update `plx-base.ts`: Add `refine-release` to `ALL_PLX_COMMANDS`
- [x] Update `plx-claude.ts`: Remove deprecated, add `refine-release` to FILE_PATHS and FRONTMATTER
- [x] Update `plx-cursor.ts`: Remove deprecated, add `refine-release` to FILE_PATHS and FRONTMATTER
- [x] Update `plx-factory.ts`: Remove deprecated, add `refine-release` to FILE_PATHS and FRONTMATTER
- [x] Update `plx-codebuddy.ts`: Remove deprecated, add `refine-release` to FILE_PATHS and FRONTMATTER
- [x] Update `plx-qoder.ts`: Remove deprecated, add `refine-release` to FILE_PATHS and FRONTMATTER
- [x] Update `plx-windsurf.ts`: Remove deprecated, add `refine-release` to FILE_PATHS and DESCRIPTIONS
- [x] Update `plx-kilocode.ts`: Remove deprecated, add `refine-release` to FILE_PATHS
- [x] Update `plx-opencode.ts`: Remove deprecated, add `refine-release` to FILE_PATHS and FRONTMATTER
- [x] Update `plx-codex.ts`: Remove deprecated, add `refine-release` to FILE_PATHS and FRONTMATTER
- [x] Update `plx-github-copilot.ts`: Remove deprecated, add `refine-release` to FILE_PATHS and FRONTMATTER
- [x] Update `plx-amazon-q.ts`: Remove deprecated, add `refine-release` to FILE_PATHS and FRONTMATTER
- [x] Update `plx-auggie.ts`: Remove deprecated, add `refine-release` to FILE_PATHS and FRONTMATTER
- [x] Update `plx-cline.ts`: Remove deprecated, add `refine-release` to FILE_PATHS and FRONTMATTER
- [x] Update `plx-crush.ts`: Remove deprecated, add `refine-release` to FILE_PATHS and FRONTMATTER
- [x] Update `plx-costrict.ts`: Remove deprecated, add `refine-release` to FILE_PATHS and FRONTMATTER
- [x] Update `plx-qwen.ts`: Remove deprecated, add `refine-release` to FILE_PATHS and DESCRIPTIONS
- [x] Update `plx-roocode.ts`: Remove deprecated, add `refine-release` to FILE_PATHS and FRONTMATTER
- [x] Update `plx-antigravity.ts`: Remove deprecated, add `refine-release` to FILE_PATHS and DESCRIPTIONS
- [x] Update `plx-iflow.ts`: Remove deprecated, add `refine-release` to FILE_PATHS and FRONTMATTER
- [x] Update `plx-gemini.ts`: Remove deprecated, add `refine-release` to FILE_PATHS and DESCRIPTIONS
- [x] Run `npx tsc --noEmit` to verify

## Notes
- Files in: `src/core/configurators/slash/`
- Total: 20 files (1 base + 19 tools)
- Some tools use `DESCRIPTIONS` instead of `FRONTMATTER` (windsurf, qwen)
- KiloCode has no frontmatter
