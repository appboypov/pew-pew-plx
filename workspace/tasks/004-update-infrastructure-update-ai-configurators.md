---
status: done
skill-level: senior
parent-type: change
parent-id: update-infrastructure
---
# Task: Update All AI Tool Configurators for New CLI Patterns

## End Goal

All 20+ AI tool configurators generate instructions and slash commands using the new standardized CLI patterns.

## Currently

Configurators in `src/core/configurators/`:
- Generate instructions referencing `plx list`, `plx show`
- Generate slash commands with old flag patterns
- Reference nested task storage paths

Slash configurators in `src/core/configurators/slash/`:
- Generate tool-specific slash commands with old patterns
- Use template bodies that reference deprecated commands

## Should

Configurators:
- Generate instructions referencing `plx get changes`, `plx get change --id <id>`
- Generate slash commands with `--id`, `--parent-id`, `--parent-type` patterns
- Reference centralized `workspace/tasks/` storage

## Constraints

- [ ] Update only command patterns and references
- [ ] Maintain existing tool-specific formatting
- [ ] Keep configurator registry structure unchanged
- [ ] Do not add new configurators

## Acceptance Criteria

- [ ] All configurators in `src/core/configurators/` use new CLI patterns
- [ ] All slash configurators in `src/core/configurators/slash/` use new CLI patterns
- [ ] `plx init` generates correct instructions for all supported tools
- [ ] No deprecated command references in generated output

## Implementation Checklist

- [x] 4.1 Update base.ts configurator base class if needed
- [x] 4.2 Update agents.ts (AGENTS.md template references)
- [x] 4.3 Update claude.ts configurator
- [x] 4.4 Update cline.ts configurator
- [x] 4.5 Update codebuddy.ts configurator
- [x] 4.6 Update costrict.ts configurator
- [x] 4.7 Update iflow.ts configurator
- [x] 4.8 Update qoder.ts configurator
- [x] 4.9 Update qwen.ts configurator
- [x] 4.10 Update registry.ts if pattern changes needed
- [x] 4.11 Update slash/base.ts slash command base
- [x] 4.12 Update slash/amazon-q.ts
- [x] 4.13 Update slash/antigravity.ts
- [x] 4.14 Update slash/auggie.ts
- [x] 4.15 Update slash/claude.ts
- [x] 4.16 Update slash/cline.ts
- [x] 4.17 Update slash/codebuddy.ts
- [x] 4.18 Update slash/codex.ts
- [x] 4.19 Update slash/costrict.ts
- [x] 4.20 Update slash/crush.ts
- [x] 4.21 Update slash/cursor.ts
- [x] 4.22 Update slash/factory.ts
- [x] 4.23 Update slash/gemini.ts
- [x] 4.24 Update slash/github-copilot.ts
- [x] 4.25 Update slash/iflow.ts
- [x] 4.26 Update slash/kilocode.ts
- [x] 4.27 Update slash/opencode.ts
- [x] 4.28 Update slash/qoder.ts
- [x] 4.29 Update slash/qwen.ts
- [x] 4.30 Update slash/roocode.ts
- [x] 4.31 Update slash/windsurf.ts
- [x] 4.32 Update slash/registry.ts if needed

## Notes

This is a large task touching many files. Consider splitting work by configurator category (main vs slash) if needed. Test with `plx init --tools claude` to verify output.
