---
status: done
skill-level: medior
---

# Task: Implement parent resolution logic for parented tasks

## End Goal

The create task subcommand resolves `--parent-id` to the correct parent entity, handling ambiguous and non-existent cases appropriately.

## Currently

No parent resolution logic exists for the create command. Existing `ItemRetrievalService` provides some lookup capabilities.

## Should

- When `--parent-id` provided without `--parent-type`:
  1. Search changes, reviews, and specs for matching ID
  2. If exactly one match: use that parent
  3. If multiple matches: error with disambiguation guidance
  4. If no matches: error with not-found message
- When `--parent-type` explicitly provided: search only that entity type
- Integrate with existing discovery utilities where possible

## Constraints

- [ ] Reuse existing item discovery utilities (`getActiveChangeIds`, `getSpecIds`, etc.)
- [ ] Follow existing error handling patterns
- [ ] Support multi-workspace scenarios (search all workspaces)
- [ ] Do not modify existing services; create new utility if needed

## Acceptance Criteria

- [ ] Unambiguous parent ID resolves correctly
- [ ] Ambiguous parent ID returns error with list of conflicting types
- [ ] Non-existent parent ID returns clear error message
- [ ] Explicit `--parent-type` bypasses ambiguity search
- [ ] Resolution works across multi-workspace setups

## Implementation Checklist

- [x] 3.1 Create `resolveParentEntity` function accepting parentId and optional parentType
- [x] 3.2 Implement search across changes for matching ID
- [x] 3.3 Implement search across reviews for matching ID
- [x] 3.4 Implement search across specs for matching ID
- [x] 3.5 Implement collision detection and error messaging
- [x] 3.6 Integrate resolution into `createTask` method
- [x] 3.7 Handle multi-workspace prefixed IDs (e.g., `project-a/change-name`)

## Notes

- Review directory structure is `workspace/reviews/<name>/`
- Spec directory structure is `workspace/specs/<name>/`
- Change directory structure is `workspace/changes/<name>/`
- Multi-workspace IDs may include project prefix separated by `/`
