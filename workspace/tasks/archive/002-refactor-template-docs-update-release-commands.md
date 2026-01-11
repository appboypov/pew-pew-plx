---
status: done
parent-type: change
parent-id: refactor-template-docs
---
# Task: Update refine-release and prepare-release commands

## End Goal

refine-release command contains all option documentation. prepare-release reads minimal config and applies defaults.

## Currently

- refine-release: Minimal 3-step command referencing RELEASE.md
- prepare-release: References RELEASE.md for "full release preparation instructions"

## Should

- refine-release: Contains all format options, style templates, badge patterns, audience options, emoji levels embedded in command body
- prepare-release: Reads RELEASE.md config, applies defaults, executes workflow without requiring verbose RELEASE.md

## Constraints

- [ ] Keep command names unchanged
- [ ] Maintain PLX marker pattern for managed content
- [ ] Update all tool configurators (Claude, Cursor, Gemini, etc.)

## Acceptance Criteria

- [ ] refine-release command body contains all option documentation previously in RELEASE.md
- [ ] prepare-release command works with slimmed RELEASE.md (reads config, applies defaults)
- [ ] All tool configurator slash commands updated

## Implementation Checklist

- [x] 2.1 Update refineReleaseGuardrails in slash-command-templates.ts to include option documentation
- [x] 2.2 Update refineReleaseSteps to guide through all configuration options
- [x] 2.3 Update prepareReleaseGuardrails to work with minimal config
- [x] 2.4 Update prepareReleaseSteps to apply defaults when config sections are missing
- [x] 2.5 Run `plx update` to regenerate all tool configurator files
- [x] 2.6 Verify refine-release command contains format/style/badge documentation

## Notes

The format templates, style examples, and badge patterns from RELEASE.md move into refine-release command body.
