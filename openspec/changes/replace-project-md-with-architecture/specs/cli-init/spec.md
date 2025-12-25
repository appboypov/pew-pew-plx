# Delta for CLI Init

## MODIFIED Requirements

### Requirement: Directory Creation
The command SHALL create the complete OpenSpec directory structure with all required directories and files.

#### Scenario: Creating OpenSpec structure
- **WHEN** `openspec init` is executed
- **THEN** create the following directory structure:
```
openspec/
├── AGENTS.md
├── specs/
└── changes/
    └── archive/
```

### Requirement: File Generation
The command SHALL generate required template files with appropriate content for immediate use.

#### Scenario: Generating template files
- **WHEN** initializing OpenSpec
- **THEN** generate `openspec/AGENTS.md` containing complete OpenSpec instructions for AI assistants
- **AND** generate `ARCHITECTURE.md` at the project root with template content for users to populate

### Requirement: Success Output

The command SHALL provide clear, actionable next steps upon successful initialization.

#### Scenario: Displaying success message
- **WHEN** initialization completes successfully
- **THEN** include prompt: "Please explain the OpenSpec workflow from openspec/AGENTS.md and how I should work with you on this project"
- **AND** include prompt: "Please read ARCHITECTURE.md and help me fill it out with details about my project, tech stack, and conventions"

## REMOVED Requirements

### Requirement: File Generation (partial)
**Reason**: The `project.md` file generation is replaced by `ARCHITECTURE.md` which is now automatically generated at the project root during `openspec init`.
**Migration**: ARCHITECTURE.md is generated automatically. Users are prompted to populate it with project details.
