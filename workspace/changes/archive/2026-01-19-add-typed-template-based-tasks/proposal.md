# Change: Add Typed Template-Based Tasks

## Why

The current task system uses a generic structure for all tasks, lacking differentiation between task types (UI work, business logic, bug fixes, etc.). This makes it difficult for AI agents to:
- Know which template structure to follow when creating tasks
- Understand task ordering and dependencies
- Create properly scoped, single-commit tasks

Additionally, there's no way for users to customize task templates or add new task types without modifying the CLI itself.

## What Changes

### 1. Template System
- Add `workspace/templates/` directory for task templates
- Ship 13 built-in default templates (story, bug, business-logic, components, research, discovery, chore, refactor, infrastructure, documentation, release, implementation)
- Templates use `type:` frontmatter to declare their type
- User templates override built-in defaults
- Dynamic template discovery - any template file with `type:` frontmatter becomes valid immediately

### 2. Task Type Field
- New optional `type:` field in task frontmatter
- Type references a template (built-in or user-defined)
- Tasks without type pass validation with warning
- Agents propose new templates when no match exists

### 3. Dependency System
- New optional `blocked-by:` field in task frontmatter
- References tasks by ID: `blocked-by: [001-task-name]`
- Cross-change dependencies: `blocked-by: [other-change/001-task]`
- Advisory only - displayed as info, does not block task retrieval

### 4. Task Ordering Guidelines
- Recommended ordering: `components` → `business-logic` → `implementation`
- Express ordering via `blocked-by` dependencies
- Title format guidelines with emojis per type

### 5. New Command: `/splx:sync-tasks`
- Syncs tasks with external PM tools via MCPs (Linear, GitHub Issues, etc.)
- Creates remote issues, links relationships
- Updates frontmatter with external references

## Impact

- **Affected specs**:
  - `cli-get-task` - Display blocked-by info, type badges
  - `cli-validate` - Validate type matches template, warn on missing type
  - `cli-create` - Support type parameter for task creation
  - `docs-agent-instructions` - Document templates, ordering, blocked-by
  - `splx-slash-commands` - Add sync-tasks command, update plan-proposal

- **Affected code**:
  - `src/core/templates/` - New template discovery and loading
  - `src/utils/task-*.ts` - Parse type and blocked-by fields
  - `src/core/validation/` - Template-based type validation
  - `src/commands/get.ts` - Display dependency info
  - `.claude/commands/splx/` - Update slash commands

- **Breaking changes**: None - all new fields are optional, backward compatible
