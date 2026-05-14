# Change: Adopt Verb–Noun CLI Structure (Deprecate Noun-Based Commands)

## Why

Most widely used CLIs (git, docker, kubectl) start with an action (verb) followed by the object (noun). This matches how users think: “do X to Y”. Using verbs as top-level commands improves clarity, discoverability, and extensibility.

## What Changes

- Promote top-level verb commands as primary entry points: `list`, `show`, `validate`, `diff`, `archive`.
- Deprecate noun-based top-level commands: `splx spec ...` and `splx change ...`.
- Introduce consistent noun scoping via flags where applicable (e.g., `--changes`, `--specs`) and keep smart defaults.
- Clarify disambiguation for `show` and `validate` when names collide.

### Mappings (From → To)

- **List**
  - From: `splx change list`
  - To: `splx list --changes` (default), or `splx list --specs`

- **Show**
  - From: `splx spec show <spec-id>` / `splx change show <change-id>`
  - To: `splx show <item-id>` with auto-detect, use `--type spec|change` if ambiguous

- **Validate**
  - From: `splx spec validate <spec-id>` / `splx change validate <change-id>`
  - To: `splx validate <item-id> --type spec|change`, or bulk: `splx validate --specs` / `--changes` / `--all`

### Backward Compatibility

- Keep `splx spec` and `splx change` available with deprecation warnings for one release cycle.
- Update help text to point users to the verb–noun alternatives.

## Impact

- **Affected specs**:
  - `cli-list`: Add support for `--specs` and explicit `--changes` (default remains changes)
  - `splx-conventions`: Add explicit requirement establishing verb–noun CLI design and deprecation guidance
- **Affected code**:
  - `src/cli/index.ts`: Un-deprecate top-level `list`; mark `change list` as deprecated; ensure help text and warnings align
  - `src/core/list.ts`: Support listing specs via `--specs` and default to changes; shared output shape
  - Optional follow-ups: tighten `show`/`validate` help and ambiguity handling

## Explicit Changes

**CLI Design**
- From: Mixed model with nouns (`spec`, `change`) and some top-level verbs; `splx list` currently deprecated
- To: Verbs as primary: `splx list|show|validate|diff|archive`; nouns scoped via flags or item ids; noun commands deprecated
- Reason: Align with common CLIs; improve UX; simpler mental model
- Impact: Non-breaking with deprecation period; users migrate incrementally

**Listing Behavior**
- From: `splx change list` (primary), `splx list` (deprecated)
- To: `splx list` as primary, defaulting to `--changes`; add `--specs` to list specs
- Reason: Consistent verb–noun style; better discoverability
- Impact: New option; preserves existing behavior via default

## Rollout and Deprecation Policy

- Show deprecation warnings on noun-based commands for one release.
- Document new usage in `workspace/README.md` and CLI help.
- After one release, consider removing noun-based commands, or keep as thin aliases without warnings.

## Open Questions

- Should `show` also accept `--changes`/`--specs` for discovery without an id? (Out of scope here; current auto-detect and `--type` remain.)


