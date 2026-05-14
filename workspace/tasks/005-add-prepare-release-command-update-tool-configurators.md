---
status: done
parent-type: change
parent-id: add-prepare-release-command
---
# Update Tool-Specific Configurators

## End Goal

All 20 tool-specific PLX configurators include FILE_PATHS and FRONTMATTER entries for prepare-release.

## Currently

- 20 configurator files exist with entries for 8 commands each
- No prepare-release entries exist

## Should

Add prepare-release entries to each configurator following their specific format:

**Standard YAML frontmatter:**
- splx-claude.ts
- splx-codebuddy.ts
- splx-crush.ts
- splx-qoder.ts

**Name/ID format:**
- splx-cursor.ts
- splx-iflow.ts

**With $ARGUMENTS placeholder:**
- splx-factory.ts
- splx-opencode.ts
- splx-codex.ts
- splx-github-copilot.ts
- splx-amazon-q.ts
- splx-auggie.ts
- splx-costrict.ts
- splx-kilocode.ts

**TOML format (description-only):**
- splx-windsurf.ts
- splx-gemini.ts
- splx-qwen.ts
- splx-antigravity.ts

**Simple markdown format:**
- splx-cline.ts
- splx-roocode.ts

## Constraints

- Must follow each tool's existing format exactly
- Description: "Prepare release by updating changelog, readme, and architecture documentation."
- Category: OpenSplx
- Tags: [splx, release, documentation]

## Acceptance Criteria

- [x] All 20 configurator files updated
- [x] Each file has FILE_PATHS entry for prepare-release
- [x] Each file has FRONTMATTER/description entry for prepare-release
- [x] TypeScript compiles without errors

## Implementation Checklist

- [x] Update splx-claude.ts
- [x] Update splx-codebuddy.ts
- [x] Update splx-crush.ts
- [x] Update splx-qoder.ts
- [x] Update splx-cursor.ts
- [x] Update splx-iflow.ts
- [x] Update splx-factory.ts
- [x] Update splx-opencode.ts
- [x] Update splx-codex.ts
- [x] Update splx-github-copilot.ts
- [x] Update splx-amazon-q.ts
- [x] Update splx-auggie.ts
- [x] Update splx-costrict.ts
- [x] Update splx-kilocode.ts
- [x] Update splx-windsurf.ts
- [x] Update splx-gemini.ts
- [x] Update splx-qwen.ts
- [x] Update splx-antigravity.ts
- [x] Update splx-cline.ts
- [x] Update splx-roocode.ts
- [x] Verify TypeScript compilation

## Notes

Location: `src/core/configurators/slash/splx-*.ts`

Reference existing entries for the exact format each tool uses.
