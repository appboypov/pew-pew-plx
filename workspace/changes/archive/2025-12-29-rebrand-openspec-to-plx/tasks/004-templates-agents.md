---
status: done
---

# Task: Update templates and agent instructions

## End Goal

All templates generate PLX-branded content. Agent instructions reference PLX terminology and workspace directory.

## Currently

- `src/core/templates/agents-template.ts`: "# OpenSpec Instructions"
- `src/core/templates/agents-root-stub.ts`: "# OpenSpec Instructions"
- `src/core/templates/slash-command-templates.ts`: references `openspec/AGENTS.md`, `openspec` commands
- `src/core/templates/splx-slash-command-templates.ts`: references `openspec` commands

## Should

- `src/core/templates/agents-template.ts`: "# PLX Instructions"
- `src/core/templates/agents-root-stub.ts`: "# PLX Instructions"
- All templates reference `workspace/AGENTS.md`, `splx` commands
- All templates use `<!-- PLX:START -->` and `<!-- PLX:END -->` markers

## Constraints

- [x] All templates must use PLX terminology
- [x] Directory references must use "workspace" instead of "openspec"
- [x] Command references must use "splx" instead of "openspec"

## Acceptance Criteria

- [x] Running `splx init` generates files with PLX branding
- [x] Generated AGENTS.md uses PLX terminology
- [x] Generated slash commands use PLX terminology

## Implementation Checklist

- [x] 4.1 Update `src/core/templates/agents-template.ts`: replace all "OpenSpec" with "PLX", "openspec" with "workspace"
- [x] 4.2 Update `src/core/templates/agents-root-stub.ts`: replace all "OpenSpec" with "PLX", "openspec" with "workspace"
- [x] 4.3 Update `src/core/templates/slash-command-templates.ts`: replace "openspec" commands with "splx", directory references
- [x] 4.4 Update `src/core/templates/splx-slash-command-templates.ts`: replace any remaining "openspec" references
- [x] 4.5 Update `src/core/templates/claude-template.ts`: verify PLX branding (re-exports from agents-root-stub)
- [x] 4.6 Search all template files for remaining "openspec" and update

## Notes

Templates are the source of generated files, so getting these right is critical for the user experience.
