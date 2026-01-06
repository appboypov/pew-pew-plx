# Change: Extend Paste Command

## Why

The `plx paste` command currently only supports `plx paste request` for capturing clipboard content. Extending it to support all entity types (task, change, spec) provides parity with the planned `plx create` command but for clipboard-based workflows. Users with content in their clipboard (e.g., from issue trackers, documentation, or notes) can quickly scaffold entities without manual transcription.

## What Changes

**New Subcommands**
- `plx paste task` - Create task from clipboard content
- `plx paste task --parent-id <id>` - Create parented task from clipboard content
- `plx paste change` - Create change from clipboard content
- `plx paste spec` - Create spec from clipboard content
- `plx paste request` - (existing, unchanged)

**Shared Template System**
- Reuse entity templates from `plx create` command for consistent scaffolding
- Task template includes frontmatter with `status: to-do` and optional `parent-type`/`parent-id`
- Change template includes `proposal.md` structure with `## Why`, `## What Changes`, `## Impact`
- Spec template includes `spec.md` structure with requirements and scenarios

**Clipboard Content Handling**
- Clipboard content becomes the body/description of the created entity
- For tasks: content populates `## End Goal` section
- For changes: content populates `## Why` section
- For specs: content populates first requirement description

**Output Behavior**
- Success message with created file path and character count
- JSON output mode (`--json`) returns `{ path, characters, success, entityType }`
- Error handling for empty clipboard, missing workspace, and invalid parent-id

## Impact

- Affected specs: `cli-paste` (new spec or ADDED requirements in existing)
- Affected code: `src/commands/paste.ts`, template utilities
- Dependencies: `add-create-command` proposal (shares templates)
