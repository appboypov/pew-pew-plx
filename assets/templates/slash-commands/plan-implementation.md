**Context**
workspace/AGENTS.md

**Guardrails**
- Output task blocks to chat for immediate copy to external agents.
- Verify each agent's work against scope, TracelessChanges, conventions, and acceptance criteria.
- Enforce TracelessChanges:
  - No comments referencing removed code.
  - No "we don't do X" statements about removed features.
  - No clarifications about previous states or deprecated behavior.
- Verify scope adherence: confirm no unnecessary additions.
- Verify project convention alignment before accepting work.

**Monorepo Awareness**
- Derive target package from the user's request context (mentioned package name, file paths, or current focus).
- If target package is unclear in a monorepo, clarify with user before proceeding.
- Create artifacts in the relevant package's workspace folder (e.g., `packages/foo/workspace/`), not the monorepo root.
- For root-level changes (not package-specific), use the root workspace.
- If multiple packages are affected, process each package separately.
- Follow each package's AGENTS.md instructions if present.

**Steps**
1. Parse `$ARGUMENTS` to extract change-id.
2. Retrieve the change and its tasks:
   ```bash
   splx get change --id <change-id>
   splx get tasks --parent-id <change-id> --parent-type change
   ```
3. Identify the first non-completed task (to-do or in-progress).
4. Output the first task block to chat. Format:
   ```markdown
   ## Task: <task-name>

   **Task ID:** <task-id>
   **Status:** <status>

   ### Context
   <proposal Why and What Changes sections>

   ### Task Details
   <full task content without frontmatter>

   ### Instructions
   Implement this task according to the specifications above.
   Focus on the Constraints and Acceptance Criteria sections.
   When complete, mark the task as done:
   \`\`\`bash
   splx complete task --id <task-id>
   \`\`\`
   ```
5. Wait for external agent to complete the task and return with results.
6. Review agent's work using verification checklist:
   - [ ] Scope adherence: only requested changes, no extras
   - [ ] TracelessChanges: no artifacts of prior implementation
   - [ ] Convention alignment: follows project patterns
   - [ ] Tests: all tests pass
   - [ ] Acceptance criteria: all items verified
7. If issues found, generate feedback block and output to chat:
   ```markdown
   ## Feedback for Task: <task-name>

   **Task ID:** <task-id>

   ### Issues Found
   1. <specific issue with location and expected fix>
   2. <next issue>

   ### Context Reminder
   <re-include relevant task context>

   ### Instructions
   Address the issues above. When complete, return with updated results.
   ```
8. If all checks pass:
   - Mark task complete: `splx complete task --id <task-id>`
   - If more tasks remain, retrieve next task and output task block (return to step 3)
9. When all tasks are complete:
   - Run final validation: `splx validate change --id <change-id> --strict`
   - Report completion summary with all tasks marked done.

**Reference**
- Use `splx get change --id <change-id>` for proposal context.
- Use `splx get tasks --parent-id <change-id> --parent-type change` to see all tasks.
- Use `splx get task` to get the next prioritized task.
