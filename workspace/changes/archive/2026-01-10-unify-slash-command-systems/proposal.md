# Change: Unify Slash Command Systems

## Why

The codebase has diverged from OpenSpec and maintains two separate slash command systems:
- Regular system (`SlashCommandId`): 3 commands (`plan-proposal`, `implement`, `archive`)
- PLX system (`SplxSlashCommandId`): 10 commands (`get-task`, `orchestrate`, etc.)

This creates 52 duplicate configurator files, inconsistent behavior, and implementation bugs (e.g., `plan-proposal` was incorrectly placed in the regular system instead of PLX). Since PLX is now the primary command, there's no need for separation.

## What Changes

- **BREAKING**: Merge `SplxSlashCommandId` into `SlashCommandId` (single type with all 13 commands)
- **BREAKING**: Merge `SplxSlashCommandRegistry` into `SlashCommandRegistry` (single registry)
- Delete all `splx-*.ts` configurator files (~27 files)
- Update `init.ts` and `update.ts` to use single registry
- Simplify architecture documentation

## Impact

- Affected specs: `splx-slash-commands`
- Affected code:
  - `src/core/templates/slash-command-templates.ts` (merge types and bodies)
  - `src/core/templates/splx-slash-command-templates.ts` (DELETE)
  - `src/core/configurators/slash/base.ts` (expand to all commands)
  - `src/core/configurators/slash/splx-base.ts` (DELETE)
  - `src/core/configurators/slash/*.ts` (23 files - add commands)
  - `src/core/configurators/slash/splx-*.ts` (27 files - DELETE)
  - `src/core/init.ts` (remove PLX registry usage)
  - `src/core/update.ts` (remove PLX registry usage)
  - `test/core/configurators/slash/splx-parity.test.ts` (DELETE)
