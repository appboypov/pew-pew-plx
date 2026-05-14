# OpenSplx Changelog

## 0.20.0 - 2026-01-20

### Changed

- **Template system refactored**: Templates now load from `assets/templates/` at runtime instead of embedded TypeScript strings
  - Reduces source code size by ~2300 lines
  - Templates are now editable without recompilation
  - Organized by category: workspace, task-types, entities, slash-commands
  - Template caching improves performance on repeated access
  - `template-discovery.ts` now loads built-in templates from `assets/templates/task-types/` instead of hardcoding ~1275 lines
- **AGENTS.md references templates**: Task types documentation now references `workspace/templates/` instead of embedding a static table
  - Ensures documentation stays in sync with actual templates
  - Single source of truth for task type information
- **Slash command context optimization**: Removed automatic file linking to reduce context waste
  - Removed `@workspace/ARCHITECTURE.md` auto-linking from slash commands
  - Converted `@workspace/AGENTS.md` to plain text reference `workspace/AGENTS.md`
  - Reduces unnecessary context consumption in AI tool conversations
- **Task utilities extracted**: Shared task utilities moved to dedicated modules with comprehensive unit tests
  - Improves code organization and maintainability
  - Better test coverage for task-related functionality

### Fixed

- **Paste command**: Fixed clipboard content replacement to use function form for proper handling
- **Template synchronization**: Fixed task type system to sync with CLI source templates
- **Template feedback**: Addressed PR review feedback for task templates

### Removed

- **PROGRESS.md concept**: Removed PROGRESS.md concept entirely from the codebase
- **Agent-related files**: Cleaned up obsolete agent-related files

---

## 0.19.0 - 2026-01-17

### Added

- **Task type system with template discovery**: Tasks now support typed templates for different kinds of work
  - `type:` field in task frontmatter specifies the task category
  - 12 built-in types: story, bug, business-logic, components, research, discovery, chore, refactor, infrastructure, documentation, release, implementation
  - Template discovery scans `workspace/templates/` for custom templates with `type:` in frontmatter
  - User templates automatically override built-in templates with the same type
  - CLI support: `splx create task --type <type>` creates tasks from templates
- **Task dependency tracking**: Tasks can declare dependencies on other tasks
  - `blocked-by:` field in task frontmatter lists blocking task IDs
  - Same-change syntax: `blocked-by: [001-component-name, 002-logic-name]`
  - Cross-change syntax: `blocked-by: [other-change/001-task-name]`
  - CLI support: `splx create task --blocked-by <task-ids>` sets dependencies
  - Dependencies are advisory (warnings, not hard blocks) to help AI agents with task ordering
- **Copy-review-request and copy-test-request slash commands**: New commands for external agent handoff
  - `/splx:copy-review-request` copies review request with workspace/REVIEW.md guidelines to clipboard
  - `/splx:copy-test-request` copies test request with workspace/TESTING.md configuration to clipboard
  - Enables seamless handoff to external agents with proper context and guidelines

### Changed

- **PLX-managed template files moved to workspace directory**: Template files (ARCHITECTURE.md, REVIEW.md, RELEASE.md, TESTING.md) are now managed in workspace/ directory
  - Improves organization and keeps all PLX artifacts in one location
  - Maintains backward compatibility with root-level files during migration
- **PROGRESS.md concept removed**: Simplified workflow by removing PROGRESS.md tracking
  - Task management now handled entirely through task files and `splx get task` command
  - Reduces complexity in multi-agent handoff workflows

### Fixed

- **Package name restored to open-splx**: Fixed package name consistency across the codebase
- **Task type validation**: Strict mode now warns when task type is missing or unrecognized

---

## 0.18.0 - 2026-01-10

### Added

- **Plan-implementation workflow for multi-agent handoff**: New commands for orchestrating work across sub-agents
  - `/splx:plan-implementation` slash command orchestrates the workflow with verification loops
  - Task blocks are self-contained for copy-paste to external agents without context dependencies
  - Feedback blocks allow iterative refinement until tasks pass review
