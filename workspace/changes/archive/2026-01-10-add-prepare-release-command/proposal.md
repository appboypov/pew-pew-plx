# Add Prepare Release Command

## End Goal

A `plx/prepare-release` slash command that orchestrates release preparation by guiding AI agents through updating changelog, readme, and architecture documentation in sequence, with full interactive configuration via a `RELEASE.md` root file.

## Currently

- Separate update-architecture, init-architecture, and refine-architecture commands exist for architecture documentation
- Separate refine-review command exists for REVIEW.md
- No unified command to prepare all release documentation at once
- Users must manually invoke multiple commands when preparing a release
- No changelog or readme update guidance for AI agents

## Should

- Create a new `plx/prepare-release` slash command registered in PlxSlashCommandRegistry
- Command follows the concise pattern (guardrails + steps) referencing `@RELEASE.md`
- Create `RELEASE.md` root file containing detailed Activity XML instructions for:
  - **Changelog update**: Source selection (git commits, branch diff, manual), version bump suggestion, format selection (keep-a-changelog, simple-list, github-release), audience targeting, emoji level configuration
  - **Readme update**: Style selection (minimal, standard, comprehensive, CLI tool, library/package), section configuration, badge configuration, audience targeting
  - **Architecture update**: Refresh ARCHITECTURE.md based on current codebase state
- RELEASE.md created during `plx init` and `plx update` (if not exists)
- Each release step is interactive via AskUserQuestion
- User can confirm or skip each step in the workflow

## Constraints

- Must follow existing PlxSlashCommandRegistry pattern
- Must use TemplateManager for template access
- Must respect existing file marker system (PLX:START/PLX:END)
- Command body must be concise (~10-15 lines) like other PLX commands
- RELEASE.md must follow similar pattern to REVIEW.md (customizable root file)

## Affected Specs

- `plx-slash-commands` (MODIFIED)

## Task Overview

1. Create RELEASE.md template
2. Update TemplateManager to export release template
3. Add prepare-release command body to templates
4. Update PLX base configurator with new command
5. Update all 20 tool-specific configurators
6. Update init.ts for RELEASE.md creation
7. Update update.ts for RELEASE.md creation
8. Add tests for new command
9. Review implementation
