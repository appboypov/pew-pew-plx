---
status: done
parent-type: change
parent-id: add-prepare-release-command
---
# Add Prepare Release Command Body Template

## End Goal

The `plx-slash-command-templates.ts` file includes the prepare-release command type and body template.

## Currently

- `PlxSlashCommandId` type includes 8 command IDs
- `plxSlashCommandBodies` record has entries for 8 commands
- No prepare-release command exists

## Should

- Add `'prepare-release'` to `PlxSlashCommandId` type union
- Add `prepareReleaseGuardrails` constant
- Add `prepareReleaseSteps` constant
- Add `'prepare-release'` entry to `plxSlashCommandBodies` record

## Constraints

- Must follow existing pattern of guardrails + steps
- Command body must be concise (~10-15 lines)
- Must reference @RELEASE.md for detailed instructions

## Acceptance Criteria

- [x] `'prepare-release'` added to `PlxSlashCommandId` type
- [x] `prepareReleaseGuardrails` constant defined
- [x] `prepareReleaseSteps` constant defined
- [x] `'prepare-release'` entry added to `plxSlashCommandBodies`
- [x] TypeScript compiles without errors (after Task 004/005 complete)

## Implementation Checklist

- [x] Add `| 'prepare-release'` to `PlxSlashCommandId` type union
- [x] Create `prepareReleaseGuardrails` constant with:
  - [x] Read @RELEASE.md instruction
  - [x] Sequential execution instruction
  - [x] User confirmation/skip instruction
  - [x] Preserve existing content instruction
- [x] Create `prepareReleaseSteps` constant with:
  - [x] Step 1: Read @RELEASE.md
  - [x] Step 2: Execute changelog update
  - [x] Step 3: Execute readme update
  - [x] Step 4: Execute architecture update
  - [x] Step 5: Present summary
- [x] Add entry to `plxSlashCommandBodies` joining guardrails and steps
- [x] Verify TypeScript compilation (after Task 004/005 complete)

## Notes

Location: `src/core/templates/plx-slash-command-templates.ts`
