# refine-plx-slash-commands

## Why

The PLX slash command system needs refinement:

1. **Deprecated commands**: `init-architecture` and `update-architecture` are superseded by `refine-architecture` but remain in the codebase, causing confusion
2. **Missing command**: No `refine-release` command exists to iteratively refine RELEASE.md (unlike refine-review and refine-architecture)
3. **Missing file references**: Commands that work with capital-lettered markdown files don't use `@` notation, so files aren't auto-loaded when commands are invoked

## What

### Remove Deprecated Commands
- Remove `init-architecture` from type, templates, registry, and all 19 tool configurators
- Remove `update-architecture` from type, templates, registry, and all 19 tool configurators
- Remove associated `baseGuardrails`, `initArchitectureSteps`, `updateArchitectureSteps` template constants

### Add New Command
- Add `refine-release` command following the same pattern as `refine-review` and `refine-architecture`
- Command checks if RELEASE.md exists, creates from template if not, updates if exists

### Add @ File References
- `review` command: Reference `@REVIEW.md`
- `refine-review` command: Reference `@REVIEW.md`
- `refine-architecture` command: Reference `@ARCHITECTURE.md`
- `prepare-release` command: Add references to `@README.md`, `@CHANGELOG.md`, `@ARCHITECTURE.md`

## Scope

### Files Modified (22 total)

**Template Definitions:**
- `src/core/templates/plx-slash-command-templates.ts`

**Command Registry:**
- `src/core/configurators/slash/plx-base.ts`

**Tool Configurators (19 files):**
- `src/core/configurators/slash/plx-claude.ts`
- `src/core/configurators/slash/plx-cursor.ts`
- `src/core/configurators/slash/plx-factory.ts`
- `src/core/configurators/slash/plx-codebuddy.ts`
- `src/core/configurators/slash/plx-qoder.ts`
- `src/core/configurators/slash/plx-windsurf.ts`
- `src/core/configurators/slash/plx-kilocode.ts`
- `src/core/configurators/slash/plx-opencode.ts`
- `src/core/configurators/slash/plx-codex.ts`
- `src/core/configurators/slash/plx-github-copilot.ts`
- `src/core/configurators/slash/plx-amazon-q.ts`
- `src/core/configurators/slash/plx-auggie.ts`
- `src/core/configurators/slash/plx-cline.ts`
- `src/core/configurators/slash/plx-crush.ts`
- `src/core/configurators/slash/plx-costrict.ts`
- `src/core/configurators/slash/plx-qwen.ts`
- `src/core/configurators/slash/plx-roocode.ts`
- `src/core/configurators/slash/plx-antigravity.ts`
- `src/core/configurators/slash/plx-iflow.ts`

**Tests:**
- `test/core/templates/plx-slash-command-templates.test.ts`

## Out of Scope

- Updating ARCHITECTURE.md documentation (separate task after implementation)
- Regenerating existing project command files (users run `plx update`)
