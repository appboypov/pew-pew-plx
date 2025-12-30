## ADDED Requirements

### Requirement: Paste Request Command

The CLI SHALL provide a `paste request` subcommand that captures clipboard content to `workspace/drafts/request.md`.

#### Scenario: Basic invocation saves clipboard to drafts

- **WHEN** user runs `plx paste request`
- **AND** clipboard contains text content
- **THEN** the system writes clipboard content to `workspace/drafts/request.md`
- **AND** displays success message with character count

#### Scenario: Overwrites existing request file

- **WHEN** user runs `plx paste request`
- **AND** `workspace/drafts/request.md` already exists
- **THEN** the file is overwritten with new clipboard content

#### Scenario: Creates drafts directory if missing

- **WHEN** user runs `plx paste request`
- **AND** `workspace/drafts/` directory does not exist
- **THEN** the directory is created automatically
- **AND** clipboard content is saved to `request.md`

#### Scenario: Empty clipboard error

- **WHEN** user runs `plx paste request`
- **AND** clipboard is empty
- **THEN** the system displays error "Clipboard is empty"
- **AND** exits with non-zero status

#### Scenario: Missing clipboard utility on Linux

- **WHEN** user runs `plx paste request` on Linux
- **AND** neither xclip nor xsel is installed
- **THEN** the system displays error "Clipboard utility not found. Install xclip or xsel."

### Requirement: JSON Output

The CLI SHALL support a `--json` flag for machine-readable output.

#### Scenario: JSON success output

- **WHEN** user runs `plx paste request --json`
- **AND** clipboard contains content
- **THEN** the output is valid JSON containing:
  - `path`: "workspace/drafts/request.md"
  - `characters`: number of characters saved
  - `success`: true

#### Scenario: JSON error output

- **WHEN** user runs `plx paste request --json`
- **AND** an error occurs
- **THEN** the output is valid JSON containing:
  - `error`: error message string
- **AND** process.exitCode is set to 1

### Requirement: Cross-Platform Clipboard Support

The CLI SHALL support clipboard reading on macOS, Windows, and Linux.

#### Scenario: macOS clipboard reading

- **WHEN** user runs `plx paste request` on macOS
- **THEN** the system uses `pbpaste` to read clipboard

#### Scenario: Windows clipboard reading

- **WHEN** user runs `plx paste request` on Windows
- **THEN** the system uses PowerShell `Get-Clipboard` to read clipboard

#### Scenario: Linux clipboard reading with xclip

- **WHEN** user runs `plx paste request` on Linux
- **AND** xclip is installed
- **THEN** the system uses `xclip -selection clipboard -o` to read clipboard

#### Scenario: Linux fallback to xsel

- **WHEN** user runs `plx paste request` on Linux
- **AND** xclip is not available
- **AND** xsel is installed
- **THEN** the system uses `xsel --clipboard --output` to read clipboard
