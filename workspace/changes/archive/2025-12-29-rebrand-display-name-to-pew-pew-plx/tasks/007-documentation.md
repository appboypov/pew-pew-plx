---
status: done
---

# Task: Update Documentation

## End Goal

README.md and CLAUDE.md use "OpenSplx" for product references.

## Currently

- README.md has "PLX dashboard preview", "PLX Slash Commands"
- CLAUDE.md has "# PLX Instructions" references

## Should

Use "OpenSplx" for product name while keeping `splx` for CLI commands.

## Constraints

- [ ] Code examples stay as `splx init`, `splx list`, etc.
- [ ] Markers in CLAUDE.md stay as `<!-- PLX:START -->`
- [ ] Links and file paths unchanged

## Acceptance Criteria

- [ ] README.md section titles use "OpenSplx"
- [ ] README.md alt text updated
- [ ] CLAUDE.md product references updated

## Implementation Checklist

- [x] Update `README.md` - "PLX Slash Commands" section
- [x] Update `README.md` - "PLX dashboard preview" alt text
- [x] Update `README.md` - any other product name references
- [x] Update `CLAUDE.md` - product name references (not markers)

## Notes

README.md is the first thing users see - branding impact is high.
