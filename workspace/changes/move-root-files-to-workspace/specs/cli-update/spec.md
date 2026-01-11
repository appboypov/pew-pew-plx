## ADDED Requirements

### Requirement: Root Files Migration
The system SHALL migrate template files from project root to workspace directory during update.

#### Scenario: Migrate root file to workspace
- **WHEN** user runs `plx update`
- **AND** ARCHITECTURE.md exists at project root
- **AND** ARCHITECTURE.md does not exist in workspace
- **THEN** the file is moved from root to `workspace/ARCHITECTURE.md`
- **AND** a migration message is logged

#### Scenario: Workspace file takes precedence
- **WHEN** user runs `plx update`
- **AND** REVIEW.md exists at both project root and workspace
- **THEN** the workspace version is kept
- **AND** the root version is deleted
- **AND** a migration message is logged

#### Scenario: No migration needed
- **WHEN** user runs `plx update`
- **AND** template files exist only in workspace
- **THEN** no migration occurs
- **AND** no migration message is logged

#### Scenario: Silent when no root files
- **WHEN** user runs `plx update`
- **AND** no template files exist at project root
- **THEN** no migration message is logged

## MODIFIED Requirements

### Requirement: Template File Creation
The system SHALL create missing template files in the workspace directory.

#### Scenario: Update creates missing REVIEW.md in workspace
- **WHEN** user runs `plx update`
- **AND** REVIEW.md does not exist in workspace
- **THEN** REVIEW.md is created at `workspace/REVIEW.md`

#### Scenario: Update creates missing RELEASE.md in workspace
- **WHEN** user runs `plx update`
- **AND** RELEASE.md does not exist in workspace
- **THEN** RELEASE.md is created at `workspace/RELEASE.md`

#### Scenario: Update creates missing TESTING.md in workspace
- **WHEN** user runs `plx update`
- **AND** TESTING.md does not exist in workspace
- **THEN** TESTING.md is created at `workspace/TESTING.md`
