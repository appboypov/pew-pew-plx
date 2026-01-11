# Request: Add Transfer Command

## Source Input

User wants to introduce transfer logic with commands:
- `plx transfer change`
- `plx transfer spec`
- `plx transfer task`

Use case: Working from a monorepo and transferring artifacts to repos beneath it.

Behavior:
- Check if workspace is present in target
- If not present: init workspace with same config as source (tools, etc.)
- If present: just transfer the artifact

## Current Understanding

1. Transfer commands for three entity types: change, spec, task
2. Source: monorepo workspace
3. Target: child repo within or beneath the monorepo
4. Auto-initialize workspace in target if missing (copying tool configuration)
5. Transfer = move or copy artifact from source to target workspace

## Identified Ambiguities

All resolved through clarification - see Decisions section.

## Decisions

1. **Transfer semantics**: Move operation - entity is deleted from source after successful transfer to target.
2. **Target specification**: Both options - `--source` and `--target` path arguments. Fall back to interactive selection when omitted.
3. **Linked tasks**: Auto-transfer all tasks linked to the change (where parent-id matches the change ID).
4. **Spec transfer scope**: Full cascade - transfer entire spec directory (spec.md, design.md, etc.) plus any changes that modify this spec and their linked tasks.
5. **ID conflict handling**: Abort with error and instruct user to use `--target-name <new-name>` argument to rename the entity being transferred.
6. **--target-name scope**: Applies to the specific entity type being transferred (change name for `transfer change`, task name for `transfer task`). When transferring a change with linked tasks, only the change can be renamed via --target-name; task conflicts must be resolved manually before transfer.
7. **Task parent-id update**: When a change is renamed via --target-name, update parent-id in all linked task frontmatter to match the new change name.
8. **Review transfer**: Yes, include `plx transfer review` with same cascade behavior (review + linked tasks).
9. **Request transfer**: Yes, include `plx transfer request` for transferring request.md files.
10. **Task sequence numbers**: Reassign sequence numbers to continue from target's highest number (e.g., if target has 005-*.md, transferred tasks start at 006). Update filenames accordingly.
11. **Workspace auto-init**: Follow existing `plx init` behavior - prompt interactively for confirmation, use source workspace's tool configuration as defaults. Respects --no-interactive and --yes flags.
12. **Dry-run support**: Add `--dry-run` flag to preview transfer without making changes - shows what would be transferred, conflicts detected, and whether workspace init is needed.
13. **Standalone tasks**: Standalone tasks (without parent-type/parent-id) are transferable - move file and reassign sequence number.

## Final Intent

Add a `plx transfer` command with subcommands for transferring PLX entities between workspaces.

### Commands

```
plx transfer change --id <id> [--source <path>] [--target <path>] [--target-name <name>] [--dry-run] [--yes]
plx transfer spec --id <id> [--source <path>] [--target <path>] [--target-name <name>] [--dry-run] [--yes]
plx transfer task --id <id> [--source <path>] [--target <path>] [--target-name <name>] [--dry-run] [--yes]
plx transfer review --id <id> [--source <path>] [--target <path>] [--target-name <name>] [--dry-run] [--yes]
plx transfer request --id <id> [--source <path>] [--target <path>] [--target-name <name>] [--dry-run] [--yes]
```

### Behavior

1. **Move semantics**: Entities are deleted from source after successful transfer
2. **Path arguments**: `--source` and `--target` specify paths; fall back to interactive selection when omitted
3. **Cascade transfer**:
   - `transfer change`: Moves change directory + all linked tasks (by parent-id)
   - `transfer spec`: Moves spec directory + related changes + their linked tasks
   - `transfer review`: Moves review directory + all linked tasks
   - `transfer task`: Moves single task file
   - `transfer request`: Moves request.md file
4. **Workspace auto-init**: If target has no workspace, initialize using `plx init` behavior with source's tool config as defaults
5. **Conflict handling**: Abort on ID conflicts, instruct user to use `--target-name` or manually rename
6. **Task renumbering**: Reassign sequence numbers to continue from target's highest (e.g., 005 → 006, 007, ...)
7. **Parent-id updates**: When change is renamed via --target-name, update parent-id in linked task frontmatter
8. **Dry-run**: `--dry-run` previews what would be transferred without making changes
9. **Non-interactive**: Respects `--yes` and `--no-interactive` flags
