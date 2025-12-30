# Change: Add Multi-Workspace Discovery

## Why

When using `plx` from a root folder containing multiple projects (monorepo), users cannot manage workspaces across all child projects. The CLI only looks at `{cwd}/workspace/` and ignores nested project workspaces, forcing users to navigate into each project individually.

## What Changes

- **NEW** `src/utils/workspace-discovery.ts` - Recursive workspace discovery utility
- **MODIFIED** `src/utils/item-discovery.ts` - Multi-workspace variants of discovery functions
- **MODIFIED** `src/services/item-retrieval.ts` - Workspace context support
- **MODIFIED** `src/cli/index.ts` - Global `--workspace` filter flag
- **MODIFIED** `src/core/list.ts` - Aggregate across discovered workspaces
- **MODIFIED** `src/commands/get.ts` - Workspace-aware task retrieval
- **MODIFIED** `src/commands/validate.ts` - Multi-workspace validation
- **MODIFIED** Other commands - Workspace context propagation

## Impact

- Affected specs: `cli-list`, `cli-get-task`, `cli-validate`
- Affected code: All commands that interact with workspace items
- **BREAKING**: None - single-workspace behavior unchanged
- Backward compatible: Existing projects work without modification
