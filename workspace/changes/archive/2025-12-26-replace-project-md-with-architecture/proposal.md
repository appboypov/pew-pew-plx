# Change: Replace project.md with ARCHITECTURE.md

## Why

Pew Pew Plx implemented `ARCHITECTURE.md` as the project documentation standard via `/plx/init-architecture` and `/plx/update-architecture` commands. However, the codebase still references `project.md` throughout:

- Agent instructions tell AI to "read `workspace/project.md`"
- Slash command templates reference `project.md`
- `TemplateManager` still generates `project.md`
- Specs define `project.md` in directory structures
- Init command prompts users to populate `project.md`
- README compares `project.md` vs `ARCHITECTURE.md` but instructions still use `project.md`

This creates confusion as users receive mixed signals about which file to use.

## What Changes

1. **Agent Instructions (AGENTS.md template)**: Replace all `project.md` references with `ARCHITECTURE.md` and instruct agents to use `/plx/init-architecture` or `/plx/update-architecture`
2. **Slash Command Templates**: Update proposal step to reference `ARCHITECTURE.md` instead of `project.md`
3. **Template Manager**: Stop generating `project.md`, rely on PLX commands for architecture documentation
4. **Init Command**: Update success output to reference PLX architecture commands instead of `project.md`
5. **README**: Update "Optional: Populate Project Context" section to reference `ARCHITECTURE.md` and PLX commands
6. **Specs**: Update directory structure references to show `ARCHITECTURE.md` at project root (not inside workspace/)
7. **ARCHITECTURE.md (self)**: Update reference to `project.md` to `ARCHITECTURE.md`

**BREAKING**: Projects relying on `project.md` generation will no longer receive this file. Migration: Run `/plx/init-architecture` to generate `ARCHITECTURE.md`.

## Impact

- Affected specs: `cli-init`, `plx-conventions`
- Affected code:
  - `src/core/templates/agents-template.ts`
  - `src/core/templates/slash-command-templates.ts`
  - `src/core/templates/index.ts`
  - `src/core/init.ts`
  - `README.md`
  - `ARCHITECTURE.md`
  - `workspace/AGENTS.md` (regenerated from template)
