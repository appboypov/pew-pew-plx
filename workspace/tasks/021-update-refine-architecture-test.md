---
status: done
skill-level: junior
parent-type: change
parent-id: update-refine-architecture
---

# Task: Test refine-architecture command changes

## End Goal

Verify the updated `refine-architecture` command generates correctly across all tool configurations.

## Currently

No verification that the updated templates produce correct output.

## Should

All tool-specific command files contain the new guardrails, context retrieval, steps, and template structure sections.

## Constraints

- [ ] Test must verify content in at least 3 different tool formats (claude, cursor, gemini)
- [ ] Verify PLX markers are preserved

## Acceptance Criteria

- [ ] `.claude/commands/plx/refine-architecture.md` contains "spec-ready reference" in guardrails
- [ ] `.claude/commands/plx/refine-architecture.md` contains "Context Retrieval" section
- [ ] `.claude/commands/plx/refine-architecture.md` contains 7 numbered steps
- [ ] `.claude/commands/plx/refine-architecture.md` contains "Template Structure" section
- [ ] `.cursor/commands/plx-refine-architecture.md` contains matching content
- [ ] `.gemini/commands/plx/refine-architecture.toml` contains matching content

## Implementation Checklist

- [x] 2.1 Run `plx update` to regenerate all commands
- [x] 2.2 Verify `.claude/commands/plx/refine-architecture.md` has new content
- [x] 2.3 Verify `.cursor/commands/plx-refine-architecture.md` has new content
- [x] 2.4 Verify `.gemini/commands/plx/refine-architecture.toml` has new content
- [x] 2.5 Verify PLX markers are present in all files
- [x] 2.6 Run `pnpm test` to ensure no regressions

## Notes

Check for these key strings in generated files:
- "spec-ready reference"
- "Context Retrieval"
- "mcp__auggie-mcp__codebase-retrieval"
- "Template Structure"
- "DTOs / Models / Records / Entities"
