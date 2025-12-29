## MODIFIED Requirements
### Requirement: AI Tool Configuration
The command SHALL configure AI coding assistants with PLX instructions using a marker system.
#### Scenario: Prompting for AI tool selection
- **WHEN** run interactively
- **THEN** prompt the user with "Which AI tools do you use?" using a multi-select menu
- **AND** list every available tool with a checkbox:
  - Claude Code (creates or refreshes CLAUDE.md and slash commands)
  - Cursor (creates or refreshes `.cursor/commands/*` slash commands)
  - OpenCode (creates or refreshes `.opencode/command/plx-*.md` slash commands)
  - Windsurf (creates or refreshes `.windsurf/workflows/plx-*.md` workflows)
  - Kilo Code (creates or refreshes `.kilocode/workflows/plx-*.md` workflows)
  - Codex (creates or refreshes global prompts at `~/.codex/prompts/plx-*.md`)
  - AGENTS.md standard (creates or refreshes AGENTS.md with PLX markers)
- **AND** show "(already configured)" beside tools whose managed files exist so users understand selections will refresh content
- **AND** treat disabled tools as "coming soon" and keep them unselectable
- **AND** allow confirming with Enter after selecting one or more tools

### Requirement: Slash Command Configuration
The init command SHALL generate slash command files for supported editors using shared templates.

#### Scenario: Generating slash commands for Claude Code
- **WHEN** the user selects Claude Code during initialization
- **THEN** create `.claude/commands/workspace/proposal.md`, `.claude/commands/workspace/apply.md`, and `.claude/commands/workspace/archive.md`
- **AND** populate each file from shared templates so command text matches other tools
- **AND** each template includes instructions for the relevant PLX workflow stage

#### Scenario: Generating slash commands for Cursor
- **WHEN** the user selects Cursor during initialization
- **THEN** create `.cursor/commands/plx-proposal.md`, `.cursor/commands/plx-apply.md`, and `.cursor/commands/plx-archive.md`
- **AND** populate each file from shared templates so command text matches other tools
- **AND** each template includes instructions for the relevant PLX workflow stage

#### Scenario: Generating slash commands for OpenCode
- **WHEN** the user selects OpenCode during initialization
- **THEN** create `.opencode/command/plx-proposal.md`, `.opencode/command/plx-apply.md`, and `.opencode/command/plx-archive.md`
- **AND** populate each file from shared templates so command text matches other tools
- **AND** each template includes instructions for the relevant PLX workflow stage

#### Scenario: Generating slash commands for Windsurf
- **WHEN** the user selects Windsurf during initialization
- **THEN** create `.windsurf/workflows/plx-proposal.md`, `.windsurf/workflows/plx-apply.md`, and `.windsurf/workflows/plx-archive.md`
- **AND** populate each file from shared templates (wrapped in PLX markers) so workflow text matches other tools
- **AND** each template includes instructions for the relevant PLX workflow stage

#### Scenario: Generating slash commands for Kilo Code
- **WHEN** the user selects Kilo Code during initialization
- **THEN** create `.kilocode/workflows/plx-proposal.md`, `.kilocode/workflows/plx-apply.md`, and `.kilocode/workflows/plx-archive.md`
- **AND** populate each file from shared templates (wrapped in PLX markers) so workflow text matches other tools
- **AND** each template includes instructions for the relevant PLX workflow stage

#### Scenario: Generating slash commands for Codex
- **WHEN** the user selects Codex during initialization
- **THEN** create global prompt files at `~/.codex/prompts/plx-proposal.md`, `~/.codex/prompts/plx-apply.md`, and `~/.codex/prompts/plx-archive.md` (or under `$CODEX_HOME/prompts` if set)
- **AND** populate each file from shared templates that map the first numbered placeholder (`$1`) to the primary user input (e.g., change identifier or question text)
- **AND** wrap the generated content in PLX markers so `plx update` can refresh the prompts without touching surrounding custom notes
