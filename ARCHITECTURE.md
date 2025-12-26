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
│   │   ├── get.ts          # Artifact retrieval (get task)
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
│   ├── services/           # Domain services
│   │   ├── content-filter.ts # Markdown section filtering
│   │   └── item-retrieval.ts # ID-based item retrieval
│   ├── core/               # Core business logic
│   │   ├── completions/    # Shell completion generators
│   │   ├── configurators/  # AI tool configurators
│   │   ├── converters/     # Format converters (JSON)
│   │   ├── parsers/        # Markdown/spec parsers
│   │   ├── schemas/        # Zod schemas for specs/changes
│   │   ├── styles/         # Terminal color palette
│   │   ├── templates/      # Template generators
│   │   └── validation/     # Validation rules and constants
│   └── utils/              # Shared utilities
│       ├── change-prioritization.ts # Change priority scoring
│       ├── command-name.ts # CLI command name detection
│       ├── file-system.ts  # File operations with markers
│       ├── interactive.ts  # Interactive mode helpers
│       ├── item-discovery.ts # Find specs/changes
│       ├── match.ts        # Pattern matching utilities
│       ├── shell-detection.ts # Detect user's shell
│       ├── markdown-sections.ts # Extract sections from markdown
│       ├── task-file-parser.ts # Parse task filenames (NNN-name.md)
│       ├── task-migration.ts # Legacy tasks.md migration
│       ├── task-progress.ts # Task completion tracking
│       └── task-status.ts  # Task status (to-do/in-progress/done)
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
- `GetCommand` - Retrieve project artifacts (tasks, changes, specs)

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
- `TrackedIssueSchema` (embedded in Change frontmatter)
- `GlobalConfigSchema` (for CLI configuration)

### External Issue Tracking

Change proposals can link to external issue trackers via YAML frontmatter in `proposal.md`:

```yaml
---
tracked-issues:
  - tracker: linear
    id: PLX-123
    url: https://linear.app/team/issue/PLX-123
  - tracker: github
    id: "#45"
    url: https://github.com/org/repo/issues/45
---
```

Tracked issues are:
- Displayed in `openspec list` output alongside change names
- Included in `openspec show --json` output
- Reported when archiving changes

### Service Layer

Domain services encapsulate business logic for reuse across commands:

- **ItemRetrievalService** - Retrieves tasks, changes, and specs by ID
  - `getTaskById(id)` - Find task across all changes
  - `getChangeById(id)` - Get change proposal with tasks
  - `getSpecById(id)` - Get spec content
  - `getTasksForChange(id)` - List tasks for a change
  - `getAllOpenTasks()` - List all non-done tasks

- **ContentFilterService** - Extracts markdown sections
  - `filterSections(content, sections)` - Extract named sections
  - `filterMultipleTasks(contents, sections)` - Aggregate from multiple tasks

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

Location: `~/.config/openspec/config.json` (XDG-compliant, respects `XDG_CONFIG_HOME`)

```json
{
  "featureFlags": {}
}
```

Managed via `openspec config` subcommands:
- `config path` - Show config file location
- `config list [--json]` - Show all settings
- `config get <key>` - Get specific value (raw, scriptable)
- `config set <key> <value>` - Set value (auto-coerces types)
- `config unset <key>` - Remove key (revert to default)
- `config reset --all [-y]` - Reset all configuration
- `config edit` - Open config in `$EDITOR`

### Project Configuration

OpenSpec creates/updates these files in a project:

| File | Purpose |
|------|---------|
| `ARCHITECTURE.md` (root) | Project context and conventions (auto-generated during init) |
| `openspec/AGENTS.md` | AI agent instructions |
| `AGENTS.md` (root) | Universal stub for AGENTS.md-compatible tools |
| `.claude/commands/` | Claude Code slash commands |
| Various tool configs | Tool-specific configuration files |

The `openspec init` command generates `ARCHITECTURE.md` at the project root with technology stack, folder structure, and architectural patterns. This replaces the previous `openspec/project.md` approach.

### AI Tool Support

Tools are defined in `src/core/config.ts` with availability flags. Currently supported:

| Tool | Config File | Slash Commands |
|------|-------------|----------------|
| Amazon Q Developer | `.amazonq/rules/` | `.amazonq/prompts/` |
| Antigravity | `.antigravity/rules/` | `.antigravity/prompts/` |
| Auggie (CLI) | `.auggie/rules/` | `.auggie/prompts/` |
| Claude Code | `.claude/settings.local.json` | `.claude/commands/openspec/` |
| Cline | `.clinerules` | `.clinerules/workflows/` |
| Codex | N/A | `~/.codex/prompts/` (global) |
| CodeBuddy Code | `.codebuddy/rules/` | `.codebuddy/prompts/` |
| CoStrict | `.costrict/` | `.costrict/prompts/` |
| Crush | `.crush/rules/` | `.crush/prompts/` |
| Cursor | `.cursor/rules/openspec.mdc` | `.cursor/prompts/` |
| Factory Droid | `.factory/rules/` | `.factory/prompts/` |
| Gemini CLI | `.gemini/` | `.gemini/prompts/` |
| GitHub Copilot | `.github/copilot-instructions.md` | `.github/prompts/` |
| iFlow | `.iflow/rules/` | `.iflow/prompts/` |
| Kilo Code | `.kilocode/rules/` | `.kilocode/prompts/` |
| OpenCode | `.opencode/rules/` | `.opencode/prompts/` |
| Qoder (CLI) | `.qoder/rules/` | `.qoder/prompts/` |
| Qwen Code | `.qwen/rules/` | `.qwen/prompts/` |
| RooCode | `.roocode/rules/` | `.roocode/prompts/` |
| Windsurf | `.windsurf/workflows/` | (workflow files) |

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

