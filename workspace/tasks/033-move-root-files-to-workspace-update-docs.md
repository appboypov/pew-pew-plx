---
status: to-do
skill-level: junior
parent-type: change
parent-id: move-root-files-to-workspace
---

# Task: Update documentation files

## End Goal
ARCHITECTURE.md (project), README.md, and related documentation reflect new file locations.

## Currently
- `ARCHITECTURE.md` shows files at project root
- `README.md` references files at project root in slash command descriptions

## Should
- Documentation shows template files in `workspace/` directory
- Directory structure examples are accurate

## Constraints
- [ ] Only update location references, not file descriptions
- [ ] Keep documentation accurate and consistent

## Acceptance Criteria
- [ ] ARCHITECTURE.md directory structure is accurate
- [ ] README.md slash command descriptions mention correct paths

## Implementation Checklist
- [ ] 8.1 Update ARCHITECTURE.md project structure section (once moved to workspace)
- [ ] 8.2 Update README.md slash command descriptions
- [ ] 8.3 Verify no other stale references exist

## Notes
ARCHITECTURE.md itself will be moved to workspace/ as part of migration, so update it there.
