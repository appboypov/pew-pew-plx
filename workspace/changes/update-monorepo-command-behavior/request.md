# Request: Update Monorepo Slash Command Behavior

## Source Input

```
- [ ] prepare-release should never add unreleased in changelogs, remove that - always put the next version there and optionally suggest a bigger bump is the change thats being added qualifies for it - and make sure it updates the proper date by running the date command
- [ ] all commands like plan-proposal, prepare-release etc, should always consider placing those proposal and plans etc in the folders the changes are for, for exmaple when working in a mono repo with mana packages, the proposals shouls go in the package folders workspaces, not in the mono repo - only the changes for the mono repo itself ghould go in the mono repo - same for all the other commands - they must go and folow all instructions for that specific folder e..g fif there are mulitple package and prepare release is run they do it invidiually for both
```

## Current Understanding

These are changes to **Claude Code slash commands** (`.claude/commands/plx/*`), NOT PLX CLI commands.

### Change 1: Prepare-Release Changelog Behavior (`/plx/prepare-release`)
- Remove "Unreleased" section usage in changelogs
- Always use the actual next version number instead
- Suggest larger version bumps when changes warrant it (e.g., breaking changes → major)
- Use `date` command to get the correct release date

### Change 2: Monorepo-Aware Slash Command Execution
- Slash commands (`/plx/plan-proposal`, `/plx/prepare-release`, etc.) should respect monorepo structure
- Proposals/changes should go in the relevant package's workspace folder, not the monorepo root
- Root workspace only for root-level changes
- When multiple packages exist, commands operate on the package the user is focused on
- Each package follows its own AGENTS.md/instructions if present

## Identified Ambiguities

1. ~~**Scope of "commands"**: Which slash commands need monorepo awareness? All of them, or specific subset?~~ → Resolved
2. ~~**Workspace detection**: How to detect which package context the user is working in?~~ → Resolved
3. ~~**Version bump suggestion**: What criteria determine a "bigger bump"? (breaking changes, MODIFIED vs ADDED, etc.)~~ → Resolved
4. ~~**Cross-package changes**: How to handle changes that span multiple packages?~~ → Resolved

## Decisions

1. **Command scope**: All relevant slash commands that create/modify artifacts need monorepo awareness (plan-proposal, plan-request, prepare-release, review, parse-feedback, refine-architecture, refine-release, refine-review, refine-testing, etc.)
2. **Workspace detection**: Derive target package from user's request context. Clarify if unclear which package the user wants to operate on.
3. **Version bump criteria**: Use all indicators - breaking changes suggest major, feat = minor, fix = patch, BREAKING footer = major, plus AI judgment on overall scope to recommend appropriate bump.
4. **Cross-package changes**: Create separate proposals/releases per package. Each package gets its own workspace artifacts.
5. **Changelog version handling**: Explicitly instruct to never use "Unreleased", always determine concrete next version number, and run `date` command to get accurate release date.

## Final Intent

Update Claude Code slash commands (`.claude/commands/plx/*`) with two changes:

### 1. Prepare-Release Changelog Improvements
Update `/plx/prepare-release` to:
- Never use "Unreleased" in changelogs - always determine and use the concrete next version number
- Run the `date` command to get the accurate release date
- Suggest appropriate version bumps based on: breaking changes → major, feat → minor, fix → patch, BREAKING footer → major, plus AI judgment on overall change scope

### 2. Monorepo-Aware Slash Commands
Update all artifact-creating slash commands to be monorepo-aware:
- `/plx/plan-proposal`
- `/plx/plan-request`
- `/plx/prepare-release`
- `/plx/review`
- `/plx/parse-feedback`
- `/plx/refine-architecture`
- `/plx/refine-release`
- `/plx/refine-review`
- `/plx/refine-testing`

Each command should:
- Derive target package from user's request context
- Clarify with user if target package is unclear
- Create artifacts in the relevant package's workspace folder (not monorepo root)
- Root workspace only for root-level changes
- When multiple packages affected, create separate proposals/releases per package
- Follow each package's own AGENTS.md/instructions if present
