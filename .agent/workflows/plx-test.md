---
description: Run tests based on scope (change, task, or spec) using TESTING.md configuration.
---
<!-- PLX:START -->
**Guardrails**
- Read @TESTING.md for test runner, coverage threshold, and test patterns.
- Parse arguments for scope: --change-id, --task-id, --spec-id.
- Run tests based on scope or all tests if no scope provided.
- Report results and coverage against configured threshold.

**Steps**
1. Parse `$ARGUMENTS` to extract scope flags:
   - `--change-id <id>`: run tests related to changed files in that change.
   - `--task-id <id>`: run tests related to task scope.
   - `--spec-id <id>`: run tests related to spec.
   - No arguments: run all tests.
2. Read @TESTING.md for configuration:
   - Test runner (vitest, jest, pytest, flutter_test, etc.).
   - Coverage threshold (70%, 80%, 90%).
   - Test patterns and file locations.
3. Determine test scope based on arguments:
   - If `--change-id`: use `plx show <id> --json` to get changed files, derive test files.
   - If `--task-id`: use `plx get task --id <id>` to get task scope, derive test files.
   - If `--spec-id`: use `plx show <id> --type spec` to get spec scope, derive test files.
   - If no scope: run full test suite.
4. Execute tests using configured runner:
   - Run scoped tests if arguments provided.
   - Run full suite if no scope.
   - Capture output and coverage report.
5. Report results:
   - List passed/failed tests.
   - Show coverage percentage.
   - Compare coverage to threshold from TESTING.md.
   - Highlight any failures or coverage gaps.
6. If tests fail or coverage is below threshold:
   - Summarize failures with file locations.
   - Suggest fixes or next steps.
<!-- PLX:END -->
