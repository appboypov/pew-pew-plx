---
tracked-issues:
  - tracker: linear
    id: PLX-17
    url: https://linear.app/de-app-specialist/issue/PLX-17/user-is-able-to-preserve-progress-across-context-limited-chat-sessions
---

# Change: Add /splx/compact context preservation command

## Why

When an AI agent's context window runs out during a chat session, all progress, decisions, and state are lost. Users must manually re-explain the situation to a new agent, wasting time and causing inconsistencies.

## What Changes

- Add `'compact'` to `SplxSlashCommandId` type union
- Add compact command body with guardrails and steps to `splxSlashCommandBodies`
- Add `'compact'` to `ALL_PLX_COMMANDS` array
- Update all 20 tool configurators with FILE_PATHS and FRONTMATTER entries for compact
- Generated command instructs agents to create/update `PROGRESS.md` with session state
- Command instructs agents to add `PROGRESS.md` to `.gitignore`

## Impact

- Affected specs: `splx-slash-commands`
- Affected code:
  - `src/core/templates/splx-slash-command-templates.ts`
  - `src/core/configurators/slash/splx-base.ts`
  - `src/core/configurators/slash/splx-claude.ts`
  - `src/core/configurators/slash/splx-cursor.ts`
  - `src/core/configurators/slash/splx-windsurf.ts`
  - `src/core/configurators/slash/splx-cline.ts`
  - 16 additional configurator files
