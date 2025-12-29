---
status: done
---

# Task: Update documentation and assets

## End Goal

All documentation uses PLX-first terminology with minimal fork mentions. Assets are renamed appropriately.

## Currently

- `README.md` is PLX-first with minimal fork mentions
- `AGENTS.md` (root) references "PLX Instructions" and `workspace/AGENTS.md`
- `assets/plx_dashboard.png` exists (renamed)
- `.devcontainer/` files reference PLX

## Should

- `README.md` is PLX-first with minimal fork mentions
- `AGENTS.md` (root) references "PLX Instructions" and `workspace/AGENTS.md`
- `assets/plx_dashboard.png` exists (renamed)
- `.devcontainer/` files reference PLX

## Constraints

- [x] CHANGELOG.md is left unchanged (historical record)
- [x] docs/artifact_poc.md is left unchanged (POC document)
- [x] Dashboard asset must be renamed to plx_dashboard.png

## Acceptance Criteria

- [x] README.md is PLX-first
- [x] AGENTS.md uses PLX terminology
- [x] Dashboard image renamed and references updated
- [x] DevContainer config references PLX

## Implementation Checklist

- [x] 7.1 Update `README.md`: make PLX-first, update all command examples to use `plx`, update directory references to `workspace/`
- [x] 7.2 Update `AGENTS.md` (root): replace "OpenSpec" with "PLX", `openspec/` with `workspace/`, update markers
- [x] 7.3 Rename `assets/openspec_dashboard.png` to `assets/plx_dashboard.png`
- [x] 7.4 Update README.md to reference `assets/plx_dashboard.png`
- [x] 7.5 Update `.devcontainer/devcontainer.json`: change "OpenSpec Development" to "PLX Development"
- [x] 7.6 Update `.devcontainer/README.md`: replace OpenSpec references with PLX
- [x] 7.7 Update `ARCHITECTURE.md`: replace remaining OpenSpec references with PLX

## Notes

The README should position PLX as the primary product, with OpenSpec mentioned as the upstream fork source. Command examples should all use `plx`.
