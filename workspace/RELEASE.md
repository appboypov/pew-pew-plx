# Release Preparation

## Purpose
This file configures release preparation and pre-release consistency verification.
Run `/splx:refine-release` to populate project-specific checklists.
Run `/splx:prepare-release` to execute release preparation.

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
- `assets/templates/slash-commands/*.md` — slash command content (loaded at runtime)
- `assets/templates/workspace/agents.md` — AGENTS.md template
- `src/core/configurators/slash/*.ts` — AI tool configurators (20 files)

### Derived Artifacts
- 600+ provider slash command files across 20 AI tool directories
- `.claude/`, `.cursor/`, `.gemini/`, `.qwen/`, `.amazonq/`, `.github/prompts/`, etc.

Regeneration command: `pnpm build && splx update`

### Shared Values
- Version in `package.json`
- Project name `@appboypov/OpenSplx`
- CLI binary name `splx`

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
- Delete renamed files (e.g., `splx-proposal.md` when renamed to `splx-plan-proposal.md`)
- Check `.cospec/splx/commands/` for orphaned files

### Verification
```bash
# Search for old patterns
grep -rn "OLD_PATTERN" --include="*.md" --include="*.ts" --include="*.toml" .

# Run tests
pnpm test

# Validate workspace
splx validate all --strict
```

## Release Checklist
- [ ] Consistency checklist reviewed and complete
- [ ] Changelog updated with new version
- [ ] Version bumped in package.json
- [ ] All changes reviewed and confirmed
