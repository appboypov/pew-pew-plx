export type SlashCommandId =
  | 'archive'
  | 'complete-task'
  | 'get-task'
  | 'implement'
  | 'orchestrate'
  | 'parse-feedback'
  | 'plan-proposal'
  | 'plan-request'
  | 'prepare-compact'
  | 'prepare-release'
  | 'refine-architecture'
  | 'refine-release'
  | 'refine-review'
  | 'refine-testing'
  | 'review'
  | 'sync-workspace'
  | 'test'
  | 'undo-task';

const baseGuardrails = `**Guardrails**
- Favor straightforward, minimal implementations first and add complexity only when it is requested or clearly required.
- Keep changes tightly scoped to the requested outcome.
- Refer to \`workspace/AGENTS.md\` (located inside the \`workspace/\` directory—run \`ls workspace\` or \`plx update\` if you don't see it) if you need additional Pew Pew Plx conventions or clarifications.
- When clarification is needed, use your available question tool (if one exists) instead of asking in chat. If no question tool is available, ask in chat.`;

const planningContext = `**Context**
@ARCHITECTURE.md
@workspace/AGENTS.md`;

const proposalGuardrails = `${planningContext}\n\n${baseGuardrails}\n- Identify any vague or ambiguous details and gather the necessary clarifications before editing files.
- Do not write any code during the proposal stage. Only create design documents (proposal.md, tasks/ directory, design.md, and spec deltas). Implementation happens in the implement stage after approval.`;

const proposalSteps = `**Steps**
0. Check for existing \`workspace/changes/<change-id>/request.md\`:
   - If found: consume it as the source of truth for user intent and skip interactive clarification.
   - If not found: proceed with gathering intent through conversation or your question tool.
1. Review \`ARCHITECTURE.md\`, run \`plx list\` and \`plx list --specs\`, and inspect related code or docs (e.g., via \`rg\`/\`ls\`) to ground the proposal in current behaviour; note any gaps that require clarification.
2. Choose a unique verb-led \`change-id\` and scaffold \`proposal.md\`, \`tasks/\` directory, and \`design.md\` (when needed) under \`workspace/changes/<id>/\`.
3. Map the change into concrete capabilities or requirements, breaking multi-scope efforts into distinct spec deltas with clear relationships and sequencing.
4. Capture architectural reasoning in \`design.md\` when the solution spans multiple systems, introduces new patterns, or demands trade-off discussion before committing to specs.
5. Draft spec deltas in \`changes/<id>/specs/<capability>/spec.md\` (one folder per capability) using \`## ADDED|MODIFIED|REMOVED Requirements\` with at least one \`#### Scenario:\` per requirement and cross-reference related capabilities when relevant.
6. Create \`tasks/\` directory with numbered task files (minimum 3: implementation, review, test). Each file uses format \`NNN-<name>.md\` with frontmatter (status: to-do, skill-level: junior|medior|senior) and sections: End Goal, Currently, Should, Constraints, Acceptance Criteria, Implementation Checklist, Notes. Assign skill-level based on complexity: junior for straightforward changes, medior for feature implementation, senior for architectural work.
7. Validate with \`plx validate <id> --strict\` and resolve every issue before sharing the proposal.`;


const proposalReferences = `**Reference**
- Use \`plx show <id> --json --deltas-only\` or \`plx show <spec> --type spec\` to inspect details when validation fails.
- Search existing requirements with \`rg -n "Requirement:|Scenario:" workspace/specs\` before writing new ones.
- Explore the codebase with \`rg <keyword>\`, \`ls\`, or direct file reads so proposals align with current implementation realities.`;

const implementSteps = `**Steps**
Track these steps as TODOs and complete them one by one.
1. Determine the scope:
   - If user specified a task ID in ARGUMENTS, use \`plx get task --id <task-id>\` to get that specific task and proceed to step 2
   - Otherwise, run \`plx get tasks\` to retrieve all tasks for the highest-priority change
2. For each task (or the single task if task ID was provided):
   a. Work through the task's Implementation Checklist, keeping edits minimal
   b. Mark checklist items complete (\`[x]\`) in the task file
   c. Mark the task as done with \`plx complete task --id <task-id>\`
3. Stop when complete:
   - If implementing a specific task ID (from step 1), stop after completing that task
   - If implementing all tasks in a change, stop after all tasks have been completed
4. Reference \`plx list\` or \`plx show <item>\` when additional context is required.`;

