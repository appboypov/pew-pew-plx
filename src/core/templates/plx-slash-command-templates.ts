export type PlxSlashCommandId =
  | 'get-task'
  | 'compact'
  | 'review'
  | 'refine-architecture'
  | 'refine-review'
  | 'refine-release'
  | 'parse-feedback'
  | 'prepare-release';

const getTaskGuardrails = `**Guardrails**
- Complete tasks sequentially, marking each done before starting the next.
- Tasks auto-transition from to-do to in-progress when retrieved.
- Preserve existing task file content when updating status.`;

const getTaskSteps = `**Steps**
1. Run \`plx get task\` to get the highest-priority task (auto-transitions to in-progress).
2. Execute the task following its Implementation Checklist.
3. When all checklist items are complete, run \`plx complete task --id <task-id>\` to mark the task as done.
4. **Stop and await user confirmation** before proceeding to the next task.`;

const compactGuardrails = `**Guardrails**
- Save ALL modified files before creating PROGRESS.md.
- Create PROGRESS.md in the project root directory.
- Include enough detail that a new agent can continue without user re-explanation.
- Add PROGRESS.md to .gitignore if not already present.
- Update existing PROGRESS.md if one already exists (don't create duplicates).`;

const compactSteps = `**Steps**
1. Save all files you have modified during this session.
2. Create or update \`PROGRESS.md\` in the project root with these sections: Current Task, Status, Completed Steps, Remaining Steps, Key Decisions Made, Files Modified, Files Created, Open Questions/Blockers, Context for Next Agent, Related Resources.
3. Check if \`.gitignore\` contains \`PROGRESS.md\`; if not present, add it on a new line.
4. Confirm to user that progress has been saved and they can start a new session.`;

const reviewGuardrails = `**Guardrails**
- Use CLI to retrieve review context.
- Output feedback as language-aware markers.
- For spec-impacting feedback, include spec reference.`;

const reviewSteps = `**Steps**
1. Run \`plx review --change-id <id>\` (or --spec-id, --task-id).
2. Read the output: @REVIEW.md guidelines + parent documents.
3. Review implementation against constraints/acceptance criteria.
4. Insert feedback markers in relevant code.
5. Summarize findings.
6. Instruct to run \`plx parse feedback <name> --change-id <id>\`.`;

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
- Require parent linkage.`;

const parseFeedbackSteps = `**Steps**
1. Run \`plx parse feedback <name> --change-id <id>\`.
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

export const plxSlashCommandBodies: Record<PlxSlashCommandId, string> = {
  'get-task': [getTaskGuardrails, getTaskSteps].join('\n\n'),
  'compact': [compactGuardrails, compactSteps].join('\n\n'),
  'review': [reviewGuardrails, reviewSteps].join('\n\n'),
  'refine-architecture': [refineArchitectureGuardrails, refineArchitectureSteps].join('\n\n'),
  'refine-review': [refineReviewGuardrails, refineReviewSteps].join('\n\n'),
  'refine-release': [refineReleaseGuardrails, refineReleaseSteps].join('\n\n'),
  'parse-feedback': [parseFeedbackGuardrails, parseFeedbackSteps].join('\n\n'),
  'prepare-release': [prepareReleaseGuardrails, prepareReleaseSteps].join('\n\n')
};

export function getPlxSlashCommandBody(id: PlxSlashCommandId): string {
  return plxSlashCommandBodies[id];
}
