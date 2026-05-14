---
status: done
---

# Task: Update Agent Instruction Templates

## End Goal

Generated AGENTS.md files use "OpenSplx" as the product name.

## Currently

Templates generate:
- "# PLX Instructions"
- "Instructions for AI coding assistants using PLX..."
- Command descriptions like "Initialize PLX"

## Should

Templates generate "OpenSplx" in titles and descriptions while keeping `splx` for CLI command references.

## Constraints

- [ ] CLI command examples in templates stay as `splx init`, `splx list`, etc.
- [ ] File markers stay as `<!-- PLX:START -->`
- [ ] Directory references stay as `workspace/`

## Acceptance Criteria

- [ ] Generated AGENTS.md title is "# OpenSplx Instructions"
- [ ] Template descriptions reference "OpenSplx"
- [ ] Command table descriptions use "OpenSplx" for product, `splx` for commands

## Implementation Checklist

- [x] Update `src/core/templates/agents-template.ts` - title and descriptions
- [x] Update `src/core/templates/agents-root-stub.ts` - title and descriptions
- [x] Update `src/core/templates/slash-command-templates.ts` - any PLX references

## Notes

These templates affect all new and updated user projects via `splx init` and `splx update`.
