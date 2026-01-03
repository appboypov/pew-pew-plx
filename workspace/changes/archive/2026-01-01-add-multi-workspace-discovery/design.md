## Context

Monorepo setups often contain multiple independent projects, each with their own `workspace/` directory. Currently, `plx` commands only discover the single workspace at `{cwd}/workspace/`, requiring users to navigate into each project directory to manage specs/changes.

**Stakeholders**: Users managing monorepos with multiple PLX-enabled projects.

## Goals / Non-Goals

### Goals
- Recursively discover all `workspace/` directories from the current working directory
- Aggregate items (changes, specs, reviews, tasks) across all discovered workspaces
- Display workspace context (project name prefix) when multiple workspaces exist
- Provide `--workspace` flag to filter operations to a specific workspace
- Maintain backward compatibility for single-workspace projects

### Non-Goals
- Workspace-to-workspace dependencies or cross-references
- Workspace configuration inheritance
- Workspace priority ordering beyond alphabetical

## Decisions

### Decision 1: Workspace Discovery Strategy
**What**: Recursive breadth-first scan for `workspace/` directories with depth limit.
**Why**: Simple, predictable, and performant for typical monorepo structures.
**Alternatives considered**:
- Configuration-based workspace list → Rejected: Adds maintenance burden
- Git submodule detection → Rejected: Not all monorepos use submodules

### Decision 2: Item ID Format
**What**: `{project-name}/{item-id}` format when multiple workspaces exist (e.g., `project-a/add-feature`).
**Why**: Clear provenance, unambiguous resolution, human-readable.
**Alternatives considered**:
- Path-based (`project-a/workspace/...`) → Rejected: Verbose, redundant
- Hash-based → Rejected: Not human-readable

### Decision 3: Root Workspace Handling
**What**: Root workspace (at cwd) appears first with empty project name in single-workspace mode, or with repo name in multi-workspace mode.
**Why**: Backward compatible for single workspace; clear distinction in multi-workspace.

### Decision 4: Skip Directories
**What**: Skip `node_modules`, `.git`, `dist`, `build`, `.next`, `__pycache__`, `venv`, `coverage`, `.cache`.
**Why**: Performance optimization; these directories never contain valid workspaces.

### Decision 5: Max Depth
**What**: Limit recursive scanning to 5 levels.
**Why**: Balance between deep monorepo support and performance; prevents runaway scanning.

## Data Structures

```typescript
interface DiscoveredWorkspace {
  path: string;           // Absolute path to workspace directory
  relativePath: string;   // Relative path from scan root
  projectName: string;    // Parent directory name (empty for root)
  isRoot: boolean;        // True if at scan root
}

interface ItemWithWorkspace {
  id: string;             // Original item ID
  workspacePath: string;  // Absolute path to workspace
  projectName: string;    // Project name for prefix
  displayId: string;      // id or projectName/id
}
```

## Risks / Trade-offs

### Risk: Performance degradation in large monorepos
**Mitigation**: Skip directories, depth limit, early termination on valid workspace detection.

### Risk: Ambiguous item resolution when same ID exists in multiple workspaces
**Mitigation**: Always use full `projectName/itemId` format in multi-workspace mode; search all workspaces when prefix not provided.

### Trade-off: Complexity vs. flexibility
**Choice**: Simple alphabetical sorting and depth-first discovery over complex priority/configuration systems.

## Migration Plan

No migration required. This is additive functionality:
1. Existing single-workspace projects continue to work unchanged
2. Multi-workspace behavior only activates when >1 workspace discovered
3. No configuration changes required

## Open Questions

None - all design questions resolved during planning phase.
