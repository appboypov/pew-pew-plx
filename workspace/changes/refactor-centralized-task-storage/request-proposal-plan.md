# Request Proposal Plan

Master plan for breaking down PLX-44 into scoped proposals. Each proposal is independent but must be implemented in dependency order.

## Proposal Breakdown

### Proposal 1: `standardize-cli-pattern`
**Purpose**: Establish the `plx {verb} {entity} --id/--parent-id` CLI pattern as the foundation for all other changes.

**Scope**:
- Standardize `plx get` command with singular/plural entity distinction
  - `plx get task --id <id>` (singular: specific lookup)
  - `plx get tasks` (plural: list all)
  - `plx get tasks --parent-id <id>` (plural with filter)
  - Same for change/changes, spec/specs, review/reviews
- Add `--parent-type <type>` optional flag (searches all types if omitted, errors on conflict)
- Merge `plx show` filtering options into `plx get change`:
  - `--deltas-only`, `--requirements`, `--no-scenarios`, `-r <id>`
- Deprecate: `plx list`, `plx show`, `plx change` parent, `plx spec` parent
- Standardize `plx validate`:
  - `plx validate change --id <id>`, `plx validate changes`
  - `plx validate spec --id <id>`, `plx validate specs`
- Standardize `plx archive`:
  - `plx archive change --id <id>`, `plx archive review --id <id>`
- Standardize `plx review`:
  - `plx review change --id <id>`, `plx review spec --id <id>`, `plx review task --id <id>`
  - Deprecate `--change-id`, `--spec-id`, `--task-id` flags
- Standardize `plx parse feedback`:
  - `plx parse feedback "name" --parent-id <id> --parent-type change|spec|task`
  - Deprecate `--change-id`, `--spec-id`, `--task-id` flags
- Keep `plx view` as interactive dashboard (unchanged)

**Dependencies**: None (foundation)

---

### Proposal 2: `add-create-command`
**Purpose**: Add `plx create` command for entity creation with positional content argument.

**Scope**:
- `plx create task "Title"` - standalone task
- `plx create task "Title" --parent-id <id>` - parented task (requires --parent-type if ambiguous)
- `plx create change "Name"` - scaffold change proposal
- `plx create spec "Name"` - scaffold spec
- `plx create request "Description"` - create request
- Positional argument after entity becomes file content/title
- Flags/options determine frontmatter fields
- Templates required for all entity types

**Dependencies**: `standardize-cli-pattern` (uses --parent-id/--parent-type pattern)

---

### Proposal 3: `extend-paste-command`
**Purpose**: Extend `plx paste` for clipboard-based creation of all entity types.

**Scope**:
- `plx paste task` - create task from clipboard
- `plx paste task --parent-id <id>` - parented task from clipboard
- `plx paste change` - create change from clipboard
- `plx paste spec` - create spec from clipboard
- `plx paste request` - (existing, unchanged)
- Same template system as `plx create`

**Dependencies**: `add-create-command` (shares templates and creation logic)

---

### Proposal 4: `centralize-task-storage`
**Purpose**: Move tasks from nested folders to centralized `workspace/tasks/` with parent linking.

**Scope**:
- New storage location: `workspace/tasks/`
- Task filename format:
  - Parented: `NNN-<parent-id>-<name>.md` (e.g., `001-add-feature-x-implement.md`)
  - Standalone: `NNN-<name>.md` (e.g., `001-fix-typo.md`)
- Frontmatter fields: `parent-type: change|review|spec`, `parent-id: <id>` (optional for standalone)
- Per-parent numbering (each parent's tasks start at 001)
- Per-workspace tasks folder (follows existing multi-workspace pattern)
- Supported parent types: change, review, spec
- Archive location: `workspace/tasks/archive/`
- Update all task retrieval, filtering, and management logic

**Dependencies**: `standardize-cli-pattern` (uses --parent-id/--parent-type for filtering)

---

### Proposal 5: `extend-complete-undo`
**Purpose**: Extend `plx complete` and `plx undo` to support all parent types.

**Scope**:
- `plx complete task --id <id>` (existing)
- `plx complete change --id <id>` (existing)
- `plx complete review --id <id>` (new) - complete all tasks in review
- `plx complete spec --id <id>` (new) - complete all tasks linked to spec
- Same pattern for `plx undo`

**Dependencies**: `centralize-task-storage` (requires parent linking to find tasks)

---

### Proposal 6: `add-migrate-command`
**Purpose**: Add migration command for existing projects.

**Scope**:
- `plx migrate tasks` - move existing nested tasks to centralized folder
- Rename files to new format (add parent-id prefix)
- Add frontmatter fields (parent-type, parent-id)
- Report migration results
- No dual-structure support (breaking change)

**Dependencies**: `centralize-task-storage` (defines target structure)

---

### Proposal 7: `update-archive-task-handling`
**Purpose**: Update archive command to handle centralized task archiving.

**Scope**:
- When parent is archived, move linked tasks to `workspace/tasks/archive/`
- Filename preserved (includes parent-id)
- Maintain frontmatter association

**Dependencies**: `centralize-task-storage` (defines archive location)

---

### Proposal 8: `update-infrastructure`
**Purpose**: Update all documentation, instructions, templates, completions, and tests.

**Scope**:
- Update AGENTS.md with new CLI patterns
- Update CLAUDE.md with new command tables
- Update all slash commands for new patterns
- Update all AI tool configurators
- Update ARCHITECTURE.md
- Update shell completions for new commands
- Update/create templates for all entity types
- Migrate all existing tests to new structure
- Update help text for all commands

**Dependencies**: All previous proposals (documents final state)

---

## Implementation Order

```
1. standardize-cli-pattern     (foundation)
   ↓
2. add-create-command          (uses CLI pattern)
   ↓
3. extend-paste-command        (shares create logic)
   ↓
4. centralize-task-storage     (core storage change)
   ↓
5. extend-complete-undo        (uses centralized storage)
   ↓
6. add-migrate-command         (migration tooling)
   ↓
7. update-archive-task-handling (archive behavior)
   ↓
8. update-infrastructure       (documentation)
```

## Sub-Agent Instructions

Each sub-agent receives:
1. This plan document for context
2. The original request.md
3. Specific scope boundaries (what to include, what to exclude)
4. Strict instruction to apply scope_integrity

Sub-agents must:
- Create ONLY proposal.md, tasks/, design.md (if needed), and spec deltas
- NOT add features beyond their scope
- NOT make assumptions about other proposals
- Use exact CLI patterns as specified
- Follow PLX conventions from workspace/AGENTS.md
