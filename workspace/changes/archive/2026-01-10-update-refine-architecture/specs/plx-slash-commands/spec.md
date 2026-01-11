# plx-slash-commands Delta

## MODIFIED Requirements

### Requirement: Refine Architecture Command

The system SHALL provide a `plx/refine-architecture` slash command that produces spec-ready architecture documentation with complete component inventories.

#### Scenario: Generating refine-architecture command for Claude Code

- **WHEN** Claude Code is selected during initialization
- **THEN** create `.claude/commands/plx/refine-architecture.md`
- **AND** include frontmatter with name "Refine Architecture", description "Create or update ARCHITECTURE.md with spec-ready component inventories.", category "Pew Pew Plx", and relevant tags
- **AND** wrap the command body in PLX markers
- **AND** include guardrails requiring spec-ready reference, complete component inventories, user content preservation, and completeness validation
- **AND** include context retrieval section with codebase-retrieval tool instructions
- **AND** include steps for discovery, checking existence, creating/loading, populating inventories, mapping dependencies, validating completeness, and writing
- **AND** include template structure section defining required sections and component inventory categories

#### Scenario: Context retrieval instructs use of codebase tools

- **WHEN** the `plx/refine-architecture` command body is generated
- **THEN** include Context Retrieval section
- **AND** instruct use of `mcp__auggie-mcp__codebase-retrieval` or equivalent tools
- **AND** list component discovery queries for DTOs, services, APIs, views, view models, routing, enums
- **AND** list dependency mapping queries for service relationships and data flow
- **AND** list pattern detection queries for architecture patterns and state management

#### Scenario: Template structure defines component inventory categories

- **WHEN** the `plx/refine-architecture` command body is generated
- **THEN** include Template Structure section
- **AND** reference `workspace/templates/ARCHITECTURE.template.md` as canonical template
- **AND** list required sections: Technology Stack, Project Structure, Component Inventory, Architecture Patterns, Data Flow, Dependency Graph, Configuration, Testing Structure
- **AND** list component inventory categories with universal terms: DTOs/Models/Records/Entities, Services/Providers/Managers, APIs/Repositories/Controllers/Data Sources, Views/Pages/Screens, View Models/Hooks/Blocs/Cubits/Notifiers, Widgets/Components, Enums/Constants/Config, Utils/Helpers/Extensions, Routing/Navigation, Schemas/Validators
