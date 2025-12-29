# CLI Init Specification

## Purpose

The `plx init` command SHALL create a complete workspace directory structure in any project, enabling immediate adoption of Pew Pew Plx conventions with support for multiple AI coding assistants.
## Requirements
### Requirement: Progress Indicators

The command SHALL display progress indicators during initialization to provide clear feedback about each step.

#### Scenario: Displaying initialization progress

- **WHEN** executing initialization steps
- **THEN** validate environment silently in background (no output unless error)
- **AND** display progress with ora spinners:
  - Show spinner: "⠋ Creating Pew Pew Plx structure..."
  - Then success: "✔ Pew Pew Plx structure created"
  - Show spinner: "⠋ Configuring AI tools..."
  - Then success: "✔ AI tools configured"

### Requirement: Directory Creation
The command SHALL create the complete workspace directory structure with all required directories and files.

#### Scenario: Creating Pew Pew Plx structure
- **WHEN** `plx init` is executed
- **THEN** create the following directory structure:
```
workspace/
├── AGENTS.md
├── specs/
└── changes/
    └── archive/
```

### Requirement: File Generation
The command SHALL generate required template files with appropriate content for immediate use.

#### Scenario: Generating template files
- **WHEN** initializing Pew Pew Plx
- **THEN** generate `workspace/AGENTS.md` containing complete Pew Pew Plx instructions for AI assistants
- **AND** generate `ARCHITECTURE.md` at the project root with template content for users to populate

### Requirement: AI Tool Configuration
The command SHALL configure AI coding assistants with Pew Pew Plx instructions using a grouped selection experience so teams can enable native integrations while always provisioning guidance for other assistants.

#### Scenario: Prompting for AI tool selection
- **WHEN** run interactively
- **THEN** present a multi-select wizard that separates options into two headings:
  - **Natively supported providers** shows each available first-party integration (Claude Code, Cursor, OpenCode, …) with checkboxes
  - **Other tools** explains that the root-level `AGENTS.md` stub is always generated for AGENTS-compatible assistants and cannot be deselected
- **AND** mark already configured native tools with "(already configured)" to signal that choosing them will refresh managed content
- **AND** keep disabled or unavailable providers labelled as "coming soon" so users know they cannot opt in yet
- **AND** allow confirming the selection even when no native provider is chosen because the root stub remains enabled by default
- **AND** change the base prompt copy in extend mode to "Which natively supported AI tools would you like to add or refresh?"

### Requirement: AI Tool Configuration Details

The command SHALL properly configure selected AI tools with Pew Pew Plx-specific instructions using a marker system.

#### Scenario: Configuring Claude Code

- **WHEN** Claude Code is selected
- **THEN** create or update `CLAUDE.md` in the project root directory (not inside workspace/)
- **AND** populate the managed block with a short stub that points teammates to `@/workspace/AGENTS.md`

#### Scenario: Configuring CodeBuddy Code

- **WHEN** CodeBuddy Code is selected
- **THEN** create or update `CODEBUDDY.md` in the project root directory (not inside workspace/)
- **AND** populate the managed block with a short stub that points teammates to `@/workspace/AGENTS.md`

#### Scenario: Configuring Cline

- **WHEN** Cline is selected
- **THEN** create or update `CLINE.md` in the project root directory (not inside workspace/)
- **AND** populate the managed block with a short stub that points teammates to `@/workspace/AGENTS.md`

#### Scenario: Configuring iFlow CLI

- **WHEN** iFlow CLI is selected
- **THEN** create or update `IFLOW.md` in the project root directory (not inside workspace/)
- **AND** populate the managed block with a short stub that points teammates to `@/workspace/AGENTS.md`

#### Scenario: Creating new CLAUDE.md

- **WHEN** CLAUDE.md does not exist
- **THEN** create new file with stub instructions wrapped in markers so the full workflow stays in `workspace/AGENTS.md`:
```markdown
<!-- PLX:START -->
# Pew Pew Plx Instructions

This project uses Pew Pew Plx to manage AI assistant workflows.

- Full guidance lives in '@/workspace/AGENTS.md'.
- Keep this managed block so 'plx update' can refresh the instructions.
<!-- PLX:END -->
```

### Requirement: Interactive Mode
The command SHALL provide an interactive menu for AI tool selection with clear navigation instructions.
#### Scenario: Displaying interactive menu
- **WHEN** run in fresh or extend mode
- **THEN** present a looping select menu that lets users toggle tools with Space and review selections with Enter
- **AND** when Enter is pressed on a highlighted selectable tool that is not already selected, automatically add it to the selection before moving to review so the highlighted tool is configured
- **AND** label already configured tools with "(already configured)" while keeping disabled options marked "coming soon"
- **AND** change the prompt copy in extend mode to "Which AI tools would you like to add or refresh?"
- **AND** display inline instructions clarifying that Space toggles tools and Enter selects the highlighted tool before reviewing selections

### Requirement: Safety Checks
The command SHALL perform safety checks to prevent overwriting existing structures and ensure proper permissions.

#### Scenario: Detecting existing initialization
- **WHEN** the `workspace/` directory already exists
- **THEN** inform the user that Pew Pew Plx is already initialized, skip recreating the base structure, and enter an extend mode
- **AND** continue to the AI tool selection step so additional tools can be configured
- **AND** display the existing-initialization error message only when the user declines to add any AI tools

### Requirement: Success Output

The command SHALL provide clear, actionable next steps upon successful initialization.

