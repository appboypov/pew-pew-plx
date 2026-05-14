---
status: done
---

# Task: Implement Slash Command Templates

## End Goal

Four new PLX slash commands: review, refine-architecture, refine-review, parse-feedback.

## Currently

PLX commands include: init-architecture, update-architecture, get-task, compact, complete-task, undo-task.

## Should

Modify `/src/core/templates/splx-slash-command-templates.ts`:
- Add 'review', 'refine-architecture', 'refine-review', 'parse-feedback' to SplxSlashCommandId
- Add template bodies for each new command

Update all PLX configurators in `/src/core/configurators/slash/`:
- Add FILE_PATHS for new commands
- Add FRONTMATTER for new commands

## Constraints

- Must follow existing template patterns
- Must use PLX markers for managed content
- Must include guardrails and steps sections

## Acceptance Criteria

- [ ] SplxSlashCommandId includes all 4 new command IDs
- [ ] Template bodies defined for all 4 commands
- [ ] splx-claude.ts has paths and frontmatter for new commands
- [ ] All other splx-*.ts configurators updated
- [ ] `splx init` generates new commands
- [ ] `splx update` updates new commands

## Implementation Checklist

- [x] Add new IDs to SplxSlashCommandId type
- [x] Add splx/review template body
- [x] Add splx/refine-architecture template body
- [x] Add splx/refine-review template body
- [x] Add splx/parse-feedback template body
- [x] Update splx-base.ts ALL_PLX_COMMANDS array
- [x] Update splx-claude.ts FILE_PATHS and FRONTMATTER
- [x] Update all other splx-*.ts configurators
- [x] Test init generates new commands
- [x] Test update refreshes new commands

## Notes

Template structure for each command:

splx/review:
- Guardrails: ask what to review, use CLI, output feedback markers
- Steps: ask target, search if ambiguous, retrieve criteria, review, insert markers

splx/refine-architecture:
- Guardrails: practical docs, preserve user content
- Steps: check ARCHITECTURE.md, create or update

splx/refine-review:
- Guardrails: template structure, preserve guidelines
- Steps: check REVIEW.md, create or update

splx/parse-feedback:
- Guardrails: scan tracked files, one task per marker
- Steps: run CLI, review tasks, address, archive
