---
status: done
skill-level: medior
---

# Task: Add paste change subcommand

## End Goal

The `plx paste change` command creates a change proposal directory structure from clipboard content.

## Currently

The `PasteCommand` class only supports `plx paste request`. There is no way to scaffold a change proposal from clipboard content.

## Should

- `plx paste change` creates change directory in `workspace/changes/`
- Directory structure includes `proposal.md`, `tasks/`, `specs/`
- Clipboard content populates `## Why` section of proposal.md
- Change name derived from first line of clipboard (kebab-case)
- Automatic verb prefix detection (`add-`, `update-`, `fix-`, `refactor-`, `draft-`)
- Duplicate name handling with numeric suffix

## Constraints

- [ ] Change directory structure matches `plx create change` output (assumes `add-create-command` complete)
- [ ] Name derivation produces valid kebab-case identifiers
- [ ] Follow existing workspace discovery patterns for target directory

## Acceptance Criteria

- [ ] `plx paste change` creates complete change directory structure
- [ ] Clipboard content appears in `## Why` section
- [ ] Change name correctly derived and prefixed
- [ ] Duplicate names get numeric suffix (-2, -3, etc.)
- [ ] Empty clipboard shows appropriate error

## Implementation Checklist

- [x] 2.1 Add `change` method to `PasteCommand` class
- [x] 2.2 Implement change name derivation with kebab-case conversion
- [x] 2.3 Implement verb prefix detection from clipboard content
- [x] 2.4 Implement duplicate name handling with numeric suffix
- [x] 2.5 Create change directory structure (proposal.md, tasks/, specs/)
- [x] 2.6 Import and use change template from shared templates
- [x] 2.7 Register `paste change` subcommand in `src/cli/index.ts`

## Notes

The name derivation logic extracts the first line of clipboard content, converts to kebab-case, and analyzes for action verbs. If no recognized verb is found, prefix with `draft-`.
