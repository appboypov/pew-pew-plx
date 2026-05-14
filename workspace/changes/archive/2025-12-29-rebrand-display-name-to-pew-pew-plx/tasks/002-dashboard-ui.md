---
status: done
---

# Task: Update Dashboard and UI Output

## End Goal

Dashboard title and UI success/progress messages display "OpenSplx".

## Currently

- Dashboard shows "PLX Dashboard"
- Success messages say "Updated PLX instructions"
- User prompts reference "PLX tooling"

## Should

Display "OpenSplx" in all user-visible console output.

## Constraints

- [ ] Keep console styling (chalk colors, ora spinners) unchanged
- [ ] Command references in prompts stay as `splx`

## Acceptance Criteria

- [ ] Dashboard title shows "OpenSplx Dashboard"
- [ ] Success messages reference "OpenSplx"
- [ ] User prompts reference "OpenSplx tooling"

## Implementation Checklist

- [x] Update `src/core/view.ts:16` - "PLX Dashboard" → "OpenSplx Dashboard"
- [x] Update `src/core/update.ts` - success message
- [x] Update `src/core/init.ts` - user prompts ("Extend your PLX tooling", etc.)

## Notes

The dashboard is the most visible user touchpoint - this is where "OpenSplx" branding has highest impact.
