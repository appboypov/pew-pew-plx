## ADDED Requirements

### Requirement: Sync Tasks Command

The system SHALL provide a `/splx:sync-tasks` slash command that syncs local tasks with external project management tools.

#### Scenario: Generating sync-tasks command for Claude Code

- **WHEN** Claude Code is selected during initialization
- **THEN** create `.claude/commands/splx/sync-tasks.md`
- **AND** include frontmatter with name "OpenSplx: Sync Tasks", description "Sync tasks with external project management tools", category "OpenSplx"
- **AND** wrap the command body in PLX markers

#### Scenario: Sync-tasks detects available tools

- **WHEN** the sync-tasks command is executed
- **THEN** detect available MCP tools for project management (Linear, GitHub Issues, Jira)
- **AND** if no tools available, display message listing supported integrations
- **AND** if tools available, proceed with sync workflow

#### Scenario: Sync-tasks creates remote issues

- **WHEN** sync-tasks runs with available PM tool
- **THEN** for each task without external reference:
  - Create remote issue with task title and content
  - Link parent/child relationships (parent-id → parent issue)
  - Link blocked-by relationships where supported
  - Update task frontmatter with `tracked-issues:` reference

#### Scenario: Sync-tasks updates task frontmatter

- **WHEN** a remote issue is created for a task
- **THEN** add to task frontmatter:
```yaml
tracked-issues:
  - tracker: linear|github|jira
    id: <issue-id>
    url: <issue-url>
```
- **AND** preserve existing tracked-issues if present

#### Scenario: Sync-tasks bidirectional status sync

- **WHEN** sync-tasks runs with existing tracked issues
- **THEN** check remote issue status
- **AND** if remote is closed/done and local is not done, warn about mismatch
- **AND** if local is done and remote is open, offer to close remote

### Requirement: Plan Proposal Template Reading

The `/splx:plan-proposal` slash command SHALL instruct agents to read all templates before creating tasks.

#### Scenario: Plan-proposal reads templates

- **WHEN** the plan-proposal command is executed
- **THEN** include step to read all templates from `workspace/templates/`
- **AND** include step to identify which template types apply to the planned work
- **AND** include step to use template structure when creating task files

#### Scenario: Plan-proposal uses blocked-by

- **WHEN** plan-proposal creates multiple tasks
- **THEN** include step to add `blocked-by:` relationships based on task ordering
- **AND** specifically for feature work: components blocked by nothing, business-logic blocked by components, implementation blocked by business-logic

#### Scenario: Plan-proposal uses title formats

- **WHEN** plan-proposal creates tasks
- **THEN** use emoji-prefixed title format based on task type
- **AND** reference title format guidelines from templates

## MODIFIED Requirements

### Requirement: Get Task Command Updates

The `/splx:get-task` slash command SHALL display type and dependency information.

#### Scenario: Get-task shows type badge

- **WHEN** the get-task command retrieves a task
- **THEN** display task type with emoji prefix if type is set
- **AND** include type information in task context

#### Scenario: Get-task shows blockers

- **WHEN** the get-task command retrieves a task with blocked-by
- **THEN** display list of blocking tasks with their status
- **AND** if blockers are incomplete, show advisory message
- **AND** proceed with task (advisory only)