const implementReferences = `**Reference**
- Use \`plx show <id> --json --deltas-only\` if you need additional context from the proposal while implementing.`;

const archiveSteps = `**Steps**
1. Determine the change ID to archive:
   - If this prompt already includes a specific change ID (for example inside a \`<ChangeId>\` block populated by slash-command arguments), use that value after trimming whitespace.
   - If the conversation references a change loosely (for example by title or summary), run \`plx list\` to surface likely IDs, share the relevant candidates, and confirm which one the user intends.
   - Otherwise, review the conversation, run \`plx list\`, and ask the user which change to archive; wait for a confirmed change ID before proceeding.
   - If you still cannot identify a single change ID, stop and tell the user you cannot archive anything yet.
2. Validate the change ID by running \`plx list\` (or \`plx show <id>\`) and stop if the change is missing, already archived, or otherwise not ready to archive.
3. Run \`plx archive <id> --yes\` so the CLI moves the change and applies spec updates without prompts (use \`--skip-specs\` only for tooling-only work).
4. Review the command output to confirm the target specs were updated and the change landed in \`changes/archive/\`.
5. Validate with \`plx validate --strict\` and inspect with \`plx show <id>\` if anything looks off.`;

const archiveReferences = `**Reference**
- Use \`plx list\` to confirm change IDs before archiving.
- Inspect refreshed specs with \`plx list --specs\` and address any validation issues before handing off.`;

const getTaskGuardrails = `**Guardrails**
- Complete tasks sequentially, marking each done before starting the next.
- Tasks auto-transition from to-do to in-progress when retrieved.
- Preserve existing task file content when updating status.`;

const getTaskSteps = `**Steps**
1. Run \`plx get task\` to get the highest-priority task (auto-transitions to in-progress).
2. Execute the task following its Implementation Checklist.
3. When all checklist items are complete, run \`plx complete task --id <task-id>\` to mark the task as done.
4. **Stop and await user confirmation** before proceeding to the next task.`;

const prepareCompactGuardrails = `**Guardrails**
- Save ALL modified files before creating PROGRESS.md.
- Create PROGRESS.md in the project root directory.
- Include enough detail that a new agent can continue without user re-explanation.
- Add PROGRESS.md to .gitignore if not already present.
- Update existing PROGRESS.md if one already exists (don't create duplicates).`;

const prepareCompactSteps = `**Steps**
1. Save all files you have modified during this session.
2. Create or update \`PROGRESS.md\` in the project root with these sections: Current Task, Status, Completed Steps, Remaining Steps, Key Decisions Made, Files Modified, Files Created, Open Questions/Blockers, Context for Next Agent, Related Resources.
3. Check if \`.gitignore\` contains \`PROGRESS.md\`; if not present, add it on a new line.
4. Confirm to user that progress has been saved and they can start a new session.`;

const reviewGuardrails = `**Guardrails**
- Use CLI to retrieve review context.
- Output feedback as language-aware markers.
- Include parent linkage in markers when reviewing a task, change, or spec.`;

const reviewSteps = `**Steps**
1. Run \`plx review --change-id <id>\` (or --spec-id, --task-id).
2. Read the output: @REVIEW.md guidelines + parent documents.
3. Review implementation against constraints/acceptance criteria.
4. Insert feedback markers with format: \`#FEEDBACK #TODO | {type}:{id} | {feedback}\`
   - Examples: \`task:001\`, \`change:my-feature\`, \`spec:auth-spec\`
   - Parent linkage is optional but recommended.
5. Summarize findings.
6. Instruct to run \`plx parse feedback <name>\` (optionally with --change-id, --spec-id, or --task-id for unassigned markers).`;

const refineArchitectureGuardrails = `**Guardrails**
- Reference @ARCHITECTURE.md template structure.
- Focus on practical documentation.
- Preserve user content.`;

const refineArchitectureSteps = `**Steps**
1. Check if @ARCHITECTURE.md exists.
2. If not: create from template.
3. If exists: read and update.`;

