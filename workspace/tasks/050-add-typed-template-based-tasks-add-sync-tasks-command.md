---
status: done
skill-level: senior
parent-type: change
parent-id: add-typed-template-based-tasks
type: implementation
blocked-by: [044-add-typed-template-based-tasks-update-task-frontmatter-parsing]
---

# Task: ⚙️ Add sync-tasks slash command for external PM integration

## End Goal

New `/splx:sync-tasks` command that syncs tasks with external project management tools via available MCPs.

## Currently

- No integration with external PM tools
- Tasks exist only in local workspace
- No way to sync with Linear, GitHub Issues, Jira, etc.

## Should

- New slash command `.claude/commands/splx/sync-tasks.md`
- Instructs agent to:
  1. Detect available PM tool MCPs (Linear, GitHub, Jira)
  2. Create remote issues for each task
  3. Link parent/child and blocked-by relationships
  4. Update task frontmatter with external references
- Support for bidirectional status sync

## Constraints

- [ ] Only use MCPs that are actually available
- [ ] Store external references in frontmatter: `tracked-issues:` array
- [ ] Do not fail if no MCPs available - inform user gracefully
- [ ] Each task maps to one external issue

## Acceptance Criteria

- [ ] Slash command file created in .claude/commands/splx/
- [ ] Command detects available PM tool MCPs
- [ ] Tasks created as external issues when MCPs available
- [ ] Relationships (blocked-by) linked in external tool
- [ ] Frontmatter updated with external issue references

## Implementation Checklist

- [x] Create slash command template for sync-tasks
- [x] Add sync-tasks to slash command registry/configurator
- [x] Define frontmatter format for tracked-issues
- [x] Document expected MCP interactions (Linear, GitHub, etc.)
- [x] Add to template manager output
- [x] Regenerate slash commands with `splx update`

## Notes

Frontmatter format for external tracking:
```yaml
tracked-issues:
  - tracker: linear
    id: PLX-123
    url: https://linear.app/team/issue/PLX-123
```

The command is guidance-based - the actual MCP calls are made by the AI agent based on available tools.
