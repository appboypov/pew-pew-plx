---
description: Create or update ARCHITECTURE.md with spec-ready component inventories.
---

$ARGUMENTS

$ARGUMENTS
<!-- PLX:START -->
**Guardrails**
- Produce a spec-ready reference: senior architects and developers must be able to create detailed technical specs without opening the codebase.
- Include complete inventories of all architectural components (DTOs, services, APIs, etc.) with file paths.
- Preserve user-authored content outside PLX markers.
- Validate completeness: if a component type exists in the codebase but is missing from the document, the architecture is incomplete.

**Monorepo Awareness**
- Derive target package from the user's request context (mentioned package name, file paths, or current focus).
- If target package is unclear in a monorepo, clarify with user before proceeding.
- Create artifacts in the relevant package's workspace folder (e.g., `packages/foo/workspace/`), not the monorepo root.
- For root-level changes (not package-specific), use the root workspace.
- If multiple packages are affected, process each package separately.
- Follow each package's AGENTS.md instructions if present.

**Context Retrieval**
Use codebase context tools to discover all architectural components before writing. Required scans:

1. **Component Discovery** - Use Auggie MCP, Codebase Retrieval, or similar semantic search tools:
   - "List all DTOs, models, records, and entities with file paths"
   - "List all services, providers, and managers with file paths"
   - "List all APIs, repositories, controllers, and data sources with file paths"
   - "List all views, pages, and screens with file paths"
   - "List all view models, hooks, blocs, cubits, and notifiers with file paths"
   - "List all routing and navigation definitions"
   - "List all enums, constants, and configuration schemas"

2. **Dependency Mapping** - Query relationships:
   - "What services does each view model depend on?"
   - "What APIs does each service use?"
   - "What is the data flow from API to UI?"

3. **Pattern Detection** - Identify conventions:
   - "What architectural patterns are used (MVVM, Clean Architecture, etc.)?"
   - "What state management approach is used?"
   - "What dependency injection mechanism is used?"

Run these queries iteratively until no new components are discovered. Cross-reference results against file tree to verify completeness.

**Steps**
1. **Discover** - Run Context Retrieval queries to build complete component inventory.
2. **Check** - Determine if ARCHITECTURE.md exists at target location.
3. **Create or Load** - If missing: create from Template Structure below. If exists: read full content, identify gaps against discovered inventory.
4. **Populate Inventories** - For each component category: list all discovered items with file paths, group by feature/domain where applicable, include brief purpose description for each item.
5. **Map Dependencies** - Document service → API/repository relationships, view model → service relationships, data flow from external sources to UI.
6. **Validate Completeness** - Cross-reference inventory against file tree. Flag any component types with zero entries (likely missed). Re-run targeted queries for empty categories.
7. **Write** - Update ARCHITECTURE.md preserving user content outside PLX markers.

**Template Structure**
Reference `workspace/templates/ARCHITECTURE.template.md` for the canonical template structure. If it does not exist, use the project's existing ARCHITECTURE.md as reference, or create from these required sections:

**Required Sections:**
- Technology Stack (table format)
- Project Structure (annotated file tree)
- Component Inventory (one subsection per category below)
- Architecture Patterns
- Data Flow
- Dependency Graph
- Configuration
- Testing Structure

**Component Inventory Categories** (table format with Name, Path, Purpose + category-specific columns):
- DTOs / Models / Records / Entities
- Services / Providers / Managers (include Type, Dependencies)
- APIs / Repositories / Controllers / Data Sources
- Views / Pages / Screens (include Route, View Model)
- View Models / Hooks / Blocs / Cubits / Notifiers (include Services Used)
- Widgets / Components
- Enums / Constants / Config
- Utils / Helpers / Extensions
- Routing / Navigation (include Auth Required)
- Schemas / Validators (include Validates)

Omit empty categories only if that component type does not exist in the project.
<!-- PLX:END -->
