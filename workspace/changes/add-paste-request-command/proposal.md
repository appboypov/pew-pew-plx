# Change: Add paste request command

## Why

Users need a way to capture raw clipboard content into the PLX workflow when starting new proposals. Currently, users must manually create and populate request files, which adds friction to the proposal process.

## What Changes

- Add `plx paste request` command to save clipboard content to `workspace/drafts/request.md`
- Update proposal workflow to recognise and move `drafts/request.md` into change directories
- Add new `cli-paste` specification
- Document `request.md` as a recognised file type in change directories

## Impact

- Affected specs: `cli-paste` (new)
- Affected code: `src/utils/clipboard.ts` (new), `src/commands/paste.ts` (new), `src/cli/index.ts`
- Affected docs: `.claude/commands/plx/proposal.md`, `workspace/AGENTS.md`