- **Copy-next-task slash command**: `/splx:copy-next-task` copies the next task or feedback block to clipboard
  - Context-aware: detects plan-implementation workflow, new conversation, or existing conversation
  - Generates task blocks with proposal context for fresh sub-agents
  - Generates feedback blocks when issues are found during review
  - Cross-platform clipboard support (pbcopy, xclip, clip)

---

## 0.17.0 - 2026-01-10

### Added

- **Transfer command for multi-workspace workflows**: New `splx transfer` command moves PLX entities between workspaces in monorepo setups
  - Subcommands: `change`, `spec`, `task`, `review`, `request`
  - Cascade logic: change→tasks, spec→changes→tasks, review→tasks
  - Task renumbering continues from target's highest sequence number
  - Workspace auto-initialization using source tool configuration
  - Conflict detection with `--target-name` resolution
  - `--dry-run` for transfer preview without changes
  - Interactive workspace selection when `--target` omitted
  - JSON output for machine-readable results

---

## 0.16.1 - 2026-01-09

### Fixed

- **`splx update` now updates frontmatter in slash command files**: Previously only body content between PLX markers was updated, leaving frontmatter (descriptions, names, hints) unchanged
  - Frontmatter is now regenerated from source definitions during update
  - User customizations outside PLX markers (before start marker or after end marker) are preserved
  - TOML-based configurators (Qwen, Gemini) also regenerate full content including description field

---

## 0.16.0 - 2026-01-09

### Changed

- **Simplified slash command names**: Removed "OpenSplx: " prefix from all 18 command names for cleaner display (e.g., "OpenSplx: Refine Architecture" → "Refine Architecture")
- **Enhanced `/splx:refine-architecture` command**: Produces spec-ready documentation with complete component inventories
  - Guardrails require spec-ready reference enabling architects to create specs without opening the codebase
  - New Context Retrieval section instructs use of Auggie MCP, Codebase Retrieval, or similar semantic search tools
  - Expanded from 3 to 7 detailed steps: Discover, Check, Create/Load, Populate Inventories, Map Dependencies, Validate Completeness, Write
  - New Template Structure section defines required sections and 10 component inventory categories with universal terms
  - Component categories use framework-agnostic terms (DTOs/Models/Records/Entities, Services/Providers/Managers, APIs/Repositories/Controllers/Data Sources, etc.)

---

## 0.15.0 - 2026-01-07

### Added

- **CLI self-upgrade command**: New `splx upgrade` command to update the CLI binary
  - Checks npm registry for latest version
  - Detects and uses appropriate package manager (pnpm or npm)
  - `--check` flag shows version comparison without installing
  - Cross-platform support (macOS, Linux, Windows)

---

## 0.14.0 - 2026-01-07

### Added

- **Monorepo awareness in slash commands**: Artifact-creating commands now detect monorepo context
  - Derives target package from user request context (mentioned package name, file paths, or current focus)
  - Creates artifacts in the relevant package's workspace folder
  - Follows each package's AGENTS.md instructions if present
  - Affected commands: `/splx:plan-proposal`, `/splx:plan-request`, `/splx:prepare-release`, `/splx:review`, `/splx:parse-feedback`, `/splx:refine-architecture`, `/splx:refine-release`, `/splx:refine-review`, `/splx:refine-testing`
- **Improved prepare-release workflow**: Added version determination and date handling
  - Enforces concrete version numbers (no "Unreleased" in changelog entries)
  - Uses `date` command for accurate release dates
  - Analyzes commits for version bump type (major/minor/patch)

---

## 0.13.1 - 2026-01-06

### Fixed

- `splx get task` now uses centralized task storage for prioritization
  - Previously looked in deprecated `workspace/changes/{id}/tasks/` location
  - Now correctly discovers tasks from `workspace/tasks/` with parent linking
  - Aligns with `splx get changes` behavior introduced in 0.13.0

---

## 0.13.0 - 2026-01-06

### Added

