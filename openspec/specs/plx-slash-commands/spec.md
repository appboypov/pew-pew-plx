# plx-slash-commands Specification

## Purpose
TBD - created by archiving change add-plx-architecture-commands. Update Purpose after archive.
## Requirements
### Requirement: PLX Slash Command Infrastructure

The system SHALL provide a separate PLX slash command infrastructure that coexists with OpenSpec commands without modifying the core OpenSpec workflow.

#### Scenario: PLX command registry exists independently

- **WHEN** the PLX slash command system is initialized
- **THEN** provide a `PlxSlashCommandRegistry` that is separate from `SlashCommandRegistry`
- **AND** support the same tool configurator pattern as OpenSpec commands
- **AND** use the same OpenSpec marker pattern (`<!-- OPENSPEC:START -->` / `<!-- OPENSPEC:END -->`) for managed content

### Requirement: Init Architecture Command

The system SHALL provide a `plx/init-architecture` slash command that instructs AI agents to generate comprehensive architecture documentation.

#### Scenario: Generating init-architecture command for Claude Code

- **WHEN** Claude Code is selected during initialization
- **THEN** create `.claude/commands/plx/init-architecture.md`
- **AND** include frontmatter with name "PLX: Init Architecture", description, category "PLX", and relevant tags
- **AND** wrap the command body in OpenSpec markers
- **AND** include guardrails focusing on practical, usable documentation
- **AND** include steps for: reading project manifest files, exploring the project directory structure, identifying patterns, creating ARCHITECTURE.md at project root

### Requirement: Update Architecture Command

The system SHALL provide a `plx/update-architecture` slash command that instructs AI agents to refresh existing architecture documentation.

#### Scenario: Generating update-architecture command for Claude Code

- **WHEN** Claude Code is selected during initialization
- **THEN** create `.claude/commands/plx/update-architecture.md`
- **AND** include frontmatter with name "PLX: Update Architecture", description, category "PLX", and relevant tags
- **AND** wrap the command body in OpenSpec markers
- **AND** include guardrails focusing on practical, usable documentation
- **AND** include steps for: reading existing ARCHITECTURE.md, exploring codebase for changes, updating document, preserving user-added content

### Requirement: Architecture Template Structure

The system SHALL provide an architecture template that AI agents can use as a starting point for ARCHITECTURE.md generation.

#### Scenario: Template contains required sections

- **WHEN** an AI agent uses the init-architecture command
- **THEN** the generated ARCHITECTURE.md SHALL contain these sections:
  - Overview (project purpose and high-level architecture)
  - Project Setup (prerequisites, installation, development)
  - Technology Stack (core technologies, key dependencies)
  - Project Structure (folder structure documentation)
  - Service Types and Patterns (service architecture, common patterns)
  - State Management (approach, state flow)
  - Conventions (naming, code organization, error handling)
  - API Patterns (external APIs, internal APIs)

### Requirement: PLX Command Updates on Re-Init

The system SHALL update PLX command content within markers when running init in extend mode.

#### Scenario: Refreshing PLX commands on re-init

- **GIVEN** an existing project with PLX commands at "./test-project"
- **WHEN** the user runs `plx init ./test-project` again
- **THEN** update PLX command content within OpenSpec markers
- **AND** preserve any content outside the markers

### Requirement: Act Next Actionable Filtering

The system SHALL filter out non-actionable changes when selecting the next task via `plx act next`.

#### Scenario: Skipping changes with all checkboxes complete

- **WHEN** a change has all implementation checkboxes marked as complete (`- [x]`)
- **THEN** the `plx act next` command SHALL skip that change
- **AND** select a change with incomplete checkboxes instead

#### Scenario: Skipping changes with no checkboxes

- **WHEN** a change has zero implementation checkboxes in its task files
- **THEN** the `plx act next` command SHALL skip that change
- **AND** select a change with incomplete checkboxes instead

#### Scenario: Returning null when no actionable changes exist

- **WHEN** all active changes are either complete or have no checkboxes
- **THEN** the `plx act next` command SHALL return null
- **AND** display "No active changes found" message

### Requirement: Compact Context Preservation Command

The system SHALL provide a `plx/compact` slash command that instructs AI agents to preserve session state for continuation across context-limited chat sessions.

#### Scenario: Generating compact command for Claude Code

- **WHEN** Claude Code is selected during initialization
- **THEN** create `.claude/commands/plx/compact.md`
- **AND** include frontmatter with name "PLX: Compact", description "Preserve session progress to PROGRESS.md for context handoff", category "PLX", and relevant tags
- **AND** wrap the command body in OpenSpec markers
- **AND** include guardrails for saving files, creating PROGRESS.md in project root, including sufficient detail for continuation, updating .gitignore, and handling existing PROGRESS.md files

#### Scenario: Command steps instruct agent to create PROGRESS.md

