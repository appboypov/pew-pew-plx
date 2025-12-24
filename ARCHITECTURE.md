# OpenSplx Architecture

OpenSplx is a fork of [OpenSpec](https://github.com/Fission-AI/OpenSpec) that provides an AI-native system for spec-driven development. This document describes the project architecture for feature planning and development.

## Technology Stack

| Category | Technology | Version |
|----------|-----------|---------|
| Runtime | Node.js | >=20.19.0 |
| Language | TypeScript | 5.9.x |
| Module System | ESM (NodeNext) | - |
| Package Manager | pnpm | - |
| Build | Custom build.js | - |
| Testing | Vitest | 3.2.x |
| Linting | ESLint | 9.x |
| Versioning | Changesets | 2.x |

### Key Dependencies

- **commander** (14.x): CLI argument parsing and command definition
- **@inquirer/core, @inquirer/prompts** (7-10.x): Interactive terminal prompts
- **chalk** (5.x): Terminal styling and colors
- **ora** (8.x): Terminal spinners for progress indication
- **zod** (4.x): Schema validation and type inference

## Project Structure

```
OpenSplx/
├── bin/                    # CLI entry points
│   ├── openspec.js         # Main CLI entry (openspec command)
│   └── plx.js              # Alias CLI entry (plx command)
├── src/
│   ├── index.ts            # Library exports (core + cli)
│   ├── cli/
│   │   └── index.ts        # CLI program definition (Commander.js)
│   ├── commands/           # Top-level command implementations
│   │   ├── change.ts       # Change management subcommands
│   │   ├── completion.ts   # Shell completion commands
│   │   ├── config.ts       # Configuration commands
│   │   ├── show.ts         # Item display command
│   │   ├── spec.ts         # Spec management commands
│   │   └── validate.ts     # Validation command
│   ├── core/               # Core business logic
│   │   ├── archive.ts      # Archive completed changes
│   │   ├── config.ts       # Constants and AI tool definitions
│   │   ├── config-schema.ts # Zod schemas for configuration
│   │   ├── global-config.ts # Global config file management
│   │   ├── init.ts         # Project initialization wizard
│   │   ├── list.ts         # List changes/specs
│   │   ├── update.ts       # Update OpenSpec files
│   │   ├── view.ts         # Interactive dashboard
│   │   ├── completions/    # Shell completion generators
│   │   ├── configurators/  # AI tool configurators
│   │   ├── converters/     # Format converters (JSON)
│   │   ├── parsers/        # Markdown/spec parsers
│   │   ├── schemas/        # Zod schemas for specs/changes
│   │   ├── styles/         # Terminal color palette
│   │   ├── templates/      # Template generators
│   │   └── validation/     # Validation rules and constants
│   └── utils/              # Shared utilities
│       ├── command-name.ts # CLI command name detection
│       ├── file-system.ts  # File operations with markers
│       ├── interactive.ts  # Interactive mode helpers
│       ├── item-discovery.ts # Find specs/changes
│       ├── match.ts        # Pattern matching utilities
│       ├── shell-detection.ts # Detect user's shell
│       └── task-progress.ts # Task completion tracking
├── test/                   # Test files (mirrors src structure)
├── openspec/               # OpenSpec directory (dogfooding)
├── .claude/commands/       # Claude Code slash commands
└── dist/                   # Compiled output
```

## Architecture Patterns

### Command Pattern

The CLI uses the **Command Pattern** via Commander.js. Commands are registered in `src/cli/index.ts` and delegate to dedicated command classes:

```
CLI Entry (bin/openspec.js)
    ↓
Commander Program (src/cli/index.ts)
    ↓
Command Classes (src/commands/*.ts, src/core/*.ts)
```

Each command class encapsulates its own logic:
- `InitCommand` - Interactive project initialization
- `UpdateCommand` - Refresh OpenSpec files
- `ListCommand` - Display changes/specs
- `ViewCommand` - Interactive dashboard
- `ArchiveCommand` - Archive completed changes
- `ValidateCommand` - Validate specs and changes
- `ShowCommand` - Display item details
- `ChangeCommand` - Change management
- `CompletionCommand` - Shell completions
- `ConfigCommand` - Global configuration

### Registry Pattern

Tool configurators use a **Registry Pattern** with static initialization:

```typescript
// ToolRegistry - manages AI tool config file generators
ToolRegistry.get('claude')?.configure(projectPath, openspecDir);

// SlashCommandRegistry - manages slash command generators
SlashCommandRegistry.get('claude')?.generateAll(projectPath, openspecDir);

// PlxSlashCommandRegistry - manages PLX-specific commands (fork feature)
PlxSlashCommandRegistry.get('claude')?.generateAll(projectPath);
```

Registries are populated via static initializer blocks, making all configurators available at module load.

### Parser Pattern

Markdown parsing follows a **Recursive Descent** approach:

1. `MarkdownParser` - Base parser for structured markdown
   - Extracts frontmatter (YAML-like)
   - Parses sections hierarchically
   - Parses requirements and scenarios

2. `ChangeParser` - Extended parser for change proposals
   - Inherits from MarkdownParser
   - Handles delta specifications

3. `requirement-blocks.ts` - Specialized parser for delta specs
   - Parses ADDED/MODIFIED/REMOVED/RENAMED sections
   - Extracts requirement blocks

### Schema Validation

Validation uses **Zod schemas** with custom rules:

```
Zod Schema (src/core/schemas/)
    ↓
Validator Class (src/core/validation/validator.ts)
    ↓
ValidationReport { valid, issues, summary }
```

Schema hierarchy:
- `ScenarioSchema` → `RequirementSchema` → `SpecSchema`
- `DeltaSchema` → `ChangeSchema`
- `TrackedIssueSchema` (embedded in Change)
- `GlobalConfigSchema` (for CLI configuration)

### Template System

Templates use a **Factory Pattern** via `TemplateManager`:

```typescript
TemplateManager.getTemplates(context)     // Core templates
TemplateManager.getSlashCommandBody(id)   // Slash command templates
TemplateManager.getPlxSlashCommandBody(id) // PLX slash command templates
TemplateManager.getArchitectureTemplate(context) // Architecture doc template
```

Templates support dynamic content via context injection.

### File Marker System

Files managed by OpenSpec use **markers** to identify managed sections:

```markdown
<!-- OPENSPEC:START -->
Managed content here...
<!-- OPENSPEC:END -->
```

`FileSystemUtils.updateFileWithMarkers()` handles safe updates preserving user content outside markers.

## Data Flow

### Initialization Flow

```
User runs: openspec init
    ↓
InitCommand.execute()
    ↓
Validate permissions → Interactive tool wizard
    ↓
CreateDirectoryStructure → GenerateFiles
    ↓
For each selected tool:
    ToolRegistry.get(tool).configure()
    SlashCommandRegistry.get(tool).generateAll()
    PlxSlashCommandRegistry.get(tool).generateAll()
    ↓
Write AGENTS.md root stub
```

### Validation Flow

```
User runs: openspec validate <item>
    ↓
ValidateCommand.execute()
    ↓
Discover items (specs/changes)
    ↓
For each item:
    Validator.validateSpec() or Validator.validateChange()
        ↓
    MarkdownParser.parseSpec/parseChange()
        ↓
    ZodSchema.safeParse()
        ↓
    Apply custom rules (applySpecRules/applyChangeRules)
        ↓
    Return ValidationReport
```

### Archive Flow

```
User runs: openspec archive <change>
    ↓
ArchiveCommand.execute()
    ↓
Validate change (proposal.md, delta specs)
    ↓
Check task progress (tasks.md)
    ↓
Find spec updates (change/specs/* → main/specs/*)
    ↓
For each spec:
    parseDeltaSpec() → extract ADDED/MODIFIED/REMOVED/RENAMED
    buildUpdatedSpec() → merge with existing spec
    validateSpecContent() → pre-write validation
    writeUpdatedSpec()
    ↓
Move change to archive/YYYY-MM-DD-<name>/
```

## Configuration

### Global Configuration

Location: `~/.config/openspec/config.json` (XDG-compliant)

```json
{
  "featureFlags": {}
}
```

Managed via `openspec config get/set/delete` commands.

### Project Configuration

OpenSpec creates/updates these files in a project:

| File | Purpose |
|------|---------|
| `openspec/AGENTS.md` | AI agent instructions |
| `openspec/project.md` | Project context template |
| `AGENTS.md` (root) | Universal stub for AGENTS.md-compatible tools |
| `.claude/commands/` | Claude Code slash commands |
| Various tool configs | Tool-specific configuration files |

### AI Tool Support

Tools are defined in `src/core/config.ts` with availability flags:

| Tool | Config File | Slash Commands |
|------|-------------|----------------|
| Claude Code | `.claude/settings.local.json` | `.claude/commands/openspec/` |
| Cursor | `.cursor/rules/openspec.mdc` | `.cursor/prompts/` |
| Windsurf | `.windsurf/workflows/` | (workflow files) |
| Cline | `.clinerules` | `.clinerules/workflows/` |
| Codex | N/A | `~/.codex/prompts/` (global) |
| GitHub Copilot | N/A | `.github/prompts/` |
| ... | ... | ... |

## Key Conventions

### Naming

- Commands: PascalCase class names (e.g., `InitCommand`)
- Files: kebab-case (e.g., `file-system.ts`)
- Constants: SCREAMING_SNAKE_CASE (e.g., `OPENSPEC_DIR_NAME`)
- Schemas: PascalCase with `Schema` suffix (e.g., `SpecSchema`)

### Error Handling

Commands wrap operations in try/catch and use `ora` for user-friendly output:

```typescript
try {
  // operation
} catch (error) {
  ora().fail(`Error: ${(error as Error).message}`);
  process.exit(1);
}
```

### Interactive Mode

Commands support `--no-interactive` flag for CI/scripting. Interactive prompts use `@inquirer/prompts`:

```typescript
if (!options.noInteractive) {
  const { confirm } = await import('@inquirer/prompts');
  const proceed = await confirm({ message: '...' });
}
```

### Async Patterns

- File operations use `fs.promises` API
- Commands are async and return `Promise<void>`
- Parallel operations where possible (e.g., `Promise.all` for independent validations)

## Testing

Tests mirror the source structure under `test/`:

```
test/
├── cli-e2e/          # End-to-end CLI tests
├── commands/         # Command integration tests
├── core/             # Core module unit tests
├── utils/            # Utility function tests
├── helpers/          # Test utilities
└── fixtures/         # Test data
```

Run tests:
```bash
pnpm test        # Run all tests
pnpm test:watch  # Watch mode
pnpm test:ui     # Vitest UI
```

## Build System

The custom `build.js` script:
1. Runs TypeScript compiler (`tsc`)
2. Copies non-TS assets if needed

Build output goes to `dist/` with:
- `.js` files (ESM modules)
- `.d.ts` declaration files
- Source maps

## Fork-Specific Features (OpenSplx)

OpenSplx extends OpenSpec with:

1. **PLX Command Alias**: Both `openspec` and `plx` CLI commands
2. **PLX Slash Commands**: Additional commands in `.claude/commands/plx/`
   - `/plx/init-architecture` - Generate ARCHITECTURE.md
   - `/plx/update-architecture` - Refresh architecture documentation
3. **PlxSlashCommandRegistry**: Separate registry for PLX-specific commands
4. **Extended Templates**: Architecture template generation

## Extending the System

### Adding a New AI Tool

1. Create configurator in `src/core/configurators/<tool>.ts`
2. Register in `src/core/configurators/registry.ts`
3. Create slash command configurator in `src/core/configurators/slash/<tool>.ts`
4. Register in `src/core/configurators/slash/registry.ts`
5. Add to `AI_TOOLS` array in `src/core/config.ts`
6. (Optional) Create PLX configurator in `slash/plx-<tool>.ts`

### Adding a New Command

1. Create command file in `src/commands/<name>.ts` or `src/core/<name>.ts`
2. Register in `src/cli/index.ts` using Commander.js
3. Add tests in `test/commands/<name>.test.ts`

### Adding New Validation Rules

1. Add constants to `src/core/validation/constants.ts`
2. Add schema rules to appropriate schema in `src/core/schemas/`
3. Add custom rules in `Validator.applySpecRules()` or `applyChangeRules()`
