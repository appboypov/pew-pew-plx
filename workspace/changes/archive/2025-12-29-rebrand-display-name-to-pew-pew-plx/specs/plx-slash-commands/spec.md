# plx-slash-commands Delta

## MODIFIED Requirements

### Requirement: Init Architecture Command

The system SHALL provide a `plx/init-architecture` slash command that instructs AI agents to generate comprehensive architecture documentation.

#### Scenario: Generating init-architecture command for Claude Code

- **WHEN** Claude Code is selected during initialization
- **THEN** create `.claude/commands/plx/init-architecture.md`
- **AND** include frontmatter with name "Pew Pew Plx: Init Architecture", description, category "Pew Pew Plx", and relevant tags
- **AND** wrap the command body in PLX markers
- **AND** include guardrails focusing on practical, usable documentation
- **AND** include steps for: reading project manifest files, exploring the project directory structure, identifying patterns, creating ARCHITECTURE.md at project root

### Requirement: Update Architecture Command

The system SHALL provide a `plx/update-architecture` slash command that instructs AI agents to refresh existing architecture documentation.

#### Scenario: Generating update-architecture command for Claude Code

- **WHEN** Claude Code is selected during initialization
- **THEN** create `.claude/commands/plx/update-architecture.md`
- **AND** include frontmatter with name "Pew Pew Plx: Update Architecture", description, category "Pew Pew Plx", and relevant tags
- **AND** wrap the command body in PLX markers
- **AND** include guardrails focusing on practical, usable documentation
- **AND** include steps for: reading existing ARCHITECTURE.md, exploring codebase for changes, updating document, preserving user-added content

### Requirement: Compact Context Preservation Command

The system SHALL provide a `plx/compact` slash command that instructs AI agents to preserve session state for continuation across context-limited chat sessions.

#### Scenario: Generating compact command for Claude Code

- **WHEN** Claude Code is selected during initialization
- **THEN** create `.claude/commands/plx/compact.md`
- **AND** include frontmatter with name "Pew Pew Plx: Compact", description "Preserve session progress to PROGRESS.md for context handoff", category "Pew Pew Plx", and relevant tags
- **AND** wrap the command body in PLX markers
- **AND** include guardrails for saving files, creating PROGRESS.md in project root, including sufficient detail for continuation, updating .gitignore, and handling existing PROGRESS.md files

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

The system SHALL provide a `plx/refine-architecture` slash command that combines init and update architecture functionality.

#### Scenario: Generating refine-architecture command for Claude Code

- **WHEN** Claude Code is selected during initialization
- **THEN** create `.claude/commands/plx/refine-architecture.md`
- **AND** include frontmatter with name "Pew Pew Plx: Refine Architecture", description, category "Pew Pew Plx", and relevant tags
- **AND** wrap the command body in PLX markers
- **AND** include guardrails for: practical documentation, preserving user content
- **AND** include steps for: checking ARCHITECTURE.md existence, creating if not exists (init flow), updating if exists (update flow)

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
