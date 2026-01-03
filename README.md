<p align="center">OpenSpec-driven development for AI coding assistants.</p>
<p align="center">
  <a href="https://github.com/Fission-AI/OpenSpec"><img alt="Fork of OpenSpec" src="https://img.shields.io/badge/Fork%20of-OpenSpec-blue?style=flat-square" /></a>
  <a href="https://www.npmjs.com/package/@appboypov/pew-pew-plx"><img alt="npm version" src="https://img.shields.io/npm/v/@appboypov/pew-pew-plx?style=flat-square" /></a>
  <a href="https://nodejs.org/"><img alt="node version" src="https://img.shields.io/node/v/@appboypov/pew-pew-plx?style=flat-square" /></a>
  <a href="./LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square" /></a>
</p>

<p align="center">
  <img src="assets/hero.png" alt="Pew Pew Plx dashboard preview" width="90%">
</p>

# Pew Pew Plx

Pew Pew Plx aligns humans and AI coding assistants with spec-driven development. Agree on what to build before any code is written. **No API keys required.**

> Fork of [OpenSpec](https://github.com/Fission-AI/OpenSpec) with extended task management, review workflows, and automatic migration from OpenSpec projects.

## Installation

```bash
npm install -g @appboypov/pew-pew-plx
plx --version
```

**Prerequisites:** Node.js >= 20.19.0

## Quick Start

```bash
cd my-project
plx init
```

This creates the `workspace/` directory structure and configures slash commands for your AI tools.

## How It Works

```
1. Draft    → Create a change proposal capturing spec updates
2. Review   → Iterate with your AI until everyone agrees
3. Implement → AI works through tasks referencing agreed specs
4. Archive  → Merge approved updates into source-of-truth specs
```

## Commands

### Navigation & Listing

| Command | Description |
|---------|-------------|
| `plx list` | List active changes |
| `plx list --specs` | List specifications |
| `plx list --reviews` | List active reviews |
| `plx view` | Interactive dashboard |

### Task Management

| Command | Description |
|---------|-------------|
| `plx get task` | Get next prioritized task |
| `plx get task --id <id>` | Get specific task |
| `plx get task --did-complete-previous` | Complete current, get next |
| `plx get task --constraints` | Show only Constraints |
| `plx get task --acceptance-criteria` | Show only Acceptance Criteria |
| `plx get tasks` | List all open tasks |
| `plx complete task --id <id>` | Mark task done |
| `plx complete change --id <id>` | Complete all tasks in change |
| `plx undo task --id <id>` | Revert task to to-do |
| `plx undo change --id <id>` | Revert all tasks in change |

### Item Retrieval

| Command | Description |
|---------|-------------|
| `plx get change --id <id>` | Get change by ID |
| `plx get spec --id <id>` | Get spec by ID |
| `plx show <item>` | Display change or spec |
| `plx show <item> --json` | JSON output |

### Review System

| Command | Description |
|---------|-------------|
| `plx review --change-id <id>` | Review a change |
| `plx review --spec-id <id>` | Review a spec |
| `plx review --task-id <id>` | Review a task |
| `plx parse feedback <name> --change-id <id>` | Parse feedback markers |

### Draft Management

| Command | Description |
|---------|-------------|
| `plx paste request` | Paste clipboard content as draft request |

### Validation & Archival

| Command | Description |
|---------|-------------|
| `plx validate <item>` | Validate single item |
| `plx validate --all` | Validate everything |
| `plx archive <change-id>` | Archive completed change |

### Configuration

| Command | Description |
|---------|-------------|
| `plx config path` | Show config file location |
| `plx config list` | Show all settings |
| `plx update` | Refresh instruction files |

### Subdirectory Support

All PLX commands work from any subdirectory within a project. The CLI automatically finds the project root by scanning upward for `workspace/AGENTS.md`.

### Multi-Workspace (Monorepo)

| Command | Description |
|---------|-------------|
| `plx list --workspace <name>` | Filter to specific workspace |
| `plx get task --workspace <name>` | Get task from specific workspace |
| `plx validate --all --workspace <name>` | Validate specific workspace |

In monorepos, items display with project prefixes (e.g., `project-a/add-feature`). Use `--workspace` to filter operations.

## Task Structure

Tasks live in `workspace/changes/<change-id>/tasks/` as numbered files:

```
tasks/
├── 001-setup-database.md
├── 002-implement-api.md
└── 003-add-tests.md
```

Each task uses YAML frontmatter for status tracking:

```yaml
---
status: to-do  # or: in-progress, done
---
```

**Prioritization:** Changes with highest completion percentage are prioritized first. Within a change, the first `to-do` or `in-progress` task is selected.

**Auto-completion:** When all Implementation Checklist items are checked, the task is automatically marked `done` and the next task begins.

## Review Workflow

Add inline feedback markers during code review:

```typescript
// #FEEDBACK #TODO | Validate input before processing
```

```python
# #FEEDBACK #TODO | Add error handling here
```

```html
<!-- #FEEDBACK #TODO | Missing accessibility attributes -->
```

For spec-impacting feedback, add suffix: `(spec:<spec-id>)`

Parse markers with: `plx parse feedback review-name --change-id <id>`

## Slash Commands

When you run `plx init`, these commands are installed for supported AI tools:

- `/plx/plan-request` - Clarify intent via iterative yes/no questions
- `/plx/plan-proposal` - Scaffold change proposal (auto-consumes request.md)
- `/plx/get-task` - Get next prioritized task
- `/plx/complete-task` - Mark task as done
- `/plx/undo-task` - Revert task to to-do
- `/plx/implement` - Implement current task with guided workflow
- `/plx/orchestrate` - Coordinate sub-agents for multi-task work
- `/plx/refine-architecture` - Create or update `ARCHITECTURE.md`
- `/plx/refine-review` - Create or update `REVIEW.md` template
- `/plx/refine-release` - Create or update `RELEASE.md` template
- `/plx/review` - Review implementations
- `/plx/parse-feedback` - Parse feedback markers
- `/plx/prepare-release` - Guided release preparation workflow
- `/plx/prepare-compact` - Preserve session progress in PROGRESS.md

## Supported AI Tools

<details>
<summary><strong>Native Slash Commands</strong></summary>

| Tool | Command Format |
|------|----------------|
| Amazon Q Developer | `@plx-plan-proposal`, `@plx-implement`, `@plx-archive` |
| Antigravity | `/plx-plan-proposal`, `/plx-implement`, `/plx-archive` |
| Auggie (Augment CLI) | `/plx-plan-proposal`, `/plx-implement`, `/plx-archive` |
| Claude Code | `/plx:plan-proposal`, `/plx:implement`, `/plx:archive` |
| Cline | Workflows in `.clinerules/workflows/` |
| CodeBuddy Code | `/plx:plan-proposal`, `/plx:implement`, `/plx:archive` |
| Codex | `/plx-plan-proposal`, `/plx-implement`, `/plx-archive` |
| CoStrict | `/plx-plan-proposal`, `/plx-implement`, `/plx-archive` |
| Crush | `/plx-plan-proposal`, `/plx-implement`, `/plx-archive` |
| Cursor | `/plx-plan-proposal`, `/plx-implement`, `/plx-archive` |
| Factory Droid | `/plx-plan-proposal`, `/plx-implement`, `/plx-archive` |
| Gemini CLI | `/plx:plan-proposal`, `/plx:implement`, `/plx:archive` |
| GitHub Copilot | `/plx-plan-proposal`, `/plx-implement`, `/plx-archive` |
| iFlow | `/plx-plan-proposal`, `/plx-implement`, `/plx-archive` |
| Kilo Code | `/plx-plan-proposal.md`, `/plx-implement.md`, `/plx-archive.md` |
| OpenCode | `/plx-plan-proposal`, `/plx-implement`, `/plx-archive` |
| Qoder | `/plx:plan-proposal`, `/plx:implement`, `/plx:archive` |
| Qwen Code | `/plx-plan-proposal`, `/plx-implement`, `/plx-archive` |
| RooCode | `/plx-plan-proposal`, `/plx-implement`, `/plx-archive` |
| Windsurf | `/plx-plan-proposal`, `/plx-implement`, `/plx-archive` |

</details>

<details>
<summary><strong>AGENTS.md Compatible</strong></summary>

Tools that read workflow instructions from `workspace/AGENTS.md`:

Amp, Jules, and others following the [AGENTS.md convention](https://agents.md/).

</details>

## Contributing

```bash
pnpm install
pnpm run build
pnpm test
```

## License

MIT
