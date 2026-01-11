---
status: done
skill-level: medior
parent-type: change
parent-id: extend-paste-command
---
# Task: Add paste spec subcommand

## End Goal

The `plx paste spec` command creates a specification directory from clipboard content.

## Currently

The `PasteCommand` class only supports `plx paste request`. There is no way to scaffold a spec from clipboard content.

## Should

- `plx paste spec` creates spec directory in `workspace/specs/`
- Directory contains `spec.md` file with template structure
- Clipboard content populates first requirement description
- Spec name derived from first line of clipboard (kebab-case)
- Error when spec name already exists (no automatic suffix)

## Constraints

- [ ] Spec structure matches `plx create spec` output (assumes `add-create-command` complete)
- [ ] Name derivation produces valid kebab-case identifiers
- [ ] Duplicate specs are rejected (not auto-suffixed like changes)
- [ ] Include at least one requirement with scenario placeholder

## Acceptance Criteria

- [ ] `plx paste spec` creates spec directory with spec.md
- [ ] Clipboard content appears as first requirement description
- [ ] Spec name correctly derived as kebab-case
- [ ] Error displayed when spec name already exists
- [ ] Empty clipboard shows appropriate error

## Implementation Checklist

- [x] 3.1 Add `spec` method to `PasteCommand` class
- [x] 3.2 Implement spec name derivation with kebab-case conversion
- [x] 3.3 Check for existing spec and return error if duplicate
- [x] 3.4 Create spec directory structure (spec.md)
- [x] 3.5 Import and use spec template from shared templates
- [x] 3.6 Register `paste spec` subcommand in `src/cli/index.ts`

## Notes

Unlike changes, specs do not get automatic numeric suffixes for duplicates. This is intentional as specs represent unique capabilities and duplicate names indicate a naming conflict that requires user resolution.
