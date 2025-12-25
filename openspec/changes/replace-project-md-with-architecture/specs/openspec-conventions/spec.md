# Delta for OpenSpec Conventions

## MODIFIED Requirements

### Requirement: Project Structure
An OpenSpec project SHALL maintain a consistent directory structure for specifications and changes.

#### Scenario: Initializing project structure
- **WHEN** an OpenSpec project is initialized
- **THEN** it SHALL have this structure:
```
project-root/
├── ARCHITECTURE.md             # Project context and conventions
├── AGENTS.md                   # Root stub pointing to openspec/AGENTS.md
└── openspec/
    ├── AGENTS.md               # AI assistant instructions
    ├── specs/                  # Current deployed capabilities
    │   └── [capability]/       # Single, focused capability
    │       ├── spec.md         # WHAT and WHY
    │       └── design.md       # HOW (optional, for established patterns)
    └── changes/                # Proposed changes
        ├── [change-name]/      # Descriptive change identifier
        │   ├── proposal.md     # Why, what, and impact
        │   ├── tasks/          # Task files directory
        │   │   ├── 001-<task-name>.md
        │   │   ├── 002-<task-name>.md
        │   │   └── NNN-<task-name>.md
        │   ├── design.md       # Technical decisions (optional)
        │   └── specs/          # Complete future state
        │       └── [capability]/
        │           └── spec.md # Clean markdown (no diff syntax)
        └── archive/            # Completed changes
            └── YYYY-MM-DD-[name]/
```
