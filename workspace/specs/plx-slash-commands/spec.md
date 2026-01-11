# plx-slash-commands Specification

## Purpose
TBD - created by archiving change add-plx-architecture-commands. Update Purpose after archive.
## Requirements
### Requirement: PLX Slash Command Infrastructure

The system SHALL provide a separate PLX slash command infrastructure that coexists with PLX commands without modifying the core PLX workflow.

#### Scenario: PLX command registry exists independently

- **WHEN** the PLX slash command system is initialized
- **THEN** provide a `PlxSlashCommandRegistry` that is separate from `SlashCommandRegistry`
- **AND** support the same tool configurator pattern as PLX commands
- **AND** use the PLX marker pattern (`<!-- PLX:START -->` / `<!-- PLX:END -->`) for managed content

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
- **THEN** update PLX command content within PLX markers
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
- **AND** include frontmatter with name "Pew Pew Plx: Compact", description "Preserve session progress to PROGRESS.md for context handoff", category "Pew Pew Plx", and relevant tags
- **AND** wrap the command body in PLX markers
- **AND** include guardrails for saving files, creating PROGRESS.md in project root, including sufficient detail for continuation, updating .gitignore, and handling existing PROGRESS.md files

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
- **AND** include frontmatter with name "Pew Pew Plx: Review", description, category "Pew Pew Plx", and relevant tags
- **AND** wrap the command body in PLX markers
- **AND** include guardrails for: asking what to review, using CLI to retrieve criteria, outputting language-aware feedback markers
- **AND** include steps for: asking review target, searching if ambiguous, retrieving constraints/acceptance criteria/requirements, reviewing implementation, inserting feedback markers, summarizing findings

### Requirement: Refine Architecture Command

The system SHALL provide a `plx/refine-architecture` slash command that produces spec-ready architecture documentation with complete component inventories.

#### Scenario: Generating refine-architecture command for Claude Code

- **WHEN** Claude Code is selected during initialization
- **THEN** create `.claude/commands/plx/refine-architecture.md`
- **AND** include frontmatter with name "Refine Architecture", description "Create or update ARCHITECTURE.md with spec-ready component inventories.", category "Pew Pew Plx", and relevant tags
- **AND** wrap the command body in PLX markers
- **AND** include guardrails requiring spec-ready reference, complete component inventories, user content preservation, and completeness validation
- **AND** include context retrieval section with codebase-retrieval tool instructions
- **AND** include steps for discovery, checking existence, creating/loading, populating inventories, mapping dependencies, validating completeness, and writing
- **AND** include template structure section defining required sections and component inventory categories

#### Scenario: Context retrieval instructs use of codebase tools

- **WHEN** the `plx/refine-architecture` command body is generated
- **THEN** include Context Retrieval section
- **AND** instruct use of `mcp__auggie-mcp__codebase-retrieval` or equivalent tools
- **AND** list component discovery queries for DTOs, services, APIs, views, view models, routing, enums
- **AND** list dependency mapping queries for service relationships and data flow
- **AND** list pattern detection queries for architecture patterns and state management

#### Scenario: Template structure defines component inventory categories

- **WHEN** the `plx/refine-architecture` command body is generated
- **THEN** include Template Structure section
- **AND** reference `workspace/templates/ARCHITECTURE.template.md` as canonical template
- **AND** list required sections: Technology Stack, Project Structure, Component Inventory, Architecture Patterns, Data Flow, Dependency Graph, Configuration, Testing Structure
- **AND** list component inventory categories with universal terms: DTOs/Models/Records/Entities, Services/Providers/Managers, APIs/Repositories/Controllers/Data Sources, Views/Pages/Screens, View Models/Hooks/Blocs/Cubits/Notifiers, Widgets/Components, Enums/Constants/Config, Utils/Helpers/Extensions, Routing/Navigation, Schemas/Validators

### Requirement: Refine Review Command

The system SHALL provide a `plx/refine-review` slash command that creates or updates REVIEW.md template.

#### Scenario: Generating refine-review command for Claude Code

- **WHEN** Claude Code is selected during initialization
- **THEN** create `.claude/commands/plx/refine-review.md`
- **AND** include frontmatter with name "Pew Pew Plx: Refine Review", description, category "Pew Pew Plx", and relevant tags
- **AND** wrap the command body in PLX markers
- **AND** include guardrails for: using REVIEW.md template structure, preserving existing guidelines
- **AND** include steps for: checking REVIEW.md existence, creating if not exists, updating if exists

