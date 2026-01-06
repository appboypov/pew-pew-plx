# Pew Pew Plx Instructions

Instructions for AI coding assistants using Pew Pew Plx for spec-driven development.

## TL;DR Quick Checklist

- Search existing work: `plx get specs --long`, `plx get changes` (use `rg` only for full-text search)
- Decide scope: new capability vs modify existing capability
- Pick a unique `change-id`: kebab-case, verb-led (`add-`, `update-`, `remove-`, `refactor-`)
- Scaffold: `proposal.md`, `tasks/` directory, `design.md` (only if needed), and delta specs per affected capability
- Write deltas: use `## ADDED|MODIFIED|REMOVED|RENAMED Requirements`; include at least one `#### Scenario:` per requirement
- Validate: `plx validate change --id <change-id> --strict` and fix issues
- Request approval: Do not start implementation until proposal is approved

## Three-Stage Workflow

### Stage 1: Creating Changes
Create proposal when you need to:
- Add features or functionality
- Make breaking changes (API, schema)
- Change architecture or patterns
- Optimize performance (changes behavior)
- Update security patterns

Triggers (examples):
- "Help me create a change proposal"
- "Help me plan a change"
- "Help me create a proposal"
- "I want to create a spec proposal"
- "I want to create a spec"

Loose matching guidance:
- Contains one of: `proposal`, `change`, `spec`
- With one of: `create`, `plan`, `make`, `start`, `help`

Skip proposal for:
- Bug fixes (restore intended behavior)
- Typos, formatting, comments
- Dependency updates (non-breaking)
- Configuration changes
- Tests for existing behavior

**Slash Commands**
- `plx/plan-request` - Clarify ambiguous requirements through iterative yes/no questions before scaffolding
- `plx/plan-proposal` - Scaffold `proposal.md`, task files in `workspace/tasks/`, `design.md`, and spec deltas. Consumes request.md when present.

**Workflow**
1. Review `ARCHITECTURE.md`, `plx get changes`, and `plx get specs` to understand current context.
2. If requirements are ambiguous, run `plx/plan-request` to clarify intent first.
3. Choose a unique verb-led `change-id` and scaffold `proposal.md`, task files in `workspace/tasks/`, optional `design.md`, and spec deltas under `workspace/changes/<id>/`.
4. Draft spec deltas using `## ADDED|MODIFIED|REMOVED Requirements` with at least one `#### Scenario:` per requirement.
5. Run `plx validate change --id <id> --strict` and resolve any issues before sharing the proposal.

### Stage 2: Implementing Changes
Track these steps as TODOs and complete them one by one.
1. **Read proposal.md** - Understand what's being built
2. **Read design.md** (if exists) - Review technical decisions
3. **Get next task** - Run `plx get task` to retrieve the next task (auto-transitions to in-progress)
4. **Implement task** - Work through the Implementation Checklist
5. **Complete task** - Run `plx complete task --id <id>` to mark the task as done
6. **Stop and await user confirmation** - Do not proceed to the next task until the user requests it
7. **Approval gate** - Do not start implementation until the proposal is reviewed and approved

### Stage 3: Archiving Changes
After deployment, create separate PR to:
- Move `changes/[name]/` → `changes/archive/YYYY-MM-DD-[name]/`
- Update `specs/` if capabilities changed
- Use `plx archive change --id <change-id> --skip-specs --yes` for tooling-only changes (always pass the change ID explicitly)
- Run `plx validate all --strict` to confirm the archived change passes checks

## Before Any Task

**Context Checklist:**
- [ ] Read relevant specs in `specs/[capability]/spec.md`
- [ ] Check pending changes in `changes/` for conflicts
- [ ] Read `ARCHITECTURE.md` for project context and conventions
- [ ] Run `plx get changes` to see active changes
- [ ] Run `plx get specs` to see existing capabilities

**Before Creating Specs:**
- Always check if capability already exists
- Prefer modifying existing specs over creating duplicates
- Use `plx get spec --id [spec]` to review current state
- If request is ambiguous, gather as many as necessary clarifications (using your question tool if available) before scaffolding

