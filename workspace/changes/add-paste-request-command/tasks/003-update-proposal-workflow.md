---
status: to-do
---

# Task: Update proposal.md and AGENTS.md

## End Goal

The proposal workflow recognises `drafts/request.md` and moves it to the change directory. AGENTS.md documents `request.md` as a recognised file type.

## Currently

- The proposal workflow has no input source mechanism
- AGENTS.md doesn't mention `request.md`

## Should

- `.claude/commands/plx/proposal.md` checks for `drafts/request.md` and moves it
- `workspace/AGENTS.md` documents `request.md` in directory structure and file purposes

## Constraints

- [ ] Use `mv` command (not copy) to relocate `request.md`
- [ ] Content of `request.md` must remain unedited
- [ ] Follow existing documentation patterns in AGENTS.md

## Acceptance Criteria

- [ ] Proposal workflow step 0 checks for `drafts/request.md`
- [ ] If exists, moves to change directory after creation
- [ ] AGENTS.md shows `request.md` in directory structure
- [ ] AGENTS.md documents `request.md` purpose

## Implementation Checklist

- [ ] Add "Input Sources" section to `.claude/commands/plx/proposal.md`
- [ ] Add step 0 to check and move `drafts/request.md`
- [ ] Update directory structure in `workspace/AGENTS.md` to include `request.md`
- [ ] Update "File Purposes" section in `workspace/AGENTS.md`

## Notes

The move uses `mv` command which is atomic on most filesystems and preserves the file content exactly.