### Requirement: Parse Feedback Command

The system SHALL provide a `plx/parse-feedback` slash command that instructs to run the CLI parse feedback command.

#### Scenario: Generating parse-feedback command for Claude Code

- **WHEN** Claude Code is selected during initialization
- **THEN** create `.claude/commands/plx/parse-feedback.md`
- **AND** include frontmatter with name "Pew Pew Plx: Parse Feedback", description, category "Pew Pew Plx", and relevant tags
- **AND** wrap the command body in PLX markers
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
- **THEN** include 'review', 'refine-architecture', 'refine-review', 'refine-testing', 'test', 'parse-feedback' in `ALL_PLX_COMMANDS`
- **AND** provide template bodies for each command
- **AND** map each command to its file path in configurators

### Requirement: Orchestrate Command

The system SHALL provide a `plx/orchestrate` slash command that guides AI agents through sub-agent orchestration for completing multi-task work collaboratively.

#### Scenario: Generating orchestrate command for Claude Code

- **WHEN** Claude Code is selected during initialization
- **THEN** create `.claude/commands/plx/orchestrate.md`
- **AND** include frontmatter with name "Pew Pew Plx: Orchestrate", description "Orchestrate sub-agents to complete work collaboratively", category "Pew Pew Plx", and relevant tags
- **AND** wrap the command body in PLX markers

#### Scenario: Orchestrate command guardrails

- **WHEN** the orchestrate command is invoked
- **THEN** include guardrails for:
  - Spawning exactly one sub-agent per task (never parallelize task execution)
  - Reviewing each sub-agent's work before accepting it
  - Maintaining ongoing conversations with sub-agents
  - Acting as a senior team member guiding talented colleagues
  - Enforcing TracelessChanges (no comments referencing removed code, no "we don't do X" statements, no clarifications about previous states)
  - Verifying scope adherence (no unnecessary additions)
  - Verifying project convention alignment

#### Scenario: Orchestrate command steps

- **WHEN** the orchestrate command is invoked
- **THEN** include steps for:
  1. Understanding work scope (run `plx get tasks` for changes, identify review aspects for reviews, enumerate discrete units for other work)
  2. For each unit of work: get detailed context, spawn a sub-agent with clear instructions, wait for completion
  3. Reviewing sub-agent output for scope adherence, convention alignment, TracelessChanges compliance, and quality
  4. If issues found: provide specific feedback and request revision
  5. If approved: mark complete and proceed to next unit
  6. Continue until all work complete
  7. Final validation with `plx validate` if applicable

#### Scenario: Orchestrate command reference section

- **WHEN** the orchestrate command is generated
- **THEN** include reference section with:
  - `plx show <change-id>` for proposal context
  - `plx list` for changes and progress
  - `plx review` for review context
  - `plx parse feedback` for converting review feedback to tasks

### Requirement: Plan Request Command

The system SHALL provide a `plx/plan-request` slash command that clarifies user intent through iterative yes/no questions before proposal creation.

#### Scenario: Generating plan-request command for Claude Code

- **WHEN** Claude Code is selected during initialization
- **THEN** create `.claude/commands/plx/plan-request.md`
- **AND** include frontmatter with name "Pew Pew Plx: Plan Request", description "Clarify user intent through iterative questions to create request.md", category "Pew Pew Plx", and relevant tags
- **AND** wrap the command body in PLX markers

#### Scenario: Plan-request uses Activity XML template pattern

- **WHEN** the `plx/plan-request` command is executed
- **THEN** use the Activity XML template pattern with Intent Analyst role
- **AND** include AskActUpdateRepeat behavioral instruction for iterative questioning
- **AND** use SimpleQuestions format with yes/no options plus "Not sure" and "Skip" alternatives

#### Scenario: Plan-request creates request.md early

- **WHEN** the `plx/plan-request` command determines a change-id
- **THEN** create `workspace/changes/{change-id}/` directory
- **AND** create `request.md` with sections: Source Input, Current Understanding, Identified Ambiguities, Decisions, Final Intent
- **AND** update request.md after each clarification question

