---
name: Copy Next Task
description: Copy next task or feedback block to clipboard for external agent handoff.
category: OpenSplx
tags: [splx, orchestrate, workflow]
---
<!-- PLX:START -->
**Guardrails**
- Output format must match task block or feedback block structure exactly.
- Do NOT modify task content—copy verbatim from source.
- The copied block is self-contained for a fresh sub-agent with no prior context.
- Copy to clipboard using appropriate system command (pbcopy on macOS, xclip on Linux, clip on Windows).

**Monorepo Awareness**
- Derive target package from the user's request context (mentioned package name, file paths, or current focus).
- If target package is unclear in a monorepo, clarify with user before proceeding.
- Create artifacts in the relevant package's workspace folder (e.g., `packages/foo/workspace/`), not the monorepo root.
- For root-level changes (not package-specific), use the root workspace.
- If multiple packages are affected, process each package separately.
- Follow each package's AGENTS.md instructions if present.

**Context Detection**
Determine which scenario applies:

1. **Plan-implementation workflow active**: Check if conversation contains task blocks or feedback blocks.
   - If pending feedback: copy the most recent feedback block.
   - If no feedback: get the next uncompleted task via `splx get task`.

2. **New conversation (no context)**: Run `splx get task` to retrieve the highest-priority task.
   - Generate a task block from the task content.

3. **Existing conversation with context**: Analyze conversation history.
   - If a task was just reviewed with issues: generate a feedback block.
   - If a task was completed: get next task via `splx get task --did-complete-previous`.
   - If unclear: ask user what to copy.

**Steps**
1. Detect context using Context Detection rules above.
2. Based on context, determine what to copy:

   **If feedback is pending (issues found in review):**
   Generate feedback block:
   ```markdown
   ## Feedback for Task: <task-name>

   **Task ID:** <task-id>

   ### Issues Found
   1. <specific issue with location and expected fix>
   2. <next issue>

   ### Context Reminder
   <re-include relevant task context from proposal>

   ### Instructions
   Address the issues above. When complete, return with updated results.
   ```

   **If copying next task (no pending feedback):**
   a. Get task content via `splx get task` (or `splx get task --did-complete-previous` if previous completed)
   b. Generate task block:
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

3. Copy the generated block to clipboard:
   - macOS: `echo "<block>" | pbcopy`
   - Linux: `echo "<block>" | xclip -selection clipboard`
   - Windows: `echo "<block>" | clip`

4. Confirm to user what was copied and the task/feedback ID.

**Reference**
- Use `splx get task` to retrieve highest-priority task when no context exists.
- Use `splx get task --did-complete-previous` after completing a task.
- Use `splx get change --id <change-id>` to get proposal context.
- Use `splx get task` to retrieve the next task.
<!-- PLX:END -->
