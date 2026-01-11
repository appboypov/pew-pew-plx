---
description: "Generate PROGRESS.md and orchestrate multi-agent task handoff."
argument-hint: (optional context)
---
<!-- PLX:START -->
**Context**
@ARCHITECTURE.md
@workspace/AGENTS.md

**Guardrails**
- Generate PROGRESS.md before outputting task blocks.
- Output task blocks to chat for immediate copy to external agents.
- Do NOT reference PROGRESS.md in task blocks—agents must work without knowledge of it.
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
2. Generate progress file:
   ```bash
   plx create progress --change-id <change-id>
   ```
3. Read the generated PROGRESS.md and identify the first non-completed task.
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
   plx complete task --id <task-id>
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
   - Mark task complete: `plx complete task --id <task-id>`
   - Regenerate progress: `plx create progress --change-id <change-id>`
   - If more tasks remain, output next task block (return to step 4)
9. When all tasks are complete:
   - Run final validation: `plx validate change --id <change-id> --strict`
   - Report completion summary with all tasks marked done.

**Reference**
- Use `plx get change --id <change-id>` for proposal context.
- Use `plx get tasks --parent-id <change-id> --parent-type change` to see all tasks.
- Use `plx create progress --change-id <id>` to regenerate progress file.
<!-- PLX:END -->