#### Scenario: Plan-request ends on user confirmation

- **WHEN** all ambiguities are resolved
- **THEN** present final clarified intent to user
- **AND** ask user to confirm intent is 100% captured
- **AND** if confirmed, populate Final Intent section and instruct to run `plx/plan-proposal`

### Requirement: Plan Proposal Command

The system SHALL provide a `plx/plan-proposal` slash command that scaffolds change proposals and auto-detects existing `request.md` files.

#### Scenario: Generating plan-proposal command for Claude Code

- **WHEN** Claude Code is selected during initialization
- **THEN** create `.claude/commands/plx/plan-proposal.md`
- **AND** include frontmatter with name "Pew Pew Plx: Plan Proposal", description "Scaffold a new Pew Pew Plx change and validate strictly. Consumes request.md when present.", category "Pew Pew Plx", and relevant tags
- **AND** wrap the command body in PLX markers

#### Scenario: Plan-proposal detects and consumes request.md

- **WHEN** the `plx/plan-proposal` command is executed with a change-id argument
- **AND** `workspace/changes/{change-id}/request.md` exists
- **THEN** use the Final Intent section as primary input for the proposal
- **AND** incorporate Decisions section into proposal context

#### Scenario: Plan-proposal scaffolds proposal structure

- **WHEN** the `plx/plan-proposal` command is executed
- **THEN** scaffold `proposal.md`, `tasks/` directory, and `design.md` (when needed)
- **AND** map change into concrete capabilities with spec deltas
- **AND** validate with `plx validate <id> --strict`

### Requirement: Sync Workspace Command

The system SHALL provide a `plx/sync-workspace` slash command that guides AI agents through workspace maintenance.

#### Scenario: Generating sync-workspace command for Claude Code

- **WHEN** Claude Code is selected during initialization
- **THEN** create `.claude/commands/plx/sync-workspace.md`
- **AND** include frontmatter with name "Pew Pew Plx: Sync Workspace", description, category "Pew Pew Plx", and relevant tags
- **AND** wrap the command body in PLX markers
- **AND** include guardrails for: sub-agent usage based on complexity, action selection via question tool or numbered list
- **AND** include steps for: parsing optional target argument, scanning workspace state, assessing items, suggesting actions, presenting selections, executing selected actions, reporting summary

#### Scenario: Global workspace sync

- **WHEN** the user runs `/plx/sync-workspace` without arguments
- **THEN** the command SHALL instruct the agent to scan all open changes, open tasks, and completed-but-not-archived changes
- **AND** assess each item for maintenance needs
- **AND** suggest actions such as archive, create tasks, update proposals, validate and fix

#### Scenario: Targeted sync

- **WHEN** the user runs `/plx/sync-workspace <change-id|task-id>`
- **THEN** the command SHALL instruct the agent to focus on the specified item
- **AND** assess only that item for maintenance needs
- **AND** suggest actions specific to that item

### Requirement: Complete Task Command

The system SHALL provide a `plx/complete-task` slash command that marks a task as done.

#### Scenario: Generating complete-task command for Claude Code

- **WHEN** Claude Code is selected during initialization
- **THEN** create `.claude/commands/plx/complete-task.md`
- **AND** include frontmatter with name "Pew Pew Plx: Complete Task", description, category "Pew Pew Plx", and relevant tags
- **AND** wrap the command body in PLX markers
- **AND** include step to run `plx complete task --id <task-id>` using the provided argument

### Requirement: Undo Task Command

The system SHALL provide a `plx/undo-task` slash command that reverts a task to to-do status.

#### Scenario: Generating undo-task command for Claude Code

- **WHEN** Claude Code is selected during initialization
- **THEN** create `.claude/commands/plx/undo-task.md`
- **AND** include frontmatter with name "Pew Pew Plx: Undo Task", description, category "Pew Pew Plx", and relevant tags
- **AND** wrap the command body in PLX markers
- **AND** include step to run `plx undo task --id <task-id>` using the provided argument

### Requirement: Orchestrate Model Selection

The plx/orchestrate slash command SHALL instruct agents to select sub-agent models based on task skill level.

#### Scenario: Model selection guidance in orchestrate

