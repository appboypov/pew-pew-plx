---
status: done
---

# Task: Implement compact command template

## End Goal

The `/plx/compact` slash command is defined in the template system and available for all supported AI tools.

## Currently

Only three PLX slash commands exist: `init-architecture`, `update-architecture`, and `get-task`. There is no command for preserving context across sessions.

## Should

- `PlxSlashCommandId` type includes `'compact'`
- `plxSlashCommandBodies` object includes the compact command body
- `ALL_PLX_COMMANDS` array includes `'compact'`
- All 20 configurators have FILE_PATHS and FRONTMATTER entries for compact

## Constraints

- [x] Follow existing command patterns exactly
- [x] Command body must include Guardrails and Steps sections
- [x] Frontmatter must follow tool-specific conventions

## Acceptance Criteria

- [x] Running `openspec init` generates compact.md for each supported tool
- [x] Generated command file has valid frontmatter
- [x] Command body instructs agent to create PROGRESS.md
- [x] Command body instructs agent to update .gitignore

## Implementation Checklist

- [x] 1.1 Add `'compact'` to `PlxSlashCommandId` type in `src/core/templates/plx-slash-command-templates.ts`
- [x] 1.2 Add `compactGuardrails` constant with 5 guardrail bullets
- [x] 1.3 Add `compactSteps` constant with 4 numbered steps
- [x] 1.4 Add `'compact'` entry to `plxSlashCommandBodies` object
- [x] 1.5 Add `'compact'` to `ALL_PLX_COMMANDS` array in `src/core/configurators/slash/plx-base.ts`
- [x] 1.6 Add FILE_PATHS entry in `plx-claude.ts`
- [x] 1.7 Add FRONTMATTER entry in `plx-claude.ts`
- [x] 1.8 Add FILE_PATHS and FRONTMATTER entries in `plx-cursor.ts`
- [x] 1.9 Add FILE_PATHS and FRONTMATTER entries in `plx-windsurf.ts`
- [x] 1.10 Add FILE_PATHS and FRONTMATTER entries in `plx-cline.ts`
- [x] 1.11 Add FILE_PATHS and FRONTMATTER entries in `plx-codebuddy.ts`
- [x] 1.12 Add FILE_PATHS and FRONTMATTER entries in `plx-qoder.ts`
- [x] 1.13 Add FILE_PATHS and FRONTMATTER entries in `plx-kilocode.ts`
- [x] 1.14 Add FILE_PATHS and FRONTMATTER entries in `plx-opencode.ts`
- [x] 1.15 Add FILE_PATHS and FRONTMATTER entries in `plx-codex.ts`
- [x] 1.16 Add FILE_PATHS and FRONTMATTER entries in `plx-github-copilot.ts`
- [x] 1.17 Add FILE_PATHS and FRONTMATTER entries in `plx-amazon-q.ts`
- [x] 1.18 Add FILE_PATHS and FRONTMATTER entries in `plx-factory.ts`
- [x] 1.19 Add FILE_PATHS and FRONTMATTER entries in `plx-gemini.ts`
- [x] 1.20 Add FILE_PATHS and FRONTMATTER entries in `plx-auggie.ts`
- [x] 1.21 Add FILE_PATHS and FRONTMATTER entries in `plx-crush.ts`
- [x] 1.22 Add FILE_PATHS and FRONTMATTER entries in `plx-costrict.ts`
- [x] 1.23 Add FILE_PATHS and FRONTMATTER entries in `plx-qwen.ts`
- [x] 1.24 Add FILE_PATHS and FRONTMATTER entries in `plx-roocode.ts`
- [x] 1.25 Add FILE_PATHS and FRONTMATTER entries in `plx-antigravity.ts`
- [x] 1.26 Add FILE_PATHS and FRONTMATTER entries in `plx-iflow.ts`

## Notes

Command body content:

**Guardrails**
- Save ALL modified files before creating PROGRESS.md.
- Create PROGRESS.md in the project root directory.
- Include enough detail that a new agent can continue without user re-explanation.
- Add PROGRESS.md to .gitignore if not already present.
- Update existing PROGRESS.md if one already exists (don't create duplicates).

**Steps**
1. Save all files you have modified during this session.
2. Create or update `PROGRESS.md` in the project root with these sections: Current Task, Status, Completed Steps, Remaining Steps, Key Decisions Made, Files Modified, Files Created, Open Questions/Blockers, Context for Next Agent, Related Resources.
3. Check if `.gitignore` contains `PROGRESS.md`; if not present, add it on a new line.
4. Confirm to user that progress has been saved and they can start a new session.
