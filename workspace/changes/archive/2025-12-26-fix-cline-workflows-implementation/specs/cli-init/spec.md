# Delta for CLI Init

## MODIFIED Requirements
### Requirement: Slash Command Configuration

The init command SHALL generate slash command files for supported editors using shared templates.

#### Scenario: Generating slash commands for Cline
- **WHEN** the user selects Cline during initialization
- **THEN** create `.clinerules/workflows/plx-proposal.md`, `.clinerules/workflows/plx-apply.md`, and `.clinerules/workflows/plx-archive.md`
- **AND** populate each file from shared templates so command text matches other tools
- **AND** include Cline-specific Markdown heading frontmatter
- **AND** each template includes instructions for the relevant PLX workflow stage
