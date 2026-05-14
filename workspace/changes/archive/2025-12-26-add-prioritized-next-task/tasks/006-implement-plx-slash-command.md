# Task: Implement PLX slash command generation

## End Goal

Add `act-next` to the PLX slash command generation system so it gets created during `splx init` and `splx update`.

## Currently

The proposal lists `.claude/commands/splx/act-next.md` as an affected file but the PLX slash command system was not updated.

## Should

Update the PLX slash command template system to generate `act-next` command for all supported tools.

## Constraints

- [x] Must follow existing PLX slash command patterns
- [x] Must update all splx-*.ts configurator files

## Acceptance Criteria

- [x] `act-next` added to `SplxSlashCommandId` type
- [x] Body content added to `splxSlashCommandBodies`
- [x] All splx-*.ts configurators updated with FILE_PATHS and FRONTMATTER
- [x] `splx update` generates the command file

## Implementation Checklist

- [x] 6.1 Update `src/core/templates/splx-slash-command-templates.ts`:
  - Add `'act-next'` to `SplxSlashCommandId` type
  - Add body content to `splxSlashCommandBodies`
- [x] 6.2 Update `src/core/configurators/slash/splx-claude.ts` with FILE_PATHS and FRONTMATTER
- [x] 6.3 Update `src/core/configurators/slash/splx-cline.ts`
- [x] 6.4 Update `src/core/configurators/slash/splx-cursor.ts`
- [x] 6.5 Update `src/core/configurators/slash/splx-windsurf.ts`
- [x] 6.6 Update `src/core/configurators/slash/splx-codebuddy.ts`
- [x] 6.7 Update `src/core/configurators/slash/splx-qoder.ts`
- [x] 6.8 Update `src/core/configurators/slash/splx-kilocode.ts`
- [x] 6.9 Update `src/core/configurators/slash/splx-opencode.ts`
- [x] 6.10 Update `src/core/configurators/slash/splx-codex.ts`
- [x] 6.11 Update `src/core/configurators/slash/splx-github-copilot.ts`
- [x] 6.12 Update `src/core/configurators/slash/splx-amazon-q.ts`
- [x] 6.13 Update `src/core/configurators/slash/splx-factory.ts`
- [x] 6.14 Update `src/core/configurators/slash/splx-gemini.ts`
- [x] 6.15 Update `src/core/configurators/slash/splx-auggie.ts`
- [x] 6.16 Update `src/core/configurators/slash/splx-crush.ts`
- [x] 6.17 Update `src/core/configurators/slash/splx-costrict.ts`
- [x] 6.18 Update `src/core/configurators/slash/splx-qwen.ts`
- [x] 6.19 Update `src/core/configurators/slash/splx-roocode.ts`
- [x] 6.20 Update `src/core/configurators/slash/splx-antigravity.ts`
- [x] 6.21 Update `src/core/configurators/slash/splx-iflow.ts`
- [x] 6.22 Run `splx update` and verify command file is generated
- [x] 6.23 Add tests for the new command generation

## Notes

Reference existing commands `init-architecture` and `update-architecture` for patterns.
