---
tracked-issues:
  - tracker: linear
    id: PLX-5
    url: https://linear.app/de-app-specialist/issue/PLX-5/improve-architecture-documentation-to-support-feature-planning
---

## Why

Technical agents and engineers need comprehensive architecture documentation to design features without researching the codebase first. The current `openspec/project.md` provides basic context but lacks depth for feature planning. PLX-specific commands should be installed during initialization to provide architecture documentation capabilities alongside OpenSpec's core workflow.

## What Changes

- Add new PLX slash commands: `plx/init-architecture` and `plx/update-architecture`
- Create PLX-specific template system (`plx-slash-command-templates.ts`)
- Create PLX configurator infrastructure (`plx-base.ts`, `plx-claude.ts`, `plx-registry.ts`)
- Integrate PLX command generation into `plx init` workflow
- Add architecture update suggestion to `plx archive` output

## Impact

- Affected specs: `cli-init`, `cli-archive`, new `plx-slash-commands`
- Affected code:
  - `src/core/templates/plx-slash-command-templates.ts` (CREATE)
  - `src/core/templates/architecture-template.ts` (CREATE)
  - `src/core/templates/index.ts` (MODIFY - exports)
  - `src/core/configurators/slash/plx-base.ts` (CREATE)
  - `src/core/configurators/slash/plx-claude.ts` (CREATE)
  - `src/core/configurators/slash/plx-registry.ts` (CREATE)
  - `src/core/init.ts` (MODIFY - PLX command generation)
  - `src/core/archive.ts` (MODIFY - suggestion message)
