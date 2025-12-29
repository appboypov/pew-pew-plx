# Task: Verify behavior with real changes

## End Goal

Manual verification confirms that `plx act next` correctly filters completed changes and outputs full task file content.

## Currently

The implementation and tests are complete but need manual verification against the actual OpenSplx repository changes.

## Should

Running `plx act next` in the OpenSplx repository:
- Skips changes like `add-antigravity-support` (100% complete)
- Selects changes like `add-scaffold-command` or `make-validation-scope-aware` (incomplete)
- Outputs the full task file content, not just checkboxes
- Outputs proposal.md and design.md (if present) before the task content

## Constraints

- [ ] Must verify both JSON and text output formats
- [ ] Must verify output order: proposal → design → task content

## Acceptance Criteria

- [ ] `plx act next` skips 100% complete changes in OpenSplx
- [ ] `plx act next` returns an incomplete change
- [ ] Full task file content is displayed (not just checkboxes)
- [ ] Output order is: proposal.md → design.md (optional) → task content
- [ ] `plx act next --json` includes full `taskContent` field

## Implementation Checklist

- [x] 3.1 Run `plx act next` and verify it skips completed changes
- [x] 3.2 Verify the selected change has incomplete checkboxes
- [x] 3.3 Verify full task file content is output (all sections visible)
- [x] 3.4 Run `plx act next --json` and verify `taskContent` contains full content
- [x] 3.5 Verify proposal.md is output before task content
- [x] 3.6 Run `npm run lint` to verify code style

## Notes

Current repository state (from `plx list`):
- Complete: `add-antigravity-support`, `add-prioritized-next-task`, etc.
- Incomplete: `add-scaffold-command` (0/7), `make-validation-scope-aware` (0/8)

After this change, `plx act next` should select `add-scaffold-command` or similar incomplete change instead of a completed one.
