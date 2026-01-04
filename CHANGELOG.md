# Pew Pew Plx Changelog

## 0.11.0 - 2026-01-04

### Added

- **TESTING.md template**: New config-style testing configuration file (~21 lines)
  - Created during `plx init` and `plx update` (same pattern as REVIEW.md)
  - Configures test types, coverage thresholds, test runner, and file patterns
- **`/plx:refine-testing` slash command**: Guide users through testing configuration
  - Test types: unit, integration, e2e, snapshot, performance
  - Coverage thresholds: 70%, 80%, 90%
  - Test runners: vitest, jest, mocha, pytest, flutter_test
- **`/plx:test` slash command**: Run tests based on scope using TESTING.md configuration
  - Accepts `--change-id`, `--task-id`, `--spec-id` arguments (same pattern as review)
  - Reads TESTING.md for runner, coverage threshold, and patterns

### Changed

- **RELEASE.md slimmed**: Reduced from 481 to 33 lines
  - Now a config-style file with defaults only
  - Verbose documentation moved to `/plx:refine-release` command
- **`/plx:refine-release` enhanced**: Now contains comprehensive option documentation
  - Format options: keep-a-changelog, simple-list, github-release
  - Style options: minimal, standard, comprehensive, cli-tool, library
  - Audience, emoji, and badge configuration guidance
- **`/plx:refine-review` enhanced**: Expanded from 16 to 68 lines
  - Review type options: implementation, architecture, security, performance, accessibility
  - Feedback format and checklist customization documentation

---

## 0.10.1 - 2025-12-31

### Added

- Context file references added to `/plx:orchestrate` command
  - `@ARCHITECTURE.md` and `@workspace/AGENTS.md` automatically included (matching plan-proposal and plan-request)

### Fixed

- Plan-proposal descriptions updated to include "Consumes request.md when present." across all configurators
- Changed "sceptical" to "skeptical" (American English)

---

## 0.10.0 - 2025-12-31

### Added

- `/plx:plan-request` slash command for intent clarification
  - Iterative yes/no questions to capture user intent before proposal scaffolding
  - Creates `workspace/changes/{change-id}/request.md` with structured sections
  - Activity XML template with Intent Analyst role and AskActUpdateRepeat loop
- `/plx:plan-proposal` auto-detects and consumes `request.md` when present
  - Step 0 checks for existing request context from `plan-request` workflow
  - Uses Final Intent section as primary input for proposal generation
- Context file references added to planning commands
  - `@ARCHITECTURE.md` and `@workspace/AGENTS.md` automatically included in plan-proposal and plan-request

### Changed

- **BREAKING**: Renamed `/plx:proposal` slash command to `/plx:plan-proposal`
  - All 21 tool configurators updated with new file paths and frontmatter
  - `SlashCommandId` type updated from `'proposal'` to `'plan-proposal'`
- **BREAKING**: Unified dual slash command systems into single registry
  - `SlashCommandRegistry` now generates all commands via `generateAll()`
  - Removed redundant `PlxSlashCommandConfigurator` classes
  - Configurators now use shared templates from `slash-command-templates.ts`
- `/plx:implement` command now processes entire change by default
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
- `/plx:orchestrate` slash command for sub-agent coordination
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

- `plx paste request` command: Capture clipboard content as a new change proposal draft
  - Supports pasting markdown, text, and structured content directly into a change request
  - Creates proposal.md with clipboard content wrapped in appropriate sections

### Changed

- Renamed "apply stage" to "implement stage" in proposal guardrails for clarity

### Fixed

- Skip paste integration tests on non-macOS platforms for CI compatibility

---

## 0.6.2 - 2025-12-30

### Added

- Review task retrieval: `plx get tasks --id <review-id>` and `plx get task --id <review-id>/<task-id>` now work with reviews
- Parent linkage for feedback markers: markers can specify parent type and ID inline

### Changed

- Renamed `/plx:apply` slash command to `/plx:implement` with enhanced task workflow integration

### Fixed

- `ItemRetrievalService` now searches `workspace/reviews` for task retrieval (previously only searched `workspace/changes`)
- `ListCommand` path resolution: `plx list` now works correctly when invoked with relative paths

---

## 0.6.1 - 2025-12-29

### Added

- `/plx:prepare-release` slash command for guided release preparation workflow
- `/plx:refine-release` slash command for updating RELEASE.md template

### Changed

- Slash commands now use `@` file references for better context loading
- Removed deprecated `/plx:init-architecture` and `/plx:update-architecture` commands (use `/plx:refine-architecture` instead)

### Fixed

- Windows path separators now normalized correctly in slash command file paths

---

## 0.6.0 - 2025-12-29

### Changed

