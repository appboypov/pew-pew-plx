---
name: /plx-refine-testing
id: plx-refine-testing
category: Pew Pew Plx
description: Create or update TESTING.md.
---
<!-- PLX:START -->
**Guardrails**
- Reference @TESTING.md template structure.
- Preserve existing testing configuration.
- Use question tool to guide user through configuration options.
- Write final selections to TESTING.md.

## Configuration Options Reference

### Test Types
| Type | Description | Best For |
|------|-------------|----------|
| `unit` | Isolated function/method tests with mocked dependencies | Business logic, utilities, pure functions |
| `integration` | Tests verifying component interactions | API endpoints, database operations, service layers |
| `e2e` | End-to-end user journey tests | Critical user flows, checkout processes, auth flows |
| `snapshot` | UI component snapshot comparisons | React/Vue components, styled components |
| `performance` | Load testing and benchmarks | High-traffic endpoints, critical paths |

### Coverage Thresholds
| Threshold | Description | Best For |
|-----------|-------------|----------|
| `70%` | Minimum viable coverage | Legacy codebases, rapid prototyping |
| `80%` | Standard coverage target | Most production applications |
| `90%` | High coverage requirement | Critical systems, libraries, SDKs |

### Test Runners
| Runner | Description | Best For |
|--------|-------------|----------|
| `vitest` | Fast, Vite-native test runner | Vite projects, TypeScript, ESM |
| `jest` | Full-featured test framework | React, general JavaScript/TypeScript |
| `mocha` | Flexible test framework | Node.js backends, custom setups |
| `pytest` | Python test framework | Python projects |
| `flutter_test` | Flutter test framework | Flutter/Dart projects |

**Steps**

## Part 1: Test Config
1. Check if @TESTING.md exists:
   - If not: create from template.
   - If exists: read current configuration.

2. Guide user through Test Types selection:
   - Present options: unit, integration, e2e, snapshot, performance.
   - Allow multiple selections.
   - Record selections.

3. Guide user through Coverage Threshold selection:
   - Present options: 70%, 80%, 90%.
   - Record selection.

4. Guide user through Test Runner selection:
   - Present options based on detected project type.
   - Record selection.

5. Guide user through File Pattern configuration:
   - Present common patterns based on selected runner.
   - Record patterns.

6. Write selections to TESTING.md Test Config section.

## Part 2: Test Scope Research
7. Research and populate each Test Scope section in @TESTING.md:

   **Unit Tests**
   - Find unit test directories and files
   - Identify naming conventions
   - Count total unit test files

   **Integration Tests**
   - Find integration test directories
   - Identify integration test patterns
   - Note which components have integration coverage

   **E2E Tests**
   - Find e2e test directories
   - Identify e2e framework (Playwright, Cypress, etc.)
   - Note critical user flows covered

   **Test Utilities**
   - Find shared test helpers
   - Locate test fixtures and factories
   - Identify mock utilities

   **Test Data**
   - Find sample data and fixtures
   - Locate seed files
   - Identify test database setup

   **Mocking Patterns**
   - Find mock files and directories
   - Identify mocking approach (manual, library)
   - Note external services that are mocked

   **Coverage Reporting**
   - Find coverage configuration
   - Identify report output location
   - Note exclusion patterns

   **CI Integration**
   - Find CI test configuration
   - Identify test commands used in CI
   - Note parallelization setup

8. Write findings to each section with file paths and counts.

## Part 3: Confirm
9. Present summary of configuration and populated scope.
10. Explain how `/plx:test` will use these settings.
<!-- PLX:END -->
