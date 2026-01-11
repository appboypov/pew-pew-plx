---
status: done
skill-level: medior
parent-type: change
parent-id: update-refine-architecture
---

# Task: Update slash-command-templates.ts for refine-architecture

## End Goal

The `refine-architecture` slash command produces spec-ready documentation with complete component inventories, enabling architects to create detailed specs without opening the codebase.

## Currently

The command has minimal guardrails ("Reference @ARCHITECTURE.md template structure", "Focus on practical documentation", "Preserve user content") and 3 simple steps (check existence, create from template, read and update).

## Should

The command has:
- Guardrails requiring spec-ready reference, complete inventories, user content preservation, completeness validation
- Context Retrieval section with codebase-retrieval tool instructions and query examples
- 7 detailed steps: Discover, Check, Create/Load, Populate Inventories, Map Dependencies, Validate Completeness, Write
- Template Structure section defining required sections and component categories

## Constraints

- [ ] Maintain existing monorepo awareness section unchanged
- [ ] Use universal terms for component categories (DTOs/Models/Records/Entities, etc.)
- [ ] Reference template file rather than embedding full template inline
- [ ] TypeScript must compile without errors

## Acceptance Criteria

- [ ] `refineArchitectureGuardrails` contains 4 spec-ready guardrails
- [ ] `refineArchitectureContextRetrieval` constant exists with tool instructions
- [ ] `refineArchitectureSteps` contains 7 numbered steps
- [ ] `refineArchitectureTemplateStructure` constant exists with section definitions
- [ ] `slashCommandBodies['refine-architecture']` combines all sections
- [ ] Running `plx update` regenerates all tool command files with new content

## Implementation Checklist

- [x] 1.1 Update `refineArchitectureGuardrails` with spec-ready guardrails
- [x] 1.2 Add `refineArchitectureContextRetrieval` constant with codebase tool instructions
- [x] 1.3 Update `refineArchitectureSteps` with 7 detailed steps
- [x] 1.4 Add `refineArchitectureTemplateStructure` constant with sections and categories
- [x] 1.5 Update `slashCommandBodies['refine-architecture']` to combine all sections
- [x] 1.6 Run `pnpm build` to verify TypeScript compiles
- [x] 1.7 Run `plx update` to regenerate tool command files

## Notes

Source file: `src/core/templates/slash-command-templates.ts`

Current implementation (lines 135-145):
```typescript
const refineArchitectureGuardrails = `**Guardrails**
- Reference @ARCHITECTURE.md template structure.
- Focus on practical documentation.
- Preserve user content.

${monorepoAwareness}`;

const refineArchitectureSteps = `**Steps**
1. Check if @ARCHITECTURE.md exists.
2. If not: create from template.
3. If exists: read and update.`;
```
