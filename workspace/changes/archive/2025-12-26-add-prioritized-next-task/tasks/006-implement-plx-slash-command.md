# Task: Implement PLX slash command generation

## End Goal

Add `act-next` to the PLX slash command generation system so it gets created during `plx init` and `plx update`.

## Currently

The proposal lists `.claude/commands/plx/act-next.md` as an affected file but the PLX slash command system was not updated.

## Should

Update the PLX slash command template system to generate `act-next` command for all supported tools.

## Constraints

- [x] Must follow existing PLX slash command patterns
- [x] Must update all plx-*.ts configurator files

## Acceptance Criteria

- [x] `act-next` added to `PlxSlashCommandId` type
- [x] Body content added to `plxSlashCommandBodies`
- [x] All plx-*.ts configurators updated with FILE_PATHS and FRONTMATTER
- [x] `plx update` generates the command file

## Implementation Checklist

- [x] 6.1 Update `src/core/templates/plx-slash-command-templates.ts`:
  - Add `'act-next'` to `PlxSlashCommandId` type
  - Add body content to `plxSlashCommandBodies`
- [x] 6.2 Update `src/core/configurators/slash/plx-claude.ts` with FILE_PATHS and FRONTMATTER
- [x] 6.3 Update `src/core/configurators/slash/plx-cline.ts`
- [x] 6.4 Update `src/core/configurators/slash/plx-cursor.ts`
- [x] 6.5 Update `src/core/configurators/slash/plx-windsurf.ts`
- [x] 6.6 Update `src/core/configurators/slash/plx-codebuddy.ts`
- [x] 6.7 Update `src/core/configurators/slash/plx-qoder.ts`
- [x] 6.8 Update `src/core/configurators/slash/plx-kilocode.ts`
- [x] 6.9 Update `src/core/configurators/slash/plx-opencode.ts`
- [x] 6.10 Update `src/core/configurators/slash/plx-codex.ts`
- [x] 6.11 Update `src/core/configurators/slash/plx-github-copilot.ts`
- [x] 6.12 Update `src/core/configurators/slash/plx-amazon-q.ts`
- [x] 6.13 Update `src/core/configurators/slash/plx-factory.ts`
- [x] 6.14 Update `src/core/configurators/slash/plx-gemini.ts`
- [x] 6.15 Update `src/core/configurators/slash/plx-auggie.ts`
- [x] 6.16 Update `src/core/configurators/slash/plx-crush.ts`
- [x] 6.17 Update `src/core/configurators/slash/plx-costrict.ts`
- [x] 6.18 Update `src/core/configurators/slash/plx-qwen.ts`
- [x] 6.19 Update `src/core/configurators/slash/plx-roocode.ts`
- [x] 6.20 Update `src/core/configurators/slash/plx-antigravity.ts`
- [x] 6.21 Update `src/core/configurators/slash/plx-iflow.ts`
- [x] 6.22 Run `plx update` and verify command file is generated
- [x] 6.23 Add tests for the new command generation

## Notes

Reference existing commands `init-architecture` and `update-architecture` for patterns.
