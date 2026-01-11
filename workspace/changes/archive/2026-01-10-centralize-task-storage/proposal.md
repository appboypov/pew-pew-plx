# Change: Centralize Task Storage

## Why

Task storage is currently fragmented across `workspace/changes/<name>/tasks/` and `workspace/reviews/<name>/tasks/`. This creates inconsistent retrieval patterns, complicates multi-workspace discovery, and prevents standalone tasks that are not associated with any parent entity.

Centralizing tasks in `workspace/tasks/` with optional parent linking enables:
- Unified task retrieval and management
- Support for standalone tasks
- Consistent filtering by parent entity
- Simplified multi-workspace architecture

## What Changes

**Storage Location**
- From: Tasks stored in `workspace/changes/<name>/tasks/` and `workspace/reviews/<name>/tasks/`
- To: All tasks stored in `workspace/tasks/`
- Archive location: `workspace/tasks/archive/`

**Task Filename Format**
- Parented tasks: `NNN-<parent-id>-<name>.md` (e.g., `001-add-feature-x-implement.md`)
- Standalone tasks: `NNN-<name>.md` (e.g., `001-fix-typo.md`)
- Per-parent numbering (each parent's tasks start at 001)

**Frontmatter Fields**
- `parent-type: change|review|spec` (required for parented tasks)
- `parent-id: <id>` (required for parented tasks)
- Both fields optional for standalone tasks

**Supported Parent Types**
- `change` - Link task to a change proposal
- `review` - Link task to a review entity
- `spec` - Link task to a specification

**Multi-Workspace Support**
- Each workspace maintains its own `workspace/tasks/` folder
- Follows existing upward/downward workspace discovery pattern

**Task Retrieval Logic Updates**
- `plx get task` searches `workspace/tasks/` instead of nested folders
- Prioritization considers parent entity completion status
- Filtering by `--parent-id` and `--parent-type` flags (assumes `standardize-cli-pattern` complete)

**Task Management Updates**
- `plx complete task` and `plx undo task` operate on centralized storage
- Change/review completion aggregates by parent-id linkage

## Impact

- **Affected specs**: `plx-conventions`, `cli-get-task`, `cli-complete`, `cli-undo`, `docs-agent-instructions`
- **Affected code**: Task discovery utilities, item retrieval service, task progress tracking, task status utilities, workspace discovery
- **Breaking**: Yes - existing projects require migration (handled by separate `add-migrate-command` proposal)
