---
status: done
---

# Task: Update Agent Instruction Templates

## End Goal

Generated AGENTS.md files use "Pew Pew Plx" as the product name.

## Currently

Templates generate:
- "# PLX Instructions"
- "Instructions for AI coding assistants using PLX..."
- Command descriptions like "Initialize PLX"

## Should

Templates generate "Pew Pew Plx" in titles and descriptions while keeping `plx` for CLI command references.

## Constraints

- [ ] CLI command examples in templates stay as `plx init`, `plx list`, etc.
- [ ] File markers stay as `<!-- PLX:START -->`
- [ ] Directory references stay as `workspace/`

## Acceptance Criteria

- [ ] Generated AGENTS.md title is "# Pew Pew Plx Instructions"
- [ ] Template descriptions reference "Pew Pew Plx"
- [ ] Command table descriptions use "Pew Pew Plx" for product, `plx` for commands

## Implementation Checklist

- [x] Update `src/core/templates/agents-template.ts` - title and descriptions
- [x] Update `src/core/templates/agents-root-stub.ts` - title and descriptions
- [x] Update `src/core/templates/slash-command-templates.ts` - any PLX references

## Notes

These templates affect all new and updated user projects via `plx init` and `plx update`.
