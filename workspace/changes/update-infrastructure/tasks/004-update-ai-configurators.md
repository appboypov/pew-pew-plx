---
status: done
skill-level: senior
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

- [ ] 4.1 Update base.ts configurator base class if needed
- [ ] 4.2 Update agents.ts (AGENTS.md template references)
- [ ] 4.3 Update claude.ts configurator
- [ ] 4.4 Update cline.ts configurator
- [ ] 4.5 Update codebuddy.ts configurator
- [ ] 4.6 Update costrict.ts configurator
- [ ] 4.7 Update iflow.ts configurator
- [ ] 4.8 Update qoder.ts configurator
- [ ] 4.9 Update qwen.ts configurator
- [ ] 4.10 Update registry.ts if pattern changes needed
- [ ] 4.11 Update slash/base.ts slash command base
- [ ] 4.12 Update slash/amazon-q.ts
- [ ] 4.13 Update slash/antigravity.ts
- [ ] 4.14 Update slash/auggie.ts
- [ ] 4.15 Update slash/claude.ts
- [ ] 4.16 Update slash/cline.ts
- [ ] 4.17 Update slash/codebuddy.ts
- [ ] 4.18 Update slash/codex.ts
- [ ] 4.19 Update slash/costrict.ts
- [ ] 4.20 Update slash/crush.ts
- [ ] 4.21 Update slash/cursor.ts
- [ ] 4.22 Update slash/factory.ts
- [ ] 4.23 Update slash/gemini.ts
- [ ] 4.24 Update slash/github-copilot.ts
- [ ] 4.25 Update slash/iflow.ts
- [ ] 4.26 Update slash/kilocode.ts
- [ ] 4.27 Update slash/opencode.ts
- [ ] 4.28 Update slash/qoder.ts
- [ ] 4.29 Update slash/qwen.ts
- [ ] 4.30 Update slash/roocode.ts
- [ ] 4.31 Update slash/windsurf.ts
- [ ] 4.32 Update slash/registry.ts if needed

## Notes

This is a large task touching many files. Consider splitting work by configurator category (main vs slash) if needed. Test with `plx init --tools claude` to verify output.