- **WHEN** the plx/orchestrate slash command is generated
- **THEN** include guidance for selecting sub-agent model based on task skill level
- **AND** include the Claude model mapping: junior→haiku, medior→sonnet, senior→opus
- **AND** include fallback guidance: if skill level is missing, agent determines model based on task complexity

#### Scenario: Non-Claude model handling

- **WHEN** an agent uses a non-Claude model ecosystem
- **THEN** the orchestrate command SHALL instruct to determine equivalent model tier
- **OR** ignore skill level if model selection is not available

### Requirement: Plan Proposal Skill Level Assignment

The plx/plan-proposal slash command SHALL instruct agents to auto-assign skill levels to generated tasks.

#### Scenario: Skill level heuristics in plan-proposal

- **WHEN** the plx/plan-proposal slash command is generated
- **THEN** include instruction to assign skill level to each generated task
- **AND** include heuristics for assignment:
  - junior: documentation, simple config, minor refactoring
  - medior: feature implementation, moderate integration, testing tasks
  - senior: architecture changes, complex algorithms, cross-cutting concerns

#### Scenario: Review and test task defaults

- **WHEN** creating standard review and test tasks
- **THEN** review tasks SHALL default to medior
- **AND** test tasks SHALL default to medior

### Requirement: Implement Command Change-Focused Scope

The `/plx:implement` slash command SHALL implement all tasks in a change by default, only focusing on a single task when a task ID is explicitly provided.

#### Scenario: Default behavior implements entire change

- **WHEN** the implement command is invoked without a task ID argument
- **THEN** retrieve all tasks for the highest-priority change using `plx get tasks`
- **AND** work through each task's Implementation Checklist sequentially
- **AND** mark each task complete with `plx complete task --id <task-id>`
- **AND** stop when all tasks in the change are complete

#### Scenario: Task ID argument limits scope to single task

- **WHEN** the implement command is invoked with a task ID argument
- **THEN** retrieve only that specific task
- **AND** work through that task's Implementation Checklist
- **AND** mark the task complete with `plx complete task --id <task-id>`
- **AND** stop after completing that single task

### Requirement: Refine Release Command

The system SHALL provide a `plx/refine-release` slash command that creates or updates RELEASE.md with comprehensive option documentation.

#### Scenario: Generating refine-release command for Claude Code

- **WHEN** Claude Code is selected during initialization
- **THEN** create `.claude/commands/plx/refine-release.md`
- **AND** include frontmatter with name "Pew Pew Plx: Refine Release", description, category "Pew Pew Plx", and relevant tags
- **AND** wrap the command body in PLX markers
- **AND** include guardrails for: using RELEASE.md template structure, preserving existing configuration
- **AND** include steps for: checking RELEASE.md existence, creating if not exists with defaults, updating if exists
- **AND** include embedded documentation for: changelog formats (keep-a-changelog, simple-list, github-release), readme styles (minimal, standard, comprehensive, CLI tool, library), badge patterns, audience options, emoji levels

### Requirement: File Reference Notation

Slash commands that operate on capital-lettered markdown files SHALL use `@` notation to ensure files are auto-loaded when commands are invoked.

#### Scenario: Review command references REVIEW.md

- **WHEN** the `plx/review` slash command body is generated
- **THEN** include `@REVIEW.md` notation in the command body
- **AND** reference the file in the appropriate step or guardrail

#### Scenario: Refine-review command references REVIEW.md

- **WHEN** the `plx/refine-review` slash command body is generated
- **THEN** include `@REVIEW.md` notation in guardrails and steps
- **AND** use format "Reference @REVIEW.md template structure" in guardrails
- **AND** use format "Check if @REVIEW.md exists" in steps

#### Scenario: Refine-architecture command references ARCHITECTURE.md

- **WHEN** the `plx/refine-architecture` slash command body is generated
- **THEN** include `@ARCHITECTURE.md` notation in guardrails and steps
- **AND** use format "Reference @ARCHITECTURE.md template structure" in guardrails
- **AND** use format "Check if @ARCHITECTURE.md exists" in steps

#### Scenario: Prepare-release command references multiple files

- **WHEN** the `plx/prepare-release` slash command body is generated
- **THEN** include `@RELEASE.md` notation (already present)
- **AND** include `@README.md` notation for readme update step
- **AND** include `@CHANGELOG.md` notation for changelog update step
- **AND** include `@ARCHITECTURE.md` notation for architecture update step

