# Release Preparation

## Purpose
This file configures release preparation and pre-release consistency verification.
Run `/plx:refine-release` to populate project-specific checklists.
Run `/plx:prepare-release` to execute release preparation.

## Documentation Config
```yaml
changelog_format: keep-a-changelog
readme_style: cli-tool
audience: technical
emoji_level: none
```

## Consistency Checklist

### Primary Sources
- `src/cli/index.ts` — CLI command definitions, flags, descriptions
- `src/commands/*.ts` — command implementations with help text/hints (14 files)
- `src/core/completions/command-registry.ts` — shell completion metadata
- `src/core/templates/slash-command-templates.ts` — slash command content
- `src/core/templates/agents-template.ts` — AGENTS.md CLI reference
- `src/core/configurators/slash/*.ts` — AI tool configurators (20 files)

### Derived Artifacts
- 600+ provider slash command files across 20 AI tool directories
- `.claude/`, `.cursor/`, `.gemini/`, `.qwen/`, `.amazonq/`, `.github/prompts/`, etc.

Regeneration command: `pnpm build && plx update`

### Shared Values
- Version in `package.json`
- Project name `@appboypov/pew-pew-plx`
- CLI binary name `plx`

### Behavioral Contracts
- `workspace/specs/cli-*/spec.md` — 21 spec files defining CLI behavior
- Type definitions in `src/core/schemas/`

### Assertion Updates
- `test/commands/*.ts` — 15 command test files
- `test/core/update.test.ts` — template output assertions
- `test/core/templates/*.ts` — slash command template tests

### Documentation References
- `README.md` — usage examples, command tables
- `CLAUDE.md` — command reference table
- `workspace/AGENTS.md` — CLI quick reference section
- `ARCHITECTURE.md` — if referencing commands

### External Integrations
- Shell completion scripts (zsh, bash)
- `.github/workflows/` — CI/CD pipelines

### Platform Variations
- 20 AI tool provider directories with synchronized slash commands
- TOML format for Qwen/Gemini, Markdown for others

### Cleanup
- Delete renamed files (e.g., `plx-proposal.md` when renamed to `plx-plan-proposal.md`)
- Check `.cospec/plx/commands/` for orphaned files

### Verification
```bash
# Search for old patterns
grep -rn "OLD_PATTERN" --include="*.md" --include="*.ts" --include="*.toml" .

# Run tests
pnpm test

# Validate workspace
plx validate all --strict
```

## Release Checklist
- [ ] Consistency checklist reviewed and complete
- [ ] Changelog updated with new version
- [ ] Version bumped in package.json
- [ ] All changes reviewed and confirmed
