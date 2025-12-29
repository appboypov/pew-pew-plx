# Delta for CLI Init

## MODIFIED Requirements

### Requirement: Directory Creation
The command SHALL create the complete PLX directory structure with all required directories and files.

#### Scenario: Creating PLX structure
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
- **WHEN** initializing PLX
- **THEN** generate `workspace/AGENTS.md` containing complete PLX instructions for AI assistants
- **AND** generate `ARCHITECTURE.md` at the project root with template content for users to populate

### Requirement: Success Output

The command SHALL provide clear, actionable next steps upon successful initialization.

#### Scenario: Displaying success message
- **WHEN** initialization completes successfully
- **THEN** include prompt: "Please explain the PLX workflow from workspace/AGENTS.md and how I should work with you on this project"
- **AND** include prompt: "Please read ARCHITECTURE.md and help me fill it out with details about my project, tech stack, and conventions"