const refineReviewGuardrails = `**Guardrails**
- Reference @REVIEW.md template structure.
- Preserve existing review guidelines.
- Use question tool to guide user through configuration options.
- Write final selections to REVIEW.md.

## Configuration Options Reference

### Review Types
| Type | Description | Focus Areas |
|------|-------------|-------------|
| \`implementation\` | Code correctness and quality | Logic errors, edge cases, error handling, code style |
| \`architecture\` | System design and patterns | Component boundaries, dependencies, scalability, maintainability |
| \`security\` | Vulnerability assessment | Input validation, authentication, authorization, data exposure |
| \`performance\` | Efficiency and optimization | Algorithmic complexity, memory usage, I/O operations, caching |
| \`accessibility\` | Inclusive design compliance | WCAG guidelines, screen reader support, keyboard navigation |

### Feedback Format
| Format | Description | Best For |
|--------|-------------|----------|
| \`marker\` | Inline markers with format \`#FEEDBACK #TODO \\| {type}:{id} \\| {feedback}\` | Automated parsing, task generation, CI integration |
| \`annotation\` | Spec-style annotations referencing requirements | Traceability to specs, compliance verification |
| \`inline-comment\` | Direct code comments at issue location | Quick fixes, minor suggestions, style feedback |

### Checklist Customization
| Checklist | Items | Best For |
|-----------|-------|----------|
| \`minimal\` | 5-7 core items covering critical issues only | Fast reviews, trusted contributors, small changes |
| \`standard\` | 10-15 items covering common review concerns | Most PRs, balanced thoroughness |
| \`comprehensive\` | 20+ items covering all review aspects | Critical systems, security-sensitive code, new contributors |
| \`custom\` | User-defined items tailored to project needs | Domain-specific requirements, compliance mandates |`;

const refineReviewSteps = `**Steps**
1. Check if @REVIEW.md exists:
   - If not: create from template with default configuration.
   - If exists: read current configuration.

2. Guide user through Review Types selection:
   - Present review type options: implementation, architecture, security, performance, accessibility.
   - Explain each type's focus areas and when to apply.
   - Allow multiple selections (most projects use 2-3 types).
   - Record selections.

3. Guide user through Feedback Format selection:
   - Present feedback format options: marker, annotation, inline-comment.
   - Explain each format's structure and tooling compatibility.
   - Record selection.

4. Guide user through Checklist customization:
   - Present checklist options: minimal, standard, comprehensive, custom.
   - If custom: guide user to define checklist items.
   - Explain tradeoffs between speed and thoroughness.
   - Record selection.

5. Write all selections to REVIEW.md:
   - Update Review Types section with selected types.
   - Update Feedback Format section with format choice.
   - Update Checklist section with selected level or custom items.

6. Confirm configuration saved and explain how \`plx/review\` will use these settings.`;

const refineTestingGuardrails = `**Guardrails**
- Reference @TESTING.md template structure.
- Preserve existing testing configuration.
- Use question tool to guide user through configuration options.
- Write final selections to TESTING.md.

## Configuration Options Reference

### Test Types
| Type | Description | Best For |
|------|-------------|----------|
| \`unit\` | Isolated function/method tests with mocked dependencies | Business logic, utilities, pure functions |
| \`integration\` | Tests verifying component interactions | API endpoints, database operations, service layers |
| \`e2e\` | End-to-end user journey tests | Critical user flows, checkout processes, auth flows |
| \`snapshot\` | UI component snapshot comparisons | React/Vue components, styled components |
| \`performance\` | Load testing and benchmarks | High-traffic endpoints, critical paths |

### Coverage Thresholds
| Threshold | Description | Best For |
|-----------|-------------|----------|
| \`70%\` | Minimum viable coverage | Legacy codebases, rapid prototyping |
| \`80%\` | Standard coverage target | Most production applications |
| \`90%\` | High coverage requirement | Critical systems, libraries, SDKs |

### Test Runners
| Runner | Description | Best For |
|--------|-------------|----------|
| \`vitest\` | Fast, Vite-native test runner | Vite projects, TypeScript, ESM |
| \`jest\` | Full-featured test framework | React, general JavaScript/TypeScript |
| \`mocha\` | Flexible test framework | Node.js backends, custom setups |
| \`pytest\` | Python test framework | Python projects |
| \`flutter_test\` | Flutter test framework | Flutter/Dart projects |`;

