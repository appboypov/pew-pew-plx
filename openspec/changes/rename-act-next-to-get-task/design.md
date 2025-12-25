## Context

The `act next` command retrieves the next prioritized task from active changes. Two issues exist:
1. Naming is unclear - "act" suggests performing an action, not retrieving data
2. The `--did-complete-previous` flag only updates the task file status, not the implementation checkboxes

## Goals / Non-Goals

- Goals:
  - Rename command to `get task` for clarity
  - Auto-complete implementation checkboxes when task is marked done
  - Provide feedback showing what was completed

- Non-Goals:
  - Backwards compatibility alias (clean break)
  - Modifying checkboxes in Constraints or Acceptance Criteria sections

## Decisions

### Command Structure: Subcommand under `get`

- Decision: `plx get task` as subcommand of `get` parent command
- Rationale: Allows future `get <x>` commands (e.g., `get change`, `get spec`)
- Alternative considered: Standalone `plx task` - rejected to preserve extensibility

### Checkbox Completion Logic

- Decision: Reuse section detection pattern from `task-progress.ts`
- Rationale: Consistent behavior - same sections excluded from progress counting are excluded from auto-completion
- Pattern: Mark `[ ]` as `[x]` only within `## Implementation Checklist`, skip `## Constraints` and `## Acceptance Criteria`

### Output Format

- Decision: Show completed task name + list of checkbox items marked complete
- Rationale: User requested visibility into what was completed for verification
- Format (text):
  ```
  ✓ Completed task: <name>
    Marked complete:
      • <item 1>
      • <item 2>
  ```
- Format (JSON): `completedTask: { name: string, completedItems: string[] }`

### New Functions

- `completeImplementationChecklist(content: string): CheckboxCompletionResult` - pure function for checkbox completion
- `completeTaskFully(filePath: string): Promise<string[]>` - combines checkbox completion + status update

## Risks / Trade-offs

- Breaking change for existing scripts using `act next` → Documented in CHANGELOG, users must update
- Checkbox completion is irreversible → Acceptable since this only runs when user explicitly completes a task

## Migration Plan

1. Rename files and update all references in single PR
2. Update CHANGELOG with breaking change notice
3. No deprecation period - clean break

## Open Questions

None - all decisions finalized.
