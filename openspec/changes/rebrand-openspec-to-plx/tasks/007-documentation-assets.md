---
status: to-do
---

# Task: Update documentation and assets

## End Goal

All documentation uses PLX-first terminology with minimal fork mentions. Assets are renamed appropriately.

## Currently

- `README.md` mentions both OpenSpec and PLX
- `AGENTS.md` (root) references "OpenSpec Instructions" and `openspec/AGENTS.md`
- `assets/openspec_dashboard.png` exists
- `.devcontainer/` files reference OpenSpec

## Should

- `README.md` is PLX-first with minimal fork mentions
- `AGENTS.md` (root) references "PLX Instructions" and `workspace/AGENTS.md`
- `assets/plx_dashboard.png` exists (renamed)
- `.devcontainer/` files reference PLX

## Constraints

- [ ] CHANGELOG.md is left unchanged (historical record)
- [ ] docs/artifact_poc.md is left unchanged (POC document)
- [ ] Dashboard asset must be renamed to plx_dashboard.png

## Acceptance Criteria

- [ ] README.md is PLX-first
- [ ] AGENTS.md uses PLX terminology
- [ ] Dashboard image renamed and references updated
- [ ] DevContainer config references PLX

## Implementation Checklist

- [ ] 7.1 Update `README.md`: make PLX-first, update all command examples to use `plx`, update directory references to `workspace/`
- [ ] 7.2 Update `AGENTS.md` (root): replace "OpenSpec" with "PLX", `openspec/` with `workspace/`, update markers
- [ ] 7.3 Rename `assets/openspec_dashboard.png` to `assets/plx_dashboard.png`
- [ ] 7.4 Update README.md to reference `assets/plx_dashboard.png`
- [ ] 7.5 Update `.devcontainer/devcontainer.json`: change "OpenSpec Development" to "PLX Development"
- [ ] 7.6 Update `.devcontainer/README.md`: replace OpenSpec references with PLX
- [ ] 7.7 Update `ARCHITECTURE.md`: replace remaining OpenSpec references with PLX

## Notes

The README should position PLX as the primary product, with OpenSpec mentioned as the upstream fork source. Command examples should all use `plx`.
