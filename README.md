<p align="center">
  <a href="https://github.com/appboypov/pew-pew-plx">
    <picture>
      <source srcset="assets/pew_pew_plx_pixel_dark.svg" media="(prefers-color-scheme: dark)">
      <source srcset="assets/pew_pew_plx_pixel_light.svg" media="(prefers-color-scheme: light)">
      <img src="assets/pew_pew_plx_pixel_light.svg" alt="Pew Pew Plx logo" height="64">
    </picture>
  </a>

</p>
<p align="center">Spec-driven development for AI coding assistants.</p>
<p align="center">
  <a href="https://github.com/Fission-AI/OpenSpec"><img alt="Fork of OpenSpec" src="https://img.shields.io/badge/Fork%20of-OpenSpec-blue?style=flat-square" /></a>
  <a href="https://www.npmjs.com/package/@appboypov/pew-pew-plx"><img alt="npm version" src="https://img.shields.io/npm/v/@appboypov/pew-pew-plx?style=flat-square" /></a>
  <a href="https://nodejs.org/"><img alt="node version" src="https://img.shields.io/node/v/@appboypov/pew-pew-plx?style=flat-square" /></a>
  <a href="./LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square" /></a>
</p>

<p align="center">
  <img src="assets/plx_dashboard.png" alt="Pew Pew Plx dashboard preview" width="90%">
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

- `/plx/get-task` - Get next prioritized task
- `/plx/init-architecture` - Generate `ARCHITECTURE.md`
- `/plx/update-architecture` - Refresh architecture documentation
- `/plx/review` - Review implementations
- `/plx/parse-feedback` - Parse feedback markers

## Supported AI Tools

<details>
<summary><strong>Native Slash Commands</strong></summary>

| Tool | Command Format |
|------|----------------|
| Amazon Q Developer | `@plx-proposal`, `@plx-apply`, `@plx-archive` |
| Antigravity | `/plx-proposal`, `/plx-apply`, `/plx-archive` |
| Auggie (Augment CLI) | `/plx-proposal`, `/plx-apply`, `/plx-archive` |
| Claude Code | `/plx:proposal`, `/plx:apply`, `/plx:archive` |
| Cline | Workflows in `.clinerules/workflows/` |
| CodeBuddy Code | `/plx:proposal`, `/plx:apply`, `/plx:archive` |
| Codex | `/plx-proposal`, `/plx-apply`, `/plx-archive` |
| CoStrict | `/plx-proposal`, `/plx-apply`, `/plx-archive` |
| Crush | `/plx-proposal`, `/plx-apply`, `/plx-archive` |
| Cursor | `/plx-proposal`, `/plx-apply`, `/plx-archive` |
| Factory Droid | `/plx-proposal`, `/plx-apply`, `/plx-archive` |
| Gemini CLI | `/plx:proposal`, `/plx:apply`, `/plx:archive` |
| GitHub Copilot | `/plx-proposal`, `/plx-apply`, `/plx-archive` |
| iFlow | `/plx-proposal`, `/plx-apply`, `/plx-archive` |
| Kilo Code | `/plx-proposal.md`, `/plx-apply.md`, `/plx-archive.md` |
| OpenCode | `/plx-proposal`, `/plx-apply`, `/plx-archive` |
| Qoder | `/plx:proposal`, `/plx:apply`, `/plx:archive` |
| Qwen Code | `/plx-proposal`, `/plx-apply`, `/plx-archive` |
| RooCode | `/plx-proposal`, `/plx-apply`, `/plx-archive` |
| Windsurf | `/plx-proposal`, `/plx-apply`, `/plx-archive` |

</details>

<details>
<summary><strong>AGENTS.md Compatible</strong></summary>

Tools that read workflow instructions from `workspace/AGENTS.md`:

Amp, Jules, and others following the [AGENTS.md convention](https://agents.md/).

</details>

## OpenSpec Migration

Projects created with OpenSpec are automatically migrated when running `plx update` or `plx init`:

- `openspec/` directory contents moved to `workspace/`
- `<!-- OPENSPEC:START/END -->` markers updated to `<!-- PLX:START/END -->`
- `~/.openspec/` global config moved to `~/.plx/`

## Contributing

```bash
pnpm install
pnpm run build
pnpm test
```

## License

MIT
