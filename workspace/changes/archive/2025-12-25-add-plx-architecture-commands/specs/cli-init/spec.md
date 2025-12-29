## ADDED Requirements

### Requirement: PLX Slash Command Configuration

The init command SHALL generate PLX slash command files for supported editors alongside PLX slash commands.

#### Scenario: Generating PLX slash commands for Claude Code

- **WHEN** the user selects Claude Code during initialization
- **THEN** create `.claude/commands/plx/init-architecture.md` and `.claude/commands/plx/update-architecture.md`
- **AND** populate each file from PLX-specific templates with appropriate frontmatter
- **AND** wrap the command body in PLX markers so `plx update` can refresh the content
- **AND** each template includes guardrails and steps for architecture documentation generation

#### Scenario: PLX commands not generated for unsupported tools

- **GIVEN** a new project at path "./test-project"
- **WHEN** only "agents" (AGENTS.md) is selected and no natively supported tools are configured
- **THEN** no PLX command files should be created

#### Scenario: PLX commands refreshed on re-init

- **GIVEN** an existing project with PLX commands
- **WHEN** the user runs `plx init` again
- **THEN** update PLX command content within PLX markers
- **AND** preserve any content outside the markers
