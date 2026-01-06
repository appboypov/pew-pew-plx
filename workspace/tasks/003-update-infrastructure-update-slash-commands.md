---
status: done
skill-level: medior
parent-type: change
parent-id: update-infrastructure
---
# Task: Update All Slash Commands for New CLI Patterns

## End Goal

All 18 slash commands in `.claude/commands/plx/` use the new standardized CLI patterns.

## Currently

Slash commands reference:
- `plx list`, `plx show` for listing and display
- `plx parse feedback <name> --change-id <id>` style flags
- `plx review --change-id <id>` style flags
- `plx archive <change-id>` positional syntax

## Should

Slash commands reference:
- `plx get changes`, `plx get change --id <id>` for listing and display
- `plx parse feedback <name> --parent-id <id> --parent-type change` style flags
- `plx review change --id <id>` style syntax
- `plx archive change --id <id>` style syntax
- `plx create` command where entity creation is needed
- Centralized task storage references

## Constraints

- [ ] Update only the content within PLX markers
- [ ] Preserve frontmatter metadata
- [ ] Keep existing command structure and flow
- [ ] Update only CLI commands, not workflow guidance

## Acceptance Criteria

- [ ] All 18 slash commands updated with new CLI patterns
- [ ] No deprecated command references remain
- [ ] Command examples use `--id`, `--parent-id`, `--parent-type` consistently
- [ ] Review and parse-feedback commands use new syntax

## Implementation Checklist

- [x] 3.1 Update archive.md - change to `plx archive change --id <id>`
- [x] 3.2 Update complete-task.md - verify `plx complete task --id <id>` (already correct)
- [x] 3.3 Update get-task.md - verify `plx get task` patterns (already correct)
- [x] 3.4 Update implement.md - update list/show references
- [x] 3.5 Update orchestrate.md - update list/show references
- [x] 3.6 Update parse-feedback.md - change to `--parent-id`/`--parent-type` syntax
- [x] 3.7 Update plan-proposal.md - update list/show references
- [x] 3.8 Update plan-request.md - update list/show references
- [x] 3.9 Update prepare-compact.md - update any CLI references
- [x] 3.10 Update prepare-release.md - update any CLI references
- [x] 3.11 Update refine-architecture.md - update any CLI references
- [x] 3.12 Update refine-release.md - update any CLI references
- [x] 3.13 Update refine-review.md - update any CLI references
- [x] 3.14 Update refine-testing.md - update any CLI references
- [x] 3.15 Update review.md - change to `plx review change --id <id>` syntax
- [x] 3.16 Update sync-workspace.md - update any CLI references
- [x] 3.17 Update test.md - update any CLI references
- [x] 3.18 Update undo-task.md - verify `plx undo task --id <id>` (already correct)

## Notes

The slash command template system in `src/core/templates/slash-command-templates.ts` must also be updated (covered in task 005).