### Search Guidance
- Enumerate specs: `plx get specs --long` (or `--json` for scripts)
- Enumerate changes: `plx get changes` (or `plx get changes --json`)
- Show details:
  - Spec: `plx get spec --id <spec-id>` (use `--json` for filters)
  - Change: `plx get change --id <change-id> --json --deltas-only`
- Full-text search (use ripgrep): `rg -n "Requirement:|Scenario:" workspace/specs`

## External Issue Tracking

Proposals may reference external issues (Linear, GitHub, Jira, etc.). When detected, track and update them throughout the workflow.

### Detection

When user input contains issue references:
1. Confirm with user: "I detected [issue]. Track and post progress updates?"
2. If confirmed, fetch issue metadata using available tools
3. Store in proposal.md frontmatter:

```yaml
---
tracked-issues:
  - tracker: linear
    id: SM-123
    url: https://linear.app/team/issue/SM-123
---
```

Only store immutable references (tracker, id, url). Fetch current details from the API when needed.

### Updates

Post progress to tracked issues at these points:
- **Proposal created**: Comment linking to the change
- **Section completed**: Comment with progress (batch per section, not per checkbox)
- **Archive complete**: Final summary comment

### User Confirmation

Before any external update, present a summary and wait for confirmation. Never auto-post.

### Tool Usage

Use available tools to interact with issue trackers. If no tools available for a tracker, note the issue URL for manual updates.

## Quick Start

### CLI Commands

```bash
# Essential commands
plx get changes           # List active changes
plx get specs             # List specifications
plx get change --id [id]  # Display change
plx get spec --id [id]    # Display spec
plx validate change --id <id>  # Validate specific change
plx validate spec --id <id>     # Validate specific spec
plx validate changes            # Validate all changes
plx validate specs              # Validate all specs
plx validate all                # Validate everything
plx archive change --id <change-id> [--yes|-y]   # Archive after deployment (add --yes for non-interactive runs)

# Project management
plx init [path]           # Initialize Pew Pew Plx
plx update [path]         # Update instruction files

# Bulk validation mode
plx validate              # Bulk validation mode

# Debugging
plx get change --id [change] --json --deltas-only
plx validate change --id <change-id> --strict

# Create project artifacts
plx create task "Title" --parent-id <id> --parent-type <change|review>  # Create task linked to change or review
plx create change "Name"                      # Create new change proposal
plx create spec "Name"                        # Create new specification
plx create request "Description"              # Create new request

# Retrieve tasks and items
plx get task                          # Get next task from highest-priority change
plx get task --id <task-id>           # Get specific task by ID
plx get task --did-complete-previous  # Complete current task and get next
plx get task --constraints            # Show only Constraints section
plx get task --acceptance-criteria    # Show only Acceptance Criteria section
plx get change --id <change-id>       # Retrieve change by ID
plx get spec --id <spec-id>           # Retrieve spec by ID
plx get tasks                                         # List all open tasks
plx get tasks --parent-id <change-id> --parent-type change  # List tasks for specific change

# Complete tasks and changes
plx complete task --id <task-id>      # Mark task as done, check Implementation Checklist items
plx complete change --id <change-id>  # Complete all tasks in a change

# Undo task/change completion
plx undo task --id <task-id>          # Revert task to to-do, uncheck Implementation Checklist items
plx undo change --id <change-id>      # Revert all tasks in a change to to-do

# Review
plx get reviews                       # List all active reviews
plx get review --id <review-id>       # Retrieve specific review
plx review change --id <change-id>    # Review a change proposal
plx review spec --id <spec-id>        # Review a specification
plx review task --id <task-id>        # Review a task

# Parse feedback
plx parse feedback <name> --parent-id <id> --parent-type change|spec|task  # Parse feedback into tasks

# Archive
plx archive change --id <change-id>             # Archive after deployment
plx archive change --id <id> --yes             # Archive without prompts
plx archive change --id <id> --skip-specs --yes # Archive tooling-only changes
plx archive review --id <review-id>            # Archive completed review
```

### Command Flags

- `--json` - Machine-readable output
- `--type change|spec` - Disambiguate items
- `--strict` - Comprehensive validation
- `--no-interactive` - Disable prompts
- `--skip-specs` - Archive without spec updates
- `--yes`/`-y` - Skip confirmation prompts (non-interactive archive)
- `--did-complete-previous` - Complete current task and advance to next
- `--constraints` - Show only Constraints section (get task)
- `--acceptance-criteria` - Show only Acceptance Criteria section (get task)

