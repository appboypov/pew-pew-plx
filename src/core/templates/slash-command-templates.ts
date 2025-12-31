export type SlashCommandId =
  | 'archive'
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
  | 'review';

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
6. Create \`tasks/\` directory with numbered task files (minimum 3: implementation, review, test). Each file uses format \`NNN-<name>.md\` with End Goal, Currently, Should, Constraints, Acceptance Criteria, Implementation Checklist, and Notes sections.
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
- Preserve existing guidelines.`;

const refineReviewSteps = `**Steps**
1. Check if @REVIEW.md exists.
2. If not: create from template.
3. If exists: read and update.`;

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
- Preserve existing release configuration.`;

const refineReleaseSteps = `**Steps**
1. Check if @RELEASE.md exists.
2. If not: create from template.
3. If exists: read and update.`;

const prepareReleaseGuardrails = `**Guardrails**
- Read @RELEASE.md for full release preparation instructions.
- Reference @README.md, @CHANGELOG.md, and @ARCHITECTURE.md for updates.
- Execute steps sequentially: changelog → readme → architecture.
- User confirms or skips each step before proceeding.
- Preserve existing content when updating files.`;

const prepareReleaseSteps = `**Steps**
1. Read @RELEASE.md to understand release preparation workflow.
2. Execute changelog update step (source, version, format selection).
3. Execute readme update step (style, sections, badges selection).
4. Execute architecture update step (refresh from codebase).
5. Present summary of all changes made.`;

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
- Verify project convention alignment before accepting work.`;

const orchestrateSteps = `**Steps**
1. Understand the work scope:
   - For changes: run \`plx get tasks\` to see all tasks.
   - For reviews: identify review aspects (architecture, scope, testing, etc.).
   - For other work: enumerate the discrete units of work.
2. For each unit of work:
   a. Get detailed context (\`plx get task --id <id>\` or equivalent).
   b. Spawn a sub-agent with clear, scoped instructions.
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

export const slashCommandBodies: Record<SlashCommandId, string> = {
  'archive': [baseGuardrails, archiveSteps, archiveReferences].join('\n\n'),
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
  'review': [reviewGuardrails, reviewSteps].join('\n\n')
};

export function getSlashCommandBody(id: SlashCommandId): string {
  return slashCommandBodies[id];
}