- **Feedback scanner excludes**: Default exclude patterns filter false positives from test files and AI tool directories
  - Excludes `test/`, `__tests__/`, `.claude/`, `.cursor/`, `node_modules/`, and 30+ other patterns
  - `--exclude <pattern>` flag adds custom exclude patterns
  - `--no-default-excludes` flag disables default exclusions for full scans
- **Lazy implementation checklist sync**: Tasks with `status: done` auto-mark Implementation Checklist items as `[x]`
  - Persists changes to disk on first retrieval via any command
  - Centralizes logic in `discoverTasks()` for consistent behavior
  - Idempotent: only writes if content changed

### Changed

- **View command**: Now uses centralized task discovery for progress tracking
  - Filters tasks by parent entity (`change` type)
  - Aggregates progress across all linked tasks

### Fixed

- Task progress calculation now reflects actual status for migrated tasks
  - Previously showed 0/N for `status: done` tasks with unchecked checkboxes
  - Now auto-syncs Implementation Checklist on retrieval

---

## 0.12.1 - 2026-01-06

### Changed

- **CLI error messages updated**: All command usage hints now show correct verb-first syntax
  - `splx review` hints: `splx review change --id <id>` instead of `--change-id`
  - `splx parse feedback` hints: `--parent-id <id> --parent-type change|spec|task`
  - `splx validate` hints: `splx validate all/changes/specs` instead of `--all/--changes/--specs`
  - `splx archive` errors: reference `splx get changes` instead of `splx list`
- **Deprecation warnings updated**: `splx change` and `splx spec` commands show correct replacement syntax
- **AGENTS.md template updated**: CLI reference reflects centralized task storage and parent linking
- **RELEASE.md template restructured**: Config-style format with Consistency Checklist sections
- **REVIEW.md template restructured**: Config-style format with Review Scope sections
- **Slash command templates updated**: Three-phase workflow structure for refine commands

### Fixed

- CLI help text in `show.ts` removed references to deprecated `splx show <item>` syntax
- Workspace prefix error messages in `validate.ts` use correct `--id` flag syntax

---

## 0.12.0 - 2026-01-05

### Added

- **Task skill-level field**: Optional `skill-level` in task YAML frontmatter for AI model selection
  - Values: `junior` (lightweight/haiku), `medior` (balanced/sonnet), `senior` (advanced/opus)
  - Displayed as color-coded badge in task headers and table columns
  - Included in `--json` output as `skillLevel` field
  - Strict mode validation warns when skill-level is missing or invalid
- **AGENTS.md template updated**: Task template now documents skill-level field and model mapping
- **Slash command guidance**: `/splx:orchestrate` and `/splx:plan-proposal` include model selection hints

### Fixed

- Skill-level validation now checks frontmatter only, not file body content
- Task skill levels cached during discovery to eliminate duplicate file I/O

---

## 0.11.0 - 2026-01-04

### Added

- **Upward workspace discovery** for subdirectory support
  - PLX commands now work from any subdirectory within a project
  - Automatically scans upward to find project root containing `workspace/AGENTS.md`
  - `.git` boundary stops upward scan if no workspace found
  - After finding project root, runs existing downward scan for multi-workspace support
- `isValidSplxWorkspace()` function to validate PLX workspace directories
- `findProjectRoot()` function to locate project root from any subdirectory
- Test utility `createValidSplxWorkspace()` for consistent test fixture creation
- **TESTING.md template**: New config-style testing configuration file (~21 lines)
  - Created during `splx init` and `splx update` (same pattern as REVIEW.md)
  - Configures test types, coverage thresholds, test runner, and file patterns
- **`/splx:refine-testing` slash command**: Guide users through testing configuration
  - Test types: unit, integration, e2e, snapshot, performance
  - Coverage thresholds: 70%, 80%, 90%
  - Test runners: vitest, jest, mocha, pytest, flutter_test
- **`/splx:test` slash command**: Run tests based on scope using TESTING.md configuration
  - Accepts `--change-id`, `--task-id`, `--spec-id` arguments (same pattern as review)
  - Reads TESTING.md for runner, coverage threshold, and patterns

### Changed

- **RELEASE.md slimmed**: Reduced from 481 to 33 lines
  - Now a config-style file with defaults only
  - Verbose documentation moved to `/splx:refine-release` command