## Directory Structure

```
project-root/
├── ARCHITECTURE.md             # Project context and conventions
├── AGENTS.md                   # Root stub pointing to workspace/AGENTS.md
└── workspace/
    ├── AGENTS.md               # AI assistant instructions
    ├── specs/                  # Current truth - what IS built
    │   └── [capability]/       # Single focused capability
    │       ├── spec.md         # Requirements and scenarios
    │       └── design.md       # Technical patterns
    └── changes/                # Proposals - what SHOULD change
        ├── [change-name]/
        │   ├── proposal.md     # Why, what, impact
        │   ├── tasks/          # Task files (directory)
        │   │   ├── 001-*.md    # First task file
        │   │   ├── 002-*.md    # Second task file
        │   │   └── ...         # Additional task files
        │   ├── design.md       # Technical decisions (optional; see criteria)
        │   └── specs/          # Delta changes
        │       └── [capability]/
        │           └── spec.md # ADDED/MODIFIED/REMOVED
        └── archive/            # Completed changes
```

## Creating Change Proposals

### Decision Tree

```
New request?
├─ Bug fix restoring spec behavior? → Fix directly
├─ Typo/format/comment? → Fix directly  
├─ New feature/capability? → Create proposal
├─ Breaking change? → Create proposal
├─ Architecture change? → Create proposal
└─ Unclear? → Create proposal (safer)
```

### Proposal Structure

1. **Create directory:** `changes/[change-id]/` (kebab-case, verb-led, unique)

2. **Write proposal.md:**
```markdown
# Change: [Brief description of change]

## Why
[1-2 sentences on problem/opportunity]

## What Changes
- [Bullet list of changes]
- [Mark breaking changes with **BREAKING**]

## Impact
- Affected specs: [list capabilities]
- Affected code: [key files/systems]
```

3. **Create spec deltas:** `specs/[capability]/spec.md`
```markdown
## ADDED Requirements
### Requirement: New Feature
The system SHALL provide...

#### Scenario: Success case
- **WHEN** user performs action
- **THEN** expected result

## MODIFIED Requirements
### Requirement: Existing Feature
[Complete modified requirement]

## REMOVED Requirements
### Requirement: Old Feature
**Reason**: [Why removing]
**Migration**: [How to handle]
```
If multiple capabilities are affected, create multiple delta files under `changes/[change-id]/specs/<capability>/spec.md`—one per capability.

4. **Create tasks:**

Create task files in `workspace/tasks/` with numbered files. Minimum 3 files recommended:
- Implementation task(s): The actual work
- Review task: Verify all changes are complete and consistent
- Test task: Validate behavior meets acceptance criteria

For parented tasks, use format `NNN-<parent-id>-<kebab-case-name>.md` (e.g., `001-add-feature-implement.md`).
For standalone tasks, use format `NNN-<kebab-case-name>.md` (e.g., `003-standalone-task.md`).

Example `workspace/tasks/001-add-feature-implement.md`:
```markdown
---
status: to-do
skill-level: junior|medior|senior
parent-type: change
parent-id: add-feature
---

# Task: Implement feature

## End Goal
What this task accomplishes.

## Currently
Current state before this task.

## Should
Expected state after this task.

## Constraints
- [ ] Constraint 1
- [ ] Constraint 2

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2

## Implementation Checklist
- [ ] 1.1 Create database schema
- [ ] 1.2 Implement API endpoint
- [ ] 1.3 Add frontend component

## Notes
Additional context if needed.
```

**Note:** Checkboxes under `## Constraints` and `## Acceptance Criteria` are ignored when calculating task progress. Only `## Implementation Checklist` checkboxes count.

### Task Skill Level

The optional `skill-level` field guides AI model selection when spawning sub-agents.

**Valid Values:**
| Level | Description |
|-------|-------------|
| junior | Straightforward changes, simple refactoring, documentation updates |
| medior | Feature implementation, moderate complexity, integration work |
| senior | Architectural changes, complex algorithms, cross-cutting concerns |

