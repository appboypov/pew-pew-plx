## MODIFIED Requirements

### Requirement: Slash Command Naming

All slash commands SHALL use the `splx` prefix instead of `splx` prefix.

#### Scenario: Slash command format

- **WHEN** slash commands are generated for AI tools
- **THEN** use the format `/splx:command-name` or `/splx-command-name` depending on tool conventions
- **AND** update all command references from `splx` to `splx` in generated templates

### Requirement: Command References in Templates

All slash command templates SHALL reference the `splx` CLI command instead of `splx`.

#### Scenario: Template command references

- **WHEN** generating slash command templates
- **THEN** all CLI command examples use `splx` instead of `splx`
- **AND** all references to the command in help text use `splx`
