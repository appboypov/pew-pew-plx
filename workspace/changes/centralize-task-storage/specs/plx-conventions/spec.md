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
    ├── tasks/                  # Centralized task storage
    │   ├── NNN-<parent-id>-<name>.md  # Parented task
    │   ├── NNN-<name>.md              # Standalone task
    │   └── archive/                   # Archived tasks
    ├── changes/                # Proposed changes
    │   ├── [change-name]/      # Descriptive change identifier
    │   │   ├── proposal.md     # Why, what, and impact
    │   │   ├── design.md       # Technical decisions (optional)
    │   │   └── specs/          # Complete future state
    │   │       └── [capability]/
    │   │           └── spec.md # Clean markdown (no diff syntax)
    │   └── archive/            # Completed changes
    │       └── YYYY-MM-DD-[name]/
    └── reviews/                # Review entities
        ├── [review-name]/
        │   └── review.md
        └── archive/
```

## ADDED Requirements

### Requirement: Centralized Task Storage

Tasks SHALL be stored in a centralized `workspace/tasks/` directory with optional parent linkage via frontmatter.

#### Scenario: Storing parented tasks

- **WHEN** a task is associated with a parent entity (change, review, or spec)
- **THEN** the task file SHALL be named `NNN-<parent-id>-<name>.md`
- **AND** the frontmatter SHALL contain `parent-type` and `parent-id` fields
- **AND** NNN is a three-digit zero-padded sequence number per parent

#### Scenario: Storing standalone tasks

- **WHEN** a task is not associated with any parent entity
- **THEN** the task file SHALL be named `NNN-<name>.md`
- **AND** the frontmatter SHALL NOT contain `parent-type` or `parent-id` fields
- **AND** NNN is a three-digit zero-padded sequence number

#### Scenario: Task frontmatter schema

- **WHEN** creating or parsing a task file
- **THEN** the frontmatter SHALL follow this schema:
```yaml
---
status: to-do|in-progress|done
skill-level: junior|medior|senior  # optional
parent-type: change|review|spec    # required for parented tasks
parent-id: <entity-id>             # required for parented tasks
---
```
- **AND** `parent-type` and `parent-id` SHALL be present together or both absent

#### Scenario: Per-parent numbering

- **WHEN** numbering tasks for a parent entity
- **THEN** each parent's tasks SHALL start numbering at 001
- **AND** multiple parents MAY have tasks with the same sequence number (e.g., `001-feature-a-impl.md` and `001-feature-b-impl.md`)

#### Scenario: Task archiving

- **WHEN** tasks are archived
- **THEN** they SHALL be moved to `workspace/tasks/archive/`
- **AND** the filename SHALL be preserved (maintains parent-id association)
- **AND** the frontmatter SHALL remain unchanged

#### Scenario: Multi-workspace task storage

- **WHEN** operating in a multi-workspace environment
- **THEN** each workspace SHALL have its own `workspace/tasks/` directory
- **AND** task discovery SHALL follow the existing workspace discovery pattern

### Requirement: Supported Parent Types

The system SHALL recognize three parent entity types for task linkage: change, review, and spec.

#### Scenario: Change parent type

- **WHEN** a task is linked to a change proposal
- **THEN** the frontmatter SHALL contain `parent-type: change`
- **AND** `parent-id` SHALL match a directory name in `workspace/changes/`

#### Scenario: Review parent type

- **WHEN** a task is linked to a review entity
- **THEN** the frontmatter SHALL contain `parent-type: review`
- **AND** `parent-id` SHALL match a directory name in `workspace/reviews/`

#### Scenario: Spec parent type

- **WHEN** a task is linked to a specification
- **THEN** the frontmatter SHALL contain `parent-type: spec`
- **AND** `parent-id` SHALL match a directory name in `workspace/specs/`
