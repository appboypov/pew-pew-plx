# cli-workspace-discovery

The workspace discovery system SHALL locate valid PLX workspaces by scanning both upward (to find project root) and downward (to find nested workspaces in monorepos).

## ADDED Requirements

### Requirement: Upward Workspace Discovery

The CLI SHALL scan upward from the current working directory to find the project root containing a valid PLX workspace.

#### Scenario: Valid workspace found in ancestor directory

- **WHEN** executing any `plx` command from a subdirectory (e.g., `/project/src/components/`)
- **AND** an ancestor directory contains a valid PLX workspace
- **THEN** locate the first valid PLX workspace going upward
- **AND** use that directory as the project root for subsequent operations

#### Scenario: CWD is already valid workspace

- **WHEN** executing any `plx` command from the project root
- **AND** CWD contains a valid PLX workspace
- **THEN** skip upward scanning
- **AND** use CWD as the project root

#### Scenario: No workspace found with git boundary

- **WHEN** executing any `plx` command from a subdirectory
- **AND** no valid PLX workspace exists in any ancestor
- **AND** a `.git` directory is encountered
- **THEN** stop upward scanning at the `.git` parent directory
- **AND** return an appropriate "no workspace found" error

#### Scenario: No workspace found without git boundary

- **WHEN** executing any `plx` command from a directory
- **AND** no valid PLX workspace exists in any ancestor
- **AND** no `.git` directory is encountered
- **THEN** scan up to filesystem root
- **AND** return an appropriate "no workspace found" error

### Requirement: PLX Workspace Validation

A valid PLX workspace SHALL be identified by the presence of `workspace/AGENTS.md` containing the PLX signature marker.

#### Scenario: Valid PLX workspace detection

- **WHEN** checking if a directory contains a valid PLX workspace
- **THEN** check for existence of `workspace/AGENTS.md`
- **AND** verify the file contains `<!-- PLX:START -->` marker
- **AND** return true only if both conditions are met

#### Scenario: Invalid workspace - missing AGENTS.md

- **WHEN** checking if a directory contains a valid PLX workspace
- **AND** `workspace/` directory exists but `AGENTS.md` is missing
- **THEN** return false (not a valid PLX workspace)

#### Scenario: Invalid workspace - missing PLX signature

- **WHEN** checking if a directory contains a valid PLX workspace
- **AND** `workspace/AGENTS.md` exists but lacks `<!-- PLX:START -->` marker
- **THEN** return false (not a valid PLX workspace)

### Requirement: Integration with Multi-Workspace Discovery

After finding the project root via upward scan, the CLI SHALL perform downward scanning from that root to discover nested workspaces.

#### Scenario: Upward then downward scan

- **WHEN** executing any `plx` command from a subdirectory
- **AND** upward scan locates project root
- **THEN** use project root as base for downward multi-workspace scanning
- **AND** apply existing workspace filter logic if `--workspace` flag provided