### Requirement: Prepare Release Version Handling

The `/plx/prepare-release` slash command SHALL enforce concrete version numbers and accurate dates in changelog entries.

#### Scenario: Never use Unreleased placeholder

- **WHEN** the prepare-release command generates a changelog entry
- **THEN** it SHALL determine the concrete next version number
- **AND** never use "Unreleased" as a version placeholder

#### Scenario: Use date command for release date

- **WHEN** the prepare-release command generates a changelog entry
- **THEN** it SHALL run the `date` command to get the accurate release date
- **AND** format the date according to changelog conventions (YYYY-MM-DD)

#### Scenario: Suggest version bumps based on changes

- **WHEN** analyzing commits for version bump type
- **THEN** suggest major bump for breaking changes or BREAKING footer
- **AND** suggest minor bump for feat commits
- **AND** suggest patch bump for fix commits
- **AND** apply AI judgment on overall scope to recommend appropriate bump

### Requirement: Monorepo Awareness for Artifact Commands

All artifact-creating PLX slash commands SHALL support monorepo project structures by operating on the correct package workspace.

#### Scenario: Derive target package from context

- **WHEN** an artifact-creating slash command is invoked in a monorepo
- **THEN** derive the target package from the user's request context
- **AND** clarify with user if the target package is unclear

#### Scenario: Create artifacts in package workspace

- **WHEN** operating on a specific package in a monorepo
- **THEN** create artifacts in that package's workspace folder
- **AND** not in the monorepo root workspace

#### Scenario: Root workspace for root changes

- **WHEN** a change affects only the monorepo root (not a specific package)
- **THEN** create artifacts in the root workspace

#### Scenario: Separate artifacts per package

- **WHEN** a change affects multiple packages
- **THEN** create separate proposals/releases per package
- **AND** each package gets its own workspace artifacts

#### Scenario: Follow package-specific instructions

- **WHEN** a package has its own AGENTS.md or workspace instructions
- **THEN** follow that package's specific instructions
- **AND** not just the root instructions

### Requirement: Refine Testing Command

The system SHALL provide a `plx/refine-testing` slash command that creates or updates TESTING.md with test configuration options.

#### Scenario: Generating refine-testing command for Claude Code

- **WHEN** Claude Code is selected during initialization
- **THEN** create `.claude/commands/plx/refine-testing.md`
- **AND** include frontmatter with name "Pew Pew Plx: Refine Testing", description, category "Pew Pew Plx", and relevant tags
- **AND** wrap the command body in PLX markers
- **AND** include guardrails for: using TESTING.md template structure, preserving existing configuration
- **AND** include steps for: checking TESTING.md existence, creating if not exists, updating if exists

### Requirement: Test Command

The system SHALL provide a `plx/test` slash command that runs testing workflow for specified scope.

#### Scenario: Generating test command for Claude Code

- **WHEN** Claude Code is selected during initialization
- **THEN** create `.claude/commands/plx/test.md`
- **AND** include frontmatter with name "Pew Pew Plx: Test", description, category "Pew Pew Plx", and relevant tags
- **AND** wrap the command body in PLX markers
- **AND** include guardrails for: reading TESTING.md configuration, running tests for specified scope
- **AND** include steps for: parsing arguments (--change-id, --task-id, --spec-id), reading TESTING.md, running tests, reporting results

#### Scenario: Test command accepts scope arguments

- **WHEN** the test command is invoked with --change-id, --task-id, or --spec-id
- **THEN** run tests only for the specified scope
- **AND** reference TESTING.md for test configuration

### Requirement: TESTING.md Template

The system SHALL create a TESTING.md template at the project root during initialization.

#### Scenario: Creating TESTING.md during init

- **WHEN** `plx init` is executed
- **THEN** check if TESTING.md exists at project root
- **AND** if not exists, create TESTING.md with config-style content
- **AND** include sections: Purpose, Test Types, Coverage, Test Patterns, Test Checklist

#### Scenario: Creating TESTING.md during update

- **WHEN** `plx update` is executed
- **THEN** check if TESTING.md exists at project root
- **AND** if not exists, create TESTING.md with config-style content
- **AND** do not overwrite existing TESTING.md

