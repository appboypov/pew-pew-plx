# docs-agent-instructions Specification

## Purpose
TBD - created by archiving change improve-agent-instruction-usability. Update Purpose after archive.
## Requirements
### Requirement: Quick Reference Placement
The AI instructions SHALL begin with a quick-reference section that surfaces required file structures, templates, and formatting rules before any narrative guidance.

#### Scenario: Loading templates at the top
- **WHEN** `openspec/AGENTS.md` is regenerated or updated
- **THEN** the first substantive section after the title SHALL provide copy-ready headings for `proposal.md`, `tasks/` directory structure, spec deltas, and scenario formatting
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

### Requirement: Task Directory Structure
`openspec/AGENTS.md` SHALL document that tasks are stored in a `tasks/` directory as individual numbered markdown files instead of a single `tasks.md` file.

#### Scenario: Documenting task directory structure
- **WHEN** an agent reads the task creation instructions
- **THEN** find documentation that tasks are stored in `tasks/` directory
- **AND** find that each task file is named with a three-digit prefix (e.g., `001-<task-name>.md`)
- **AND** find that files are processed in sequence order based on the numeric prefix
- **AND** find guidance that minimum 3 task files are recommended: implementation, review, testing

#### Scenario: Documenting auto-migration behavior
- **WHEN** an agent encounters a legacy change with `tasks.md`
- **THEN** find documentation that CLI auto-migrates `tasks.md` to `tasks/001-tasks.md`
- **AND** understand that migration happens transparently on first CLI access

### Requirement: Task File Template
`openspec/AGENTS.md` SHALL provide a complete template for task files with all required sections.

#### Scenario: Providing task file template
- **WHEN** an agent creates task files
- **THEN** find a template with these sections:
  - `# Task: <title>` - Descriptive title
  - `## End Goal` - What this task accomplishes
  - `## Currently` - Current state before this task
  - `## Should` - Expected state after this task
  - `## Constraints` - Checkbox items using `- [ ]` syntax
  - `## Acceptance Criteria` - Checkbox items using `- [ ]` syntax
  - `## Implementation Checklist` - Checkbox items using `- [ ]` syntax
  - `## Notes` - Additional context if needed

#### Scenario: Documenting task counting exclusions
- **WHEN** an agent reads about task progress calculation
- **THEN** find documentation that checkboxes under `## Constraints` are ignored
- **AND** find documentation that checkboxes under `## Acceptance Criteria` are ignored

#### Scenario: Task file naming convention
- **WHEN** an agent names task files
- **THEN** find guidance to use format `NNN-<kebab-case-name>.md`
- **AND** find that NNN is a three-digit zero-padded sequence number
- **AND** find examples using `NNN-<descriptive-name>.md` pattern

### Requirement: Question Tool Usage

`openspec/AGENTS.md` and slash command templates SHALL instruct AI assistants to use their available question tools for gathering clarifications instead of asking questions directly in chat.

#### Scenario: Base guardrail for question tool usage

- **WHEN** an AI assistant reads the slash command guardrails
- **THEN** find an instruction to use available question tools (if one exists) for gathering clarifications
- **AND** find a fallback instruction to ask in chat when no question tool is available

#### Scenario: AGENTS.md references question tools

- **WHEN** an AI assistant reads the "Before Creating Specs" section in `openspec/AGENTS.md`
- **THEN** find guidance to use question tools when gathering clarifications for ambiguous requests
- **AND** find the same pattern in the error recovery section

#### Scenario: Generic tool-agnostic phrasing

- **WHEN** an AI assistant reads question tool guidance
- **THEN** find tool-agnostic phrasing like "your available question tool" rather than specific tool names
- **AND** understand the guidance applies regardless of which AI tool is being used

### Requirement: Single Task Execution

`openspec/AGENTS.md` SHALL instruct agents to stop after completing one task and await user confirmation before proceeding to the next task.

#### Scenario: Documenting stop-and-wait behavior

- **WHEN** an agent reads Stage 2: Implementing Changes
- **THEN** find instruction to stop after completing the current task
- **AND** find instruction to await user confirmation before proceeding to the next task
- **AND** NOT find instruction to automatically repeat or continue until all tasks are done

