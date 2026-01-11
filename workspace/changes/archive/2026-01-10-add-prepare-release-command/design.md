# Design: Add Prepare Release Command

## Overview

This design describes the implementation of the `plx/prepare-release` slash command and accompanying `RELEASE.md` root file.

## Architecture Decision

### Two-Tier Structure

The prepare-release feature uses a two-tier structure:

1. **Slash Command (prepare-release.md)**: Concise guardrails + steps that reference @RELEASE.md
2. **Root File (RELEASE.md)**: Detailed Activity XML with full interactive workflow instructions

This mirrors the existing pattern used by the review command:
- `plx/review.md` (slash command) → references `REVIEW.md` (root file)

### Rationale

- **Consistency**: Follows established patterns in the codebase
- **Maintainability**: Detailed instructions in RELEASE.md can be customized per-project
- **Conciseness**: Slash command body remains scannable like other PLX commands

## Data Flow

```
User invokes: /plx/prepare-release
    ↓
AI reads prepare-release.md command body
    ↓
Command instructs: "Read @RELEASE.md"
    ↓
AI reads RELEASE.md for detailed workflow
    ↓
Execute Step 1: Changelog Update
    - Source selection (git commits, branch diff, manual)
    - Version configuration (semver suggestion)
    - Format selection (keep-a-changelog, simple-list, github-release)
    - Audience selection (technical, user-facing, marketing)
    - Emoji level (none, little, medium, high)
    ↓
User confirms or skips
    ↓
Execute Step 2: Readme Update
    - Style selection (minimal, standard, comprehensive, etc.)
    - Section configuration (multi-select)
    - Badge configuration (multi-select)
    - Audience selection
    ↓
User confirms or skips
    ↓
Execute Step 3: Architecture Update
    - Read existing ARCHITECTURE.md
    - Explore codebase for changes
    - Update while preserving user content
    ↓
User confirms or skips
    ↓
Present summary of all changes made
```

## File Changes

### New Files

| File | Purpose |
|------|---------|
| `src/core/templates/release-template.ts` | RELEASE.md template content |

### Modified Files

| File | Change |
|------|--------|
| `src/core/templates/index.ts` | Export `getReleaseTemplate()` |
| `src/core/templates/plx-slash-command-templates.ts` | Add `'prepare-release'` type and body |
| `src/core/configurators/slash/plx-base.ts` | Add to `ALL_PLX_COMMANDS` |
| `src/core/configurators/slash/plx-*.ts` (20 files) | Add FILE_PATHS and FRONTMATTER entries |
| `src/core/init.ts` | Create RELEASE.md during init |
| `src/core/update.ts` | Create RELEASE.md during update |

## Command Body Design

```markdown
**Guardrails**
- Read @RELEASE.md for full release preparation instructions.
- Execute steps sequentially: changelog → readme → architecture.
- User confirms or skips each step before proceeding.
- Preserve existing content when updating files.

**Steps**
1. Read @RELEASE.md to understand release preparation workflow.
2. Execute changelog update step (source, version, format selection).
3. Execute readme update step (style, sections, badges selection).
4. Execute architecture update step (refresh from codebase).
5. Present summary of all changes made.
```

## RELEASE.md Template Structure

The template contains:

1. **Purpose Section**: Explains what the release preparation process does
2. **Changelog Activity**: Full interactive workflow with format templates
3. **Readme Activity**: Full interactive workflow with style templates and badge patterns
4. **Architecture Activity**: Simple refresh workflow referencing existing patterns
5. **Release Checklist**: Summary checklist for verification

## Configurator Updates

Each of the 20 tool-specific configurators requires:

1. **FILE_PATHS entry**: Path to generate the command file
2. **FRONTMATTER entry**: Tool-specific frontmatter format

Tool categories and their formats:
- Standard YAML: claude, codebuddy, crush, qoder
- Name/ID format: cursor, iflow
- With $ARGUMENTS: factory, opencode, codex, github-copilot, amazon-q, auggie, costrict, kilocode
- TOML format: windsurf, gemini, qwen, antigravity
- Simple markdown: cline, roocode

## Testing Strategy

1. Template tests: Verify RELEASE.md template generates correctly
2. Command tests: Verify prepare-release command body contains expected content
3. Init tests: Verify RELEASE.md created during `plx init`
4. Update tests: Verify RELEASE.md created during `plx update` (if missing)
5. Integration: Verify command generates for all 20 AI tools
