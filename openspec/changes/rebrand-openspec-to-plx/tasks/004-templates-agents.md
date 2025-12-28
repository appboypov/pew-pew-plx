---
status: to-do
---

# Task: Update templates and agent instructions

## End Goal

All templates generate PLX-branded content. Agent instructions reference PLX terminology and workspace directory.

## Currently

- `src/core/templates/agents-template.ts`: "# OpenSpec Instructions"
- `src/core/templates/agents-root-stub.ts`: "# OpenSpec Instructions"
- `src/core/templates/slash-command-templates.ts`: references `openspec/AGENTS.md`, `openspec` commands
- `src/core/templates/plx-slash-command-templates.ts`: references `openspec` commands

## Should

- `src/core/templates/agents-template.ts`: "# PLX Instructions"
- `src/core/templates/agents-root-stub.ts`: "# PLX Instructions"
- All templates reference `workspace/AGENTS.md`, `plx` commands
- All templates use `<!-- PLX:START -->` and `<!-- PLX:END -->` markers

## Constraints

- [ ] All templates must use PLX terminology
- [ ] Directory references must use "workspace" instead of "openspec"
- [ ] Command references must use "plx" instead of "openspec"

## Acceptance Criteria

- [ ] Running `plx init` generates files with PLX branding
- [ ] Generated AGENTS.md uses PLX terminology
- [ ] Generated slash commands use PLX terminology

## Implementation Checklist

- [ ] 4.1 Update `src/core/templates/agents-template.ts`: replace all "OpenSpec" with "PLX", "openspec" with "workspace"
- [ ] 4.2 Update `src/core/templates/agents-root-stub.ts`: replace all "OpenSpec" with "PLX", "openspec" with "workspace"
- [ ] 4.3 Update `src/core/templates/slash-command-templates.ts`: replace "openspec" commands with "plx", directory references
- [ ] 4.4 Update `src/core/templates/plx-slash-command-templates.ts`: replace any remaining "openspec" references
- [ ] 4.5 Update `src/core/templates/claude-template.ts`: verify PLX branding (re-exports from agents-root-stub)
- [ ] 4.6 Search all template files for remaining "openspec" and update

## Notes

Templates are the source of generated files, so getting these right is critical for the user experience.
