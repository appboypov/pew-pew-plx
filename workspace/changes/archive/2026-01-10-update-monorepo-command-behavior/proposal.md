# Change: Update Monorepo Slash Command Behavior

## Why

Current PLX slash commands assume single-workspace projects. In monorepos with multiple packages, commands place proposals and releases in the wrong workspace (root instead of package-specific). Additionally, prepare-release lacks explicit guidance on version numbering and date handling.

## What Changes

### 1. Prepare-Release Improvements
- **BREAKING**: Never use "Unreleased" in changelogs - always determine concrete next version
- Add instruction to run `date` command for accurate release date
- Add version bump suggestion logic (breaking → major, feat → minor, fix → patch)

### 2. Monorepo-Aware Commands
Update all artifact-creating slash commands to:
- Derive target package from user's request context
- Clarify with user if target package is unclear
- Create artifacts in relevant package's workspace folder
- Create separate proposals/releases per package when multiple affected
- Follow each package's AGENTS.md if present

**Affected commands:**
- `/plx/plan-proposal`
- `/plx/plan-request`
- `/plx/prepare-release`
- `/plx/review`
- `/plx/parse-feedback`
- `/plx/refine-architecture`
- `/plx/refine-release`
- `/plx/refine-review`
- `/plx/refine-testing`

## Impact

- Affected specs: `plx-slash-commands`
- Affected code: `.claude/commands/plx/*.md` (slash command prompts)
- No CLI code changes required - these are prompt-only updates
