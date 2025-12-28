---
status: to-do
---

# Task: Update core constants and configuration

## End Goal

All core constants and configuration files use PLX terminology instead of OpenSpec.

## Currently

- `src/core/config.ts`: `OPENSPEC_DIR_NAME = 'openspec'` and `OPENSPEC_MARKERS`
- `src/utils/command-name.ts`: defaults to "openspec"
- `src/core/global-config.ts`: uses `~/.openspec/` directory

## Should

- `src/core/config.ts`: `PLX_DIR_NAME = 'workspace'` and `PLX_MARKERS` with `<!-- PLX:START -->` and `<!-- PLX:END -->`
- `src/utils/command-name.ts`: defaults to "plx"
- `src/core/global-config.ts`: uses `~/.plx/` directory

## Constraints

- [ ] OPENSPEC_DIR_NAME must become PLX_DIR_NAME with value "workspace"
- [ ] OPENSPEC_MARKERS must become PLX_MARKERS with PLX markers
- [ ] Global config directory must be ~/.plx/
- [ ] Environment variable must be PLX_CONCURRENCY

## Acceptance Criteria

- [ ] All constants use PLX naming
- [ ] All marker strings use `<!-- PLX:START -->` and `<!-- PLX:END -->`
- [ ] Build passes after changes

## Implementation Checklist

- [ ] 1.1 Update `src/core/config.ts`: rename `OPENSPEC_DIR_NAME` to `PLX_DIR_NAME` with value "workspace"
- [ ] 1.2 Update `src/core/config.ts`: rename `OPENSPEC_MARKERS` to `PLX_MARKERS` with `<!-- PLX:START -->` and `<!-- PLX:END -->`
- [ ] 1.3 Update `src/utils/command-name.ts`: change default from "openspec" to "plx"
- [ ] 1.4 Update `src/core/global-config.ts`: change `GLOBAL_CONFIG_DIR_NAME` from "openspec" to "plx"
- [ ] 1.5 Find and update all imports of OPENSPEC_DIR_NAME to PLX_DIR_NAME
- [ ] 1.6 Find and update all imports of OPENSPEC_MARKERS to PLX_MARKERS

## Notes

This is the foundational task - all other tasks depend on these constants being renamed first.
