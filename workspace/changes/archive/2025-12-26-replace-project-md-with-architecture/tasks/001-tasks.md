## 1. Update Agent Instructions Template

- [x] 1.1 Update `src/core/templates/agents-template.ts` to replace all `project.md` references with `ARCHITECTURE.md`
- [x] 1.2 Update directory structure example to remove `project.md` from workspace/ and show `ARCHITECTURE.md` at project root

## 2. Update Slash Command Templates

- [x] 2.1 Update `src/core/templates/slash-command-templates.ts` proposal step to reference `ARCHITECTURE.md` instead of `project.md`

## 3. Update TemplateManager and Init

- [x] 3.1 Remove `project.md` from `TemplateManager.getTemplates()` in `src/core/templates/index.ts`
- [x] 3.2 Add `ARCHITECTURE.md` generation at project root during init
- [x] 3.3 Remove `project-template.ts` import

## 4. Update Init Command

- [x] 4.1 Update success output in `src/core/init.ts` to reference `ARCHITECTURE.md` instead of `project.md`

## 5. Update README

- [x] 5.1 Update "Optional: Populate Project Context" section to reference `ARCHITECTURE.md`

## 6. Update Self-Reference in ARCHITECTURE.md

- [x] 6.1 Update `ARCHITECTURE.md` reference from `workspace/project.md` to `ARCHITECTURE.md`

## 7. Update Existing Specs

- [x] 7.1 Update `workspace/specs/cli-init/spec.md` directory structure and file generation references
- [x] 7.2 Update `workspace/specs/plx-conventions/spec.md` directory structure references

## 8. Regenerate AGENTS.md

- [x] 8.1 Run `plx update` to regenerate `workspace/AGENTS.md` from updated template

## 9. Update Tests

- [x] 9.1 Update `test/core/init.test.ts` to reflect that `ARCHITECTURE.md` is created at project root
- [x] 9.2 Verify tests pass with `pnpm test`

## 10. Cleanup

- [x] 10.1 Delete `workspace/project.md` from the repository
- [x] 10.2 Delete `src/core/templates/project-template.ts`
