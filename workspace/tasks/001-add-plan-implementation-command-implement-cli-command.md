---
status: done
skill-level: medior
parent-type: change
parent-id: add-plan-implementation-command
---

# Task: Implement CLI Command (plx create progress)

## End Goal

The CLI command `plx create progress --change-id <id>` exists and generates PROGRESS.md at project root with all non-completed tasks embedded.

## Currently

- `plx create` supports `task`, `change`, `spec`, and `request` subcommands
- No mechanism to generate PROGRESS.md with embedded task content
- Multi-agent handoffs require manual context copying

## Should

- New `plx create progress --change-id <id>` subcommand
- Generates PROGRESS.md at project root
- Includes only non-completed tasks (to-do, in-progress)
- Each task section contains:
  - Checkbox for completion tracking
  - Full task content embedded
  - Relevant proposal context
  - Agent pickup instructions (no PROGRESS.md mention)
  - `plx complete task --id <task-id>` at end

## Constraints

- [ ] Must not modify existing create subcommands
- [ ] Must use existing ItemRetrievalService for task discovery
- [ ] Must follow existing CreateCommand patterns
- [ ] Must support `--json` flag for machine-readable output

## Acceptance Criteria

- [ ] Running `plx create progress --change-id <id>` creates PROGRESS.md
- [ ] Tasks with status `done` are excluded
- [ ] Each task block is self-contained with full context
- [ ] Agent instructions do not mention PROGRESS.md
- [ ] Error when change not found
- [ ] Error when all tasks complete
- [ ] JSON output includes success, path, changeId, taskCount

## Implementation Checklist

- [x] 1.1 Add `ProgressOptions` interface to `src/commands/create.ts`
- [x] 1.2 Add `createProgress` method to `CreateCommand` class
- [x] 1.3 Implement task discovery using ItemRetrievalService
- [x] 1.4 Filter tasks to non-completed (to-do, in-progress)
- [x] 1.5 Load proposal.md content for context embedding
- [x] 1.6 Add `getProgressTemplate` method to TemplateManager
- [x] 1.7 Generate task block content with embedded task and proposal context
- [x] 1.8 Write PROGRESS.md to project root
- [x] 1.9 Register `create progress` subcommand in `src/cli/index.ts`
- [x] 1.10 Add command to shell completion registry

## Notes

Reference existing `createTask` and `createChange` methods for patterns.
