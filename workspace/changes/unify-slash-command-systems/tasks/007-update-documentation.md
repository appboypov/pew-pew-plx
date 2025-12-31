---
status: done
---

# Task: Update Documentation

## End Goal
ARCHITECTURE.md reflects the unified slash command system.

## Currently
- ARCHITECTURE.md mentions `PlxSlashCommandRegistry` as separate
- References "PLX Slash Commands" as fork-specific feature
- Mentions `plx-<tool>.ts` files

## Should
- ARCHITECTURE.md describes single unified registry
- No mention of separate PLX registry
- Updated file references

## Constraints
- [ ] Keep documentation accurate to new architecture
- [ ] Remove references to deleted files

## Acceptance Criteria
- [ ] ARCHITECTURE.md has no `PlxSlashCommandRegistry` references
- [ ] Registry Pattern section describes single registry
- [ ] Fork-specific features updated

## Implementation Checklist
- [x] 7.1 Update Registry Pattern section in ARCHITECTURE.md
- [x] 7.2 Update Fork-Specific Features section
- [x] 7.3 Update "Adding a New AI Tool" section
- [x] 7.4 Remove references to `plx-<tool>.ts` files

## Notes
Keep the documentation concise and accurate.
