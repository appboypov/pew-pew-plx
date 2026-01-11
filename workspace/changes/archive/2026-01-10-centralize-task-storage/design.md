## Context

PLX currently stores tasks in nested directories under their parent entities (`workspace/changes/<name>/tasks/` and `workspace/reviews/<name>/tasks/`). This design emerged from the original OpenSpec architecture where tasks were tightly coupled to changes.

Centralizing task storage addresses several limitations:
1. No support for standalone tasks unrelated to changes/reviews
2. Complex discovery logic scanning multiple nested paths
3. Inconsistent task ID resolution across entity types
4. Difficulty supporting tasks linked to specs

Stakeholders: AI agents using PLX, developers managing task workflows, CLI maintainers.

## Goals / Non-Goals

**Goals:**
- Single location for all task files (`workspace/tasks/`)
- Optional parent linking via frontmatter
- Per-parent task numbering (001, 002, etc. per parent entity)
- Support for change, review, and spec parent types
- Per-workspace task folder (multi-workspace support)
- Centralized archive location (`workspace/tasks/archive/`)

**Non-Goals:**
- Changing the CLI command structure (handled by `standardize-cli-pattern`)
- Adding `plx create task` command (handled by `add-create-command`)
- Migration tooling (handled by `add-migrate-command`)
- Archive command behavior changes (handled by `update-archive-task-handling`)

## Decisions

### Decision 1: Filename Format

**What:** Task filenames encode parent-id for parented tasks, use plain names for standalone tasks.

**Format:**
- Parented: `NNN-<parent-id>-<name>.md`
- Standalone: `NNN-<name>.md`

**Why:** Including parent-id in the filename:
- Enables quick visual identification of task ownership
- Simplifies glob-based filtering (`*-add-feature-*`)
- Preserves association even if frontmatter is corrupted
- Maintains uniqueness across parents (001 can exist for multiple parents)

**Alternatives considered:**
1. Pure frontmatter linking with sequential global numbering - rejected because global numbering creates confusing gaps when parents are archived, and removes visual association
2. Directory-per-parent under `tasks/` - rejected because it reintroduces nested discovery and doesn't improve on current structure

### Decision 2: Per-Parent Numbering

**What:** Each parent entity's tasks start numbering at 001.

**Why:**
- Tasks remain coherent within their parent context
- Archiving a parent doesn't create gaps in unrelated tasks
- Ordering within a parent is preserved

**Examples:**
```
workspace/tasks/
├── 001-add-feature-x-design.md      # First task for add-feature-x
├── 002-add-feature-x-implement.md   # Second task for add-feature-x
├── 001-fix-bug-y-investigate.md     # First task for fix-bug-y
└── 001-quick-fix.md                 # Standalone task
```

### Decision 3: Frontmatter Schema

**What:** Tasks use YAML frontmatter with optional parent linkage.

**Schema:**
```yaml
---
status: to-do|in-progress|done
skill-level: junior|medior|senior  # optional
parent-type: change|review|spec    # required for parented tasks
parent-id: <entity-id>             # required for parented tasks
---
```

**Why:**
- Explicit typing prevents ambiguity when parent-id matches multiple entity types
- Optional fields allow standalone tasks
- Consistent with existing frontmatter patterns in PLX

### Decision 4: Task Discovery Algorithm

**What:** Unified discovery scanning `workspace/tasks/` with optional filtering.

**Algorithm:**
1. Scan `workspace/tasks/` for `.md` files (exclude `archive/`)
2. Parse frontmatter to extract parent linkage
3. Filter by `parent-type` and/or `parent-id` if specified
4. Sort by filename (numeric prefix, then alpha)
5. Apply status filter (exclude `done` for prioritized retrieval)

**Parent Filtering Behavior:**
- If `--parent-id` provided without `--parent-type`: search all entity types, error if conflicts
- If both provided: filter to exact match
- If neither: return all tasks

### Decision 5: Archive Location

**What:** Archived tasks move to `workspace/tasks/archive/`.

**Why:**
- Single archive location matches centralized storage
- Filename preservation (includes parent-id) maintains origin visibility
- Frontmatter remains intact for historical queries

### Decision 6: Multi-Workspace Pattern

**What:** Each workspace has its own `workspace/tasks/` folder.

**Why:**
- Follows existing multi-workspace discovery pattern
- Tasks are scoped to their workspace
- `--workspace` flag filters appropriately

**Structure:**
```
monorepo/
├── project-a/
│   └── workspace/
│       ├── tasks/           # project-a tasks
│       └── ...
└── project-b/
    └── workspace/
        ├── tasks/           # project-b tasks
        └── ...
```

## Risks / Trade-offs

**Risk:** Filename collisions for standalone tasks
- Mitigation: Standalone tasks use sequential numbering within the `tasks/` folder

**Risk:** Parent-id embedded in filename becomes stale if parent is renamed
- Mitigation: Frontmatter is authoritative; filename is a convenience. Validation can warn on mismatch.

**Risk:** Large number of tasks in single directory
- Mitigation: Archive completed parents' tasks. Consider future sharding by date if needed.

**Trade-off:** Slightly longer filenames for parented tasks
- Accepted: Clarity and filtering benefits outweigh minor verbosity

## Migration Plan

Migration is handled by the separate `add-migrate-command` proposal:
1. Scan existing `changes/*/tasks/` and `reviews/*/tasks/`
2. Move files to `workspace/tasks/` with renamed format
3. Add frontmatter fields
4. Report results

Rollback: Keep original nested directories until migration verified.

## Open Questions

None - all decisions finalized based on request.md clarifications.
