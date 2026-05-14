---
status: done
---

# Task: Update Slash Command Display Names

## End Goal

Slash command display names and categories show "OpenSplx".

## Currently

Claude and Cursor slash commands use:
- "PLX: Init Architecture"
- "PLX: Update Architecture"
- Category: "PLX"

## Should

Display "OpenSplx" in slash command names and categories.

## Constraints

- [ ] Slash command filenames stay as `splx-*.md`
- [ ] Command functionality unchanged
- [ ] Directory paths stay as `.claude/commands/splx/`

## Acceptance Criteria

- [ ] Claude slash commands named "OpenSplx: Init Architecture", etc.
- [ ] Cursor commands use category "OpenSplx"
- [ ] All configurator-generated descriptions updated

## Implementation Checklist

- [x] Update `src/core/configurators/slash/splx-claude.ts` - command names (8 commands)
- [x] Update `src/core/configurators/slash/cursor.ts` - category and descriptions

## Notes

Slash command names appear in editor command palettes - high visibility.
