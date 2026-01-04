# Change: Refactor Template Documentation Pattern

## Why

The current RELEASE.md (481 lines) mixes configuration with verbose documentation, making it unwieldy as a project config file. REVIEW.md (28 lines) already follows the correct pattern - minimal config with documentation in commands. This change standardizes the pattern across all template docs and adds TESTING.md + test commands.

## What Changes

- **RELEASE.md**: Slim down from 481 lines to ~50 lines config-style (defaults: keep-a-changelog, standard style, technical audience, no emoji)
- **refine-release command**: Embed all option documentation (format templates, style examples, badge patterns)
- **prepare-release command**: Update to read minimal config and apply defaults
- **TESTING.md**: New config file for test workflows (test types, coverage, patterns)
- **refine-testing command**: New command to create/update TESTING.md with all options documented
- **plx/test command**: New command to run testing workflow (args: --change-id, --task-id, --spec-id like review)

## Impact

- Affected specs: `plx-slash-commands`, `cli-init` (if TESTING.md added to init)
- Affected code:
  - `src/core/templates/slash-command-templates.ts` (new commands, updated bodies)
  - `src/core/init.ts` (add TESTING.md creation)
  - `src/core/update.ts` (add TESTING.md creation on update)
  - All tool configurator slash command files (new test/refine-testing commands)
  - Root `RELEASE.md` (slim down)