- **`/splx:refine-release` enhanced**: Now contains comprehensive option documentation
  - Format options: keep-a-changelog, simple-list, github-release
  - Style options: minimal, standard, comprehensive, cli-tool, library
  - Audience, emoji, and badge configuration guidance
- **`/splx:refine-review` enhanced**: Expanded from 16 to 68 lines
  - Review type options: implementation, architecture, security, performance, accessibility
  - Feedback format and checklist customization documentation

### Fixed

- `splx update` now only generates slash commands for configured tools
  - Previously generated commands for all 20+ registered tools regardless of configuration
  - Now checks if tool has at least one existing slash command file before generating

---

## 0.10.1 - 2025-12-31

### Added

- Context file references added to `/splx:orchestrate` command
  - `@ARCHITECTURE.md` and `@workspace/AGENTS.md` automatically included (matching plan-proposal and plan-request)

### Fixed

- Plan-proposal descriptions updated to include "Consumes request.md when present." across all configurators
- Changed "sceptical" to "skeptical" (American English)

---

## 0.10.0 - 2025-12-31

### Added

- `/splx:plan-request` slash command for intent clarification
  - Iterative yes/no questions to capture user intent before proposal scaffolding
  - Creates `workspace/changes/{change-id}/request.md` with structured sections
  - Activity XML template with Intent Analyst role and AskActUpdateRepeat loop
- `/splx:plan-proposal` auto-detects and consumes `request.md` when present
  - Step 0 checks for existing request context from `plan-request` workflow
  - Uses Final Intent section as primary input for proposal generation
- Context file references added to planning commands
  - `@ARCHITECTURE.md` and `@workspace/AGENTS.md` automatically included in plan-proposal and plan-request

### Changed

- **BREAKING**: Renamed `/splx:proposal` slash command to `/splx:plan-proposal`
  - All 21 tool configurators updated with new file paths and frontmatter
  - `SlashCommandId` type updated from `'proposal'` to `'plan-proposal'`
- **BREAKING**: Unified dual slash command systems into single registry
  - `SlashCommandRegistry` now generates all commands via `generateAll()`
  - Removed redundant `SplxSlashCommandConfigurator` classes
  - Configurators now use shared templates from `slash-command-templates.ts`
- `/splx:implement` command now processes entire change by default
  - Iterates through all remaining tasks instead of single task
  - Maintains per-task review and confirmation workflow

### Fixed

- Windows compatibility: Use Node.js fs instead of shell commands in tests

---

## 0.8.0 - 2025-12-30

### Added

- Multi-workspace discovery for monorepo support
  - Commands scan recursively for `workspace/` directories from the current directory
  - Item IDs display with project prefixes in multi-workspace mode (e.g., `project-a/add-feature`)
  - Global `--workspace <name>` flag filters operations to a specific project
  - Single-workspace projects work unchanged (no prefixes shown)
  - Ambiguity detection when unprefixed IDs match multiple workspaces
  - Case-insensitive workspace prefix matching
- `/splx:orchestrate` slash command for sub-agent coordination
  - Structured workflow for delegating work to sub-agents
  - Enforces quality gates, scope adherence, and TracelessChanges principles
  - Sequential execution with one sub-agent per task
  - Requires review before accepting sub-agent work

### Changed

- Change prioritization now uses task file status instead of checkbox completion percentage
  - Changes with no remaining tasks (all `status: done`) are filtered out
  - Aligns with task-file-based workflow

---

## 0.7.0 - 2025-12-30

### Added

- `splx paste request` command: Capture clipboard content as a new change proposal draft
  - Supports pasting markdown, text, and structured content directly into a change request
  - Creates proposal.md with clipboard content wrapped in appropriate sections

### Changed

- Renamed "apply stage" to "implement stage" in proposal guardrails for clarity

### Fixed

- Skip paste integration tests on non-macOS platforms for CI compatibility

---

## 0.6.2 - 2025-12-30

### Added