const refineTestingSteps = `**Steps**
1. Check if @TESTING.md exists:
   - If not: create from template with default configuration.
   - If exists: read current configuration.

2. Guide user through Test Types selection:
   - Present test type options: unit, integration, e2e, snapshot, performance.
   - Explain each type's purpose and use case.
   - Allow multiple selections.
   - Record selections.

3. Guide user through Coverage Threshold selection:
   - Present coverage options: 70%, 80%, 90%.
   - Explain tradeoffs for each level.
   - Record selection.

4. Guide user through Test Runner selection:
   - Present runner options based on detected project type.
   - Explain each runner's strengths.
   - Record selection.

5. Guide user through File Pattern configuration:
   - Present common patterns based on selected runner.
   - Allow customization.
   - Record patterns.

6. Write all selections to TESTING.md:
   - Update Test Types section with selected types.
   - Update Coverage section with threshold.
   - Update Test Patterns section with runner and file patterns.

7. Confirm configuration saved and explain how test configuration will be used.`;

const parseFeedbackGuardrails = `**Guardrails**
- Scan only tracked files.
- Generate one task per marker.
- Markers with parent linkage are grouped automatically.`;

const parseFeedbackSteps = `**Steps**
1. Run \`plx parse feedback <name>\` (CLI flags --change-id, --spec-id, --task-id are optional fallbacks for unassigned markers).
2. Review generated tasks.
3. Address feedback.
4. Archive when complete.`;

const refineReleaseGuardrails = `**Guardrails**
- Reference @RELEASE.md template structure.
- Preserve existing release configuration.
- Use question tool to guide user through configuration options.
- Write final selections to RELEASE.md Config section.

## Configuration Options Reference

### Format Options
| Format | Description | Best For |
|--------|-------------|----------|
| \`keep-a-changelog\` | Standard format following keepachangelog.com with Added/Changed/Deprecated/Removed/Fixed/Security sections | Open source projects, libraries, packages with structured release notes |
| \`simple-list\` | Minimal bullet-point list with prefixed categories (Added:, Changed:, Fixed:) | Internal projects, rapid releases, minimal documentation needs |
| \`github-release\` | GitHub Releases compatible format with "What's Changed" sections and PR/contributor links | GitHub-hosted projects using GitHub Releases feature |

### Style Options
| Style | Sections Included | Best For |
|-------|-------------------|----------|
| \`minimal\` | Title, description, install, usage | Simple utilities, scripts, internal tools |
| \`standard\` | Above + features, contributing, license | Most open source projects |
| \`comprehensive\` | Full documentation with ToC, API, config, FAQ | Libraries with complex APIs |
| \`cli-tool\` | Commands, flags, examples, options tables | Command-line applications |
| \`library\` | API reference, class docs, method signatures | SDK/API packages |

### Audience Options
| Audience | Focus | Tone |
|----------|-------|------|
| \`technical\` | Implementation details, API changes, migration guides | Developer-centric, precise |
| \`semi-technical\` | Features and fixes with light technical context | Balanced for mixed readers |
| \`general-interest\` | User-facing improvements, benefits | Non-technical, benefit-focused |

### Emoji Levels
| Level | Usage | Example |
|-------|-------|---------|
| \`none\` | No emojis anywhere | "Added new feature" |
| \`minimal\` | Section headers only | "## ✨ Added" |
| \`standard\` | Headers and major items | "- ✨ New dashboard view" |

### Badge Patterns (shields.io)
\`\`\`
Build:     ![Build](https://img.shields.io/github/actions/workflow/status/OWNER/REPO/WORKFLOW.yml?branch=main)
Coverage:  ![Coverage](https://img.shields.io/codecov/c/github/OWNER/REPO)
npm:       ![npm](https://img.shields.io/npm/v/PACKAGE)
Downloads: ![Downloads](https://img.shields.io/npm/dm/PACKAGE)
License:   ![License](https://img.shields.io/npm/l/PACKAGE)
Stars:     ![Stars](https://img.shields.io/github/stars/OWNER/REPO)
Issues:    ![Issues](https://img.shields.io/github/issues/OWNER/REPO)
PRs:       ![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)
TypeScript:![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
Node:      ![Node](https://img.shields.io/node/v/PACKAGE)
\`\`\``;