- **BREAKING**: Rebrand from OpenSpec to PLX across entire codebase
  - CLI command changed from `openspec` to `plx`
  - Project directory renamed from `openspec/` to `workspace/`
  - Markers changed from `<!-- OPENSPEC:START/END -->` to `<!-- PLX:START/END -->`
  - Global config moved from `~/.openspec/` to `~/.plx/`
  - Environment variables renamed: `OPENSPEC_CONCURRENCY` → `PLX_CONCURRENCY`, `OPEN_SPEC_INTERACTIVE` → `PLX_INTERACTIVE`
- **BREAKING**: Rebrand display name from "PLX" to "Pew Pew Plx"
  - User-facing display names updated in CLI help, dashboard, slash commands
  - CLI command stays as `plx`, constants like `PLX_DIR_NAME` unchanged
- **BREAKING**: Rename package from `@appboypov/opensplx` to `@appboypov/pew-pew-plx`
  - GitHub repository URLs updated to `appboypov/pew-pew-plx`
  - Asset files renamed from `opensplx_pixel_*.svg` to `pew_pew_plx_pixel_*.svg`
- ASCII banner updated to display "PEW PEW PLX"
- README rewritten for Pew Pew Plx as standalone project
- Clarify backward compatibility test descriptions

### Added

- Automatic OpenSpec to PLX migration on `plx update` or `plx init`
  - Renames `openspec/` directory to `workspace/`
  - Converts `<!-- OPENSPEC:START/END -->` markers to `<!-- PLX:START/END -->`
  - Migrates `~/.openspec/` config to `~/.plx/`
  - Merges `openspec/` contents into `workspace/` when both directories exist
- Architecture documentation commands: `plx/refine-architecture`, `plx/refine-review`, `plx/parse-feedback`

### Fixed

- Migration now merges `openspec/` contents into `workspace/` instead of skipping when both exist

---

## 0.5.0 - 2025-12-26

### Added

- **Review system**: Complete review workflow for validating implementations against specs/changes/tasks
  - `plx review --change-id|--spec-id|--task-id <id>` - Output review context for a parent entity
  - `plx parse feedback [review-name] --change-id|--spec-id|--task-id <id>` - Scan codebase for feedback markers and generate review tasks
  - `plx list --reviews` - List active reviews
  - `plx archive <review-id> --type review` - Archive completed reviews with optional spec updates
- **Feedback marker system**: Language-aware inline markers for 40+ file extensions
  - C-style: `// #FEEDBACK #TODO | feedback`
  - Python/Shell: `# #FEEDBACK #TODO | feedback`
  - SQL/Lua: `-- #FEEDBACK #TODO | feedback`
  - HTML/XML/Markdown: `<!-- #FEEDBACK #TODO | feedback -->`
  - Spec-impacting: `(spec:<spec-id>)` suffix for spec updates on archive
- **Review entity type**: New entity in `workspace/reviews/` with parent linkage, task generation, and archiving with spec updates
- **PLX slash commands**: `plx/review`, `plx/refine-architecture`, `plx/refine-review`, `plx/parse-feedback`
- **Complete and undo commands**: New CLI commands for explicit task/change management
  - `complete task --id <task-id>` - Mark task as done, check all Implementation Checklist items
  - `complete change --id <change-id>` - Complete all tasks in a change
  - `undo task --id <task-id>` - Revert task to to-do, uncheck Implementation Checklist items
  - `undo change --id <change-id>` - Revert all tasks in a change to to-do
- **Auto-transition on retrieval**: `get task` and `get task --id` now auto-transition to-do tasks to in-progress when retrieved
  - Includes `transitionedToInProgress` field in JSON output
- **Automatic task completion detection**: `plx get task` now auto-detects when the current in-progress task has all Implementation Checklist items checked
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

- **BREAKING**: Renamed `plx act next` command to `plx get task`
- **BREAKING**: Renamed `PlxSlashCommandId` value `'act-next'` to `'get-task'`
- `--did-complete-previous` now automatically marks all `## Implementation Checklist` checkboxes as complete
- Completed task info (name + completed checkbox items) is output when using `--did-complete-previous`

---

## 0.3.0 - 2025-12-25

### Added

- **Act next command**: New `plx act next` CLI command for prioritized task selection across active changes
  - Prioritizes changes by completion percentage (highest first)
  - Uses proposal.md birthtime as tiebreaker when percentages equal
  - Task status tracking via YAML frontmatter (`to-do`, `in-progress`, `done`)
  - `--did-complete-previous` flag for automatic status transitions
  - `--json` flag for machine-readable output
- **PLX act-next slash command**: Add `plx/act-next` slash command to all 20 supported tool configurators

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

Initial release of Pew Pew Plx fork.

### Added

- **PLX command alias**: `plx` as an alias for `openspec` command
- **PLX architecture commands**: `plx/init-architecture` and `plx/update-architecture` slash commands for all 20 supported tools
- **PLX commands on update**: Running `plx update` generates PLX commands for tools with existing OpenSpec slash commands
- **External issue tracking**: Support `tracker` and `id` fields in proposal frontmatter for Linear, GitHub, etc.

### Changed

- Rebrand fork as Pew Pew Plx while maintaining upstream compatibility
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
