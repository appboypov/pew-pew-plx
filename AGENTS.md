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
| `plx list` | List active changes | Check what's in progress |
| `plx list --specs` | List specifications | Find existing specs |
| `plx view` | Interactive dashboard | Visual overview |

### Task Management
| Command | Description | When to Use |
|---------|-------------|-------------|
| `plx get task` | Get next prioritized task | Start work |
| `plx get task --id <id>` | Get specific task | Resume specific task |
| `plx get task --did-complete-previous` | Complete current, get next | Advance workflow |
| `plx get task --constraints` | Show only Constraints | Focus on constraints |
| `plx get task --acceptance-criteria` | Show only AC | Focus on acceptance |
| `plx get tasks` | List all open tasks | See all pending work |
| `plx get tasks --parent-id <change-id> --parent-type change` | List tasks for change | See tasks in a change |
| `plx complete task --id <id>` | Mark task done | Finish a task |
| `plx complete change --id <id>` | Complete all tasks | Finish entire change |
| `plx undo task --id <id>` | Revert task to to-do | Reopen a task |
| `plx undo change --id <id>` | Revert all tasks | Reopen entire change |

### Item Retrieval
| Command | Description | When to Use |
|---------|-------------|-------------|
| `plx get change --id <id>` | Get change by ID | View specific change |
| `plx get spec --id <id>` | Get spec by ID | View specific spec |

### Display & Inspection
| Command | Description | When to Use |
|---------|-------------|-------------|
| `plx show <item>` | Display change or spec | View details |
| `plx show <item> --json` | JSON output | Machine-readable |
| `plx show <item> --type change\|spec` | Disambiguate item type | When names collide |
| `plx show <change> --deltas-only` | Show only deltas | Focus on changes |

### Validation
| Command | Description | When to Use |
|---------|-------------|-------------|
| `plx validate <item>` | Validate single item | Check for issues |
| `plx validate --all` | Validate everything | Full project check |
| `plx validate --changes` | Validate all changes | Check all changes |
| `plx validate --specs` | Validate all specs | Check all specs |
| `plx validate --strict` | Strict validation | Comprehensive check |
| `plx validate --json` | JSON output | Machine-readable |

### Archival
| Command | Description | When to Use |
|---------|-------------|-------------|
| `plx archive <change-id>` | Archive completed change | After deployment |
| `plx archive <id> --yes` | Archive without prompts | Non-interactive |
| `plx archive <id> --skip-specs` | Archive, skip spec updates | Tooling-only changes |

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

### Global Flags
| Flag | Description |
|------|-------------|
| `--json` | Machine-readable JSON output |
| `--no-interactive` | Disable prompts |
| `--no-color` | Disable color output |

Keep this managed block so 'plx update' can refresh the instructions.

<!-- PLX:END -->
