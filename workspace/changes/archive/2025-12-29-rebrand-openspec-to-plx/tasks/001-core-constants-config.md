---
status: done
---

# Task: Update core constants and configuration

## End Goal

All core constants and configuration files use PLX terminology instead of OpenSpec.

## Currently

- `src/core/config.ts`: `PLX_DIR_NAME = 'workspace'` and `PLX_MARKERS`
- `src/utils/command-name.ts`: defaults to "plx"
- `src/core/global-config.ts`: uses `~/.plx/` directory

## Should

- `src/core/config.ts`: `PLX_DIR_NAME = 'workspace'` and `PLX_MARKERS` with `<!-- PLX:START -->` and `<!-- PLX:END -->`
- `src/utils/command-name.ts`: defaults to "plx"
- `src/core/global-config.ts`: uses `~/.plx/` directory

## Constraints

- [x] OPENSPEC_DIR_NAME must become PLX_DIR_NAME with value "workspace"
- [x] OPENSPEC_MARKERS must become PLX_MARKERS with PLX markers
- [x] Global config directory must be ~/.plx/
- [x] Environment variable must be PLX_CONCURRENCY

## Acceptance Criteria

- [x] All constants use PLX naming
- [x] All marker strings use `<!-- PLX:START -->` and `<!-- PLX:END -->`
- [x] Build passes after changes

## Implementation Checklist

- [x] 1.1 Update `src/core/config.ts`: rename `OPENSPEC_DIR_NAME` to `PLX_DIR_NAME` with value "workspace"
- [x] 1.2 Update `src/core/config.ts`: rename `OPENSPEC_MARKERS` to `PLX_MARKERS` with `<!-- PLX:START -->` and `<!-- PLX:END -->`
- [x] 1.3 Update `src/utils/command-name.ts`: change default from "openspec" to "plx"
- [x] 1.4 Update `src/core/global-config.ts`: change `GLOBAL_CONFIG_DIR_NAME` from "openspec" to "plx"
- [x] 1.5 Find and update all imports of OPENSPEC_DIR_NAME to PLX_DIR_NAME
- [x] 1.6 Find and update all imports of OPENSPEC_MARKERS to PLX_MARKERS

## Notes

This is the foundational task - all other tasks depend on these constants being renamed first.
