---
name: Pew Pew Plx: Test
description: Run tests based on scope (change, task, or spec) using TESTING.md configuration.
category: Pew Pew Plx
tags: [plx, testing, workflow]
---
<!-- PLX:START -->
**Guardrails**
- Read @TESTING.md for test runner, coverage threshold, and test patterns.
- Parse arguments for scope: --id and --parent-type flags.
- Run tests based on scope or all tests if no scope provided.
- Report results and coverage against configured threshold.

**Steps**
1. Parse `$ARGUMENTS` to extract scope flags:
   - `--id <id> --parent-type change`: run tests related to changed files in that change.
   - `--id <id> --parent-type task`: run tests related to task scope.
   - `--id <id> --parent-type spec`: run tests related to spec.
   - No arguments: run all tests.
2. Read @TESTING.md for configuration:
   - Test runner (vitest, jest, pytest, flutter_test, etc.).
   - Coverage threshold (70%, 80%, 90%).
   - Test patterns and file locations.
3. Determine test scope based on arguments:
   - If `--parent-type change`: use `plx get change --id <id> --json` to get changed files, derive test files.
   - If `--parent-type task`: use `plx get task --id <id>` to get task scope, derive test files.
   - If `--parent-type spec`: use `plx get spec --id <id>` to get spec scope, derive test files.
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
