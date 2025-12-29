---
status: done
---

# Task: Update Slash Command Display Names

## End Goal

Slash command display names and categories show "Pew Pew Plx".

## Currently

Claude and Cursor slash commands use:
- "PLX: Init Architecture"
- "PLX: Update Architecture"
- Category: "PLX"

## Should

Display "Pew Pew Plx" in slash command names and categories.

## Constraints

- [ ] Slash command filenames stay as `plx-*.md`
- [ ] Command functionality unchanged
- [ ] Directory paths stay as `.claude/commands/plx/`

## Acceptance Criteria

- [ ] Claude slash commands named "Pew Pew Plx: Init Architecture", etc.
- [ ] Cursor commands use category "Pew Pew Plx"
- [ ] All configurator-generated descriptions updated

## Implementation Checklist

- [x] Update `src/core/configurators/slash/plx-claude.ts` - command names (8 commands)
- [x] Update `src/core/configurators/slash/cursor.ts` - category and descriptions

## Notes

Slash command names appear in editor command palettes - high visibility.