const refineReleaseSteps = `**Steps**
1. Check if @RELEASE.md exists:
   - If not: create from template with empty Config section.
   - If exists: read current configuration.

2. Guide user through Format selection:
   - Present format options: keep-a-changelog, simple-list, github-release.
   - Explain each format's structure and use case.
   - Record selection.

3. Guide user through Style selection:
   - Present style options: minimal, standard, comprehensive, cli-tool, library.
   - Explain sections included in each style.
   - Record selection.

4. Guide user through Audience selection:
   - Present audience options: technical, semi-technical, general-interest.
   - Explain tone and focus of each.
   - Record selection.

5. Guide user through Emoji level selection:
   - Present emoji options: none, minimal, standard.
   - Show examples for each level.
   - Record selection.

6. Badge configuration (optional):
   - Ask if user wants badges in readme.
   - If yes, present badge options and record selections.
   - Collect OWNER, REPO, PACKAGE values if needed.

7. Write all selections to RELEASE.md Config section:
   \`\`\`yaml
   # Config
   format: <selected-format>
   style: <selected-style>
   audience: <selected-audience>
   emoji: <selected-emoji>
   badges:
     - <badge1>
     - <badge2>
   owner: <github-owner>
   repo: <github-repo>
   package: <npm-package>
   \`\`\`

8. Confirm configuration saved and explain how \`plx/prepare-release\` will use it.`;

const prepareReleaseGuardrails = `**Guardrails**
- Read @RELEASE.md Config section for release configuration.
- Apply defaults when config values are not specified.
- Reference @README.md, @CHANGELOG.md, and @ARCHITECTURE.md for updates.
- Execute steps sequentially: changelog → readme → architecture.
- User confirms or skips each step before proceeding.
- Preserve existing content when updating files.

## Default Configuration
When RELEASE.md Config section is missing or incomplete, apply these defaults:
| Setting | Default Value |
|---------|---------------|
| format | keep-a-changelog |
| style | standard |
| audience | technical |
| emoji | none |
| badges | (none) |`;

const prepareReleaseSteps = `**Steps**
1. Parse configuration from @RELEASE.md:
   - Read Config section (YAML block after "# Config" header).
   - Extract: format, style, audience, emoji, badges, owner, repo, package.
   - Apply defaults for any missing values:
     - format: keep-a-changelog
     - style: standard
     - audience: technical
     - emoji: none

2. Execute changelog update:
   - Ask user for change source: git commits, branch diff, or manual entry.
   - If git commits: ask for range (recent N, since date, since tag, tag range).
   - Analyze commits for version bump type (major/minor/patch).
   - Generate changelog entry using configured format and emoji level.
   - Prepend to CHANGELOG.md (create if not exists).

3. Execute readme update:
   - Apply configured style to determine sections.
   - Apply configured audience for tone.
   - If badges configured: generate badge markdown using owner/repo/package values.
   - Update or create README.md preserving user content.

4. Execute architecture update:
   - Read existing ARCHITECTURE.md.
   - Explore codebase for current patterns and structure.
   - Update documentation while preserving user-written content.
   - Add sections for undocumented patterns.

5. Present summary:
   - List all files updated.
   - Show version bump applied.
   - Highlight any sections that need manual review.`;

const orchestrateGuardrails = `${planningContext}

**Guardrails**
- Spawn exactly one sub-agent per task—never parallelize task execution.
- Review each sub-agent's work before accepting it.
- Maintain ongoing conversations with sub-agents; don't just spawn and forget.
- Act as a senior team member guiding talented colleagues.
- Enforce TracelessChanges:
  - No comments referencing removed code.
  - No "we don't do X" statements about removed features.
  - No clarifications about previous states or deprecated behavior.
- Verify scope adherence: confirm no unnecessary additions.
- Verify project convention alignment before accepting work.
- Select sub-agent model based on task skill-level:
  - junior → haiku (simple tasks)
  - medior → sonnet (moderate complexity)
  - senior → opus (architectural/complex tasks)
  - For non-Claude models, determine equivalent or use default.`;

