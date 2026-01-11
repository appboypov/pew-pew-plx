---
status: done
skill-level: medior
parent-type: change
parent-id: add-transfer-command
---

# Task: Implement Workspace Auto-Initialization

## End Goal

Transfer command detects missing target workspace and initializes it using source workspace's tool configuration.

## Currently

`plx init` exists but transfer command cannot invoke it programmatically with pre-configured tool selections.

## Should

- Detect when target directory lacks a workspace
- Extract tool configuration from source workspace
- Invoke init logic with source tools as defaults
- Respect `--yes` and `--no-interactive` flags

## Constraints

- [ ] Must reuse existing InitCommand logic
- [ ] Must not duplicate init implementation
- [ ] Must handle init failure gracefully

## Acceptance Criteria

- [ ] Transfer detects missing workspace
- [ ] Source tool config is correctly extracted
- [ ] Init runs with correct defaults
- [ ] Transfer continues after successful init
- [ ] Transfer aborts on init failure

## Implementation Checklist

- [x] 3.1 Create `extractToolConfig()` utility to read source workspace tools
- [x] 3.2 Add `initializeWorkspace()` method to TransferService
- [x] 3.3 Integrate with InitCommand for actual initialization
- [x] 3.4 Add `requiresInit` flag to TransferPlan
- [x] 3.5 Handle init in transfer execution flow
- [x] 3.6 Support `--yes` flag for non-interactive init

## Notes

- Tool config may be in `.claude/settings.local.json`, `.cursor/rules/plx.mdc`, etc.
- May need to parse multiple tool config files to determine enabled tools
