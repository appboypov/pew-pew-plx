---
status: done
---

# Task: Update templates and configurator files

## End Goal

All template and configurator files reference `get-task` instead of `act-next`.

## Currently

- `SplxSlashCommandId` type includes `'act-next'`
- Template variables named `actNextGuardrails` and `actNextSteps`
- 20 configurator files in `src/core/configurators/slash/` reference `'act-next'`

## Should

- `SplxSlashCommandId` type includes `'get-task'`
- Template variables renamed to `getTaskGuardrails` and `getTaskSteps`
- All configurator files reference `'get-task'`
- Step instructions use `splx get task` command

## Constraints

- [x] All 20 configurator files must be updated
- [x] Template content must reference correct command syntax

## Acceptance Criteria

- [x] TypeScript compiles without errors after type rename
- [x] All configurators generate files with `get-task` paths
- [x] Template steps use `splx get task` command syntax

## Implementation Checklist

- [x] 3.1 Update `SplxSlashCommandId` type in `src/core/templates/splx-slash-command-templates.ts`
- [x] 3.2 Rename `actNextGuardrails` to `getTaskGuardrails`
- [x] 3.3 Rename `actNextSteps` to `getTaskSteps`
- [x] 3.4 Update step instructions to use `splx get task`
- [x] 3.5 Update `splxSlashCommandBodies` object key from `'act-next'` to `'get-task'`
- [x] 3.6 Update `splx-amazon-q.ts` configurator
- [x] 3.7 Update `splx-antigravity.ts` configurator
- [x] 3.8 Update `splx-auggie.ts` configurator
- [x] 3.9 Update `splx-base.ts` configurator (including `ALL_PLX_COMMANDS` array)
- [x] 3.10 Update `splx-claude.ts` configurator
- [x] 3.11 Update `splx-cline.ts` configurator
- [x] 3.12 Update `splx-codebuddy.ts` configurator
- [x] 3.13 Update `splx-codex.ts` configurator
- [x] 3.14 Update `splx-costrict.ts` configurator
- [x] 3.15 Update `splx-crush.ts` configurator
- [x] 3.16 Update `splx-cursor.ts` configurator
- [x] 3.17 Update `splx-factory.ts` configurator
- [x] 3.18 Update `splx-gemini.ts` configurator
- [x] 3.19 Update `splx-github-copilot.ts` configurator
- [x] 3.20 Update `splx-iflow.ts` configurator
- [x] 3.21 Update `splx-kilocode.ts` configurator
- [x] 3.22 Update `splx-opencode.ts` configurator
- [x] 3.23 Update `splx-qoder.ts` configurator
- [x] 3.24 Update `splx-qwen.ts` configurator
- [x] 3.25 Update `splx-roocode.ts` configurator
- [x] 3.26 Update `splx-windsurf.ts` configurator

## Notes

Each configurator file typically has:
- `FILE_PATHS` record with command ID keys
- `FRONTMATTER` record with command descriptions
