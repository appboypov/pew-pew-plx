# Change: Update refine-architecture command for spec-ready documentation

## Why

The current `refine-architecture` command produces minimal documentation that requires developers to open the codebase for context. Senior solution architects and developers need a complete technical reference to create detailed specs and tickets without accessing the source code.

## What Changes

- Update `refineArchitectureGuardrails` in `slash-command-templates.ts` to require spec-ready documentation with complete component inventories
- Add `refineArchitectureContextRetrieval` section instructing use of codebase-retrieval tools (auggie mcp or equivalent)
- Expand `refineArchitectureSteps` to include discovery, inventory population, dependency mapping, and completeness validation
- Add `refineArchitectureTemplateStructure` defining required sections and component categories
- Update spec scenarios to reflect new command behavior

## Impact

- Affected specs: `plx-slash-commands`
- Affected code:
  - `src/core/templates/slash-command-templates.ts` (primary change)
  - All tool-specific command files via `plx update`
