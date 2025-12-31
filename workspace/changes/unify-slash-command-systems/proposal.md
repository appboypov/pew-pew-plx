# Change: Unify Slash Command Systems

## Why

The codebase has diverged from OpenSpec and maintains two separate slash command systems:
- Regular system (`SlashCommandId`): 3 commands (`plan-proposal`, `implement`, `archive`)
- PLX system (`PlxSlashCommandId`): 10 commands (`get-task`, `orchestrate`, etc.)

This creates 52 duplicate configurator files, inconsistent behavior, and implementation bugs (e.g., `plan-proposal` was incorrectly placed in the regular system instead of PLX). Since PLX is now the primary command, there's no need for separation.

## What Changes

- **BREAKING**: Merge `PlxSlashCommandId` into `SlashCommandId` (single type with all 13 commands)
- **BREAKING**: Merge `PlxSlashCommandRegistry` into `SlashCommandRegistry` (single registry)
- Delete all `plx-*.ts` configurator files (~27 files)
- Update `init.ts` and `update.ts` to use single registry
- Simplify architecture documentation

## Impact

- Affected specs: `plx-slash-commands`
- Affected code:
  - `src/core/templates/slash-command-templates.ts` (merge types and bodies)
  - `src/core/templates/plx-slash-command-templates.ts` (DELETE)
  - `src/core/configurators/slash/base.ts` (expand to all commands)
  - `src/core/configurators/slash/plx-base.ts` (DELETE)
  - `src/core/configurators/slash/*.ts` (23 files - add commands)
  - `src/core/configurators/slash/plx-*.ts` (27 files - DELETE)
  - `src/core/init.ts` (remove PLX registry usage)
  - `src/core/update.ts` (remove PLX registry usage)
  - `test/core/configurators/slash/plx-parity.test.ts` (DELETE)
