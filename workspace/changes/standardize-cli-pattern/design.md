## Context

The PLX CLI has grown organically with inconsistent command patterns:
- `plx list` vs `plx change list` vs `plx get tasks`
- `plx show <item>` vs `plx change show <item>` vs `plx get change --id <item>`
- Entity-specific flags (`--change-id`, `--spec-id`) vs generic flags (`--id`, `--parent-id`)

This change establishes a consistent `plx {verb} {entity}` pattern with clear singular/plural semantics as the foundation for future CLI extensions.

## Goals / Non-Goals

**Goals:**
- Establish consistent `plx {verb} {entity}` command pattern
- Use singular for specific item retrieval, plural for listing
- Unify filtering with `--id`, `--parent-id`, `--parent-type`
- Deprecate redundant commands with clear migration path
- Maintain backward compatibility during transition

**Non-Goals:**
- Add new entity types (out of scope)
- Implement centralized task storage (separate proposal)
- Add `plx create` command (separate proposal)
- Extend `plx paste` command (separate proposal)
- Extend `plx complete`/`plx undo` (separate proposal)

## Decisions

### Decision 1: Singular/Plural Entity Pattern

Commands use singular entity names for specific item operations and plural for listing/bulk operations.

| Command | Purpose |
|---------|---------|
| `plx get task --id <id>` | Get specific task |
| `plx get tasks` | List all tasks |
| `plx get change --id <id>` | Get specific change |
| `plx get changes` | List all changes |
| `plx validate change --id <id>` | Validate specific change |
| `plx validate changes` | Validate all changes |

**Rationale:** This pattern is intuitive and mirrors common CLI conventions (e.g., `kubectl get pod` vs `kubectl get pods`).

### Decision 2: Generic Flag Names

Replace entity-specific flags with generic names:
- `--id <id>` for identifying the target entity
- `--parent-id <id>` for filtering by parent relationship
- `--parent-type <type>` for disambiguating parent type (optional)

**Before:**
```bash
plx review --change-id add-feature
plx parse feedback "name" --change-id add-feature
```

**After:**
```bash
plx review change --id add-feature
plx parse feedback "name" --parent-id add-feature --parent-type change
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
Warning: 'plx list' is deprecated. Use 'plx get changes' instead.
```

Commands deprecated in this change:
- `plx list` → `plx get changes`, `plx get specs`, `plx get reviews`
- `plx show` → `plx get change --id`, `plx get spec --id`
- `plx change` parent → subcommands under `plx get`/`plx validate`
- `plx spec` parent → subcommands under `plx get`/`plx validate`
- `--change-id`, `--spec-id`, `--task-id` flags → `--id`, `--parent-id`

**Rationale:** Soft deprecation allows users to migrate gradually while providing clear guidance.

### Decision 5: Show Options Migration

The `plx show` command has entity-specific options that migrate to `plx get`:

| Old Command | New Command |
|-------------|-------------|
| `plx show <change> --deltas-only` | `plx get change --id <change> --deltas-only` |
| `plx show <spec> --requirements` | `plx get spec --id <spec> --requirements` |
| `plx show <spec> --no-scenarios` | `plx get spec --id <spec> --no-scenarios` |
| `plx show <spec> -r <req-id>` | `plx get spec --id <spec> -r <req-id>` |

**Rationale:** These filtering options are useful and should be preserved under the new command structure.

### Decision 6: Archive Entity Pattern

The archive command uses the same pattern:

| Old Command | New Command |
|-------------|-------------|
| `plx archive <change-name>` | `plx archive change --id <change-name>` |
| `plx archive <review-name> --type review` | `plx archive review --id <review-name>` |

**Rationale:** Explicit entity type removes ambiguity and aligns with the overall pattern.

### Decision 7: Review Command Entity Pattern

The review command becomes entity-based:

| Old Command | New Command |
|-------------|-------------|
| `plx review --change-id <id>` | `plx review change --id <id>` |
| `plx review --spec-id <id>` | `plx review spec --id <id>` |
| `plx review --task-id <id>` | `plx review task --id <id>` |

**Rationale:** Aligns with the verb-entity pattern used throughout the CLI.

### Decision 8: Parse Feedback Entity Pattern

The parse feedback command uses parent flags:

| Old Command | New Command |
|-------------|-------------|
| `plx parse feedback "name" --change-id <id>` | `plx parse feedback "name" --parent-id <id> --parent-type change` |
| `plx parse feedback "name" --spec-id <id>` | `plx parse feedback "name" --parent-id <id> --parent-type spec` |

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
