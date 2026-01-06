export const releaseTemplate = (): string => `# Release Preparation

## Purpose
This file configures release preparation and pre-release consistency verification.
Run \`/plx:refine-release\` to populate project-specific checklists.
Run \`/plx:prepare-release\` to execute release preparation.

## Documentation Config
\`\`\`yaml
changelog_format: keep-a-changelog
readme_style: standard
audience: technical
emoji_level: none
\`\`\`

## Consistency Checklist

### Primary Sources
<!-- Files that must change first when modifying core behavior -->

### Derived Artifacts
<!-- Files generated from primary sources; include regeneration command -->
Regeneration command: \`\`

### Shared Values
<!-- Values duplicated across files: versions, names, identifiers, URLs -->

### Behavioral Contracts
<!-- Schemas, types, interfaces, API contracts that define expected behavior -->

### Assertion Updates
<!-- Tests that assert on specific outputs, messages, or formats -->

### Documentation References
<!-- Docs containing code examples or implementation references -->

### External Integrations
<!-- IDE configs, CI/CD, linter rules, third-party service configs -->

### Platform Variations
<!-- Target-specific files that must stay synchronized -->

### Cleanup
<!-- Files to delete when renaming/removing features -->

### Verification
<!-- Commands to confirm zero drift -->
\`\`\`bash
# Search for old patterns
grep -rn "OLD_PATTERN" .

# Run tests
# <test-command>

# Validate project
# <validate-command>
\`\`\`

## Release Checklist
- [ ] Consistency checklist reviewed and complete
- [ ] Changelog updated with new version
- [ ] Version bumped in project config
- [ ] All changes reviewed and confirmed
`;