const orchestrateSteps = `**Steps**
1. Understand the work scope:
   - For changes: run \`plx get tasks\` to see all tasks.
   - For reviews: identify review aspects (architecture, scope, testing, etc.).
   - For other work: enumerate the discrete units of work.
2. For each unit of work:
   a. Get detailed context (\`plx get task --id <id>\` or equivalent).
   b. Spawn a sub-agent with clear, scoped instructions; select model based on task skill-level (junior→haiku, medior→sonnet, senior→opus).
   c. Wait for sub-agent to complete work.
3. Review sub-agent output:
   - Scope adherence: no unrequested features or changes.
   - Convention alignment: follows project patterns and standards.
   - TracelessChanges: no artifacts of prior implementation.
   - Quality: meets acceptance criteria.
4. If issues found:
   - Provide specific, actionable feedback to sub-agent.
   - Request revision with clear guidance.
   - Repeat review until satisfactory.
5. If approved:
   - For tasks: mark complete with \`plx complete task --id <id>\`.
   - For reviews: consolidate feedback.
   - Proceed to next unit of work.
6. Continue until all work is complete.
7. Final validation: run \`plx validate\` if applicable.`;

const orchestrateReference = `**Reference**
- Use \`plx show <change-id>\` for proposal context.
- Use \`plx list\` to see all changes and progress.
- Use \`plx review\` for review context.
- Use \`plx parse feedback\` to convert review feedback to tasks.`;

const planRequestGuardrails = `${planningContext}

**Guardrails**
- Use iterative yes/no questions to clarify intent before proposal creation.
- Create request.md early and update it incrementally after each question.
- Do not write code during this stage—output is intent clarification only.
- Use your question tool to present questions (if available).
- End only when user confirms 100% intent capture.`;

const planRequestSteps = `**Steps**
1. Parse \`$ARGUMENTS\` to extract the source input (request, wish, idea, etc.).
2. Choose a unique verb-led \`change-id\` and create \`workspace/changes/<id>/request.md\`.
3. Populate request.md with sections: Source Input, Current Understanding, Identified Ambiguities, Decisions, Final Intent.
4. Begin AskActUpdateRepeat loop:
   - ASK: Present one high-value yes/no question using the question tool.
   - ACT: Research or validate if needed.
   - UPDATE: Record decision in request.md Decisions section.
   - REPEAT: Continue until no ambiguities remain.
5. When user confirms intent is 100% captured, populate Final Intent section.
6. Direct user to run \`plx/plan-proposal <change-id>\` to create the formal proposal.`;

const planRequestReference = `**Reference**
- Run \`plx/plan-proposal <change-id>\` after this command to scaffold the proposal.
- The plan-proposal command auto-detects and consumes request.md when present.`;

const syncWorkspaceGuardrails = `${planningContext}

**Guardrails**
- Spawn sub-agents for complex assessments when context is heavy (multiple changes, many tasks).
- Present actionable suggestions using question tool (multi-select if available) or numbered list.
- Wait for user selection before executing any actions.
- Validate workspace state with \`plx validate --all --strict\` before and after actions.
- Execute only the actions explicitly selected by the user.`;

const syncWorkspaceSteps = `**Steps**
1. Determine scope from \`$ARGUMENTS\`:
   - If change-id provided: focus on that change only.
   - If task-id provided: focus on that task's parent change.
   - If no arguments: scan entire workspace.
2. Scan workspace state:
   - Run \`plx list\` to see all active changes.
   - Run \`plx get tasks\` to see all open tasks.
   - Run \`plx validate --all --strict\` to identify validation issues.
3. Assess and categorize issues:
   - Ready to archive: changes with all tasks completed.
   - Stale changes: changes with no recent activity.
   - Failing validation: items with validation errors or warnings.
   - Missing artifacts: incomplete proposals, specs, or tasks.
   - Orphaned items: specs without changes, tasks without parents.
4. Present actionable suggestions:
   - Use question tool with multi-select if available.
   - Otherwise, present numbered list and ask user to select by number.
   - Group suggestions by category (archive, create, update, validate, delete).
5. Wait for user selection—do not proceed without explicit confirmation.
6. Execute selected actions sequentially:
   - Archive: \`plx archive <id> --yes\`
   - Create tasks: scaffold task files in \`workspace/changes/<id>/tasks/\`
   - Update proposals: edit \`proposal.md\` or \`design.md\`
   - Validate: \`plx validate <id> --strict\`
7. Report summary:
   - List all actions taken with outcomes.
   - Show current workspace state with \`plx list\`.
   - Highlight any remaining issues.`;

