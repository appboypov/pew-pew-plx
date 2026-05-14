# Request: Add Typed Template-Based Tasks

## Source Input

> "I want to change the way we create tasks for proposals - the tasks should be types and templates that you see of your own in your context. We must also integrate some dependency system so that you know which tasks must go first and which tasks can be picked up independently. Then also the task creation process must be updated to make tasks fully independent where each task should be single commit worth with clear testable scoped output. The test and review task types must go - instead it should be the types that are relevant to the tasks and based on the templates we have - the types should also become a type in the system like story, bug, components, business-logic, etc - however these templates should be configurable and be placed inside workspace/templates at default and allow the user to create them themselves. System should work so fluently that when a user creates a new template with a frontmatter type: something-that-doesnt-exist - it will still be active immediately in the system - so the templates are also a dynamic source for planning etc."

## Current Understanding

The user wants to overhaul the OpenSplx task system with these key changes:

1. **Template-Based Task Types**: Replace the current generic task structure with typed tasks based on templates (story, bug, components, business-logic, research, discovery, chore)

2. **Dynamic Template System**: Templates stored in `workspace/templates/` that are dynamically discovered - any `.md` file with a `type:` frontmatter becomes a valid task type immediately

3. **Task Dependencies**: Add a dependency system where tasks can declare which other tasks must complete first, enabling proper sequencing

4. **Single-Commit Scope**: Each task should be atomic - one commit's worth of work with clear, testable output

5. **Remove Test/Review Task Types**: These become integrated into the workflow rather than being separate task types

6. **User-Configurable Templates**: Users can create custom templates that are immediately recognized by the system

## Identified Ambiguities

1. **Template Location**: Should templates live in `workspace/templates/` or in a separate `templates/` directory at project root?

2. **Template Discovery**: How should templates be discovered - by filename pattern, frontmatter field, or both?

3. **Dependency Syntax**: How should task dependencies be expressed - task IDs, task names, or both?

4. **Dependency Enforcement**: Should dependencies be enforced (block work) or advisory (warn but allow)?

5. **Parallel Task Identification**: How does the system know which tasks can run in parallel vs sequentially?

6. **Review/Test Workflow**: If test and review task types are removed, how is quality assurance tracked?

7. **Default Templates**: Should OpenSplx ship with default templates that users can override?

8. **Template Inheritance**: Can templates extend/inherit from other templates?

9. **Cross-Change Dependencies**: Can tasks depend on tasks from other changes?

10. **Migration Path**: What happens to existing tasks that don't match any template?

## Decisions

1. **Template Location**: `workspace/templates/` - follows existing PLX conventions, keeps templates alongside other workspace artifacts

2. **Type Source**: Frontmatter-based - type must be declared in frontmatter `type: story`. More explicit, allows any filename.

3. **Dependency Enforcement**: Advisory only - dependencies shown as warnings/info but tasks can still be picked up. User/agent decides execution order.

4. **Dependency Format**: Task ID (filename-based) - use existing task filename/ID: `depends-on: [001-add-feature-implement]`. Consistent with current system.

5. **QA Approach**: Separate QA workflow - testing/review remains a separate workflow step via `/splx/review`, `/splx/test` commands that apply to any task. Templates don't need embedded QA sections.

6. **Default Templates**: Ship defaults - OpenSplx provides built-in templates that users can override by creating same-type templates in workspace/templates/. User templates take precedence.

7. **Cross-Change Dependencies**: Allowed - tasks can depend on tasks from other changes using full path notation: `depends-on: [other-change/001-task]`. Same-change tasks use just the task ID.

8. **Scope Validation**: Trust the author - no automated scope checking. Task authors are responsible for ensuring single-commit scope.

9. **Unknown Types**: Require matching template - tasks must use a type that matches an existing template (built-in or user-defined). Unknown types fail validation. This ensures dynamic templates work: create template → type becomes valid immediately.

10. **Migration/Backward Compatibility**: Tasks without `type:` field are valid. Validation passes with a warning that type could not be found. 'unknown' is not a real type - it's just the term indicating no type was specified or template wasn't found. No migration required.

11. **Templating System**: NO variable substitution. Templates are reference documents that AI agents read when creating proposals/tasks. The agent decides which template type fits the work being planned. Templates are guidance, not scaffolds with placeholders.

12. **AI Workflow**: Read all upfront - agent reads all templates from workspace/templates/ at the start of planning to understand all available types and their structure before creating tasks.

13. **Template Metadata**: Minimal - just `type:` in frontmatter. Any additional guidance (when to use, descriptions) lives in the template body itself. No extra metadata fields required.

14. **Task Frontmatter**: Keep existing fields unchanged (`status`, `skill-level`, `parent-type`, `parent-id`). Add new optional fields: `type` and `blocked-by`.

15. **Dependency Field Name**: Use `blocked-by` instead of `depends-on`. Clearer semantics - indicates which tasks block this one.

