---
status: done
---

# Task: Update templates and configurator files

## End Goal

All template and configurator files reference `get-task` instead of `act-next`.

## Currently

- `PlxSlashCommandId` type includes `'act-next'`
- Template variables named `actNextGuardrails` and `actNextSteps`
- 20 configurator files in `src/core/configurators/slash/` reference `'act-next'`

## Should

- `PlxSlashCommandId` type includes `'get-task'`
- Template variables renamed to `getTaskGuardrails` and `getTaskSteps`
- All configurator files reference `'get-task'`
- Step instructions use `plx get task` command

## Constraints

- [x] All 20 configurator files must be updated
- [x] Template content must reference correct command syntax

## Acceptance Criteria

- [x] TypeScript compiles without errors after type rename
- [x] All configurators generate files with `get-task` paths
- [x] Template steps use `plx get task` command syntax

## Implementation Checklist

- [x] 3.1 Update `PlxSlashCommandId` type in `src/core/templates/plx-slash-command-templates.ts`
- [x] 3.2 Rename `actNextGuardrails` to `getTaskGuardrails`
- [x] 3.3 Rename `actNextSteps` to `getTaskSteps`
- [x] 3.4 Update step instructions to use `plx get task`
- [x] 3.5 Update `plxSlashCommandBodies` object key from `'act-next'` to `'get-task'`
- [x] 3.6 Update `plx-amazon-q.ts` configurator
- [x] 3.7 Update `plx-antigravity.ts` configurator
- [x] 3.8 Update `plx-auggie.ts` configurator
- [x] 3.9 Update `plx-base.ts` configurator (including `ALL_PLX_COMMANDS` array)
- [x] 3.10 Update `plx-claude.ts` configurator
- [x] 3.11 Update `plx-cline.ts` configurator
- [x] 3.12 Update `plx-codebuddy.ts` configurator
- [x] 3.13 Update `plx-codex.ts` configurator
- [x] 3.14 Update `plx-costrict.ts` configurator
- [x] 3.15 Update `plx-crush.ts` configurator
- [x] 3.16 Update `plx-cursor.ts` configurator
- [x] 3.17 Update `plx-factory.ts` configurator
- [x] 3.18 Update `plx-gemini.ts` configurator
- [x] 3.19 Update `plx-github-copilot.ts` configurator
- [x] 3.20 Update `plx-iflow.ts` configurator
- [x] 3.21 Update `plx-kilocode.ts` configurator
- [x] 3.22 Update `plx-opencode.ts` configurator
- [x] 3.23 Update `plx-qoder.ts` configurator
- [x] 3.24 Update `plx-qwen.ts` configurator
- [x] 3.25 Update `plx-roocode.ts` configurator
- [x] 3.26 Update `plx-windsurf.ts` configurator

## Notes

Each configurator file typically has:
- `FILE_PATHS` record with command ID keys
- `FRONTMATTER` record with command descriptions
