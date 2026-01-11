# Change: Add plan-implementation Command

## Why

Current multi-agent workflows lack a structured handoff protocol. The `/plx:orchestrate` command keeps agents in-process, but users need to manually coordinate between separate agent sessions. This change introduces a `plan-implementation` workflow that generates copy-pastable task blocks for external agents with full context.

## What Changes

- **NEW** CLI command `plx create progress --change-id <id>` - Generates PROGRESS.md with non-completed tasks
- **NEW** Slash command `/plx:plan-implementation` - Orchestrates multi-agent handoff workflow
- **MODIFIED** `src/commands/create.ts` - Add `createProgress` method
- **MODIFIED** `src/cli/index.ts` - Register `create progress` subcommand
- **MODIFIED** `src/core/templates/index.ts` - Add progress template generation
- **MODIFIED** `src/core/configurators/slash/*` - Add plan-implementation command to all tools

## Impact

- Affected specs: `cli-create`, `plx-slash-commands`
- Affected code: `src/commands/create.ts`, `src/cli/index.ts`, `src/core/templates/*`, `src/core/configurators/slash/*`
- **BREAKING**: None
- Backward compatible: Yes
