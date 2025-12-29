# Change: Rename `act next` to `get task` with Enhanced Completion

## Why

The command `plx act next` uses ambiguous naming. "Act" implies performing an action, but the command retrieves information. Renaming to `plx get task` aligns with its purpose: retrieving the next prioritized task. Additionally, the `--did-complete-previous` flag only updates the task status without marking implementation checkboxes as complete, requiring manual updates.

## What Changes

- **BREAKING**: Command `plx act next` renamed to `plx get task`
- **BREAKING**: Type `PlxSlashCommandId` value `'act-next'` renamed to `'get-task'`
- Enhanced `--did-complete-previous` to automatically mark all `## Implementation Checklist` checkboxes as `[x]`
- New output shows completed task name and checkbox items when `--did-complete-previous` is used
- All configurator files updated with new command ID
- Documentation and tests updated

## Impact

- Affected specs: `cli-act-next` (renamed to `cli-get-task`)
- Affected code:
  - `src/commands/act.ts` → `src/commands/get.ts`
  - `src/cli/index.ts`
  - `src/utils/task-status.ts`
  - `src/core/templates/plx-slash-command-templates.ts`
  - `src/core/configurators/slash/plx-*.ts` (20 files)
  - `test/commands/act.test.ts` → `test/commands/get.test.ts`
  - `.claude/commands/plx/act-next.md` → `get-task.md`
  - `README.md`