- Review task retrieval: `splx get tasks --id <review-id>` and `splx get task --id <review-id>/<task-id>` now work with reviews
- Parent linkage for feedback markers: markers can specify parent type and ID inline

### Changed

- Renamed `/splx:apply` slash command to `/splx:implement` with enhanced task workflow integration

### Fixed

- `ItemRetrievalService` now searches `workspace/reviews` for task retrieval (previously only searched `workspace/changes`)
- `ListCommand` path resolution: `splx list` now works correctly when invoked with relative paths

---

## 0.6.1 - 2025-12-29

### Added

- `/splx:prepare-release` slash command for guided release preparation workflow
- `/splx:refine-release` slash command for updating RELEASE.md template

### Changed

- Slash commands now use `@` file references for better context loading
- Removed deprecated `/splx:init-architecture` and `/splx:update-architecture` commands (use `/splx:refine-architecture` instead)

### Fixed

- Windows path separators now normalized correctly in slash command file paths

---

## 0.6.0 - 2025-12-29

### Changed

- **BREAKING**: Rebrand from OpenSpec to PLX across entire codebase
  - CLI command changed from `openspec` to `splx`
  - Project directory renamed from `openspec/` to `workspace/`
  - Markers changed from `<!-- OPENSPEC:START/END -->` to `<!-- PLX:START/END -->`
  - Global config moved from `~/.openspec/` to `~/.splx/`
  - Environment variables renamed: `OPENSPEC_CONCURRENCY` → `PLX_CONCURRENCY`, `OPEN_SPEC_INTERACTIVE` → `PLX_INTERACTIVE`
- **BREAKING**: Rebrand display name from "PLX" to "OpenSplx"
  - User-facing display names updated in CLI help, dashboard, slash commands
  - CLI command stays as `splx`, constants like `PLX_DIR_NAME` unchanged
- **BREAKING**: Rename package from `@appboypov/OpenSplx` to `@appboypov/OpenSplx`
  - GitHub repository URLs updated to `appboypov/OpenSplx`
  - Asset files renamed from `OpenSplx_pixel_*.svg` to `pew_pew_splx_pixel_*.svg`
- ASCII banner updated to display "PEW PEW PLX"
- README rewritten for OpenSplx as standalone project
- Clarify backward compatibility test descriptions

### Added

- Automatic OpenSpec to PLX migration on `splx update` or `splx init`
  - Renames `openspec/` directory to `workspace/`
  - Converts `<!-- OPENSPEC:START/END -->` markers to `<!-- PLX:START/END -->`
  - Migrates `~/.openspec/` config to `~/.splx/`
  - Merges `openspec/` contents into `workspace/` when both directories exist
- Architecture documentation commands: `splx/refine-architecture`, `splx/refine-review`, `splx/parse-feedback`

### Fixed

- Migration now merges `openspec/` contents into `workspace/` instead of skipping when both exist

---

## 0.5.0 - 2025-12-26

### Added

- **Review system**: Complete review workflow for validating implementations against specs/changes/tasks
  - `splx review --change-id|--spec-id|--task-id <id>` - Output review context for a parent entity
  - `splx parse feedback [review-name] --change-id|--spec-id|--task-id <id>` - Scan codebase for feedback markers and generate review tasks
  - `splx list --reviews` - List active reviews
  - `splx archive <review-id> --type review` - Archive completed reviews with optional spec updates
- **Feedback marker system**: Language-aware inline markers for 40+ file extensions
  - C-style: `// #FEEDBACK #TODO | feedback`
  - Python/Shell: `# #FEEDBACK #TODO | feedback`
  - SQL/Lua: `-- #FEEDBACK #TODO | feedback`
  - HTML/XML/Markdown: `<!-- #FEEDBACK #TODO | feedback -->`
  - Spec-impacting: `(spec:<spec-id>)` suffix for spec updates on archive