- **WHEN** an AI agent executes the compact command
- **THEN** the command SHALL instruct the agent to save all modified files
- **AND** instruct the agent to create or update `PROGRESS.md` in the project root
- **AND** instruct the agent to include sections for: Current Task, Status, Completed Steps, Remaining Steps, Key Decisions Made, Files Modified, Files Created, Open Questions/Blockers, Context for Next Agent, Related Resources
- **AND** instruct the agent to add `PROGRESS.md` to `.gitignore` if not already present
- **AND** instruct the agent to confirm completion to the user

#### Scenario: Compact command registered in all tool configurators

- **WHEN** OpenSpec is initialized for any supported tool
- **THEN** the compact command SHALL be generated alongside init-architecture, update-architecture, and get-task
- **AND** follow the same file path and frontmatter conventions as other PLX commands for that tool

### Requirement: Get Task Stop Behavior

The `plx/get-task` slash command SHALL instruct agents to stop after completing the retrieved task and await user confirmation before proceeding.

#### Scenario: Get-task command includes stop instruction

- **WHEN** the `plx/get-task` slash command is generated
- **THEN** include a step instructing agents to stop after task completion
- **AND** include instruction to await user confirmation before proceeding to the next task
- **AND** NOT include instruction to automatically get the next task after completion

### Requirement: Review Command

The system SHALL provide a `plx/review` slash command that guides AI agents through reviewing implementations against specifications.

#### Scenario: Generating review command for Claude Code

- **WHEN** Claude Code is selected during initialization
- **THEN** create `.claude/commands/plx/review.md`
- **AND** include frontmatter with name "PLX: Review", description, category "PLX", and relevant tags
- **AND** wrap the command body in OpenSpec markers
- **AND** include guardrails for: asking what to review, using CLI to retrieve criteria, outputting language-aware feedback markers
- **AND** include steps for: asking review target, searching if ambiguous, retrieving constraints/acceptance criteria/requirements, reviewing implementation, inserting feedback markers, summarizing findings

### Requirement: Refine Architecture Command

The system SHALL provide a `plx/refine-architecture` slash command that combines init and update architecture functionality.

#### Scenario: Generating refine-architecture command for Claude Code

- **WHEN** Claude Code is selected during initialization
- **THEN** create `.claude/commands/plx/refine-architecture.md`
- **AND** include frontmatter with name "PLX: Refine Architecture", description, category "PLX", and relevant tags
- **AND** wrap the command body in OpenSpec markers
- **AND** include guardrails for: practical documentation, preserving user content
- **AND** include steps for: checking ARCHITECTURE.md existence, creating if not exists (init flow), updating if exists (update flow)

### Requirement: Refine Review Command

The system SHALL provide a `plx/refine-review` slash command that creates or updates REVIEW.md template.

#### Scenario: Generating refine-review command for Claude Code

- **WHEN** Claude Code is selected during initialization
- **THEN** create `.claude/commands/plx/refine-review.md`
- **AND** include frontmatter with name "PLX: Refine Review", description, category "PLX", and relevant tags
- **AND** wrap the command body in OpenSpec markers
- **AND** include guardrails for: using REVIEW.md template structure, preserving existing guidelines
- **AND** include steps for: checking REVIEW.md existence, creating if not exists, updating if exists

### Requirement: Parse Feedback Command

The system SHALL provide a `plx/parse-feedback` slash command that instructs to run the CLI parse feedback command.

#### Scenario: Generating parse-feedback command for Claude Code

- **WHEN** Claude Code is selected during initialization
- **THEN** create `.claude/commands/plx/parse-feedback.md`
- **AND** include frontmatter with name "PLX: Parse Feedback", description, category "PLX", and relevant tags
- **AND** wrap the command body in OpenSpec markers
- **AND** include guardrails for: scanning tracked files, generating one task per marker
- **AND** include steps for: running `plx parse feedback <name>`, reviewing generated tasks, addressing feedback, archiving when complete

### Requirement: REVIEW.md Template

The system SHALL create a REVIEW.md template at the project root during initialization.

#### Scenario: Creating REVIEW.md during init

- **WHEN** `plx init` is executed
- **THEN** check if REVIEW.md exists at project root
- **AND** if not exists, create REVIEW.md with meta-template content
- **AND** include sections: Purpose, Review Types, Feedback Format, Review Checklist

#### Scenario: Creating REVIEW.md during update

- **WHEN** `plx update` is executed
- **THEN** check if REVIEW.md exists at project root
- **AND** if not exists, create REVIEW.md with meta-template content
- **AND** do not overwrite existing REVIEW.md

#### Scenario: REVIEW.md template content

- **WHEN** generating REVIEW.md template
- **THEN** include meta-instructions for customizing review guidelines
- **AND** explain feedback marker format with examples
- **AND** include placeholder review checklist

### Requirement: PLX Command Registry Updates

The system SHALL register new PLX commands in the PlxSlashCommandRegistry.

#### Scenario: Registering new commands

- **WHEN** the PLX slash command system is initialized
- **THEN** include 'review', 'refine-architecture', 'refine-review', 'parse-feedback' in `ALL_PLX_COMMANDS`
- **AND** provide template bodies for each new command
- **AND** map each command to its file path in configurators

