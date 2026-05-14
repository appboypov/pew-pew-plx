## MODIFIED Requirements

### Requirement: Progress Indicators

The command SHALL display progress indicators during initialization to provide clear feedback about each step.

#### Scenario: Displaying initialization progress

- **WHEN** executing initialization steps
- **THEN** validate environment silently in background (no output unless error)
- **AND** display progress with ora spinners:
  - Show spinner: "⠋ Creating OpenSplx structure..."
  - Then success: "✔ OpenSplx structure created"
  - Show spinner: "⠋ Configuring AI tools..."
  - Then success: "✔ AI tools configured"

### Requirement: Directory Creation
The command SHALL create the complete workspace directory structure with all required directories and files.

#### Scenario: Creating OpenSplx structure
- **WHEN** `splx init` is executed
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
- **WHEN** initializing OpenSplx
- **THEN** generate `workspace/AGENTS.md` containing complete OpenSplx instructions for AI assistants
- **AND** generate `ARCHITECTURE.md` at the project root with template content for users to populate

### Requirement: AI Tool Configuration
The command SHALL configure AI coding assistants with OpenSplx instructions using a grouped selection experience so teams can enable native integrations while always provisioning guidance for other assistants.

#### Scenario: Prompting for AI tool selection
- **WHEN** run interactively
- **THEN** present a multi-select wizard that separates options into two headings:
  - **Natively supported providers** shows each available first-party integration (Claude Code, Cursor, OpenCode, …) with checkboxes
  - **Other tools** explains that the root-level `AGENTS.md` stub is always generated for AGENTS-compatible assistants and cannot be deselected
- **AND** mark already configured native tools with "(already configured)" to signal that choosing them will refresh managed content
- **AND** keep disabled or unavailable providers labelled as "coming soon" so users know they cannot opt in yet
- **AND** allow confirming the selection even when no native provider is chosen because the root stub remains enabled by default
- **AND** change the base prompt copy in extend mode to "Which natively supported AI tools would you like to add or refresh?"

### Requirement: Safety Checks
The command SHALL perform safety checks to prevent overwriting existing structures and ensure proper permissions.

#### Scenario: Detecting existing initialization
- **WHEN** the `workspace/` directory already exists
- **THEN** inform the user that OpenSplx is already initialized, skip recreating the base structure, and enter an extend mode
- **AND** continue to the AI tool selection step so additional tools can be configured
- **AND** display the existing-initialization error message only when the user declines to add any AI tools

### Requirement: Success Output

The command SHALL provide clear, actionable next steps upon successful initialization.

#### Scenario: Displaying success message
- **WHEN** initialization completes successfully
- **THEN** include prompt: "Please explain the OpenSplx workflow from workspace/AGENTS.md and how I should work with you on this project"
- **AND** include prompt: "Please read ARCHITECTURE.md and help me fill it out with details about my project, tech stack, and conventions"
