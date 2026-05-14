**Context**
@workspace/ARCHITECTURE.md
@workspace/AGENTS.md

**Guardrails**
- Detect available PM tool MCPs before attempting sync.
- If no PM MCPs available, inform user and exit gracefully.
- Create remote issues for each task in the change.
- Link parent relationships (task → change) when supported.
- Link blocked-by relationships between issues when supported.
- Update task frontmatter with external references after successful creation.
- Continue with other MCPs if one fails; report failures at end.

**Monorepo Awareness**
- Derive target package from the user's request context (mentioned package name, file paths, or current focus).
- If target package is unclear in a monorepo, clarify with user before proceeding.
- Create artifacts in the relevant package's workspace folder (e.g., `packages/foo/workspace/`), not the monorepo root.
- For root-level changes (not package-specific), use the root workspace.
- If multiple packages are affected, process each package separately.
- Follow each package's AGENTS.md instructions if present.

**MCP Detection**
Check for available project management MCPs:

1. **Linear MCP** - Check if Linear MCP tools are available:
   - Look for tools like `mcp__linear__create_issue`, `mcp__linear__list_issues`
   - If available, Linear sync is supported

2. **GitHub MCP** - Check if GitHub MCP tools are available:
   - Look for tools like `mcp__github__create_issue`, `mcp__github__list_issues`
   - If available, GitHub Issues sync is supported

3. **Jira MCP** - Check if Jira MCP tools are available:
   - Look for tools like `mcp__jira__create_issue`, `mcp__jira__list_issues`
   - If available, Jira sync is supported

If no PM MCPs are detected:
- Inform user: "No project management MCPs detected. Install Linear MCP, GitHub MCP, or Jira MCP to enable sync."
- Exit without making changes.

**Steps**
1. Parse `$ARGUMENTS` to extract change-id.
2. If no change-id provided, run `splx get changes` and ask user which change to sync.
3. Detect available PM tool MCPs using MCP Detection rules above.
4. If no MCPs available, inform user and exit.
5. Retrieve all tasks for the change:
   ```bash
   splx get tasks --parent-id <change-id> --parent-type change
   ```
6. For each available MCP, for each task:
   a. Create remote issue with:
      - Title: Task name (from task file heading)
      - Body: Task content (End Goal, Currently, Should, Constraints, Acceptance Criteria sections)
      - Labels: `splx`, task type if available
   b. If task has `blocked-by` field, create blocking relationships:
      - Look up previously created issues for blocked-by task IDs
      - Link blocking relationships using the MCP's relationship API
   c. Update task frontmatter with `tracked-issues` field:
      ```yaml
      tracked-issues:
        - tracker: linear
          id: PLX-123
          url: https://linear.app/team/issue/PLX-123
      ```
7. Report summary:
   - List successfully created issues per tracker
   - List any failures with error details
   - Show updated task files

**Reference**
- Use `splx get change --id <change-id>` for change context.
- Use `splx get tasks --parent-id <change-id> --parent-type change` to list all tasks.
- Use `splx get task --id <task-id>` for individual task details.

**Frontmatter Format for Tracked Issues**
```yaml
tracked-issues:
  - tracker: linear
    id: PLX-123
    url: https://linear.app/team/issue/PLX-123
  - tracker: github
    id: 456
    url: https://github.com/owner/repo/issues/456
```

**Supported Trackers**
| Tracker | MCP | Issue ID Format | URL Pattern |
|---------|-----|-----------------|-------------|
| linear | Linear MCP | Team prefix + number (e.g., PLX-123) | https://linear.app/{team}/issue/{id} |
| github | GitHub MCP | Number (e.g., 456) | https://github.com/{owner}/{repo}/issues/{id} |
| jira | Jira MCP | Project key + number (e.g., PROJ-123) | https://{domain}/browse/{id} |
