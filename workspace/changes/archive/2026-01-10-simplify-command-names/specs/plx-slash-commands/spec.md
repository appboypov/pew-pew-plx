## MODIFIED Requirements

### Requirement: Slash Command Frontmatter
Each slash command file MUST include tool-appropriate frontmatter with name, description, and metadata.

#### Scenario: Claude Code frontmatter format
- **WHEN** generating a Claude Code slash command file
- **THEN** include YAML frontmatter with:
  - `name`: Title case of filename (e.g., `Refine Architecture` for `refine-architecture.md`)
  - `description`: Brief command purpose
  - `category`: `Pew Pew Plx`
  - `tags`: Array including `plx` and relevant keywords

#### Scenario: Command name derivation
- **WHEN** deriving the command name from filename
- **THEN** convert kebab-case to Title Case (e.g., `get-task` → `Get Task`)
- **AND** do not include tool or project prefixes in the name
