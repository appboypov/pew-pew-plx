# Change: Add splx/plan-request command and rename proposal to plan-proposal

## Why

Create a two-phase planning workflow where intent clarification (`plan-request`) precedes proposal scaffolding (`plan-proposal`). This separates "what does the user want" from "how do we implement it" into distinct steps, reducing ambiguity in proposals.

## What Changes

- **ADDED** `splx/plan-request` slash command - Intent clarification through iterative yes/no questions, outputs `request.md` in change folder
- **RENAMED** `splx/proposal` to `splx/plan-proposal` - Same functionality plus auto-detection of `request.md` when present
- **MODIFIED** `SlashCommandId` type - Change `proposal` to `plan-proposal`
- **MODIFIED** All tool configurators - Update file paths and frontmatter for renamed command

## Impact

- Affected specs: `splx-slash-commands`
- Affected code:
  - `.claude/commands/splx/proposal.md` → `.claude/commands/splx/plan-proposal.md`
  - `src/core/templates/slash-command-templates.ts`
  - `src/core/configurators/slash/*.ts` (14+ files)
  - `src/core/templates/agents-template.ts`
  - `workspace/AGENTS.md`
  - Tests referencing `proposal.md`
