---
status: done
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
- plx-claude.ts
- plx-codebuddy.ts
- plx-crush.ts
- plx-qoder.ts

**Name/ID format:**
- plx-cursor.ts
- plx-iflow.ts

**With $ARGUMENTS placeholder:**
- plx-factory.ts
- plx-opencode.ts
- plx-codex.ts
- plx-github-copilot.ts
- plx-amazon-q.ts
- plx-auggie.ts
- plx-costrict.ts
- plx-kilocode.ts

**TOML format (description-only):**
- plx-windsurf.ts
- plx-gemini.ts
- plx-qwen.ts
- plx-antigravity.ts

**Simple markdown format:**
- plx-cline.ts
- plx-roocode.ts

## Constraints

- Must follow each tool's existing format exactly
- Description: "Prepare release by updating changelog, readme, and architecture documentation."
- Category: Pew Pew Plx
- Tags: [plx, release, documentation]

## Acceptance Criteria

- [x] All 20 configurator files updated
- [x] Each file has FILE_PATHS entry for prepare-release
- [x] Each file has FRONTMATTER/description entry for prepare-release
- [x] TypeScript compiles without errors

## Implementation Checklist

- [x] Update plx-claude.ts
- [x] Update plx-codebuddy.ts
- [x] Update plx-crush.ts
- [x] Update plx-qoder.ts
- [x] Update plx-cursor.ts
- [x] Update plx-iflow.ts
- [x] Update plx-factory.ts
- [x] Update plx-opencode.ts
- [x] Update plx-codex.ts
- [x] Update plx-github-copilot.ts
- [x] Update plx-amazon-q.ts
- [x] Update plx-auggie.ts
- [x] Update plx-costrict.ts
- [x] Update plx-kilocode.ts
- [x] Update plx-windsurf.ts
- [x] Update plx-gemini.ts
- [x] Update plx-qwen.ts
- [x] Update plx-antigravity.ts
- [x] Update plx-cline.ts
- [x] Update plx-roocode.ts
- [x] Verify TypeScript compilation

## Notes

Location: `src/core/configurators/slash/plx-*.ts`

Reference existing entries for the exact format each tool uses.
