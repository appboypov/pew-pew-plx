export type PlxSlashCommandId = 'init-architecture' | 'update-architecture' | 'get-task' | 'compact';

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
- Only transition task status when explicitly using --did-complete-previous flag.
- Preserve existing task file content when updating status.`;

const getTaskSteps = `**Steps**
1. Run \`openspec get task\` to get the highest-priority task.
2. Execute the task following its Implementation Checklist.
3. Mark checklist items complete as you finish them.
4. When done, run \`openspec get task --did-complete-previous\` to transition and get next task.`;

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

export const plxSlashCommandBodies: Record<PlxSlashCommandId, string> = {
  'init-architecture': [baseGuardrails, initArchitectureSteps].join('\n\n'),
  'update-architecture': [baseGuardrails, updateArchitectureSteps].join('\n\n'),
  'get-task': [getTaskGuardrails, getTaskSteps].join('\n\n'),
  'compact': [compactGuardrails, compactSteps].join('\n\n')
};

export function getPlxSlashCommandBody(id: PlxSlashCommandId): string {
  return plxSlashCommandBodies[id];
}
