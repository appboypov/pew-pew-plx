## MODIFIED Requirements

### Requirement: Quick Reference Placement
The AI instructions SHALL begin with a quick-reference section that surfaces required file structures, templates, and formatting rules before any narrative guidance.

#### Scenario: Loading templates at the top
- **WHEN** `workspace/AGENTS.md` is regenerated or updated
- **THEN** the first substantive section after the title SHALL provide copy-ready headings for `proposal.md`, `tasks/` directory structure, spec deltas, and scenario formatting
- **AND** link each template to the corresponding workflow step for deeper reading
