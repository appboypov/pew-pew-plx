## 1. Template Infrastructure

- [x] 1.1 Create `src/core/templates/architecture-template.ts` with ARCHITECTURE.md template structure
- [x] 1.2 Create `src/core/templates/splx-slash-command-templates.ts` with init-architecture and update-architecture command bodies
- [x] 1.3 Update `src/core/templates/index.ts` to export new templates

## 2. PLX Configurator Infrastructure

- [x] 2.1 Create `src/core/configurators/slash/splx-base.ts` with SplxSlashCommandConfigurator base class
- [x] 2.2 Create `src/core/configurators/slash/splx-claude.ts` with Claude Code PLX configurator
- [x] 2.3 Create `src/core/configurators/slash/splx-registry.ts` with SplxSlashCommandRegistry

## 3. Init Workflow Integration

- [x] 3.1 Modify `src/core/init.ts` to import SplxSlashCommandRegistry
- [x] 3.2 Add PLX configurator call in configureAITools loop
- [x] 3.3 PLX commands generated after PLX commands for each tool

## 4. Archive Workflow Integration

- [x] 4.1 Modify `src/core/archive.ts` to add architecture update suggestion after spec updates

## 5. Validation

- [x] 5.1 Build project with `pnpm run build`
- [x] 5.2 Manual test: Run `splx init` in a test directory
- [x] 5.3 Verify PLX commands are created under `.claude/commands/splx/`
- [x] 5.4 Verify archive workflow displays suggestion message
