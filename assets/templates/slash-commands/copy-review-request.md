**Guardrails**
- Output format must match review request block structure exactly.
- Include full workspace/REVIEW.md content in the request block.
- The request is self-contained for a fresh sub-agent with no prior context.
- Copy to clipboard using appropriate system command (pbcopy on macOS, xclip on Linux, clip on Windows).

**Monorepo Awareness**
- Derive target package from the user's request context (mentioned package name, file paths, or current focus).
- If target package is unclear in a monorepo, clarify with user before proceeding.
- Create artifacts in the relevant package's workspace folder (e.g., `packages/foo/workspace/`), not the monorepo root.
- For root-level changes (not package-specific), use the root workspace.
- If multiple packages are affected, process each package separately.
- Follow each package's AGENTS.md instructions if present.

**Context Detection**
Determine review scope from:
1. **Task context**: If current conversation has an active task, review that task's implementation.
2. **Change context**: If a change-id is provided or can be derived, review all tasks in that change.
3. **New conversation**: Ask user what to review or run `splx get task` to get current task.

**Steps**
1. Detect context using Context Detection rules above.
2. Gather review materials:
   - Run `splx review change --id <change-id>` or `splx review task --id <task-id>`
   - Read @workspace/REVIEW.md for guidelines and checklist
3. Generate review request block:
   ```markdown
   ## Review Request: <task-name or change-name>

   **Scope:** <task|change>
   **ID:** <id>

   ### Review Guidelines
   <full workspace/REVIEW.md content>

   ### Context
   <proposal Why and What Changes sections>

   ### Implementation Details
   <task details or change summary>

   ### Instructions
   Review the implementation against the guidelines above.
   Add feedback markers in code: `// #FEEDBACK #TODO | {feedback}`
   When complete, summarize findings and list any blocking issues.
   ```
4. Copy to clipboard:
   - macOS: `echo "<block>" | pbcopy`
   - Linux: `echo "<block>" | xclip -selection clipboard`
   - Windows: `echo "<block>" | clip`
5. Confirm to user what was copied and the review scope.

**Reference**
- Use `splx review change --id <id>` for change review context.
- Use `splx review task --id <id>` for task review context.
- Use `splx get change --id <id>` for proposal details.
- Read @workspace/REVIEW.md for review guidelines and checklist.