### Shell Completions

The CLI supports shell completions for tab-completion of commands and arguments:

```bash
openspec completion install [shell]   # Install completions
openspec completion generate [shell]  # Output script to stdout
openspec completion uninstall [shell] # Remove completions
```

Shell auto-detection uses `$SHELL` environment variable. Currently supports: `zsh`.

The completion system uses:
- `src/core/completions/command-registry.ts` - Defines available commands and their arguments
- `src/core/completions/generators/` - Shell-specific script generators
- `src/core/completions/installers/` - Shell-specific installation logic

Hidden `__complete <type>` command provides machine-readable completion data for dynamic completions (changes, specs, archived-changes).

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

## Task Management System

OpenSplx includes a task management system for tracking implementation progress within changes.

### Task File Structure

Tasks are stored in `openspec/changes/<change-name>/tasks/` as individual markdown files:

```
tasks/
├── 001-design.md       # First task
├── 002-implement.md    # Second task
└── 003-test.md         # Third task
```

Task filenames follow the pattern `NNN-<kebab-case-name>.md` where NNN is a zero-padded sequence number.

### Task Status

Each task file has YAML frontmatter with a status field:

```yaml
---
status: to-do    # or 'in-progress' or 'done'
---
```

Status transitions:
- `to-do` → `in-progress` (when starting work)
- `in-progress` → `done` (when completing)

### Task Progress Tracking

Progress is calculated from checkbox items in task files:

```markdown
## Implementation Checklist
- [x] Completed item
- [ ] Pending item
```

Checkboxes under `## Constraints` and `## Acceptance Criteria` sections are excluded from progress calculations.

### Change Prioritization

The `openspec get task` command selects the highest-priority change using:

1. **Completion Percentage** (highest first): Changes closer to completion get priority
2. **Creation Date** (oldest first): Tiebreaker when percentages are equal

Changes with 0 tasks and no in-progress task are filtered out as non-actionable. Changes with an in-progress task are kept to allow auto-completion to run.

### Get Command Flow

The `get` command provides subcommands for retrieving project artifacts:

| Subcommand | Description |
|------------|-------------|
| `get task` | Get next prioritized task or specific task by ID |
| `get change --id <id>` | Retrieve change proposal by ID |
| `get spec --id <id>` | Retrieve spec by ID |
| `get tasks` | List all open tasks or tasks for specific change |

**Get Task Flow:**
```
User runs: openspec get task
    ↓
getPrioritizedChange() → find highest-priority change
    ↓
Find next task (in-progress or first to-do)
    ↓
Display proposal.md, design.md (optional), and task content
```

**Automatic Task Completion:**
```
Check if in-progress task has all Implementation Checklist items checked
    ↓
If all checked: mark task as 'done', find next to-do task → mark as 'in-progress'
    ↓
Display next task (without proposal/design)
    ↓
Include 'autoCompletedTask' in JSON output
```

**With `--did-complete-previous`:**
```
Mark in-progress task as 'done'
    ↓
Complete all Implementation Checklist items
    ↓
Find next to-do task → mark as 'in-progress'
    ↓
Display next task (without proposal/design)
```

**Content Filtering:**

The `get task` command supports content filtering:
- `--constraints` - Show only Constraints section
- `--acceptance-criteria` - Show only Acceptance Criteria section
- `--id <task-id>` - Retrieve specific task by filename (without extension)

These use `ContentFilterService` which extracts sections via `markdown-sections.ts`.

## Fork-Specific Features (OpenSplx)

OpenSplx extends OpenSpec with:

1. **PLX Command Alias**: Both `openspec` and `plx` CLI commands work identically
2. **Dynamic Command Name**: CLI detects invocation name (`openspec` or `plx`) and uses it in output messages, help text, and shell completions via `src/utils/command-name.ts`
3. **PLX Slash Commands**: Additional commands in `.claude/commands/plx/`
   - `/plx/init-architecture` - Generate ARCHITECTURE.md
   - `/plx/update-architecture` - Refresh architecture documentation
   - `/plx/get-task` - Get next prioritized task and execute workflow
4. **PlxSlashCommandRegistry**: Separate registry for PLX-specific commands
5. **Extended Templates**: Architecture template generation
6. **Get Command**: Extended with subcommands for item retrieval (`get task`, `get change`, `get spec`, `get tasks`) and content filtering (`--constraints`, `--acceptance-criteria`)
7. **Automatic Task Completion**: Detects when in-progress task has all Implementation Checklist items checked and auto-advances to next task
8. **Services Layer**: Domain services for item retrieval and content filtering

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
