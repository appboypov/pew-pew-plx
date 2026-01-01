# Change: Add Sync Workspace Command

## Why

Workspace maintenance is manual and easy to forget. Changes accumulate in various states (open, in-progress, done-but-not-archived) without a systematic way to assess their health and take action. A `/plx/sync-workspace` command provides a single entry point for workspace hygiene.

## What Changes

- Add new slash command `/plx/sync-workspace` for workspace maintenance
- Add `sync-workspace` to `SlashCommandId` type and `ALL_COMMANDS` array
- Add command template with guardrails and steps for assessment workflow
- Support global workspace scan (no arguments) and targeted scan (change-id or task-id argument)

## Impact

- Affected specs: `plx-slash-commands`
- Affected code:
  - `src/core/templates/slash-command-templates.ts` (add template)
  - `src/core/configurators/slash/base.ts` (add to ALL_COMMANDS)
  - `.claude/commands/plx/sync-workspace.md` (new command file)
