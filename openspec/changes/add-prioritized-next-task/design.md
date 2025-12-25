## Context

The OpenSpec CLI manages multiple active changes, each containing numbered task files. Developers need automated task selection to maintain workflow continuity without manual scanning of change directories.

Stakeholders: Developers using OpenSpec for spec-driven development.

Constraints:
- Must work with existing `tasks/NNN-name.md` file format
- Must integrate with existing `task-progress.ts` utilities
- Must preserve backwards compatibility (tasks without status default to `to-do`)

## Goals / Non-Goals

Goals:
- Automatic selection of highest-priority change based on completion percentage
- Age-based tiebreaking when completion percentages are equal
- Task status tracking via YAML frontmatter
- Automatic status transitions with `--did-complete-previous` flag
- JSON output for tooling integration

Non-Goals:
- Multi-change parallel task display
- Interactive task selection UI
- Integration with external task trackers (beyond issue linking)

## Decisions

### Decision: Status in YAML Frontmatter

Task status is stored in YAML frontmatter at the top of task files:

```markdown
---
status: to-do
---

# Task: Implement feature
...
```

Alternatives considered:
- **Inline status field** (`**Status**: to-do`) - Rejected: harder to parse reliably, conflicts with requirement/constraint sections
- **Separate status file** - Rejected: adds complexity, harder to track per-task
- **Database/JSON store** - Rejected: breaks single-file-of-truth principle

Rationale: YAML frontmatter is a standard pattern, easy to parse, and keeps status co-located with task content.

### Decision: Completion Percentage Calculation

```
percentage = (completed_tasks / total_tasks) * 100
```

Where `completed_tasks` = tasks with `status: done`, `total_tasks` = all tasks in change.

When `total_tasks = 0`, percentage = 0.

Changes at 100% completion are still selectable (for edge cases where all tasks are done but change isn't archived).

### Decision: Age Determination via proposal.md birthtime

Change age is determined by the file creation time (`birthtime`) of `proposal.md`.

Alternatives considered:
- **Directory mtime** - Rejected: changes with each edit
- **Git commit date** - Rejected: requires git history access, complex
- **Frontmatter date field** - Rejected: manual entry, error-prone

### Decision: Command Structure

```bash
openspec next-task [--did-complete-previous] [--json]
openspec next [--did-complete-previous] [--json]  # alias
```

The `next-task` name follows the verb-noun pattern used by `next` in workflow contexts. The `next` alias provides brevity.

## Risks / Trade-offs

### Risk: Status out of sync with actual completion

When a developer completes work but forgets to run with `--did-complete-previous`, the status remains stale.

Mitigation:
- Running without flag shows full context, prompting awareness
- Status can be manually edited in task file
- No automatic status changes without explicit flag

### Risk: birthtime not reliable on all filesystems

Some filesystems don't preserve creation time accurately.

Mitigation:
- Fall back to mtime if birthtime unavailable
- Document this behavior in CLI help

## Migration Plan

No migration required. Tasks without frontmatter or status field default to `to-do` when parsed.

Rollback: Remove the command from CLI registration; existing task files remain valid.

## Open Questions

None - all decisions resolved based on issue specification.
