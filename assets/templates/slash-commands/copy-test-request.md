**Guardrails**
- Output format must match test request block structure exactly.
- Include full workspace/TESTING.md content in the request block.
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
Determine test scope from:
1. **Task context**: If current conversation has an active task, test that task's implementation.
2. **Change context**: If a change-id is provided or can be derived, test all implementations in that change.
3. **New conversation**: Ask user what to test or run `splx get task` to get current task.

**Steps**
1. Detect context using Context Detection rules above.
2. Gather test materials:
   - Read @workspace/TESTING.md for test configuration, patterns, and checklist
   - Get implementation context from task or change
3. Generate test request block:
   ```markdown
   ## Test Request: <task-name or change-name>

   **Scope:** <task|change>
   **ID:** <id>

   ### Testing Configuration
   <full workspace/TESTING.md content>

   ### Context
   <proposal Why and What Changes sections>

   ### Implementation Details
   <task details or change summary>

   ### Instructions
   Test the implementation according to the configuration above.
   Run tests: `<test command from workspace/TESTING.md>`
   Ensure coverage meets threshold: <threshold from workspace/TESTING.md>
   When complete, report test results and coverage.
   ```
4. Copy to clipboard:
   - macOS: `echo "<block>" | pbcopy`
   - Linux: `echo "<block>" | xclip -selection clipboard`
   - Windows: `echo "<block>" | clip`
5. Confirm to user what was copied and the test scope.

**Reference**
- Read @workspace/TESTING.md for test configuration and patterns.
- Use `splx get task --id <id>` for task context.
- Use `splx get change --id <id>` for change context.
