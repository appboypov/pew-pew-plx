# Request: Refactor Centralized Task Storage

## Source Input

Linear issue PLX-44: Refactor task storage to use centralized `workspace/tasks/` folder with parent linking.

**Current state:** Tasks nested in `workspace/changes/<name>/tasks/` and `workspace/reviews/<name>/tasks/`
**Desired state:** All tasks in `workspace/tasks/` with frontmatter linking to parent entity

## Current Understanding

1. Move from nested task storage to flat centralized storage
2. Tasks will have `parent-type` and `parent-id` frontmatter fields
3. All existing functionality (get, complete, undo, progress) must continue working
4. Migration path needed for existing structures

## Identified Ambiguities (All Resolved)

All ambiguities have been clarified through iterative questions. See Decisions section.

## Decisions

1. **Task filename format**: Conditional naming
   - Parented tasks: `NNN-<parent-id>-<name>.md` (e.g., `001-add-feature-x-implement.md`)
   - Standalone tasks: `NNN-<name>.md` (e.g., `001-fix-typo.md`)
   - Parent relationship tracked in frontmatter (optional for standalone)
   - Enables both parented and standalone task workflows

2. **Task archiving**: Centralized archive at `workspace/tasks/archive/`
   - When parent is archived, tasks move to `workspace/tasks/archive/`
   - Filename preserved (includes parent-id, so origin is clear)
   - Maintains association via frontmatter

3. **Migration strategy**: Breaking change with migration command
   - Add `plx migrate tasks` command to move existing nested tasks to centralized folder
   - System only supports new structure after migration
   - No dual-structure support

4. **Multi-workspace support**: Per-workspace tasks folder (follows existing pattern)
   - Each workspace has its own `workspace/tasks/` folder
   - Tasks are scoped to their workspace
   - Follows existing upward/downward workspace discovery logic

5. **Task ordering**: Per-parent numbering
   - Each parent's tasks start at 001
   - E.g., `001-feature-a-impl.md` and `001-feature-b-impl.md` can coexist
   - Standalone task grouping is out of scope for this change

6. **Supported parent types**: change, review, and spec
   - Tasks can be parented to any of these entity types
   - Frontmatter: `parent-type: change|review|spec` and `parent-id: <id>`

7. **CLI standardization**: `plx {verb} {entity}` pattern with `--id` and `--parent-id`
   - Entity type derived from the entity argument (task, change, spec, review)
   - `--id <id>` for specific entity lookup
   - `--parent-id <id>` for filtering by parent
   - `--parent-type <type>` optional (change|review|spec); system searches all types if omitted, errors on conflict
   - Singular/plural distinction: `task`/`tasks`, `change`/`changes`, `spec`/`specs`, `review`/`reviews`
   - Deprecate entity-specific flags like `--change-id`, `--spec-id`
   - Deprecate `plx list` in favor of `plx get changes`, `plx get specs`
   - Deprecate `plx show`, merge filtering options into `plx get`:
     - `--deltas-only`, `--requirements`, `--no-scenarios`, `-r <id>` move to `plx get change`
   - Keep `plx view` as interactive dashboard (different purpose)
   - Deprecate `plx change` and `plx spec` parent commands (subcommands move to `get`/`validate`)
   - Add `plx create` command for entity creation (positional content):
     - `plx create task "Title"` - create task with title as content
     - `plx create task "Title" --parent-id <id>` - parented task
     - `plx create change "Name"` - scaffold change proposal
     - `plx create spec "Name"` - scaffold spec
     - `plx create request "Description"` - create request with description
     - Positional argument after entity becomes file content/title
   - Extend `plx paste` command for clipboard-based creation:
     - `plx paste task` - create task from clipboard content
     - `plx paste change` - create change from clipboard
     - `plx paste spec` - create spec from clipboard
     - `plx paste request` - (existing) create request from clipboard
   - Templates required for all entity types
   - Flags/options determine frontmatter fields (affects filenames for parented tasks)
   - Standardize `plx validate`:
     - `plx validate change --id <id>` - validate specific change
     - `plx validate changes` - validate all changes
     - `plx validate spec --id <id>` - validate specific spec
     - `plx validate specs` - validate all specs
   - Standardize `plx archive`:
     - `plx archive change --id <id>` - archive specific change
     - `plx archive review --id <id>` - archive specific review
   - Standardize `plx review`:
     - `plx review change --id <id>` - review a change
     - `plx review spec --id <id>` - review a spec
     - `plx review task --id <id>` - review a task
     - Deprecate `--change-id`, `--spec-id`, `--task-id` flags
   - Standardize `plx parse feedback`:
     - `plx parse feedback "name" --parent-id <id> --parent-type change|spec|task`
     - Deprecate `--change-id`, `--spec-id`, `--task-id` flags
   - Extend `plx complete` and `plx undo` for all parent types:
     - `plx complete task --id <id>` (existing)
     - `plx complete change --id <id>` (existing)
     - `plx complete review --id <id>` (new)
     - `plx complete spec --id <id>` (new)
     - Same pattern for `plx undo`
   - Examples:
     - `plx get task --id <id>` - get specific task
     - `plx get task --parent-id <id>` - get next task from parent
     - `plx get tasks` - list all open tasks
     - `plx get tasks --parent-id <id>` - list tasks for parent
     - `plx get changes` - list all changes (replaces `plx list`)
     - `plx get specs` - list all specs (replaces `plx list --specs`)
     - `plx get review --id <id>` - get specific review
     - `plx get reviews` - list all reviews

8. **Comprehensive updates required**:
   - Update all agent instructions (AGENTS.md, CLAUDE.md, slash commands)
   - Update all AI tool configurators for new CLI patterns
   - Migrate all existing tests to new structure
   - Update documentation (ARCHITECTURE.md, README, help text)
   - Update shell completions for new commands
   - Update all templates for entity creation
   - This is a large-scale refactor requiring thorough attention to detail

## Final Intent

Refactor PLX to use centralized task storage with optional parent linking, while standardizing the entire CLI to follow a consistent `plx {verb} {entity} --id/--parent-id` pattern. This includes:

1. **Storage**: Move tasks from nested `changes/<name>/tasks/` and `reviews/<name>/tasks/` to centralized `workspace/tasks/` with frontmatter-based parent linking
2. **CLI Pattern**: Standardize all commands to `plx {verb} {entity}` with `--id` for specific lookup and `--parent-id`/`--parent-type` for parent filtering
3. **New Commands**: Add `plx create` and extend `plx paste` for all entity types
4. **Deprecations**: Remove `plx list`, `plx show`, `plx change`, `plx spec` parent commands; consolidate into `plx get`/`plx validate`
5. **Extensions**: Support review/spec in complete/undo; add migration command
6. **Infrastructure**: Update all instructions, templates, tests, completions, and documentation

Breaking change requiring `plx migrate tasks` for existing projects.
