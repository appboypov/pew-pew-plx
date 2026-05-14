<!-- PLX:START -->
# OpenSplx Instructions

These instructions are for AI assistants working in this project.

Always open `/workspace/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `/workspace/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

## Commands

### Project Setup
| Command | Description | When to Use |
|---------|-------------|-------------|
| `splx init [path]` | Initialize OpenSplx | New project setup |
| `splx init --tools <list>` | Initialize with specific AI tools | Non-interactive setup |
| `splx update [path]` | Refresh instruction files | After CLI updates |

### Navigation & Listing
| Command | Description | When to Use |
|---------|-------------|-------------|
| `splx get changes` | List active changes | Check what's in progress |
| `splx get specs` | List specifications | Find existing specs |
| `splx view` | Interactive dashboard | Visual overview |

### Task Management
| Command | Description | When to Use |
|---------|-------------|-------------|
| `splx get task` | Get next prioritized task | Start work |
| `splx get task --id <id>` | Get specific task | Resume specific task |
| `splx get task --did-complete-previous` | Complete current, get next | Advance workflow |
| `splx get task --constraints` | Show only Constraints | Focus on constraints |
| `splx get task --acceptance-criteria` | Show only AC | Focus on acceptance |
| `splx get tasks` | List all open tasks | See all pending work |
| `splx get tasks --parent-id <id> --parent-type change` | List tasks for change | See tasks in a change |
| `splx complete task --id <id>` | Mark task done | Finish a task |
| `splx complete change --id <id>` | Complete all tasks | Finish entire change |
| `splx undo task --id <id>` | Revert task to to-do | Reopen a task |
| `splx undo change --id <id>` | Revert all tasks | Reopen entire change |

### Item Retrieval
| Command | Description | When to Use |
|---------|-------------|-------------|
| `splx get change --id <id>` | Get change by ID | View specific change |
| `splx get spec --id <id>` | Get spec by ID | View specific spec |
| `splx get review --id <id>` | Get review by ID | View specific review |
| `splx get reviews` | List all reviews | See all active reviews |

### Display & Inspection
| Command | Description | When to Use |
|---------|-------------|-------------|
| `splx get change --id <id>` | Display change | View change details |
| `splx get spec --id <id>` | Display spec | View spec details |
| `splx get change --id <id> --json` | JSON output | Machine-readable |
| `splx get change --id <id> --deltas-only` | Show only deltas | Focus on changes |

### Validation
| Command | Description | When to Use |
|---------|-------------|-------------|
| `splx validate change --id <id>` | Validate specific change | Check for issues |
| `splx validate spec --id <id>` | Validate specific spec | Check for issues |
| `splx validate all` | Validate everything | Full project check |
| `splx validate changes` | Validate all changes | Check all changes |
| `splx validate specs` | Validate all specs | Check all specs |
| `splx validate change --id <id> --strict` | Strict validation | Comprehensive check |
| `splx validate all --json` | JSON output | Machine-readable |

### Archival
| Command | Description | When to Use |
|---------|-------------|-------------|
| `splx archive change --id <change-id>` | Archive completed change | After deployment |
| `splx archive change --id <id> --yes` | Archive without prompts | Non-interactive |
| `splx archive change --id <id> --skip-specs` | Archive, skip spec updates | Tooling-only changes |

### Configuration
| Command | Description | When to Use |
|---------|-------------|-------------|
| `splx config path` | Show config file location | Find config |
| `splx config list` | Show all settings | View configuration |
| `splx config get <key>` | Get specific value | Read a setting |
| `splx config set <key> <value>` | Set a value | Modify configuration |

### Shell Completions
| Command | Description | When to Use |
|---------|-------------|-------------|
| `splx completion install [shell]` | Install completions | Enable tab completion |
| `splx completion uninstall [shell]` | Remove completions | Remove tab completion |
| `splx completion generate [shell]` | Generate script | Manual setup |

### Global Flags
| Flag | Description |
|------|-------------|
| `--json` | Machine-readable JSON output |
| `--no-interactive` | Disable prompts |
| `--no-color` | Disable color output |

Keep this managed block so 'splx update' can refresh the instructions.

<!-- PLX:END -->