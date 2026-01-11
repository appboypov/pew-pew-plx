## MODIFIED Requirements

### Requirement: Template File Generation
The system SHALL generate template files in the workspace directory instead of the project root.

#### Scenario: Init creates ARCHITECTURE.md in workspace
- **WHEN** user runs `plx init` in a new project
- **THEN** ARCHITECTURE.md is created at `workspace/ARCHITECTURE.md`
- **AND** no ARCHITECTURE.md is created at project root

#### Scenario: Init creates REVIEW.md in workspace
- **WHEN** user runs `plx init` in a new project
- **THEN** REVIEW.md is created at `workspace/REVIEW.md`
- **AND** no REVIEW.md is created at project root

#### Scenario: Init creates RELEASE.md in workspace
- **WHEN** user runs `plx init` in a new project
- **THEN** RELEASE.md is created at `workspace/RELEASE.md`
- **AND** no RELEASE.md is created at project root

#### Scenario: Init creates TESTING.md in workspace
- **WHEN** user runs `plx init` in a new project
- **THEN** TESTING.md is created at `workspace/TESTING.md`
- **AND** no TESTING.md is created at project root

#### Scenario: Init extend mode skips existing workspace files
- **WHEN** user runs `plx init` in a project with existing `workspace/ARCHITECTURE.md`
- **THEN** the existing file is preserved
- **AND** no new file is created
