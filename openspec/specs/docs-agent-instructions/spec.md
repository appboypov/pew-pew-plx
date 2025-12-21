# docs-agent-instructions Specification

## Purpose
TBD - created by archiving change improve-agent-instruction-usability. Update Purpose after archive.
## Requirements
### Requirement: Quick Reference Placement
The AI instructions SHALL begin with a quick-reference section that surfaces required file structures, templates, and formatting rules before any narrative guidance.

#### Scenario: Loading templates at the top
- **WHEN** `openspec/AGENTS.md` is regenerated or updated
- **THEN** the first substantive section after the title SHALL provide copy-ready headings for `proposal.md`, `tasks.md`, spec deltas, and scenario formatting
- **AND** link each template to the corresponding workflow step for deeper reading

### Requirement: Embedded Templates and Examples
`openspec/AGENTS.md` SHALL include complete copy/paste templates and inline examples exactly where agents make corresponding edits.

#### Scenario: Providing file templates
- **WHEN** authors reach the workflow guidance for drafting proposals and deltas
- **THEN** provide fenced Markdown templates that match the required structure (`## Why`, `## ADDED Requirements`, `#### Scenario:` etc.)
- **AND** accompany each template with a brief example showing correct header usage and scenario bullets

### Requirement: Pre-validation Checklist
`openspec/AGENTS.md` SHALL offer a concise pre-validation checklist that highlights common formatting mistakes before running `openspec validate`.

#### Scenario: Highlighting common validation failures
- **WHEN** a reader reaches the validation guidance
- **THEN** present a checklist reminding them to verify requirement headers, scenario formatting, and delta sections
- **AND** include reminders about at least `#### Scenario:` usage and descriptive requirement text before scenarios

### Requirement: Progressive Disclosure of Workflow Guidance
The documentation SHALL separate beginner essentials from advanced topics so newcomers can focus on core steps without losing access to advanced workflows.

#### Scenario: Organizing beginner and advanced sections
- **WHEN** reorganizing `openspec/AGENTS.md`
- **THEN** keep an introductory section limited to the minimum steps (scaffold, draft, validate, request review)
- **AND** move advanced topics (multi-capability changes, archiving details, tooling deep dives) into clearly labeled later sections
- **AND** provide anchor links from the quick-reference to those advanced sections

### Requirement: External Issue Tracking Guidance

`openspec/AGENTS.md` SHALL include guidance for detecting, storing, and updating external issue references throughout the proposal lifecycle.

#### Scenario: Providing issue detection guidance

- **WHEN** an agent reads the External Issue Tracking section
- **THEN** find instructions for detecting issue references in user input
- **AND** find guidance on confirming tracking with the user before storing

#### Scenario: Providing metadata storage format

- **WHEN** an agent needs to store tracked issue references
- **THEN** find the YAML frontmatter format for proposal.md
- **AND** understand that only immutable references (tracker, id, url) are stored

#### Scenario: Providing update workflow guidance

- **WHEN** an agent needs to update external issues
- **THEN** find guidance on when to post updates (proposal created, section completed, archive)
- **AND** find instruction to confirm with user before any external update

#### Scenario: Providing tool usage guidance

- **WHEN** an agent has access to issue tracker tools
- **THEN** find guidance on using available tools to interact with trackers
- **AND** find fallback guidance for when no tools are available