**Model Mapping (Claude):**
| Skill Level | Claude Model |
|-------------|--------------|
| junior | haiku |
| medior | sonnet |
| senior | opus |

For non-Claude models, the agent determines an equivalent model or ignores the field.

**Usage:**
- Add `skill-level` to task frontmatter during proposal creation
- `plx validate change --id <id> --strict` warns when skill-level is missing
- Skill level appears in `plx get task` output

5. **Create design.md when needed:**
Create `design.md` if any of the following apply; otherwise omit it:
- Cross-cutting change (multiple services/modules) or a new architectural pattern
- New external dependency or significant data model changes
- Security, performance, or migration complexity
- Ambiguity that benefits from technical decisions before coding

Minimal `design.md` skeleton:
```markdown
## Context
[Background, constraints, stakeholders]

## Goals / Non-Goals
- Goals: [...]
- Non-Goals: [...]

## Decisions
- Decision: [What and why]
- Alternatives considered: [Options + rationale]

## Risks / Trade-offs
- [Risk] → Mitigation

## Migration Plan
[Steps, rollback]

## Open Questions
- [...]
```

## Spec File Format

### Critical: Scenario Formatting

**CORRECT** (use #### headers):
```markdown
#### Scenario: User login success
- **WHEN** valid credentials provided
- **THEN** return JWT token
```

**WRONG** (don't use bullets or bold):
```markdown
- **Scenario: User login**  ❌
**Scenario**: User login     ❌
### Scenario: User login      ❌
```

Every requirement MUST have at least one scenario.

### Requirement Wording
- Use SHALL/MUST for normative requirements (avoid should/may unless intentionally non-normative)

### Delta Operations

- `## ADDED Requirements` - New capabilities
- `## MODIFIED Requirements` - Changed behavior
- `## REMOVED Requirements` - Deprecated features
- `## RENAMED Requirements` - Name changes

Headers matched with `trim(header)` - whitespace ignored.

#### When to use ADDED vs MODIFIED
- ADDED: Introduces a new capability or sub-capability that can stand alone as a requirement. Prefer ADDED when the change is orthogonal (e.g., adding "Slash Command Configuration") rather than altering the semantics of an existing requirement.
- MODIFIED: Changes the behavior, scope, or acceptance criteria of an existing requirement. Always paste the full, updated requirement content (header + all scenarios). The archiver will replace the entire requirement with what you provide here; partial deltas will drop previous details.
- RENAMED: Use when only the name changes. If you also change behavior, use RENAMED (name) plus MODIFIED (content) referencing the new name.

Common pitfall: Using MODIFIED to add a new concern without including the previous text. This causes loss of detail at archive time. If you aren’t explicitly changing the existing requirement, add a new requirement under ADDED instead.

Authoring a MODIFIED requirement correctly:
1) Locate the existing requirement in `workspace/specs/<capability>/spec.md`.
2) Copy the entire requirement block (from `### Requirement: ...` through its scenarios).
3) Paste it under `## MODIFIED Requirements` and edit to reflect the new behavior.
4) Ensure the header text matches exactly (whitespace-insensitive) and keep at least one `#### Scenario:`.

Example for RENAMED:
```markdown
## RENAMED Requirements
- FROM: `### Requirement: Login`
- TO: `### Requirement: User Authentication`
```

## Troubleshooting

### Common Errors

**"Change must have at least one delta"**
- Check `changes/[name]/specs/` exists with .md files
- Verify files have operation prefixes (## ADDED Requirements)

**"Requirement must have at least one scenario"**
- Check scenarios use `#### Scenario:` format (4 hashtags)
- Don't use bullet points or bold for scenario headers

**Silent scenario parsing failures**
- Exact format required: `#### Scenario: Name`
- Debug with: `plx get change --id [change] --json --deltas-only`

### Validation Tips

```bash
# Always use strict mode for comprehensive checks
plx validate change --id <change-id> --strict

# Debug delta parsing
plx get change --id [change] --json | jq '.deltas'

# Check specific requirement
plx get spec --id [spec] --json -r 1
```

## Happy Path Script

