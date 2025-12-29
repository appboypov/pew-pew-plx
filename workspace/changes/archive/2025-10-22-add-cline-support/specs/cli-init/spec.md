## MODIFIED Requirements
### Requirement: AI Tool Configuration Details

The command SHALL properly configure selected AI tools with PLX-specific instructions using a marker system.

#### Scenario: Configuring Claude Code

- **WHEN** Claude Code is selected
- **THEN** create or update `CLAUDE.md` in the project root directory (not inside workspace/)
- **AND** populate the managed block with a short stub that points teammates to `@/workspace/AGENTS.md`

#### Scenario: Configuring CodeBuddy Code

- **WHEN** CodeBuddy Code is selected
- **THEN** create or update `CODEBUDDY.md` in the project root directory (not inside workspace/)
- **AND** populate the managed block with a short stub that points teammates to `@/workspace/AGENTS.md`

#### Scenario: Configuring Cline

- **WHEN** Cline is selected
- **THEN** create or update `CLINE.md` in the project root directory (not inside workspace/)
- **AND** populate the managed block with a short stub that points teammates to `@/workspace/AGENTS.md`

#### Scenario: Creating new CLAUDE.md

- **WHEN** CLAUDE.md does not exist
- **THEN** create new file with stub instructions wrapped in markers so the full workflow stays in `workspace/AGENTS.md`:
```markdown
<!-- PLX:START -->
# PLX Instructions

This project uses PLX to manage AI assistant workflows.

- Full guidance lives in '@/workspace/AGENTS.md'.
- Keep this managed block so 'plx update' can refresh the instructions.
<!-- PLX:END -->
```

### Requirement: Slash Command Configuration
The init command SHALL generate slash command files for supported editors using shared templates.

#### Scenario: Generating slash commands for Claude Code
- **WHEN** the user selects Claude Code during initialization
- **THEN** create `.claude/commands/workspace/proposal.md`, `.claude/commands/workspace/apply.md`, and `.claude/commands/workspace/archive.md`
- **AND** populate each file from shared templates so command text matches other tools
- **AND** each template includes instructions for the relevant PLX workflow stage

#### Scenario: Generating slash commands for CodeBuddy Code
- **WHEN** the user selects CodeBuddy Code during initialization
- **THEN** create `.codebuddy/commands/workspace/proposal.md`, `.codebuddy/commands/workspace/apply.md`, and `.codebuddy/commands/workspace/archive.md`
- **AND** populate each file from shared templates so command text matches other tools
- **AND** each template includes instructions for the relevant PLX workflow stage

#### Scenario: Generating slash commands for Cline
- **WHEN** the user selects Cline during initialization
- **THEN** create `.clinerules/plx-proposal.md`, `.clinerules/plx-apply.md`, and `.clinerules/plx-archive.md`
- **AND** populate each file from shared templates so command text matches other tools
- **AND** include Cline-specific Markdown heading frontmatter
- **AND** each template includes instructions for the relevant PLX workflow stage

#### Scenario: Generating slash commands for Cursor
- **WHEN** the user selects Cursor during initialization
- **THEN** create `.cursor/commands/plx-proposal.md`, `.cursor/commands/plx-apply.md`, and `.cursor/commands/plx-archive.md`
- **AND** populate each file from shared templates so command text matches other tools
- **AND** each template includes instructions for the relevant PLX workflow stage

#### Scenario: Generating slash commands for OpenCode
- **WHEN** the user selects OpenCode during initialization
- **THEN** create `.opencode/commands/plx-proposal.md`, `.opencode/commands/plx-apply.md`, and `.opencode/commands/plx-archive.md`
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

#### Scenario: Generating slash commands for GitHub Copilot
- **WHEN** the user selects GitHub Copilot during initialization
- **THEN** create `.github/prompts/plx-proposal.prompt.md`, `.github/prompts/plx-apply.prompt.md`, and `.github/prompts/plx-archive.prompt.md`
- **AND** populate each file with YAML frontmatter containing a `description` field that summarizes the workflow stage
- **AND** include `$ARGUMENTS` placeholder to capture user input
- **AND** wrap the shared template body with PLX markers so `plx update` can refresh the content
- **AND** each template includes instructions for the relevant PLX workflow stage
