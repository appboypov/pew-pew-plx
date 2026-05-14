---
status: done
parent-type: change
parent-id: unify-slash-command-systems
---
# Task: Update Documentation

## End Goal
ARCHITECTURE.md reflects the unified slash command system.

## Currently
- ARCHITECTURE.md mentions `SplxSlashCommandRegistry` as separate
- References "PLX Slash Commands" as fork-specific feature
- Mentions `splx-<tool>.ts` files

## Should
- ARCHITECTURE.md describes single unified registry
- No mention of separate PLX registry
- Updated file references

## Constraints
- [ ] Keep documentation accurate to new architecture
- [ ] Remove references to deleted files

## Acceptance Criteria
- [ ] ARCHITECTURE.md has no `SplxSlashCommandRegistry` references
- [ ] Registry Pattern section describes single registry
- [ ] Fork-specific features updated

## Implementation Checklist
- [x] 7.1 Update Registry Pattern section in ARCHITECTURE.md
- [x] 7.2 Update Fork-Specific Features section
- [x] 7.3 Update "Adding a New AI Tool" section
- [x] 7.4 Remove references to `splx-<tool>.ts` files

## Notes
Keep the documentation concise and accurate.
