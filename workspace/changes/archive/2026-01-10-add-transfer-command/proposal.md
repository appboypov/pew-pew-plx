# Change: Add Transfer Command for Cross-Workspace Entity Migration

## Why

When working in a monorepo, users develop changes, specs, and tasks at the root level but need to transfer completed work to individual package repositories. Currently, this requires manual file copying, ID updates, task renumbering, and workspace initialization—a tedious and error-prone process.

## What Changes

- Add `plx transfer` command with subcommands for each entity type:
  - `plx transfer change` - Transfer change directory with linked tasks
  - `plx transfer spec` - Transfer spec directory with related changes and tasks
  - `plx transfer task` - Transfer individual task file
  - `plx transfer review` - Transfer review directory with linked tasks
  - `plx transfer request` - Transfer request.md file
- Implement move semantics (delete from source after successful transfer)
- Auto-initialize target workspace if missing (using source's tool configuration)
- Reassign task sequence numbers in target workspace
- Update parent-id in task frontmatter when renaming entities
- Support `--dry-run` for preview, `--target-name` for conflict resolution

## Impact

- Affected specs: None (new capability)
- Affected code:
  - `src/commands/transfer.ts` (new)
  - `src/core/transfer.ts` (new) - core transfer logic
  - `src/services/transfer-service.ts` (new) - entity transfer operations
  - `src/cli/index.ts` - register transfer command
  - `src/core/completions/command-registry.ts` - add completion data
