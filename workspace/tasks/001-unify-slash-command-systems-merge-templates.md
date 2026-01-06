---
status: done
parent-type: change
parent-id: unify-slash-command-systems
---
# Task: Merge Template Files

## End Goal
A single `SlashCommandId` type with all 13 commands and a single `slashCommandBodies` record.

## Currently
- `slash-command-templates.ts` has 3 commands: `plan-proposal`, `implement`, `archive`
- `plx-slash-command-templates.ts` has 10 commands: `get-task`, `orchestrate`, etc.
- Two separate types and body records

## Should
- `slash-command-templates.ts` has all 13 commands
- `plx-slash-command-templates.ts` is deleted
- `index.ts` exports only `SlashCommandId` and `getSlashCommandBody`

## Constraints
- [x] Preserve all existing command bodies exactly
- [x] Use alphabetical ordering for type union members
- [x] Keep `plan-proposal` body from PLX version (has request.md detection)

## Acceptance Criteria
- [x] `SlashCommandId` type has all 13 commands
- [x] `slashCommandBodies` record has all 13 entries
- [x] `plx-slash-command-templates.ts` is deleted
- [x] `index.ts` no longer exports PLX types

## Implementation Checklist
- [x] 1.1 Add all PLX command body constants to `slash-command-templates.ts`
- [x] 1.2 Update `SlashCommandId` type to include all 13 commands
- [x] 1.3 Merge `plxSlashCommandBodies` into `slashCommandBodies`
- [x] 1.4 Update `plan-proposal` body to use PLX version with request.md detection
- [x] 1.5 Delete `plx-slash-command-templates.ts`
- [x] 1.6 Update `index.ts` to remove PLX exports

## Notes
The PLX version of `plan-proposal` includes Step 0 for request.md detection - use that version.
