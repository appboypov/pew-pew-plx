---
status: done
---

# Task: Implement Slash Command Templates

## End Goal

Four new PLX slash commands: review, refine-architecture, refine-review, parse-feedback.

## Currently

PLX commands include: init-architecture, update-architecture, get-task, compact, complete-task, undo-task.

## Should

Modify `/src/core/templates/plx-slash-command-templates.ts`:
- Add 'review', 'refine-architecture', 'refine-review', 'parse-feedback' to PlxSlashCommandId
- Add template bodies for each new command

Update all PLX configurators in `/src/core/configurators/slash/`:
- Add FILE_PATHS for new commands
- Add FRONTMATTER for new commands

## Constraints

- Must follow existing template patterns
- Must use PLX markers for managed content
- Must include guardrails and steps sections

## Acceptance Criteria

- [ ] PlxSlashCommandId includes all 4 new command IDs
- [ ] Template bodies defined for all 4 commands
- [ ] plx-claude.ts has paths and frontmatter for new commands
- [ ] All other plx-*.ts configurators updated
- [ ] `plx init` generates new commands
- [ ] `plx update` updates new commands

## Implementation Checklist

- [x] Add new IDs to PlxSlashCommandId type
- [x] Add plx/review template body
- [x] Add plx/refine-architecture template body
- [x] Add plx/refine-review template body
- [x] Add plx/parse-feedback template body
- [x] Update plx-base.ts ALL_PLX_COMMANDS array
- [x] Update plx-claude.ts FILE_PATHS and FRONTMATTER
- [x] Update all other plx-*.ts configurators
- [x] Test init generates new commands
- [x] Test update refreshes new commands

## Notes

Template structure for each command:

plx/review:
- Guardrails: ask what to review, use CLI, output feedback markers
- Steps: ask target, search if ambiguous, retrieve criteria, review, insert markers

plx/refine-architecture:
- Guardrails: practical docs, preserve user content
- Steps: check ARCHITECTURE.md, create or update

plx/refine-review:
- Guardrails: template structure, preserve guidelines
- Steps: check REVIEW.md, create or update

plx/parse-feedback:
- Guardrails: scan tracked files, one task per marker
- Steps: run CLI, review tasks, address, archive
