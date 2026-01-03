---
status: to-do
---

# Task: Update documentation

## End Goal
ARCHITECTURE.md and workspace/AGENTS.md updated to document multi-workspace support.

## Currently
Documentation describes single-workspace behavior only.

## Should
Update documentation:
- **ARCHITECTURE.md**: Add section on multi-workspace discovery, update command descriptions
- **workspace/AGENTS.md**: Update CLI command examples with --workspace flag, document prefix format

## Constraints
- [ ] Keep existing documentation structure
- [ ] Add new sections rather than replacing existing content
- [ ] Include examples of common multi-workspace scenarios

## Acceptance Criteria
- [ ] ARCHITECTURE.md describes workspace discovery utility
- [ ] ARCHITECTURE.md lists --workspace global flag
- [ ] AGENTS.md shows --workspace usage examples
- [ ] Prefix format documented clearly

## Implementation Checklist
- [ ] 10.1 Add "Multi-Workspace Support" section to ARCHITECTURE.md
- [ ] 10.2 Document workspace discovery algorithm and constants
- [ ] 10.3 Document --workspace global flag
- [ ] 10.4 Update command descriptions for multi-workspace
- [ ] 10.5 Update CLI command table in AGENTS.md
- [ ] 10.6 Add multi-workspace examples to AGENTS.md
- [ ] 10.7 Document prefix format in both files

## Notes
Final task - documentation should reflect implemented behavior.
