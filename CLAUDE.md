<!-- PLX:START -->
# Pew Pew Plx Instructions

These instructions are for AI assistants working in this project.

Always open `@/workspace/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/workspace/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

## Commands

### Project Setup
| Command | Description | When to Use |
|---------|-------------|-------------|
| `plx init [path]` | Initialize Pew Pew Plx | New project setup |
| `plx init --tools <list>` | Initialize with specific AI tools | Non-interactive setup |
| `plx update [path]` | Refresh instruction files | After CLI updates |

### Navigation & Listing
| Command | Description | When to Use |
|---------|-------------|-------------|
| `plx get changes` | List active changes | Check what's in progress |
| `plx get specs` | List specifications | Find existing specs |
| `plx get specs --long` | List with additional details | See more details |

### Create Items
| Command | Description | When to Use |
|---------|-------------|-------------|
| `plx create task "Title" --parent-id <id> --parent-type <change\|review>` | Create task | New task for change/review |
| `plx create change "Name"` | Create change proposal | New change proposal |
| `plx create spec "Name"` | Create specification | New specification |
| `plx create request "Description"` | Create request | New request |

### Task Management
| Command | Description | When to Use |
|---------|-------------|-------------|
| `plx get task` | Get next prioritized task | Start work |
| `plx get task --id <task-id>` | Get specific task | Resume specific task |
| `plx get task --did-complete-previous` | Complete current, get next | Advance workflow |
| `plx get task --constraints` | Show only Constraints | Focus on constraints |
| `plx get task --acceptance-criteria` | Show only AC | Focus on acceptance |
| `plx get tasks` | List all open tasks | See all pending work |
| `plx get tasks --id <change-id>` | List tasks for change | See tasks in a change |
| `plx complete task --id <task-id>` | Mark task done | Finish a task |
| `plx complete change --id <change-id>` | Complete all tasks | Finish entire change |
| `plx undo task --id <task-id>` | Revert task to to-do | Reopen a task |
| `plx undo change --id <change-id>` | Revert all tasks | Reopen entire change |

### Item Retrieval
| Command | Description | When to Use |
|---------|-------------|-------------|
| `plx get change --id <change-id>` | Get change by ID | View specific change |
| `plx get change --id <id> --json --deltas-only` | Get change deltas | Debugging change deltas |
| `plx get spec --id <spec-id>` | Get spec by ID | View specific spec |

### Validation
| Command | Description | When to Use |
|---------|-------------|-------------|
| `plx validate change --id <change-id>` | Validate specific change | Check for issues |
| `plx validate spec --id <spec-id>` | Validate specific spec | Check spec for issues |
| `plx validate change --id <id> --strict` | Comprehensive validation | Thorough change check |
| `plx validate all` | Validate everything | Full project check |
| `plx validate changes` | Validate all changes | Check all changes |
| `plx validate specs` | Validate all specs | Check all specs |

### Archival
| Command | Description | When to Use |
|---------|-------------|-------------|
| `plx archive change --id <change-id>` | Archive after deployment | After deployment |
| `plx archive change --id <id> --yes` | Archive without prompts | Non-interactive |
| `plx archive change --id <id> --skip-specs --yes` | Archive, skip spec updates | Tooling-only changes |

### Review
| Command | Description | When to Use |
|---------|-------------|-------------|
| `plx review change --id <change-id>` | Review a change proposal | Review changes |

### Feedback
| Command | Description | When to Use |
|---------|-------------|-------------|
| `plx parse feedback <name> --parent-id <id> --parent-type <change\|review>` | Parse feedback into tasks | Convert feedback to tasks |

### Configuration
| Command | Description | When to Use |
|---------|-------------|-------------|
| `plx config path` | Show config file location | Find config |
| `plx config list` | Show all settings | View configuration |
| `plx config get <key>` | Get specific value | Read a setting |
| `plx config set <key> <value>` | Set a value | Modify configuration |

### Shell Completions
| Command | Description | When to Use |
|---------|-------------|-------------|
| `plx completion install [shell]` | Install completions | Enable tab completion |
| `plx completion uninstall [shell]` | Remove completions | Remove tab completion |
| `plx completion generate [shell]` | Generate script | Manual setup |

### Command Flags
| Flag | Description |
|------|-------------|
| `--id <id>` | Specify entity ID (change, spec, task) |
| `--parent-id <id>` | Specify parent ID when creating tasks |
| `--parent-type <change\|review>` | Specify parent type when creating tasks |
| `--json` | Machine-readable output |
| `--strict` | Comprehensive validation |
| `--long` | Show additional details |
| `--deltas-only` | Show only spec deltas (get change) |
| `--no-interactive` | Disable prompts |
| `--skip-specs` | Archive without spec updates |
| `--yes`/`-y` | Skip confirmation prompts |
| `--did-complete-previous` | Complete current task and advance to next |
| `--constraints` | Show only Constraints section (get task) |
| `--acceptance-criteria` | Show only Acceptance Criteria section (get task) |

Keep this managed block so 'plx update' can refresh the instructions.

<!-- PLX:END -->

# Pew Pew Plx Fork Configuration

This is a fork of `Fission-AI/OpenSpec`. The git remotes are configured as:
- `origin` → `appboypov/pew-pew-plx` (this fork, PRs go here)
- `sync` → `Fission-AI/OpenSpec` (upstream, sync only)

## Syncing with Upstream

Use merge (not rebase) to preserve upstream commit SHAs and enable PR review.

### Sync Workflow

1. **Fetch upstream:**
   ```bash
   git fetch sync
   ```

2. **Create sync branch from main:**
   ```bash
   git checkout main
   git pull origin main
   git checkout -b sync/vX.X.X-YYYY-MM-DD
   ```
   Example: `sync/v0.1.0-2024-12-24`

3. **Merge upstream (not rebase):**
   ```bash
   git merge sync/main
   ```

4. **Resolve conflicts intentionally:**
   - For package.json: keep fork's name (`@appboypov/pew-pew-plx`) and version
   - All other conflicts must be discussed with the user before resolving

5. **Push and create PR:**
   ```bash
   git push -u origin sync/vX.X.X-YYYY-MM-DD
   ```
   Create PR: `sync/vX.X.X-YYYY-MM-DD` → `main`

6. **Merge PR via GitHub UI:**
   - Use **"Create a merge commit"** (standard merge)
   - **DO NOT** use "Rebase and merge" (breaks SHA tracking)
   - **DO NOT** use "Squash and merge"

7. **Verify result:**
   ```bash
   git checkout main && git pull origin main
   git rev-list --count main..sync/main  # Should be 0
   ```

### Why Merge (Not Rebase)

Rebase rewrites commit SHAs, causing GitHub to show "X ahead + Y behind" even after sync.
Merge preserves upstream SHAs, resulting in "X ahead + 0 behind".

## PR Workflow

PRs from feature branches target `origin/main` (this fork), not upstream.