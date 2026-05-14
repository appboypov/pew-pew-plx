---
tracked-issues:
  - tracker: linear
    id: PLX-5
    url: https://linear.app/de-app-specialist/issue/PLX-5/improve-architecture-documentation-to-support-feature-planning
---

## Why

Technical agents and engineers need comprehensive architecture documentation to design features without researching the codebase first. The current `workspace/project.md` provides basic context but lacks depth for feature planning. PLX-specific commands should be installed during initialization to provide architecture documentation capabilities alongside PLX's core workflow.

## What Changes

- Add new PLX slash commands: `splx/init-architecture` and `splx/update-architecture`
- Create PLX-specific template system (`splx-slash-command-templates.ts`)
- Create PLX configurator infrastructure (`splx-base.ts`, `splx-claude.ts`, `splx-registry.ts`)
- Integrate PLX command generation into `splx init` workflow
- Add architecture update suggestion to `splx archive` output

## Impact

- Affected specs: `cli-init`, `cli-archive`, new `splx-slash-commands`
- Affected code:
  - `src/core/templates/splx-slash-command-templates.ts` (CREATE)
  - `src/core/templates/architecture-template.ts` (CREATE)
  - `src/core/templates/index.ts` (MODIFY - exports)
  - `src/core/configurators/slash/splx-base.ts` (CREATE)
  - `src/core/configurators/slash/splx-claude.ts` (CREATE)
  - `src/core/configurators/slash/splx-registry.ts` (CREATE)
  - `src/core/init.ts` (MODIFY - PLX command generation)
  - `src/core/archive.ts` (MODIFY - suggestion message)