16. **Dynamic Template Creation**: When no existing template matches a task being created, the agent proposes a new template that fits the style of existing templates. This allows users to build new types dynamically during proposal creation. The new template is created in workspace/templates/ and becomes immediately available.

17. **Default Templates**: Ship 13 built-in templates:
    - `story` - User-facing features with journeys, UI, data flow
    - `bug` - Bug fixes with TDD regression tests
    - `business-logic` - ViewModels, Services, APIs, DTOs, Enums, Constants (unit tests, no UI)
    - `components` - UI components/widgets and views
    - `research` - Package evaluation, API docs, best practices
    - `discovery` - Ideas, problem exploration, business value
    - `chore` - Maintenance, cleanup tasks
    - `refactor` - Code restructuring without behavior change (NEW)
    - `infrastructure` - CI/CD, deployment, hosting, DevOps (NEW)
    - `documentation` - READMEs, architecture docs, API docs (NEW)
    - `release` - Version bumping, changelog, release process (NEW)
    - `implementation` - Putting components + business logic together, integration (NEW)

18. **Recommended Task Ordering**: When building features, agents should create tasks in this order:
    1. `components` tasks first - Build UI components in isolation (stateless, primitive params)
    2. `business-logic` tasks second - Services, ViewModels, APIs with unit tests (no UI yet)
    3. `implementation` tasks last - Wire components to business logic, integration work

    This ordering ensures testable, isolated pieces before integration. Use `blocked-by` to express these dependencies.

19. **Title Formats**: Each task type has a recommended title format:
    - 🐞 `bug` - State the failure: "<Thing> fails when <condition>"
    - ✨ `story` - Outcome-based: "<Actor> is able to <capability>"
    - 🌱 `enhancement` - What improves: "Improve <thing> to <better outcome>"
    - 🧱 `refactor` - Technical intent: "Refactor <component> to <goal>"
    - 🔬 `research` - Question to answer: "Investigate <unknown>"
    - 🧾 `chore` - Concrete action: "<Verb> <thing>"
    - 🧩 `components` - What's built: "<Feature> UI components"
    - ⚙️ `business-logic` - What logic: "<Feature> business logic"
    - 🔧 `implementation` - What's wired: "Wire <feature> components to business logic"
    - 📄 `documentation` - What's documented: "Document <thing>"
    - 🚀 `release` - Version: "Prepare release v<version>"
    - 🏗️ `infrastructure` - What's set up: "Set up <infrastructure>"

20. **New Command: `sync-tasks`**: A slash command that syncs tasks with external project management tools:
    - Detects available tools/MCPs (Linear, GitHub Issues, Jira, etc.)
    - Creates remote issues for each task
    - Links issues together (parent/child, blocked-by relationships)
    - Updates task frontmatter with external issue references (tracker, id, url)
    - Bidirectional: can pull status updates from remote
    - Separate command to implement after core template system is complete

## Final Intent

Overhaul the OpenSplx task system to support typed, template-based tasks with advisory dependencies.

**Core Changes:**

1. **Template System**
   - Templates stored in `workspace/templates/` with `type:` frontmatter
   - 13 built-in default templates (story, bug, business-logic, components, research, discovery, chore, refactor, infrastructure, documentation, release, implementation)
   - User templates in workspace/templates/ override built-in defaults
   - AI agents read all templates upfront when planning to understand available types

2. **Recommended Task Ordering** (for feature work)
   - `components` first → UI components in isolation
   - `business-logic` second → Services/ViewModels with unit tests, no UI
   - `implementation` last → Wire everything together
   - Express ordering via `blocked-by` dependencies

3. **Task Type Field**
   - New optional `type:` field in task frontmatter
   - Tasks without type are valid (warning during validation)
   - Type must match an existing template (built-in or user-defined)
   - When no template matches, agent proposes a new template matching existing style

4. **Dependency System**
   - New optional `blocked-by:` field in task frontmatter
   - References tasks by ID: `blocked-by: [001-task-name]`
   - Cross-change dependencies: `blocked-by: [other-change/001-task]`
   - Advisory only - shown as info/warnings, does not block task retrieval

5. **Task Scope**
   - Each task should be single-commit scope with clear testable output
   - No automated scope validation - trust the author
   - Remove dedicated test/review task types - QA handled via separate workflow commands

6. **Backward Compatibility**
   - Existing task fields unchanged (status, skill-level, parent-type, parent-id)
   - Tasks without type remain valid with warning
   - No migration required

7. **Title Format Guidelines**
   - Each template type has a recommended emoji + title format
   - Agents use these when creating tasks for clarity and consistency
   - Examples: "🐞 Login fails when...", "🧩 Create Button component", "⚙️ Implement AuthService"

8. **New Command: `/splx:sync-tasks`**
   - Syncs tasks with external project management tools via available MCPs
   - Creates remote issues, links relationships, updates frontmatter with references
   - Implement after core template system is complete