const syncWorkspaceReference = `**Reference**
- Use \`plx list\` to see all active changes.
- Use \`plx get tasks\` to see all open tasks across changes.
- Use \`plx get tasks --id <change-id>\` to see tasks for a specific change.
- Use \`plx validate --all --strict\` for comprehensive validation.
- Use \`plx archive <id> --yes\` to archive without prompts.
- Use \`plx show <id>\` to inspect change or spec details.`;

const completeTaskSteps = `**Steps**
1. Parse \`$ARGUMENTS\` to extract task-id.
2. If no task-id provided, ask user for task-id or run \`plx get tasks\` to list options.
3. Run \`plx complete task --id <task-id>\` to mark the task as done.
4. Confirm completion to user.`;

const undoTaskSteps = `**Steps**
1. Parse \`$ARGUMENTS\` to extract task-id.
2. If no task-id provided, ask user for task-id or run \`plx get tasks\` to list options.
3. Run \`plx undo task --id <task-id>\` to revert the task to to-do.
4. Confirm undo to user.`;

const testGuardrails = `**Guardrails**
- Read @TESTING.md for test runner, coverage threshold, and test patterns.
- Parse arguments for scope: --change-id, --task-id, --spec-id.
- Run tests based on scope or all tests if no scope provided.
- Report results and coverage against configured threshold.`;

const testSteps = `**Steps**
1. Parse \`$ARGUMENTS\` to extract scope flags:
   - \`--change-id <id>\`: run tests related to changed files in that change.
   - \`--task-id <id>\`: run tests related to task scope.
   - \`--spec-id <id>\`: run tests related to spec.
   - No arguments: run all tests.
2. Read @TESTING.md for configuration:
   - Test runner (vitest, jest, pytest, flutter_test, etc.).
   - Coverage threshold (70%, 80%, 90%).
   - Test patterns and file locations.
3. Determine test scope based on arguments:
   - If \`--change-id\`: use \`plx show <id> --json\` to get changed files, derive test files.
   - If \`--task-id\`: use \`plx get task --id <id>\` to get task scope, derive test files.
   - If \`--spec-id\`: use \`plx show <id> --type spec\` to get spec scope, derive test files.
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
   - Suggest fixes or next steps.`;

export const slashCommandBodies: Record<SlashCommandId, string> = {
  'archive': [baseGuardrails, archiveSteps, archiveReferences].join('\n\n'),
  'complete-task': completeTaskSteps,
  'get-task': [getTaskGuardrails, getTaskSteps].join('\n\n'),
  'implement': [baseGuardrails, implementSteps, implementReferences].join('\n\n'),
  'orchestrate': [orchestrateGuardrails, orchestrateSteps, orchestrateReference].join('\n\n'),
  'parse-feedback': [parseFeedbackGuardrails, parseFeedbackSteps].join('\n\n'),
  'plan-proposal': [proposalGuardrails, proposalSteps, proposalReferences].join('\n\n'),
  'plan-request': [planRequestGuardrails, planRequestSteps, planRequestReference].join('\n\n'),
  'prepare-compact': [prepareCompactGuardrails, prepareCompactSteps].join('\n\n'),
  'prepare-release': [prepareReleaseGuardrails, prepareReleaseSteps].join('\n\n'),
  'refine-architecture': [refineArchitectureGuardrails, refineArchitectureSteps].join('\n\n'),
  'refine-release': [refineReleaseGuardrails, refineReleaseSteps].join('\n\n'),
  'refine-review': [refineReviewGuardrails, refineReviewSteps].join('\n\n'),
  'refine-testing': [refineTestingGuardrails, refineTestingSteps].join('\n\n'),
  'review': [reviewGuardrails, reviewSteps].join('\n\n'),
  'sync-workspace': [syncWorkspaceGuardrails, syncWorkspaceSteps, syncWorkspaceReference].join('\n\n'),
  'test': [testGuardrails, testSteps].join('\n\n'),
  'undo-task': undoTaskSteps
};

export function getSlashCommandBody(id: SlashCommandId): string {
  return slashCommandBodies[id];
}
