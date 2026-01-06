# Pew Pew Plx Architecture

Pew Pew Plx is a fork of [OpenSpec](https://github.com/Fission-AI/OpenSpec) that provides an AI-native system for spec-driven development. This document describes the project architecture for feature planning and development.

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
pew-pew-plx/
├── bin/                    # CLI entry points
│   └── plx.js              # CLI entry (plx command)
├── src/
│   ├── index.ts            # Library exports (core + cli)
│   ├── cli/
│   │   └── index.ts        # CLI program definition (Commander.js)
│   ├── commands/           # Top-level command implementations
│   │   ├── change.ts       # Change management subcommands
│   │   ├── complete.ts     # Complete task/change commands
│   │   ├── completion.ts   # Shell completion commands
│   │   ├── config.ts       # Configuration commands
│   │   ├── get.ts          # Artifact retrieval (get task)
│   │   ├── parse-feedback.ts # Parse feedback markers command
│   │   ├── review.ts       # Review command
│   │   ├── show.ts         # Item display command
│   │   ├── spec.ts         # Spec management commands
│   │   ├── undo.ts         # Undo task/change commands
│   │   └── validate.ts     # Validation command
│   ├── core/               # Core business logic
│   │   ├── archive.ts      # Archive completed changes
│   │   ├── config.ts       # Constants and AI tool definitions
│   │   ├── config-schema.ts # Zod schemas for configuration
│   │   ├── global-config.ts # Global config file management
│   │   ├── init.ts         # Project initialization wizard
│   │   ├── list.ts         # List changes/specs
│   │   ├── update.ts       # Update PLX files
│   │   ├── view.ts         # Interactive dashboard
│   ├── services/           # Domain services
│   │   ├── content-filter.ts # Markdown section filtering
│   │   ├── feedback-scanner.ts # Feedback marker scanning
│   │   ├── item-retrieval.ts # ID-based item retrieval
│   │   └── task-id.ts      # Task ID parsing and validation
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
│       ├── clipboard.ts    # Cross-platform clipboard reading
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
│       ├── task-status.ts  # Task status (to-do/in-progress/done)
│       ├── workspace-discovery.ts # Multi-workspace discovery
│       └── workspace-filter.ts # Workspace filtering
├── test/                   # Test files (mirrors src structure)
├── workspace/              # PLX workspace directory (dogfooding)
│   ├── tasks/              # Centralized task storage
│   │   ├── NNN-<parent-id>-<name>.md  # Linked task
│   │   ├── NNN-<name>.md              # Standalone task
│   │   └── archive/                   # Archived tasks
│   ├── changes/            # Change proposals
│   ├── specs/              # Specifications
│   ├── reviews/            # Review entities
│   ├── requests/           # Feature requests
│   └── AGENTS.md           # AI agent instructions
├── .claude/commands/       # Claude Code slash commands
└── dist/                   # Compiled output
```

## Architecture Patterns

### Command Pattern

The CLI uses the **Command Pattern** via Commander.js. Commands are registered in `src/cli/index.ts` and delegate to dedicated command classes:

```
CLI Entry (bin/plx.js)
    ↓
Commander Program (src/cli/index.ts)
    ↓
Command Classes (src/commands/*.ts, src/core/*.ts)
```

Each command class encapsulates its own logic:
- `InitCommand` - Interactive project initialization
- `UpdateCommand` - Refresh PLX files
- `ViewCommand` - Interactive dashboard
- `ChangeCommand` - Change entity management with subcommands
- `SpecCommand` - Spec entity management with subcommands
- `TaskCommand` - Task entity management with subcommands
- `ReviewCommand` - Review entity management with subcommands
- `RequestCommand` - Request entity management with subcommands
- `CompletionCommand` - Shell completions
- `ConfigCommand` - Global configuration
- `CreateCommand` - Create entities (tasks, changes, specs, requests, reviews)
- `GetCommand` - Retrieve project artifacts (tasks, changes, specs, reviews)
- `CompleteCommand` - Mark tasks/changes as done
- `UndoCommand` - Revert tasks/changes to to-do status
- `ValidateCommand` - Validate specs and changes
- `ArchiveCommand` - Archive completed entities
- `ParseFeedbackCommand` - Parse feedback markers from code and generate review tasks
- `PasteCommand` - Paste clipboard content as entities (tasks, changes, specs, requests)
- `MigrateCommand` - Migrate legacy task storage to centralized format

### Registry Pattern

Tool configurators use a **Registry Pattern** with static initialization:

```typescript
// ToolRegistry - manages AI tool config file generators
ToolRegistry.get('claude')?.configure(projectPath, workspaceDir);

// SlashCommandRegistry - manages slash command generators for all commands
SlashCommandRegistry.get('claude')?.generateAll(projectPath, workspaceDir);
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
- Displayed in `plx get changes` output alongside change names
- Included in `plx get change --id <id> --json` output
- Reported when archiving changes

### Service Layer

Domain services encapsulate business logic for reuse across commands:

- **ItemRetrievalService** - Retrieves tasks, changes, specs, and reviews by ID
  - `getTaskById(id)` - Find task in centralized storage
  - `getChangeById(id)` - Get change proposal with linked tasks
  - `getSpecById(id)` - Get spec content
  - `getReviewById(id)` - Get review entity with linked tasks
  - `getTasksForParent(parentId, parentType)` - List tasks for a parent entity
  - `getAllOpenTasks()` - List all non-done tasks from centralized storage

- **ContentFilterService** - Extracts markdown sections
  - `filterSections(content, sections)` - Extract named sections
  - `filterMultipleTasks(contents, sections)` - Aggregate from multiple tasks

- **FeedbackScannerService** - Scans source files for feedback markers
  - `scanDirectory(dir)` - Recursively scan directory for feedback markers
  - `generateReview(reviewId, markers, parentType, parentId)` - Generate review entity from markers
  - `removeFeedbackMarkers(markers)` - Remove feedback markers from source files
  - Supports multiple comment styles (C-style, Python, HTML/Markdown)
  - Extracts spec impact annotations `(spec:<spec-id>)`
  - Scans 40+ file extensions including `.js`, `.ts`, `.py`, `.go`, `.rs`, `.md`, etc.

- **Task ID utilities** (`src/services/task-id.ts`) - Task ID parsing and validation
  - `getTaskId(task)` - Extract task ID from task object
  - `getTaskIdFromFilename(filename)` - Parse ID from filename
  - `parseTaskId(taskId)` - Parse and validate task ID format
  - `normalizeTaskId(taskId)` - Normalize task ID format
  - `isValidTaskId(taskId)` - Validate task ID format

### Template System

Templates use a **Factory Pattern** via `TemplateManager`:

```typescript
TemplateManager.getTemplates(context)       // Core templates
TemplateManager.getSlashCommandBody(id)     // Slash command templates
TemplateManager.getArchitectureTemplate(context) // Architecture doc template
```

Templates support dynamic content via context injection.

### File Marker System

Files managed by PLX use **markers** to identify managed sections:

```markdown
<!-- PLX:START -->
Managed content here...
<!-- PLX:END -->
```

`FileSystemUtils.updateFileWithMarkers()` handles safe updates preserving user content outside markers.

## Data Flow

### Initialization Flow

```
User runs: plx init
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
    ↓
Write AGENTS.md root stub
```

### Validation Flow

```
User runs: plx validate <item>
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
User runs: plx archive change --id <id>
    ↓
ArchiveCommand.execute()
    ↓
Validate change (proposal.md, delta specs)
    ↓
Check task progress (linked tasks in workspace/tasks/)
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
    ↓
Archive linked tasks to workspace/tasks/archive/
```

## Configuration

### Global Configuration

Location: `~/.config/plx/config.json` (XDG-compliant, respects `XDG_CONFIG_HOME`)

```json
{
  "featureFlags": {}
}
```

Managed via `plx config` subcommands:
- `config path` - Show config file location
- `config list [--json]` - Show all settings
- `config get <key>` - Get specific value (raw, scriptable)
- `config set <key> <value>` - Set value (auto-coerces types)
- `config unset <key>` - Remove key (revert to default)
- `config reset --all [-y]` - Reset all configuration
- `config edit` - Open config in `$EDITOR`

### Project Configuration

PLX creates/updates these files in a project:

| File | Purpose |
|------|---------|
| `ARCHITECTURE.md` (root) | Project context and conventions (auto-generated during init) |
| `workspace/AGENTS.md` | AI agent instructions |
| `AGENTS.md` (root) | Universal stub for AGENTS.md-compatible tools |
| `.claude/commands/` | Claude Code slash commands |
| Various tool configs | Tool-specific configuration files |

The `plx init` command generates `ARCHITECTURE.md` at the project root with technology stack, folder structure, and architectural patterns.

### AI Tool Support

Tools are defined in `src/core/config.ts` with availability flags. Currently supported:

| Tool | Config File | Slash Commands |
|------|-------------|----------------|
| Amazon Q Developer | `.amazonq/rules/` | `.amazonq/prompts/` |
| Antigravity | `.antigravity/rules/` | `.antigravity/prompts/` |
| Auggie (CLI) | `.auggie/rules/` | `.auggie/prompts/` |
| Claude Code | `.claude/settings.local.json` | `.claude/commands/plx/` |
| Cline | `.clinerules` | `.clinerules/workflows/` |
| Codex | N/A | `~/.codex/prompts/` (global) |
| CodeBuddy Code | `.codebuddy/rules/` | `.codebuddy/prompts/` |
| CoStrict | `.costrict/` | `.costrict/prompts/` |
| Crush | `.crush/rules/` | `.crush/prompts/` |
| Cursor | `.cursor/rules/plx.mdc` | `.cursor/prompts/` |
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
- Constants: SCREAMING_SNAKE_CASE (e.g., `PLX_DIR_NAME`)
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
plx completion install [shell]   # Install completions
plx completion generate [shell]  # Output script to stdout
plx completion uninstall [shell] # Remove completions
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
├── fixtures/         # Test data
└── test-utils.ts     # Shared test utilities (createValidPlxWorkspace, etc.)
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

Pew Pew Plx includes a task management system for tracking implementation progress across all entities.

### Task File Structure

Tasks are stored centrally in `workspace/tasks/` as individual markdown files:

```
workspace/tasks/
├── 001-add-feature-design.md           # Standalone task
├── 002-PLX-44-implement-api.md         # Linked to change PLX-44
├── 003-PLX-44-add-tests.md             # Linked to change PLX-44
├── 004-user-auth-update-docs.md        # Linked to spec user-auth
└── archive/                            # Archived tasks
    └── 001-completed-task.md
```

**Task Filename Patterns:**

- **Standalone**: `NNN-<kebab-case-name>.md`
- **Linked to parent**: `NNN-<parent-id>-<kebab-case-name>.md`

Where NNN is a zero-padded sequence number that increments across all tasks.

### Task Status

Each task file has YAML frontmatter with status, optional skill-level, and parent linking fields:

```yaml
---
status: to-do           # or 'in-progress' or 'done'
skill-level: medior     # or 'junior' or 'senior' (optional)
parent-type: change     # or 'spec' or 'review' (optional)
parent-id: PLX-44       # ID of parent entity (optional)
---
```

Status transitions:
- `to-do` → `in-progress` (when starting work)
- `in-progress` → `done` (when completing)

Parent linking:
- `parent-type` and `parent-id` establish relationship with parent entity
- Tasks without parent fields are standalone
- Filename includes parent-id for linked tasks: `NNN-<parent-id>-<name>.md`

### Task Skill Level

The optional `skill-level` field guides AI agents in selecting appropriate models when spawning sub-agents:

| Skill Level | Model Type | Use Case |
|-------------|------------|----------|
| `junior` | Lightweight (haiku) | Simple, routine tasks |
| `medior` | Balanced (sonnet) | Standard complexity tasks |
| `senior` | Advanced (opus) | Complex, architectural decisions |

Skill levels are:
- Displayed as color-coded badges in `plx get task` output
- Shown in the Skill column of `plx get tasks` tables
- Included in JSON output as `skillLevel` field
- Validated in strict mode (warning when missing or invalid)

### Task Progress Tracking

Progress is calculated from checkbox items in task files:

```markdown
## Implementation Checklist
- [x] Completed item
- [ ] Pending item
```

Checkboxes under `## Constraints` and `## Acceptance Criteria` sections are excluded from progress calculations.

### Change Prioritization

The `plx get task` command selects the highest-priority change using:

1. **Completion Percentage** (highest first): Changes closer to completion get priority
2. **Creation Date** (oldest first): Tiebreaker when percentages are equal

Changes with 0 tasks and no in-progress task are filtered out as non-actionable. Changes with an in-progress task are kept to allow auto-completion to run.

### Get Command Flow

The `get` command provides subcommands for retrieving project artifacts:

| Subcommand | Description |
|------------|-------------|
| `get task` | Get next prioritized task or specific task by ID |
| `get task --id <id>` | Retrieve specific task by ID |
| `get task --parent-id <id> --parent-type <type>` | Get next task for parent entity |
| `get change --id <id>` | Retrieve change proposal by ID |
| `get spec --id <id>` | Retrieve spec by ID |
| `get review --id <id>` | Retrieve review entity by ID |
| `get tasks` | List all open tasks |
| `get tasks --parent-id <id> --parent-type <type>` | List tasks for parent entity |
| `get changes` | List all active changes |
| `get specs` | List all specs |
| `get reviews` | List all reviews |

**Get Task Flow:**
```
User runs: plx get task
    ↓
getPrioritizedChange() → find highest-priority change
    ↓
Find next task (in-progress or first to-do) in workspace/tasks/
    ↓
Auto-transition to-do → in-progress (if needed)
    ↓
Display proposal.md, design.md (optional), and task content
```

**Auto-Transition:**
When retrieving a task via `get task` or `get task --id`, tasks with `status: to-do` are automatically transitioned to `in-progress`. JSON output includes a `transitionedToInProgress` field when this occurs.

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

### Complete and Undo Commands

The CLI provides explicit commands for task/entity completion and undo:

| Command | Description |
|---------|-------------|
| `complete task --id <id>` | Mark task as done, check all Implementation Checklist items |
| `complete change --id <id>` | Complete all linked tasks in a change |
| `complete review --id <id>` | Complete all linked tasks in a review |
| `undo task --id <id>` | Revert task to to-do, uncheck Implementation Checklist items |
| `undo change --id <id>` | Revert all linked tasks in a change to to-do |
| `undo review --id <id>` | Revert all linked tasks in a review to to-do |

**Complete Task Flow:**
```
User runs: plx complete task --id <task-id>
    ↓
ItemRetrievalService.getTaskById() → find task in workspace/tasks/
    ↓
Check status (if 'done' → warn and exit)
    ↓
completeTaskFully() → set status to 'done', check Implementation Checklist items
    ↓
Output result (JSON includes completedItems array)
```

**Undo Task Flow:**
```
User runs: plx undo task --id <task-id>
    ↓
ItemRetrievalService.getTaskById() → find task in workspace/tasks/
    ↓
Check status (if 'to-do' → warn and exit)
    ↓
undoTaskFully() → set status to 'to-do', uncheck Implementation Checklist items
    ↓
Output result (JSON includes uncheckedItems array)
```

Task status utilities in `src/utils/task-status.ts`:
- `completeTaskFully(filePath)` - Mark done + check checkboxes
- `undoTaskFully(filePath)` - Mark to-do + uncheck checkboxes
- `completeImplementationChecklist(content)` - Check Implementation Checklist items only
- `uncompleteImplementationChecklist(content)` - Uncheck Implementation Checklist items only

## Multi-Workspace Support

Pew Pew Plx supports monorepo and multi-project setups through automatic workspace discovery.

### Workspace Discovery

When running any command, PLX uses a two-phase discovery process:

**Phase 1: Upward Scan (Find Project Root)**
- Scans upward from current directory to find project root
- Project root identified by `workspace/AGENTS.md` containing `<!-- PLX:START -->` marker
- Stops at `.git` boundary if no workspace found
- Returns `null` if filesystem root reached without finding workspace

**Phase 2: Downward Scan (Multi-Workspace)**
- From project root, recursively searches for `workspace/` subdirectories
- Maximum scan depth: 5 levels
- Skip directories: `node_modules`, `.git`, `dist`, `build`, `.next`, `__pycache__`, `venv`, `coverage`, `.cache`

Key functions in `src/utils/workspace-discovery.ts`:
- `isValidPlxWorkspace(dir)` - Check if directory contains valid PLX workspace
- `findProjectRoot(startDir)` - Scan upward to find project root
- `discoverWorkspaces(root)` - Scan downward for multi-workspace support

### Data Structures

```typescript
interface DiscoveredWorkspace {
  path: string;           // Absolute path to workspace/ directory
  relativePath: string;   // Relative path from scan root ('.' for root)
  projectName: string;    // Parent directory name (empty for root workspace)
  isRoot: boolean;        // True if workspace is at scan root
}
```

### Workspace Filter Flag

The global `--workspace <name>` flag filters operations to a specific workspace:

```bash
plx get changes --workspace project-a         # List only project-a changes
plx validate --all --workspace project-a      # Validate only project-a
plx get task --workspace project-a            # Get task from project-a only
```

### Item Prefixing

In multi-workspace mode, item IDs are prefixed with the project name:
- Single workspace: `add-feature`
- Multi-workspace: `project-a/add-feature`

Commands accept both prefixed and unprefixed IDs. When unprefixed and multiple matches exist, an error is returned with suggestions.

### Workspace Discovery Flow

```
User runs: plx get changes (from any subdirectory)
    ↓
findProjectRoot(cwd) → scan upward for workspace/AGENTS.md
    ↓
If found: projectRoot = matched directory
If not found (hit .git or root): throw "No PLX workspace found"
    ↓
discoverWorkspaces(projectRoot) → scan downward
    ↓
Apply --workspace filter (if set)
    ↓
Aggregate items from all filtered workspaces
    ↓
Display with prefixes (if multi-workspace)
```

### Backward Compatibility

Single-workspace projects work identically to before:
- No prefix shown in output
- Same directory structure
- Existing commands unchanged

### Review System

Pew Pew Plx provides a structured review workflow for validating implementations against specifications, changes, and tasks.

#### Review Command

The `plx review` command generates review context for changes, specs, or tasks:

```bash
plx review create --parent-id <id> --parent-type <type>   # Create review entity
plx review get --id <id>                                   # Get review by ID
plx review complete --id <id>                              # Complete review tasks
plx review archive --id <id>                               # Archive completed review
```

**Review Creation Flow:**
```
User runs: plx review create --parent-id <id> --parent-type change
    ↓
ReviewCommand.execute()
    ↓
Load REVIEW.md template (if exists)
    ↓
Load parent documents (proposal.md, design.md, spec.md)
    ↓
Create review entity in workspace/reviews/<review-name>/
    ↓
Display review context with next steps
```

**Output includes:**
- `REVIEW.md` template (if exists at project root)
- Parent documents (proposal, design, or spec)
- Next steps for adding feedback markers

#### Parse Feedback Command

The `plx parse feedback` command scans the codebase for feedback markers and generates review tasks:

```bash
plx parse feedback <review-name> --parent-id <id> --parent-type <type>
```

**Parse Feedback Flow:**
```
User runs: plx parse feedback <name> --parent-id <id> --parent-type change
    ↓
ParseFeedbackCommand.execute()
    ↓
FeedbackScannerService.scanDirectory() → find all feedback markers
    ↓
For each marker:
    Extract feedback text and spec impact (if any)
    ↓
FeedbackScannerService.generateReview() → create review entity
    ↓
Create tasks in workspace/tasks/ with parent linking
    ↓
Output summary (markers found, tasks created, files scanned)
```

**Feedback Marker Format:**

Feedback markers use inline comments with the pattern `#FEEDBACK #TODO | {feedback text}`:

- **C-style** (`.ts`, `.js`, `.go`, `.rs`, etc.): `// #FEEDBACK #TODO | feedback text`
- **Python/Shell** (`.py`, `.sh`, `.yaml`, etc.): `# #FEEDBACK #TODO | feedback text`
- **HTML/Markdown**: `<!-- #FEEDBACK #TODO | feedback text -->`

**Spec Impact Annotations:**

For feedback that impacts specifications, add a suffix: `(spec:<spec-id>)`

Example:
```typescript
// #FEEDBACK #TODO | Update validation logic to match new requirements (spec:user-auth)
```

**Review Entity Structure:**

Reviews are stored in `workspace/reviews/<review-name>/`:
```
reviews/
└── <review-name>/
    └── review.md          # Review summary and metadata
```

Linked tasks are stored in `workspace/tasks/`:
```
workspace/tasks/
├── 005-<review-name>-fix-validation.md
└── 006-<review-name>-update-tests.md
```

**Review Metadata:**

Each review includes frontmatter:
```yaml
---
parent-type: change|spec|task
parent-id: <id>
reviewed-at: <ISO timestamp>
---
```

**Task Linking to Reviews:**

Tasks generated from feedback markers include:
```yaml
---
parent-type: review
parent-id: <review-name>
status: to-do
---
```

**Integration with Change/Spec/Task System:**

- Reviews are linked to their parent (change, spec, or task) via metadata
- Generated tasks are stored centrally with parent linking
- Tasks can be retrieved via `plx get task` and managed with complete/undo commands
- Reviews can be archived: `plx archive review --id <review-name>`

## Fork-Specific Features (Pew Pew Plx)

Pew Pew Plx provides:

1. **PLX Command**: The CLI uses `plx` as the command name
2. **Dynamic Command Name**: CLI detects invocation name and uses it in output messages, help text, and shell completions via `src/utils/command-name.ts`
3. **Centralized Task Storage**: Tasks stored in `workspace/tasks/` with parent linking via frontmatter and filenames
4. **Parent Linking System**: Tasks link to parent entities (changes, specs, reviews) via `parent-type` and `parent-id` fields
5. **Task Migration**: `plx migrate tasks` migrates legacy `tasks/` directories to centralized storage
6. **Entity-Based Commands**: Unified command structure (`plx <entity> <action>`) for changes, specs, tasks, reviews, requests
7. **Slash Commands**: Commands in `.claude/commands/plx/`
   - `/plx/plan-request` - Clarify intent via iterative yes/no questions before proposal
   - `/plx/plan-proposal` - Scaffold change proposal (auto-consumes request.md)
   - `/plx/get-task` - Get next prioritized task and execute workflow
   - `/plx/complete-task` - Mark task as done
   - `/plx/undo-task` - Revert task to to-do
   - `/plx/implement` - Implement tasks with guided workflow (processes entire change)
   - `/plx/orchestrate` - Coordinate sub-agents for multi-task work
   - `/plx/refine-architecture` - Create or update ARCHITECTURE.md
   - `/plx/review` - Review implementations against specs/changes/tasks
   - `/plx/parse-feedback` - Parse feedback markers and generate review tasks
   - `/plx/refine-review` - Create or update REVIEW.md template
   - `/plx/prepare-release` - Guided release preparation workflow
   - `/plx/refine-release` - Create or update RELEASE.md template
   - `/plx/refine-testing` - Create or update TESTING.md template
   - `/plx/test` - Run tests based on scope (change, task, or spec)
   - `/plx/prepare-compact` - Preserve session progress in PROGRESS.md
8. **Extended Templates**: Architecture template generation
9. **Get Command**: Extended with subcommands for all entities (`get task`, `get change`, `get spec`, `get review`, `get tasks`, `get changes`, `get specs`, `get reviews`) and content filtering (`--constraints`, `--acceptance-criteria`)
10. **Automatic Task Completion**: Detects when in-progress task has all Implementation Checklist items checked and auto-advances to next task
11. **Auto-Transition**: `get task` auto-transitions to-do tasks to in-progress when retrieved
12. **Complete/Undo Commands**: Explicit commands for task/entity completion and undo with `--id`, `--parent-id`, and `--parent-type` flags
13. **Services Layer**: Domain services for item retrieval, content filtering, and feedback scanning
14. **Review System**: Structured review workflow with feedback markers and centralized task storage
15. **Paste Command**: Create entities from clipboard (`plx paste task/change/spec/request`) with cross-platform clipboard support (macOS, Windows, Linux)
16. **Create Command**: Unified entity creation (`plx create task/change/spec/request/review`) with parent linking support

## Extending the System

### Adding a New AI Tool

1. Create configurator in `src/core/configurators/<tool>.ts`
2. Register in `src/core/configurators/registry.ts`
3. Create slash command configurator in `src/core/configurators/slash/<tool>.ts`
4. Register in `src/core/configurators/slash/registry.ts`
5. Add to `AI_TOOLS` array in `src/core/config.ts`

### Adding a New Command

1. Create command file in `src/commands/<name>.ts` or `src/core/<name>.ts`
2. Register in `src/cli/index.ts` using Commander.js
3. Add tests in `test/commands/<name>.test.ts`

### Adding Multi-Workspace Support to Commands

When adding or modifying commands to support multi-workspace:

1. Import workspace utilities:
   ```typescript
   import { getFilteredWorkspaces } from '../utils/workspace-filter.js';
   import { isMultiWorkspace } from '../utils/workspace-discovery.js';
   import { getActiveChangeIdsMulti } from '../utils/item-discovery.js';
   ```

2. Discover workspaces early in command execution:
   ```typescript
   const workspaces = await getFilteredWorkspaces();
   const isMulti = isMultiWorkspace(workspaces);
   ```

3. Use multi-variants of discovery functions (`*Multi`) for aggregation

4. Include workspace context in output when `isMulti` is true

5. Accept prefixed IDs and resolve to correct workspace

### Adding New Validation Rules

1. Add constants to `src/core/validation/constants.ts`
2. Add schema rules to appropriate schema in `src/core/schemas/`
3. Add custom rules in `Validator.applySpecRules()` or `applyChangeRules()`
