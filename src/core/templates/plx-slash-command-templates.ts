export type PlxSlashCommandId = 'init-architecture' | 'update-architecture' | 'act-next';

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

const actNextGuardrails = `**Guardrails**
- Complete tasks sequentially, marking each done before starting the next.
- Only transition task status when explicitly using --did-complete-previous flag.
- Preserve existing task file content when updating status.`;

const actNextSteps = `**Steps**
1. Run \`openspec act next\` to get the highest-priority task.
2. Execute the task following its Implementation Checklist.
3. Mark checklist items complete as you finish them.
4. When done, run \`openspec act next --did-complete-previous\` to transition and get next task.`;

export const plxSlashCommandBodies: Record<PlxSlashCommandId, string> = {
  'init-architecture': [baseGuardrails, initArchitectureSteps].join('\n\n'),
  'update-architecture': [baseGuardrails, updateArchitectureSteps].join('\n\n'),
  'act-next': [actNextGuardrails, actNextSteps].join('\n\n')
};

export function getPlxSlashCommandBody(id: PlxSlashCommandId): string {
  return plxSlashCommandBodies[id];
}
