## Context

The PLX CLI has grown organically with inconsistent command patterns:
- `splx list` vs `splx change list` vs `splx get tasks`
- `splx show <item>` vs `splx change show <item>` vs `splx get change --id <item>`
- Entity-specific flags (`--change-id`, `--spec-id`) vs generic flags (`--id`, `--parent-id`)

This change establishes a consistent `splx {verb} {entity}` pattern with clear singular/plural semantics as the foundation for future CLI extensions.

## Goals / Non-Goals

**Goals:**
- Establish consistent `splx {verb} {entity}` command pattern
- Use singular for specific item retrieval, plural for listing
- Unify filtering with `--id`, `--parent-id`, `--parent-type`
- Deprecate redundant commands with clear migration path
- Maintain backward compatibility during transition

**Non-Goals:**
- Add new entity types (out of scope)
- Implement centralized task storage (separate proposal)
- Add `splx create` command (separate proposal)
- Extend `splx paste` command (separate proposal)
- Extend `splx complete`/`splx undo` (separate proposal)

## Decisions

### Decision 1: Singular/Plural Entity Pattern

Commands use singular entity names for specific item operations and plural for listing/bulk operations.

| Command | Purpose |
|---------|---------|
| `splx get task --id <id>` | Get specific task |
| `splx get tasks` | List all tasks |
| `splx get change --id <id>` | Get specific change |
| `splx get changes` | List all changes |
| `splx validate change --id <id>` | Validate specific change |
| `splx validate changes` | Validate all changes |

**Rationale:** This pattern is intuitive and mirrors common CLI conventions (e.g., `kubectl get pod` vs `kubectl get pods`).

### Decision 2: Generic Flag Names

Replace entity-specific flags with generic names:
- `--id <id>` for identifying the target entity
- `--parent-id <id>` for filtering by parent relationship
- `--parent-type <type>` for disambiguating parent type (optional)

**Before:**
```bash
splx review --change-id add-feature
splx parse feedback "name" --change-id add-feature
```

**After:**
```bash
splx review change --id add-feature
splx parse feedback "name" --parent-id add-feature --parent-type change
```

**Rationale:** Generic flags reduce API surface area and make commands more composable. The entity type is determined from the positional argument.

### Decision 3: Parent Type Resolution

When `--parent-id` is provided without `--parent-type`:
1. Search all parent types (change, review, spec)
2. If exactly one match, use it
3. If multiple matches, error with suggestion to use `--parent-type`
4. If no matches, error with "not found" message

**Rationale:** Provides convenience for unambiguous cases while preventing silent incorrect behavior.

### Decision 4: Deprecation Strategy

Deprecated commands continue to work but emit warnings:

```
Warning: 'splx list' is deprecated. Use 'splx get changes' instead.
```

Commands deprecated in this change:
- `splx list` → `splx get changes`, `splx get specs`, `splx get reviews`
- `splx show` → `splx get change --id`, `splx get spec --id`
- `splx change` parent → subcommands under `splx get`/`splx validate`
- `splx spec` parent → subcommands under `splx get`/`splx validate`
- `--change-id`, `--spec-id`, `--task-id` flags → `--id`, `--parent-id`

**Rationale:** Soft deprecation allows users to migrate gradually while providing clear guidance.

### Decision 5: Show Options Migration

The `splx show` command has entity-specific options that migrate to `splx get`:

| Old Command | New Command |
|-------------|-------------|
| `splx show <change> --deltas-only` | `splx get change --id <change> --deltas-only` |
| `splx show <spec> --requirements` | `splx get spec --id <spec> --requirements` |
| `splx show <spec> --no-scenarios` | `splx get spec --id <spec> --no-scenarios` |
| `splx show <spec> -r <req-id>` | `splx get spec --id <spec> -r <req-id>` |

**Rationale:** These filtering options are useful and should be preserved under the new command structure.

### Decision 6: Archive Entity Pattern

The archive command uses the same pattern:

| Old Command | New Command |
|-------------|-------------|
| `splx archive <change-name>` | `splx archive change --id <change-name>` |
| `splx archive <review-name> --type review` | `splx archive review --id <review-name>` |

**Rationale:** Explicit entity type removes ambiguity and aligns with the overall pattern.

### Decision 7: Review Command Entity Pattern

The review command becomes entity-based:

| Old Command | New Command |
|-------------|-------------|
| `splx review --change-id <id>` | `splx review change --id <id>` |
| `splx review --spec-id <id>` | `splx review spec --id <id>` |
| `splx review --task-id <id>` | `splx review task --id <id>` |

**Rationale:** Aligns with the verb-entity pattern used throughout the CLI.

### Decision 8: Parse Feedback Entity Pattern

The parse feedback command uses parent flags:

| Old Command | New Command |
|-------------|-------------|
| `splx parse feedback "name" --change-id <id>` | `splx parse feedback "name" --parent-id <id> --parent-type change` |
| `splx parse feedback "name" --spec-id <id>` | `splx parse feedback "name" --parent-id <id> --parent-type spec` |

**Rationale:** Generic parent flags allow flexibility for future parent types.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Users confused by deprecation warnings | Clear migration path in warnings, documentation updates |
| Breaking scripts using deprecated commands | Commands continue to work during deprecation period |
| Increased command complexity | Consistent pattern reduces overall cognitive load |
| `--parent-type` required for ambiguous cases | Error message includes suggestion to add flag |

## Migration Plan

1. **Phase 1 (This Change):** Add new command patterns, deprecate old commands with warnings
2. **Phase 2 (Future):** Update all documentation to use new patterns exclusively
3. **Phase 3 (Future Major Version):** Remove deprecated commands

## Open Questions

None - all design decisions are finalized.