- **Review entity type**: New entity in `workspace/reviews/` with parent linkage, task generation, and archiving with spec updates
- **PLX slash commands**: `splx/review`, `splx/refine-architecture`, `splx/refine-review`, `splx/parse-feedback`
- **Complete and undo commands**: New CLI commands for explicit task/change management
  - `complete task --id <task-id>` - Mark task as done, check all Implementation Checklist items
  - `complete change --id <change-id>` - Complete all tasks in a change
  - `undo task --id <task-id>` - Revert task to to-do, uncheck Implementation Checklist items
  - `undo change --id <change-id>` - Revert all tasks in a change to to-do
- **Auto-transition on retrieval**: `get task` and `get task --id` now auto-transition to-do tasks to in-progress when retrieved
  - Includes `transitionedToInProgress` field in JSON output
- **Automatic task completion detection**: `splx get task` now auto-detects when the current in-progress task has all Implementation Checklist items checked
  - Automatically marks task as `done` and advances to next `to-do` task
  - Skips change documents on auto-completion (same behavior as `--did-complete-previous`)
  - Includes `autoCompletedTask` field in JSON output

### Fixed

- Change prioritization filter now keeps changes with in-progress tasks, allowing auto-completion to run even at 100% checkbox completion

---

## 0.4.0 - 2025-12-26

### Added

- **Get subcommands**: New subcommands for retrieving items by ID
  - `get change --id <change-id>` - Retrieve change proposal by ID
  - `get spec --id <spec-id>` - Retrieve spec by ID
  - `get tasks` - List all open tasks or tasks for specific change
  - `get task --id <task-id>` - Retrieve specific task by filename
- **Content filtering**: Filter `get task` output to specific sections
  - `--constraints` - Show only Constraints section
  - `--acceptance-criteria` - Show only Acceptance Criteria section
- **Dynamic shell completion**: `--id` flags provide autocomplete suggestions for change and spec IDs
- **Services layer**: New `ItemRetrievalService` and `ContentFilterService` for domain logic

### Changed

- **BREAKING**: Renamed `splx act next` command to `splx get task`
- **BREAKING**: Renamed `SplxSlashCommandId` value `'act-next'` to `'get-task'`
- `--did-complete-previous` now automatically marks all `## Implementation Checklist` checkboxes as complete
- Completed task info (name + completed checkbox items) is output when using `--did-complete-previous`

---

## 0.3.0 - 2025-12-25

### Added

- **Act next command**: New `splx act next` CLI command for prioritized task selection across active changes
  - Prioritizes changes by completion percentage (highest first)
  - Uses proposal.md birthtime as tiebreaker when percentages equal
  - Task status tracking via YAML frontmatter (`to-do`, `in-progress`, `done`)
  - `--did-complete-previous` flag for automatic status transitions
  - `--json` flag for machine-readable output
- **PLX act-next slash command**: Add `splx/act-next` slash command to all 20 supported tool configurators

### Changed

- **Architecture documentation**: Replace `project.md` with `ARCHITECTURE.md` for project structure documentation

### Fixed

- CRLF line ending normalization in task status parser
- Unused imports in change-prioritization and task-status modules
- Design.md documentation now accurately describes checkbox-based completion calculation

---

## 0.2.0 - 2025-12-25

### Added

- **Task directory structure**: Replace single `tasks.md` with `tasks/` directory containing numbered task files (`NNN-<name>.md`)
- **Auto-migration**: Automatically migrate legacy `tasks.md` to `tasks/001-tasks.md` on CLI access
- **Task file utilities**: New `task-file-parser.ts` for parsing/sorting task files and `task-migration.ts` for migration logic
- **Task file template**: Structured template with End Goal, Currently, Should, Constraints, Acceptance Criteria, Implementation Checklist, and Notes sections

### Changed

- **Single-task workflow**: Apply command now processes one task per conversation instead of all tasks at once
- **Task auto-detection**: Automatically find next incomplete task, read completed tasks for context, skip tasks beyond next incomplete
- **Progress calculation**: Exclude checkboxes under `## Constraints` and `## Acceptance Criteria` from task progress counting

---

## 0.1.0 - 2024-12-24

Initial release of OpenSplx fork.

### Added

