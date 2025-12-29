export type PlxSlashCommandId =
  | 'init-architecture'
  | 'update-architecture'
  | 'get-task'
  | 'compact'
  | 'review'
  | 'refine-architecture'
  | 'refine-review'
  | 'parse-feedback';

const baseGuardrails = `**Guardrails**
- Focus on practical, usable documentation that enables feature planning.
- Document patterns and conventions, not implementation details.
- Keep the document maintainable - avoid copying code.
- Structure information for quick reference and navigation.`;

const initArchitectureSteps = `**Steps**
1. Read the project's manifest files to identify technology stack and dependencies.
2. Explore the directory structure to understand project organization.
3. Identify key patterns: services, APIs, state management, routing, etc.
4. Create ARCHITECTURE.md at the project root with comprehensive documentation.
5. Include: Project setup, tech stack, folder structure, service patterns, state management, and conventions.
6. Ensure the document is practical and usable for feature planning without additional codebase research.`;

const updateArchitectureSteps = `**Steps**
1. Read the existing ARCHITECTURE.md to understand current documentation state.
2. Explore the codebase for any new patterns, services, or architectural changes.
3. Update ARCHITECTURE.md to reflect the current state of the codebase.
4. Preserve user-added content that doesn't conflict with generated sections.
5. Ensure all sections remain accurate and complete for feature planning.`;

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
2. Read the output: REVIEW.md guidelines + parent documents.
3. Review implementation against constraints/acceptance criteria.
4. Insert feedback markers in relevant code.
5. Summarize findings.
6. Instruct to run \`plx parse feedback <name> --change-id <id>\`.`;

const refineArchitectureGuardrails = `**Guardrails**
- Focus on practical documentation.
- Preserve user content.`;

const refineArchitectureSteps = `**Steps**
1. Check if ARCHITECTURE.md exists.
2. If not: create from template.
3. If exists: read and update.`;

const refineReviewGuardrails = `**Guardrails**
- Use REVIEW.md template structure.
- Preserve existing guidelines.`;

const refineReviewSteps = `**Steps**
1. Check if REVIEW.md exists.
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

export const plxSlashCommandBodies: Record<PlxSlashCommandId, string> = {
  'init-architecture': [baseGuardrails, initArchitectureSteps].join('\n\n'),
  'update-architecture': [baseGuardrails, updateArchitectureSteps].join('\n\n'),
  'get-task': [getTaskGuardrails, getTaskSteps].join('\n\n'),
  'compact': [compactGuardrails, compactSteps].join('\n\n'),
  'review': [reviewGuardrails, reviewSteps].join('\n\n'),
  'refine-architecture': [refineArchitectureGuardrails, refineArchitectureSteps].join('\n\n'),
  'refine-review': [refineReviewGuardrails, refineReviewSteps].join('\n\n'),
  'parse-feedback': [parseFeedbackGuardrails, parseFeedbackSteps].join('\n\n')
};

export function getPlxSlashCommandBody(id: PlxSlashCommandId): string {
  return plxSlashCommandBodies[id];
}
