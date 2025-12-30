## ADDED Requirements

### Requirement: Multi-Workspace Discovery
The command SHALL discover and aggregate items from all workspace directories found recursively from the current working directory.

#### Scenario: Discover workspaces in monorepo
- **WHEN** `plx list` is executed from a directory containing multiple projects with workspace/ directories
- **THEN** recursively scan for workspace/ directories up to 5 levels deep
- **AND** skip directories: node_modules, .git, dist, build, .next, __pycache__, venv, coverage, .cache
- **AND** include root-level workspace/ if present
- **AND** aggregate items from all discovered workspaces

#### Scenario: Single workspace backward compatibility
- **WHEN** only one workspace is discovered
- **THEN** display items without project name prefixes
- **AND** output format remains identical to current behavior

#### Scenario: Multiple workspaces display format
- **WHEN** multiple workspaces are discovered
- **THEN** prefix item names with project name (e.g., `project-a/add-feature`)
- **AND** sort items by project name, then by item name alphabetically

### Requirement: Workspace Filter Flag
The command SHALL support a `--workspace` flag to filter operations to a specific workspace.

#### Scenario: Filter to specific workspace
- **WHEN** `plx list --workspace project-a` is executed
- **THEN** only show items from the workspace in project-a/workspace/
- **AND** do not prefix items with project name

#### Scenario: Invalid workspace filter
- **WHEN** `--workspace nonexistent` is provided
- **AND** no workspace matches the filter
- **THEN** display error: "Workspace 'nonexistent' not found"
- **AND** list available workspaces
- **AND** exit with code 1

## MODIFIED Requirements

### Requirement: Sorting
The command SHALL maintain consistent ordering of changes for predictable output, with project name as primary sort key in multi-workspace mode.

#### Scenario: Ordering changes in multi-workspace mode
- **WHEN** displaying changes from multiple workspaces
- **THEN** sort by project name (root workspace first, then alphabetically)
- **AND** then sort by change name within each workspace

#### Scenario: Ordering changes in single-workspace mode
- **WHEN** displaying multiple changes from a single workspace
- **THEN** sort them in alphabetical order by change name