- **PLX command alias**: `splx` as an alias for `openspec` command
- **PLX architecture commands**: `splx/init-architecture` and `splx/update-architecture` slash commands for all 20 supported tools
- **PLX commands on update**: Running `splx update` generates PLX commands for tools with existing OpenSpec slash commands
- **External issue tracking**: Support `tracker` and `id` fields in proposal frontmatter for Linear, GitHub, etc.

### Changed

- Rebrand fork as OpenSplx while maintaining upstream compatibility
- Archive workflow suggests refreshing architecture documentation after spec updates

---

## Upstream History (OpenSpec)

## 0.17.2

### Patch Changes

- 455c65f: Fix `--no-interactive` flag in validate command to properly disable spinner, preventing hangs in pre-commit hooks and CI environments

## 0.17.1

### Patch Changes

- a2757e7: Fix pre-commit hook hang issue in config command by using dynamic import for @inquirer/prompts

  The config command was causing pre-commit hooks to hang indefinitely due to stdin event listeners being registered at module load time. This fix converts the static import to a dynamic import that only loads inquirer when the `config reset` command is actually used interactively.

  Also adds ESLint with a rule to prevent static @inquirer imports, avoiding future regressions.

## 0.17.0

### Minor Changes

- 2e71835: ### New Features

  - Add `openspec config` command for managing global configuration settings
  - Implement global config directory with XDG Base Directory specification support
  - Add Oh-my-zsh shell completions support for enhanced CLI experience

  ### Bug Fixes

  - Fix hang in pre-commit hooks by using dynamic imports
  - Respect XDG_CONFIG_HOME environment variable on all platforms
  - Resolve Windows compatibility issues in zsh-installer tests
  - Align cli-completion spec with implementation
  - Remove hardcoded agent field from slash commands

  ### Documentation

  - Alphabetize AI tools list in README and make it collapsible

## 0.16.0

### Minor Changes

