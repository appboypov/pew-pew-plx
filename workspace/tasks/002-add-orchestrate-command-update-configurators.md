---
status: done
parent-type: change
parent-id: add-orchestrate-command
---
# Task: Update Configurators

## End Goal

Claude and Cursor configurators updated to generate the orchestrate command file.

## Currently

Configurators generate 8 PLX slash commands. Orchestrate command not included.

## Should

- Add orchestrate path mapping to Claude configurator
- Add orchestrate frontmatter to Claude configurator
- Add orchestrate path mapping to Cursor configurator
- Add orchestrate frontmatter to Cursor configurator

## Constraints

- Follow existing patterns in configurator files
- Use consistent path naming conventions
- Maintain alphabetical ordering where applicable

## Acceptance Criteria

- [ ] `PlxClaudeSlashCommandConfigurator.FILE_PATHS` includes orchestrate mapping
- [ ] `PlxClaudeSlashCommandConfigurator.FRONTMATTER` includes orchestrate entry
- [ ] `PlxCursorSlashCommandConfigurator.FILE_PATHS` includes orchestrate mapping
- [ ] `PlxCursorSlashCommandConfigurator.FRONTMATTER` includes orchestrate entry
- [ ] `plx update .` generates orchestrate command files

## Implementation Checklist

- [x] Update `src/core/configurators/slash/plx-claude.ts` FILE_PATHS
- [x] Update `src/core/configurators/slash/plx-claude.ts` FRONTMATTER
- [x] Update `src/core/configurators/slash/plx-cursor.ts` FILE_PATHS
- [x] Update `src/core/configurators/slash/plx-cursor.ts` FRONTMATTER
- [x] Update all other configurators (required for TypeScript compilation)

## Notes

Frontmatter should include:
- name: "Pew Pew Plx: Orchestrate"
- description: "Orchestrate sub-agents to complete work collaboratively"
- category: "Pew Pew Plx"
- tags: [plx, orchestrate, sub-agents]