```bash
# 1) Explore current state
plx get specs --long
plx get changes
# Optional full-text search:
# rg -n "Requirement:|Scenario:" workspace/specs
# rg -n "^#|Requirement:" workspace/changes

# 2) Choose change id and scaffold
CHANGE=add-two-factor-auth
mkdir -p workspace/changes/$CHANGE/specs/auth
printf "## Why\n...\n\n## What Changes\n- ...\n\n## Impact\n- ...\n" > workspace/changes/$CHANGE/proposal.md
printf "---\nstatus: to-do\nskill-level: junior|medior|senior\nparent-type: change\nparent-id: add-two-factor-auth\n---\n\n# Task: Implement feature\n\n## End Goal\n...\n\n## Implementation Checklist\n- [ ] 1.1 ...\n" > workspace/tasks/001-add-two-factor-auth-implement.md

# 3) Add deltas (example)
cat > workspace/changes/$CHANGE/specs/auth/spec.md << 'EOF'
## ADDED Requirements
### Requirement: Two-Factor Authentication
Users MUST provide a second factor during login.

#### Scenario: OTP required
- **WHEN** valid credentials are provided
- **THEN** an OTP challenge is required
EOF

# 4) Validate
plx validate change --id $CHANGE --strict
```

## Multi-Capability Example

```
workspace/changes/add-2fa-notify/
├── proposal.md
├── tasks/
│   ├── 001-implement-auth.md
│   ├── 002-implement-notify.md
│   ├── 003-verify-changes.md
│   └── 004-validate-behavior.md
└── specs/
    ├── auth/
    │   └── spec.md   # ADDED: Two-Factor Authentication
    └── notifications/
        └── spec.md   # ADDED: OTP email notification
```

auth/spec.md
```markdown
## ADDED Requirements
### Requirement: Two-Factor Authentication
...
```

notifications/spec.md
```markdown
## ADDED Requirements
### Requirement: OTP Email Notification
...
```

## Best Practices

### Simplicity First
- Default to <100 lines of new code
- Single-file implementations until proven insufficient
- Avoid frameworks without clear justification
- Choose boring, proven patterns

### Complexity Triggers
Only add complexity with:
- Performance data showing current solution too slow
- Concrete scale requirements (>1000 users, >100MB data)
- Multiple proven use cases requiring abstraction

### Clear References
- Use `file.ts:42` format for code locations
- Reference specs as `specs/auth/spec.md`
- Link related changes and PRs

### Capability Naming
- Use verb-noun: `user-auth`, `payment-capture`
- Single purpose per capability
- 10-minute understandability rule
- Split if description needs "AND"

### Change ID Naming
- Use kebab-case, short and descriptive: `add-two-factor-auth`
- Prefer verb-led prefixes: `add-`, `update-`, `remove-`, `refactor-`
- Ensure uniqueness; if taken, append `-2`, `-3`, etc.

## Tool Selection Guide

| Task | Tool | Why |
|------|------|-----|
| Find files by pattern | Glob | Fast pattern matching |
| Search code content | Grep | Optimized regex search |
| Read specific files | Read | Direct file access |
| Explore unknown scope | Task | Multi-step investigation |

## Error Recovery

### Change Conflicts
1. Run `plx get changes` to see active changes
2. Check for overlapping specs
3. Coordinate with change owners
4. Consider combining proposals

### Validation Failures
1. Run with `--strict` flag
2. Check JSON output for details
3. Verify spec file format
4. Ensure scenarios properly formatted

### Missing Context
1. Read ARCHITECTURE.md first
2. Check related specs
3. Review recent archives
4. Request clarification (use your question tool if available)

## Quick Reference

### Stage Indicators
- `changes/` - Proposed, not yet built
- `specs/` - Built and deployed
- `archive/` - Completed changes

### File Purposes
- `proposal.md` - Why and what
- `tasks/` - Implementation steps (directory with numbered files)
- `design.md` - Technical decisions
- `spec.md` - Requirements and behavior

### CLI Essentials
```bash
plx get changes            # What's in progress?
plx get change --id [item] # View change details
plx get spec --id [item]   # View spec details
plx validate change --id <id> --strict  # Is it correct?
plx archive change --id <change-id> [--yes|-y]  # Mark complete (add --yes for automation)
```

Remember: Specs are truth. Changes are proposals. Keep them in sync.
