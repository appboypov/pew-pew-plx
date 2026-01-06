## Context

The `plx create` command introduces a unified entity creation interface. The command must support:
- Standalone tasks (no parent)
- Parented tasks (linked to change, review, or spec)
- Change proposal scaffolding
- Spec scaffolding
- Request file creation

This change depends on `standardize-cli-pattern` which establishes the `--parent-id` and `--parent-type` flag patterns. The create command uses these patterns for parented task creation.

## Goals / Non-Goals

**Goals:**
- Provide single entry point for entity creation
- Support positional content argument for titles/descriptions
- Generate consistent scaffolding via templates
- Handle parent linking with `--parent-id` and `--parent-type`

**Non-Goals:**
- Centralized task storage (separate proposal)
- Clipboard-based creation (`plx paste` - separate proposal)
- Migration of existing entities
- Task numbering logic (uses existing utilities where available)

## Decisions

### Decision 1: Command Structure
Use subcommand pattern: `plx create {entity} "content"` rather than flags for entity type.

**Rationale:** Matches existing PLX patterns (`plx get task`, `plx complete task`). More readable and discoverable than `plx create --type task --content "Title"`.

### Decision 2: Positional Content Argument
Content/title is a required positional argument after the entity type.

**Rationale:** Natural language pattern: "create task 'Fix bug'" reads better than "create task --title 'Fix bug'". Commander.js supports this pattern well.

### Decision 3: Template System
Create dedicated template files for each entity type returning structured content.

**Rationale:**
- Separates content generation from command logic
- Enables reuse by `plx paste` command (future)
- Follows existing template patterns (`architecture-template.ts`, `review-template.ts`)

### Decision 4: Parent Resolution
When `--parent-id` is provided without `--parent-type`:
1. Search all parent types (change, review, spec) for matching ID
2. If exactly one match found, use it
3. If multiple matches found, error and require `--parent-type`
4. If no matches found, error with suggestions

**Rationale:** Reduces friction for common case (unique IDs) while handling edge cases safely.

### Decision 5: Change and Spec Scaffolding
`plx create change` and `plx create spec` scaffold directory structures, not just files.

- Change: `workspace/changes/{id}/proposal.md`, `workspace/changes/{id}/tasks/`, `workspace/changes/{id}/specs/`
- Spec: `workspace/specs/{id}/spec.md`

**Rationale:** Creates fully valid entities ready for editing. Follows existing directory conventions.

### Decision 6: Request Location
`plx create request` creates file at `workspace/changes/{id}/request.md` where `{id}` is derived from slugified description.

**Rationale:** Matches `plx/plan-request` command output location. Request is pre-proposal artifact tied to future change.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Parent resolution ambiguity | Explicit `--parent-type` flag; clear error messages |
| Template maintenance burden | Keep templates minimal; reuse existing patterns |
| Duplicate entity names | Validate unique names; append numeric suffix if needed |

## Migration Plan

No migration required. New command adds capability without breaking existing workflows.

## Open Questions

None remaining. All design decisions captured above.
