## MODIFIED Requirements
### Requirement: Slash Command Configuration
The init command SHALL generate slash command files for supported editors using shared templates.

#### Scenario: Generating slash commands for Claude Code
- **WHEN** the user selects Claude Code during initialization
- **THEN** create `.claude/commands/workspace/proposal.md`, `.claude/commands/workspace/apply.md`, and `.claude/commands/workspace/archive.md`
- **AND** populate each file from shared templates so command text matches other tools
- **AND** each template includes instructions for the relevant PLX workflow stage

#### Scenario: Generating slash commands for Cursor
- **WHEN** the user selects Cursor during initialization
- **THEN** create `.cursor/commands/splx-proposal.md`, `.cursor/commands/splx-apply.md`, and `.cursor/commands/splx-archive.md`
- **AND** populate each file from shared templates so command text matches other tools
- **AND** each template includes instructions for the relevant PLX workflow stage

#### Scenario: Generating slash commands for Factory Droid
- **WHEN** the user selects Factory Droid during initialization
- **THEN** create `.factory/commands/splx-proposal.md`, `.factory/commands/splx-apply.md`, and `.factory/commands/splx-archive.md`
- **AND** populate each file from shared templates that include Factory-compatible YAML frontmatter for the `description` and `argument-hint` fields
- **AND** include the `$ARGUMENTS` placeholder in the template body so droid receives any user-supplied input
- **AND** wrap the generated content in PLX managed markers so `splx update` can safely refresh the commands

#### Scenario: Generating slash commands for OpenCode
- **WHEN** the user selects OpenCode during initialization
- **THEN** create `.opencode/commands/splx-proposal.md`, `.opencode/commands/splx-apply.md`, and `.opencode/commands/splx-archive.md`
- **AND** populate each file from shared templates so command text matches other tools
- **AND** each template includes instructions for the relevant PLX workflow stage

#### Scenario: Generating slash commands for Windsurf
- **WHEN** the user selects Windsurf during initialization
- **THEN** create `.windsurf/workflows/splx-proposal.md`, `.windsurf/workflows/splx-apply.md`, and `.windsurf/workflows/splx-archive.md`
- **AND** populate each file from shared templates (wrapped in PLX markers) so workflow text matches other tools
- **AND** each template includes instructions for the relevant PLX workflow stage

#### Scenario: Generating slash commands for Kilo Code
- **WHEN** the user selects Kilo Code during initialization
- **THEN** create `.kilocode/workflows/splx-proposal.md`, `.kilocode/workflows/splx-apply.md`, and `.kilocode/workflows/splx-archive.md`
- **AND** populate each file from shared templates (wrapped in PLX markers) so workflow text matches other tools
- **AND** each template includes instructions for the relevant PLX workflow stage

#### Scenario: Generating slash commands for Codex
- **WHEN** the user selects Codex during initialization
- **THEN** create global prompt files at `~/.codex/prompts/splx-proposal.md`, `~/.codex/prompts/splx-apply.md`, and `~/.codex/prompts/splx-archive.md` (or under `$CODEX_HOME/prompts` if set)
- **AND** populate each file from shared templates that map the first numbered placeholder (`$1`) to the primary user input (e.g., change identifier or question text)
- **AND** wrap the generated content in PLX markers so `splx update` can refresh the prompts without touching surrounding custom notes

#### Scenario: Generating slash commands for GitHub Copilot
- **WHEN** the user selects GitHub Copilot during initialization
- **THEN** create `.github/prompts/splx-proposal.prompt.md`, `.github/prompts/splx-apply.prompt.md`, and `.github/prompts/splx-archive.prompt.md`
- **AND** populate each file with YAML frontmatter containing a `description` field that summarizes the workflow stage
- **AND** include `$ARGUMENTS` placeholder to capture user input
- **AND** wrap the shared template body with PLX markers so `splx update` can refresh the content
- **AND** each template includes instructions for the relevant PLX workflow stage
