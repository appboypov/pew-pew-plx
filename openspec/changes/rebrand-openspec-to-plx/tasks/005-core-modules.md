---
status: to-do
---

# Task: Update core modules and postinstall

## End Goal

All core modules use PLX terminology in user-facing messages and directory paths.

## Currently

- Core modules reference "openspec" directory in path operations
- User-facing messages mention "OpenSpec"
- `scripts/postinstall.js` references OpenSpec in messages

## Should

- Core modules reference "workspace" directory in path operations
- User-facing messages mention "PLX"
- `scripts/postinstall.js` references PLX in messages

## Constraints

- [ ] All user-facing output must use PLX terminology
- [ ] All directory path operations must use "workspace"
- [ ] Validation messages must reference PLX

## Acceptance Criteria

- [ ] `plx list` shows workspace directory in paths
- [ ] `plx init` mentions PLX in success messages
- [ ] Error messages reference PLX, not OpenSpec

## Implementation Checklist

- [ ] 5.1 Update `src/core/init.ts`: change directory creation paths and user-facing messages
- [ ] 5.2 Update `src/core/update.ts`: change directory references and messages
- [ ] 5.3 Update `src/core/archive.ts`: change directory references
- [ ] 5.4 Update `src/core/list.ts`: change directory references from "openspec" to "workspace"
- [ ] 5.5 Update `src/core/view.ts`: change directory references from "openspec" to "workspace"
- [ ] 5.6 Update `src/core/validation/constants.ts`: update GUIDE messages to reference PLX
- [ ] 5.7 Update `scripts/postinstall.js`: update all messages to reference PLX
- [ ] 5.8 Search for remaining "openspec" or "OpenSpec" in user-facing strings and update

## Notes

Focus on user-visible strings. Internal comments can retain historical context if needed.
