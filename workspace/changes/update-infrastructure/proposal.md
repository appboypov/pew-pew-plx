# Change: Update Infrastructure for CLI Standardization

## Why

After implementing the centralized task storage and CLI standardization changes (proposals 1-7), all documentation, templates, instructions, completions, and tests must be updated to reflect the new patterns. This proposal ensures consistency between the implementation and its supporting infrastructure.

## What Changes

- **Agent Instructions**: Update `workspace/AGENTS.md`, `CLAUDE.md`, and all slash commands with new CLI patterns
- **AI Tool Configurators**: Update all 20+ configurators to generate commands using new patterns
- **ARCHITECTURE.md**: Update with new directory structure and CLI command documentation
- **Shell Completions**: Update completion generators for all new/changed commands
- **Templates**: Update/create templates for all entity types (task, change, spec, request)
- **Tests**: Migrate all existing tests to work with new structure
- **Help Text**: Update all command descriptions and help messages

## Impact

- Affected specs: `docs-agent-instructions`, `plx-slash-commands`
- Affected code: All configurators, templates, completions, test files
- Affected files: AGENTS.md, CLAUDE.md, ARCHITECTURE.md, all slash commands
- **No breaking changes beyond what previous proposals already introduced**
