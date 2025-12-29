## MODIFIED Requirements

### Requirement: Project Structure

A PLX project SHALL maintain a consistent directory structure for specifications and changes.

#### Scenario: Initializing project structure

- **WHEN** a PLX project is initialized
- **THEN** it SHALL have this structure:
```
project-root/
├── ARCHITECTURE.md             # Project context and conventions
├── AGENTS.md                   # Root stub pointing to workspace/AGENTS.md
└── workspace/
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

### Requirement: Structured conventions for specs and changes

PLX conventions SHALL mandate a structured spec format with clear requirement and scenario sections so tooling can parse consistently.

#### Scenario: Following the structured spec format

- **WHEN** writing or updating PLX specifications
- **THEN** authors SHALL use `### Requirement: ...` followed by at least one `#### Scenario: ...` section

### Requirement: Verb–Noun CLI Command Structure

PLX CLI design SHALL use verbs as top-level commands with nouns provided as arguments or flags for scoping.

#### Scenario: Verb-first command discovery

- **WHEN** a user runs a command like `plx list`
- **THEN** the verb communicates the action clearly
- **AND** nouns refine scope via flags or arguments (e.g., `--changes`, `--specs`)

#### Scenario: Single CLI entry point

- **WHEN** a user invokes the PLX CLI
- **THEN** only the `plx` command is available
- **AND** no `openspec` alias exists

#### Scenario: Disambiguation guidance

- **WHEN** item names are ambiguous between changes and specs
- **THEN** `plx show` and `plx validate` SHALL accept `--type spec|change`
- **AND** the help text SHALL document this clearly
