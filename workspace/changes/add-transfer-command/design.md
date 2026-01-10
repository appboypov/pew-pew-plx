## Context

Users working in monorepos need to transfer PLX entities (changes, specs, tasks, reviews, requests) from a root workspace to child package workspaces. The transfer must handle cascade relationships (changes→tasks, specs→changes→tasks), conflict detection, workspace initialization, and task renumbering.

## Goals / Non-Goals

**Goals:**
- Provide move semantics for all entity types
- Auto-initialize target workspace when missing
- Handle cascade transfers (parent entity + linked children)
- Detect and report conflicts before making changes
- Reassign task sequence numbers to avoid gaps
- Support dry-run for previewing transfers

**Non-Goals:**
- Copy semantics (move only)
- Cross-project task linking (tasks transferred to new workspace have no link to source)
- Undo/rollback of transfers
- Batch transfer of multiple unrelated entities

## Architecture

### Command Structure

```
plx transfer <entity-type> --id <id> [options]

Entity types: change, spec, task, review, request

Options:
  --source <path>       Source workspace path (default: auto-discover)
  --target <path>       Target workspace path (default: interactive)
  --target-name <name>  Rename entity in target (for conflict resolution)
  --dry-run             Preview without making changes
  --yes                 Skip confirmation prompts
  --no-interactive      Disable all prompts
  --json                Output as JSON
```

### Transfer Service

A new `TransferService` class handles core transfer logic:

```typescript
interface TransferPlan {
  entityType: 'change' | 'spec' | 'task' | 'review' | 'request';
  entityId: string;
  sourcePath: string;
  targetPath: string;
  targetName: string;
  requiresInit: boolean;
  filesToMove: TransferItem[];
  tasksToRenumber: TaskRenumber[];
  conflicts: ConflictInfo[];
}

interface TransferItem {
  sourcePath: string;
  targetPath: string;
  type: 'directory' | 'file';
}

interface TaskRenumber {
  sourcePath: string;
  targetPath: string;
  oldSequence: number;
  newSequence: number;
  oldFilename: string;
  newFilename: string;
  parentIdUpdate?: { old: string; new: string };
}

interface ConflictInfo {
  type: 'entity' | 'task';
  id: string;
  existingPath: string;
}
```

### Cascade Logic

| Entity Type | Cascades To |
|-------------|-------------|
| change | All tasks where `parent-type: change` and `parent-id: <change-id>` |
| spec | All changes with delta specs for this spec + their linked tasks |
| review | All tasks where `parent-type: review` and `parent-id: <review-id>` |
| task | None (single file transfer) |
| request | None (single file transfer) |

### Transfer Flow

1. **Resolve paths**: Determine source and target workspace paths
2. **Check target workspace**: If missing, queue workspace initialization
3. **Build transfer plan**: Enumerate all files/directories to move
4. **Detect conflicts**: Check target for existing entities with same IDs
5. **Calculate task renumbering**: Find highest sequence in target, assign new numbers
6. **Display plan** (or return JSON for `--dry-run`)
7. **Execute transfer**:
   - Initialize target workspace if needed
   - Copy files to target (with renumbering/parent-id updates)
   - Delete source files after successful copy
8. **Report results**

### Task Renumbering

Tasks use sequence-prefixed filenames: `NNN-<parent-id>-<name>.md` or `NNN-<name>.md`

When transferring:
1. Scan target `workspace/tasks/` for highest sequence number
2. Assign new sequences starting from `highest + 1`
3. Update filename pattern: `{newSeq}-{parentId}-{name}.md`
4. If `--target-name` changes the parent entity, update `parent-id` in frontmatter

### Conflict Resolution

When a conflict is detected:
1. Abort transfer with error listing all conflicts
2. Instruct user to either:
   - Use `--target-name <new-name>` to rename the entity
   - Manually rename/remove conflicting entities in target

For task conflicts specifically:
- Cannot be resolved via `--target-name` (only applies to parent entity)
- User must manually rename tasks in source or target before transfer

### Workspace Initialization

When target has no workspace:
1. Detect configured tools from source workspace (parse `.claude/settings.local.json`, etc.)
2. Run `plx init` logic with detected tools as defaults
3. Follow interactive/non-interactive flags from transfer command
4. Continue with transfer after successful init

## Decisions

1. **Move semantics only**: Simplifies implementation, avoids divergent state between workspaces
2. **Abort on any conflict**: Safer than partial transfers, user has full control
3. **Task renumbering is mandatory**: Prevents sequence collisions, maintains chronological ordering
4. **Parent-id updates are automatic**: When `--target-name` is used, linked tasks get updated parent-id

## Risks / Trade-offs

- **Data loss if transfer fails mid-way**: Mitigated by copying before deleting
- **Complex spec cascade**: Finding all changes for a spec requires scanning all changes - acceptable for typical workspace sizes
- **Task sequence gaps in source**: After transfer, source may have gaps in task sequence - this is acceptable and matches archive behavior

## Open Questions

None - all clarified in request phase.
