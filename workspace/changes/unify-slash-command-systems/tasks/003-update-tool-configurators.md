---
status: done
---

# Task: Update Tool Configurators

## End Goal
Each of the 23 tool configurators has `FILE_PATHS` and `FRONTMATTER` records with all 13 commands.

## Currently
- 23 regular configurators (claude.ts, cursor.ts, etc.) have 3 commands
- 23 PLX configurators (plx-claude.ts, plx-cursor.ts, etc.) have 10 commands
- Duplicate code across 46 files

## Should
- 23 regular configurators have all 13 commands
- 23 PLX configurators are deleted
- `plx-toml-base.ts` is deleted

## Constraints
- [ ] Merge FILE_PATHS from PLX configurator into regular configurator
- [ ] Merge FRONTMATTER from PLX configurator into regular configurator
- [ ] Alphabetize record keys for consistency
- [ ] Update class to remove workspaceDir from method calls if overridden

## Acceptance Criteria
- [ ] All 23 regular configurators have 13 commands in FILE_PATHS
- [ ] All 23 regular configurators have 13 commands in FRONTMATTER
- [ ] All 23 PLX configurators are deleted
- [ ] `plx-toml-base.ts` is deleted

## Implementation Checklist
- [x] 3.1 Update `claude.ts` - merge from `plx-claude.ts`, delete PLX file
- [x] 3.2 Update `cursor.ts` - merge from `plx-cursor.ts`, delete PLX file
- [x] 3.3 Update `windsurf.ts` - merge from `plx-windsurf.ts`, delete PLX file
- [x] 3.4 Update `kilocode.ts` - merge from `plx-kilocode.ts`, delete PLX file
- [x] 3.5 Update `cline.ts` - merge from `plx-cline.ts`, delete PLX file
- [x] 3.6 Update `auggie.ts` - merge from `plx-auggie.ts`, delete PLX file
- [x] 3.7 Update `codex.ts` - merge from `plx-codex.ts`, delete PLX file
- [x] 3.8 Update `gemini.ts` - merge from `plx-gemini.ts`, delete PLX file
- [x] 3.9 Update `qoder.ts` - merge from `plx-qoder.ts`, delete PLX file
- [x] 3.10 Update `crush.ts` - merge from `plx-crush.ts`, delete PLX file
- [x] 3.11 Update `codebuddy.ts` - merge from `plx-codebuddy.ts`, delete PLX file
- [x] 3.12 Update `factory.ts` - merge from `plx-factory.ts`, delete PLX file
- [x] 3.13 Update `github-copilot.ts` - merge from `plx-github-copilot.ts`, delete PLX file
- [x] 3.14 Update `amazon-q.ts` - merge from `plx-amazon-q.ts`, delete PLX file
- [x] 3.15 Update `costrict.ts` - merge from `plx-costrict.ts`, delete PLX file
- [x] 3.16 Update `qwen.ts` - merge from `plx-qwen.ts`, delete PLX file
- [x] 3.17 Update `roocode.ts` - merge from `plx-roocode.ts`, delete PLX file
- [x] 3.18 Update `antigravity.ts` - merge from `plx-antigravity.ts`, delete PLX file
- [x] 3.19 Update `iflow.ts` - merge from `plx-iflow.ts`, delete PLX file
- [x] 3.20 Update `opencode.ts` - merge from `plx-opencode.ts`, delete PLX file
- [x] 3.21 Update `toml-base.ts` - merge from `plx-toml-base.ts`, delete PLX file
- [x] 3.22 Delete remaining PLX configurator files if any
- [x] 3.23 Verify all 23 configurators compile

## Notes
Each tool has its own file paths and frontmatter. Copy from PLX version and merge with regular version.