#### Scenario: Displaying success message
- **WHEN** initialization completes successfully
- **THEN** include prompt: "Please explain the Pew Pew Plx workflow from workspace/AGENTS.md and how I should work with you on this project"
- **AND** include prompt: "Please read ARCHITECTURE.md and help me fill it out with details about my project, tech stack, and conventions"

### Requirement: Exit Codes

The command SHALL use consistent exit codes to indicate different failure modes.

#### Scenario: Returning exit codes

- **WHEN** the command completes
- **THEN** return appropriate exit code:
  - 0: Success
  - 1: General error (including when workspace directory already exists)
  - 2: Insufficient permissions (reserved for future use)
  - 3: User cancelled operation (reserved for future use)

### Requirement: Additional AI Tool Initialization
`plx init` SHALL allow users to add configuration files for new AI coding assistants after the initial setup.

#### Scenario: Configuring an extra tool after initial setup
- **GIVEN** a `workspace/` directory already exists and at least one AI tool file is present
- **WHEN** the user runs `plx init` and selects a different supported AI tool
- **THEN** generate that tool's configuration files with Pew Pew Plx markers the same way as during first-time initialization
- **AND** leave existing tool configuration files unchanged except for managed sections that need refreshing
- **AND** exit with code 0 and display a success summary highlighting the newly added tool files

### Requirement: Success Output Enhancements
`plx init` SHALL summarize tool actions when initialization or extend mode completes.

#### Scenario: Showing tool summary
- **WHEN** the command completes successfully
- **THEN** display a categorized summary of tools that were created, refreshed, or skipped (including already-configured skips)
- **AND** personalize the "Next steps" header using the names of the selected tools, defaulting to a generic label when none remain

### Requirement: Exit Code Adjustments
`plx init` SHALL treat extend mode without new native tool selections as a successful refresh.

#### Scenario: Allowing empty extend runs
- **WHEN** Pew Pew Plx is already initialized and the user selects no additional natively supported tools
- **THEN** complete successfully while refreshing the root `AGENTS.md` stub
- **AND** exit with code 0

### Requirement: Slash Command Configuration

The init command SHALL generate slash command files for supported editors using shared templates.

#### Scenario: Generating slash commands for Cline
- **WHEN** the user selects Cline during initialization
- **THEN** create `.clinerules/workflows/plx-proposal.md`, `.clinerules/workflows/plx-apply.md`, and `.clinerules/workflows/plx-archive.md`
- **AND** populate each file from shared templates so command text matches other tools
- **AND** include Cline-specific Markdown heading frontmatter
- **AND** each template includes instructions for the relevant Pew Pew Plx workflow stage

### Requirement: Non-Interactive Mode
The command SHALL support non-interactive operation through command-line options for automation and CI/CD use cases.

#### Scenario: Select all tools non-interactively
- **WHEN** run with `--tools all`
- **THEN** automatically select every available AI tool without prompting
- **AND** proceed with initialization using the selected tools

#### Scenario: Select specific tools non-interactively
- **WHEN** run with `--tools claude,cursor`
- **THEN** parse the comma-separated tool IDs and validate against available tools
- **AND** proceed with initialization using only the specified valid tools

#### Scenario: Skip tool configuration non-interactively
- **WHEN** run with `--tools none`
- **THEN** skip AI tool configuration entirely
- **AND** only create the workspace directory structure and template files

#### Scenario: Invalid tool specification
- **WHEN** run with `--tools` containing any IDs not present in the AI tool registry
- **THEN** exit with code 1 and display available values (`all`, `none`, or the supported tool IDs)

#### Scenario: Help text lists available tool IDs
- **WHEN** displaying CLI help for `plx init`
- **THEN** show the `--tools` option description with the valid values derived from the AI tool registry

### Requirement: Root instruction stub
`plx init` SHALL always scaffold the root-level `AGENTS.md` hand-off so every teammate finds the primary Pew Pew Plx instructions.

#### Scenario: Creating root `AGENTS.md`
- **GIVEN** the project may or may not already contain an `AGENTS.md` file
- **WHEN** initialization completes in fresh or extend mode
- **THEN** create or refresh `AGENTS.md` at the repository root using the managed marker block from `TemplateManager.getAgentsStandardTemplate()`
- **AND** preserve any existing content outside the managed markers while replacing the stub text inside them
- **AND** create the stub regardless of which native AI tools are selected

### Requirement: PLX Slash Command Configuration

The init command SHALL generate PLX slash command files for supported editors alongside Pew Pew Plx slash commands.

#### Scenario: Generating PLX slash commands for Claude Code

- **WHEN** the user selects Claude Code during initialization
- **THEN** create `.claude/commands/plx/init-architecture.md` and `.claude/commands/plx/update-architecture.md`
- **AND** populate each file from PLX-specific templates with appropriate frontmatter
- **AND** wrap the command body in PLX markers so `plx update` can refresh the content
- **AND** each template includes guardrails and steps for architecture documentation generation

#### Scenario: PLX commands not generated for unsupported tools

- **GIVEN** a new project at path "./test-project"
- **WHEN** only "agents" (AGENTS.md) is selected and no natively supported tools are configured
- **THEN** no PLX command files should be created

#### Scenario: PLX commands refreshed on re-init

- **GIVEN** an existing project with PLX commands
- **WHEN** the user runs `plx init` again
- **THEN** update PLX command content within PLX markers
- **AND** preserve any content outside the markers

## Why

Manual creation of the workspace structure is error-prone and creates adoption friction. A standardized init command ensures:
- Consistent structure across all projects
- Proper AI instruction files are always included
- Quick onboarding for new projects
- Clear conventions from the start
