---
status: done
skill-level: medior
parent-type: change
parent-id: extend-paste-command
---
# Task: Add paste task subcommand

## End Goal

The `plx paste task` command creates tasks from clipboard content, supporting both standalone and parented tasks via `--parent-id`.

## Currently

The `PasteCommand` class in `src/commands/paste.ts` only supports the `request` subcommand. There is no way to create tasks from clipboard content.

## Should

- `plx paste task` creates a standalone task in `workspace/tasks/`
- `plx paste task --parent-id <id>` creates a parented task with proper frontmatter
- Task filename follows pattern `NNN-<name>.md` (standalone) or `NNN-<parent-id>-<name>.md` (parented)
- Clipboard content populates `## End Goal` section
- Frontmatter includes `status: to-do` and optional `parent-type`/`parent-id`
- Sequence number auto-generated based on existing tasks for parent (or standalone)
- Error handling for empty clipboard and invalid parent-id

## Constraints

- [ ] Reuse `ClipboardUtils.read()` from existing implementation
- [ ] Task template structure matches `plx create task` output (assumes `add-create-command` complete)
- [ ] Validate parent entity exists before creating parented task
- [ ] Follow existing error handling patterns in PasteCommand

## Acceptance Criteria

- [ ] `plx paste task` creates task file with clipboard content
- [ ] `plx paste task --parent-id <id>` creates parented task with correct frontmatter
- [ ] Task filename uses correct pattern based on parent presence
- [ ] Sequence number auto-increments correctly
- [ ] Error displayed when parent entity not found
- [ ] Error displayed when clipboard is empty

## Implementation Checklist

- [x] 1.1 Add `task` method to `PasteCommand` class
- [x] 1.2 Implement parent entity validation using `ItemRetrievalService`
- [x] 1.3 Implement task sequence number generation utility
- [x] 1.4 Create task template integration (import from shared templates)
- [x] 1.5 Register `paste task` subcommand in `src/cli/index.ts`
- [x] 1.6 Add `--parent-id` option to paste task subcommand

## Notes

Depends on shared template system from `add-create-command` proposal. If templates are not yet available, create placeholder templates that match the expected structure.