- c08fbc1: Add new AI tool integrations and enhancements:

  - **feat(iflow-cli)**: Add iFlow-cli integration with slash command support and documentation
  - **feat(init)**: Add IDE restart instruction after init to inform users about slash command availability
  - **feat(antigravity)**: Add Antigravity slash command support
  - **fix**: Generate TOML commands for Qwen Code (fixes #293)
  - Clarify scaffold proposal documentation and enhance proposal guidelines
  - Update proposal guidelines to emphasize design-first approach before implementation

## 0.15.0

### Minor Changes

- 4758c5c: Add support for new AI tools with native slash command integration

  - **Gemini CLI**: Add native TOML-based slash command support for Gemini CLI with `.gemini/commands/openspec/` integration
  - **RooCode**: Add RooCode integration with configurator, slash commands, and templates
  - **Cline**: Fix Cline to use workflows instead of rules for slash commands (`.clinerules/workflows/` paths)
  - **Documentation**: Update documentation to reflect new integrations and workflow changes

## 0.14.0

### Minor Changes

- 8386b91: Add support for new AI assistants and configuration improvements

  - feat: add Qwen Code support with slash command integration
  - feat: add $ARGUMENTS support to apply slash command for dynamic variable passing
  - feat: add Qoder CLI support to configuration and documentation
  - feat: add CoStrict AI assistant support
  - fix: recreate missing openspec template files in extend mode
  - fix: prevent false 'already configured' detection for tools
  - fix: use change-id as fallback title instead of "Untitled Change"
  - docs: add guidance for populating project-level context
  - docs: add Crush to supported AI tools in README

## 0.13.0

### Minor Changes

- 668a125: Add support for multiple AI assistants and improve validation

  This release adds support for several new AI coding assistants:

  - CodeBuddy Code - AI-powered coding assistant
  - CodeRabbit - AI code review assistant
  - Cline - Claude-powered CLI assistant
  - Crush AI - AI assistant platform
  - Auggie (Augment CLI) - Code augmentation tool

  New features:

  - Archive slash command now supports arguments for more flexible workflows

  Bug fixes:

  - Delta spec validation now handles case-insensitive headers and properly detects empty sections
  - Archive validation now correctly honors --no-validate flag and ignores metadata

  Documentation improvements:

  - Added VS Code dev container configuration for easier development setup
  - Updated AGENTS.md with explicit change-id notation
  - Enhanced slash commands documentation with restart notes

## 0.12.0

### Minor Changes

- 082abb4: Add factory function support for slash commands and non-interactive init options

  This release includes two new features:

  - **Factory function support for slash commands**: Slash commands can now be defined as functions that return command objects, enabling dynamic command configuration
  - **Non-interactive init options**: Added `--tools`, `--all-tools`, and `--skip-tools` CLI flags to `openspec init` for automated initialization in CI/CD pipelines while maintaining backward compatibility with interactive mode

## 0.11.0

### Minor Changes

- 312e1d6: Add Amazon Q Developer CLI integration. OpenSpec now supports Amazon Q Developer with automatic prompt generation in `.amazonq/prompts/` directory, allowing you to use OpenSpec slash commands with Amazon Q's @-syntax.

## 0.10.0

### Minor Changes

- d7e0ce8: Improve init wizard Enter key behavior to allow proceeding through prompts more naturally

## 0.9.2

### Patch Changes

- 2ae0484: Fix cross-platform path handling issues. This release includes fixes for joinPath behavior and slash command path resolution to ensure OpenSpec works correctly across all platforms.

## 0.9.1

### Patch Changes

- 8210970: Fix OpenSpec not working on Windows when Codex integration is selected. This release includes fixes for cross-platform path handling and normalization to ensure OpenSpec works correctly on Windows systems.

## 0.9.0

### Minor Changes

- efbbf3b: Add support for Codex and GitHub Copilot slash commands with YAML frontmatter and $ARGUMENTS

## 0.8.1

### Patch Changes

- d070d08: Fix CLI version mismatch and add a release guard that validates the packed tarball prints the same version as package.json via `openspec --version`.

## 0.8.0

### Minor Changes

- c29b06d: Add Windsurf support.
- Add Codex slash command support. OpenSpec now writes prompts directly to Codex's global directory (`~/.codex/prompts` or `$CODEX_HOME/prompts`) and refreshes them on `openspec update`.

## 0.7.0

### Minor Changes

- Add native Kilo Code workflow integration so `openspec init` and `openspec update` manage `.kilocode/workflows/openspec-*.md` files.
- Always scaffold the managed root `AGENTS.md` hand-off stub and regroup the AI tool prompts during init/update to keep instructions consistent.

## 0.6.0

### Minor Changes

- Slim the generated root agent instructions down to a managed hand-off stub and update the init/update flows to refresh it safely.

## 0.5.0

### Minor Changes

- feat: implement Phase 1 E2E testing with cross-platform CI matrix

  - Add shared runCLI helper in test/helpers/run-cli.ts for spawn testing
  - Create test/cli-e2e/basic.test.ts covering help, version, validate flows
  - Migrate existing CLI exec tests to use runCLI helper
  - Extend CI matrix to bash (Linux/macOS) and pwsh (Windows)
  - Split PR and main workflows for optimized feedback

### Patch Changes

- Make apply instructions more specific

  Improve agent templates and slash command templates with more specific and actionable apply instructions.

- docs: improve documentation and cleanup

  - Document non-interactive flag for archive command
  - Replace discord badge in README
  - Archive completed changes for better organization

## 0.4.0

### Minor Changes

- Add OpenSpec change proposals for CLI improvements and enhanced user experience
- Add Opencode slash commands support for AI-driven development workflows

### Patch Changes

- Add documentation improvements including --yes flag for archive command template and Discord badge
- Fix normalize line endings in markdown parser to handle CRLF files properly

## 0.3.0

### Minor Changes

- Enhance `openspec init` with extend mode, multi-tool selection, and an interactive `AGENTS.md` configurator.

## 0.2.0

### Minor Changes

- ce5cead: - Add an `openspec view` dashboard that rolls up spec counts and change progress at a glance
  - Generate and update AI slash commands alongside the renamed `openspec/AGENTS.md` instructions file
  - Remove the deprecated `openspec diff` command and direct users to `openspec show`

## 0.1.0

### Minor Changes

- 24b4866: Initial release
