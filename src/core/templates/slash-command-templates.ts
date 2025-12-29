export type SlashCommandId = 'proposal' | 'apply' | 'archive';

const baseGuardrails = `**Guardrails**
- Favor straightforward, minimal implementations first and add complexity only when it is requested or clearly required.
- Keep changes tightly scoped to the requested outcome.
- Refer to \`workspace/AGENTS.md\` (located inside the \`workspace/\` directory—run \`ls workspace\` or \`plx update\` if you don't see it) if you need additional PLX conventions or clarifications.
- When clarification is needed, use your available question tool (if one exists) instead of asking in chat. If no question tool is available, ask in chat.`;

const proposalGuardrails = `${baseGuardrails}\n- Identify any vague or ambiguous details and gather the necessary clarifications before editing files.
- Do not write any code during the proposal stage. Only create design documents (proposal.md, tasks/ directory, design.md, and spec deltas). Implementation happens in the apply stage after approval.`;

const proposalSteps = `**Steps**
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

const applySteps = `**Steps**
Track these steps as TODOs and complete them one by one.
1. Read \`changes/<id>/proposal.md\` and \`design.md\` (if present) to understand scope.
2. Find the next incomplete task in \`tasks/\` directory:
   - Scan task files in sequence order (001-*, 002-*, etc.)
   - Read completed task files for context
   - Stop at the first task with incomplete checkboxes in its Implementation Checklist
   - Do NOT read tasks beyond the next incomplete one
   - If user specified a task file in ARGUMENTS, use that instead
3. Work through that task's Implementation Checklist, keeping edits minimal.
4. Mark items complete (\`[x]\`) in that task file only.
5. Reference \`plx list\` or \`plx show <item>\` when additional context is required.
6. Run apply again in a new conversation for the next task.`;

const applyReferences = `**Reference**
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

export const slashCommandBodies: Record<SlashCommandId, string> = {
  proposal: [proposalGuardrails, proposalSteps, proposalReferences].join('\n\n'),
  apply: [baseGuardrails, applySteps, applyReferences].join('\n\n'),
  archive: [baseGuardrails, archiveSteps, archiveReferences].join('\n\n')
};

export function getSlashCommandBody(id: SlashCommandId): string {
  return slashCommandBodies[id];
}
